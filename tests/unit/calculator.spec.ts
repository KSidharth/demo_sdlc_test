
/**
 * Unit Tests — Two-Number Addition Calculator
 * Framework: Vitest + @testing-library/dom
 * 
 * Tests cover:
 * - DOM initialization
 * - Input validation logic
 * - Addition computation
 * - Result formatting
 * - Error handling
 * - Edge cases (empty, NaN, Infinity, scientific notation)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

// Load the HTML file
const html = fs.readFileSync(
  path.resolve(__dirname, '../../../frontend/index.html'),
  'utf8'
);

describe('Two-Number Addition Calculator — Unit Tests', () => {
  let dom: JSDOM;
  let window: Window;
  let document: Document;

  beforeEach(() => {
    // Create a fresh DOM for each test
    dom = new JSDOM(html, {
      runScripts: 'dangerously',
      resources: 'usable',
      url: 'http://localhost'
    });
    window = dom.window as unknown as Window;
    document = window.document;

    // Wait for DOMContentLoaded
    return new Promise<void>((resolve) => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('DOMContentLoaded', () => resolve());
      }
    });
  });

  afterEach(() => {
    dom.window.close();
  });

  describe('DOM Element Initialization', () => {
    it('should render two numeric input fields on page load', () => {
      const number1Input = document.getElementById('number1') as HTMLInputElement;
      const number2Input = document.getElementById('number2') as HTMLInputElement;

      expect(number1Input).toBeTruthy();
      expect(number2Input).toBeTruthy();
      expect(number1Input.type).toBe('number');
      expect(number2Input.type).toBe('number');
    });

    it('should render Enter button with correct label', () => {
      const enterButton = document.getElementById('enterButton') as HTMLButtonElement;

      expect(enterButton).toBeTruthy();
      expect(enterButton.textContent?.trim()).toBe('Enter');
      expect(enterButton.type).toBe('button');
    });

    it('should have result container hidden by default', () => {
      const resultContainer = document.getElementById('resultContainer') as HTMLDivElement;

      expect(resultContainer).toBeTruthy();
      expect(resultContainer.classList.contains('visible')).toBe(false);
      expect(window.getComputedStyle(resultContainer).display).toBe('none');
    });

    it('should have error containers hidden by default', () => {
      const error1 = document.getElementById('error1') as HTMLDivElement;
      const error2 = document.getElementById('error2') as HTMLDivElement;

      expect(error1).toBeTruthy();
      expect(error2).toBeTruthy();
      expect(error1.classList.contains('visible')).toBe(false);
      expect(error2.classList.contains('visible')).toBe(false);
    });

    it('should have proper ARIA attributes for accessibility', () => {
      const number1Input = document.getElementById('number1') as HTMLInputElement;
      const number2Input = document.getElementById('number2') as HTMLInputElement;
      const resultContainer = document.getElementById('resultContainer') as HTMLDivElement;

      expect(number1Input.getAttribute('aria-label')).toBe('First number input');
      expect(number1Input.getAttribute('aria-required')).toBe('true');
      expect(number2Input.getAttribute('aria-label')).toBe('Second number input');
      expect(number2Input.getAttribute('aria-required')).toBe('true');
      expect(resultContainer.getAttribute('aria-live')).toBe('polite');
      expect(resultContainer.getAttribute('role')).toBe('region');
    });
  });

  describe('Input Validation — validateNumericInput()', () => {
    it('should reject empty string input', () => {
      const validateNumericInput = (window as any).validateNumericInput;
      const result = validateNumericInput('', 'Test field');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Test field is required');
      expect(result.numericValue).toBe(null);
    });

    it('should reject whitespace-only input', () => {
      const validateNumericInput = (window as any).validateNumericInput;
      const result = validateNumericInput('   ', 'Test field');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Test field is required');
      expect(result.numericValue).toBe(null);
    });

    it('should reject null input', () => {
      const validateNumericInput = (window as any).validateNumericInput;
      const result = validateNumericInput(null, 'Test field');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Test field is required');
      expect(result.numericValue).toBe(null);
    });

    it('should reject undefined input', () => {
      const validateNumericInput = (window as any).validateNumericInput;
      const result = validateNumericInput(undefined, 'Test field');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Test field is required');
      expect(result.numericValue).toBe(null);
    });

    it('should reject non-numeric text input', () => {
      const validateNumericInput = (window as any).validateNumericInput;
      const result = validateNumericInput('abc', 'Test field');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Test field must be a valid number');
      expect(result.numericValue).toBe(null);
    });

    it('should reject special characters', () => {
      const validateNumericInput = (window as any).validateNumericInput;
      const result = validateNumericInput('@#$%', 'Test field');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Test field must be a valid number');
      expect(result.numericValue).toBe(null);
    });

    it('should reject Infinity', () => {
      const validateNumericInput = (window as any).validateNumericInput;
      const result = validateNumericInput('Infinity', 'Test field');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Test field must be a finite number');
      expect(result.numericValue).toBe(null);
    });

    it('should reject -Infinity', () => {
      const validateNumericInput = (window as any).validateNumericInput;
      const result = validateNumericInput('-Infinity', 'Test field');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Test field must be a finite number');
      expect(result.numericValue).toBe(null);
    });

    it('should accept valid positive integer', () => {
      const validateNumericInput = (window as any).validateNumericInput;
      const result = validateNumericInput('42', 'Test field');

      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
      expect(result.numericValue).toBe(42);
    });

    it('should accept valid negative integer', () => {
      const validateNumericInput = (window as any).validateNumericInput;
      const result = validateNumericInput('-42', 'Test field');

      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
      expect(result.numericValue).toBe(-42);
    });

    it('should accept zero', () => {
      const validateNumericInput = (window as any).validateNumericInput;
      const result = validateNumericInput('0', 'Test field');

      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
      expect(result.numericValue).toBe(0);
    });

    it('should accept valid decimal number', () => {
      const validateNumericInput = (window as any).validateNumericInput;
      const result = validateNumericInput('3.14159', 'Test field');

      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
      expect(result.numericValue).toBeCloseTo(3.14159, 5);
    });

    it('should accept negative decimal', () => {
      const validateNumericInput = (window as any).validateNumericInput;
      const result = validateNumericInput('-0.5', 'Test field');

      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
      expect(result.numericValue).toBe(-0.5);
    });

    it('should accept scientific notation (positive exponent)', () => {
      const validateNumericInput = (window as any).validateNumericInput;
      const result = validateNumericInput('1e6', 'Test field');

      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
      expect(result.numericValue).toBe(1000000);
    });

    it('should accept scientific notation (negative exponent)', () => {
      const validateNumericInput = (window as any).validateNumericInput;
      const result = validateNumericInput('2.5e-3', 'Test field');

      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
      expect(result.numericValue).toBe(0.0025);
    });

    it('should accept very large number', () => {
      const validateNumericInput = (window as any).validateNumericInput;
      const result = validateNumericInput('999999999999999', 'Test field');

      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
      expect(result.numericValue).toBe(999999999999999);
    });

    it('should accept very small decimal', () => {
      const validateNumericInput = (window as any).validateNumericInput;
      const result = validateNumericInput('0.0000001', 'Test field');

      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
      expect(result.numericValue).toBe(0.0000001);
    });
  });

  describe('Addition Logic — addNumbers()', () => {
    it('should correctly add two positive integers', () => {
      const addNumbers = (window as any).addNumbers;
      const result = addNumbers(5, 3);

      expect(result).toBe(8);
    });

    it('should correctly add two negative integers', () => {
      const addNumbers = (window as any).addNumbers;
      const result = addNumbers(-5, -3);

      expect(result).toBe(-8);
    });

    it('should correctly add positive and negative integer', () => {
      const addNumbers = (window as any).addNumbers;
      const result = addNumbers(10, -3);

      expect(result).toBe(7);
    });

    it('should correctly add decimals', () => {
      const addNumbers = (window as any).addNumbers;
      const result = addNumbers(3.14, 2.86);

      expect(result).toBeCloseTo(6.0, 2);
    });

    it('should correctly add zero to a number', () => {
      const addNumbers = (window as any).addNumbers;
      const result = addNumbers(42, 0);

      expect(result).toBe(42);
    });

    it('should correctly add two zeros', () => {
      const addNumbers = (window as any).addNumbers;
      const result = addNumbers(0, 0);

      expect(result).toBe(0);
    });

    it('should handle very large numbers', () => {
      const addNumbers = (window as any).addNumbers;
      const result = addNumbers(999999999999999, 1);

      expect(result).toBe(1000000000000000);
    });

    it('should handle very small decimals', () => {
      const addNumbers = (window as any).addNumbers;
      const result = addNumbers(0.0001, 0.0002);

      expect(result).toBeCloseTo(0.0003, 4);
    });

    it('should handle scientific notation inputs', () => {
      const addNumbers = (window as any).addNumbers;
      const result = addNumbers(1e6, 2e6);

      expect(result).toBe(3000000);
    });

    it('should handle negative decimals', () => {
      const addNumbers = (window as any).addNumbers;
      const result = addNumbers(-1.5, -2.5);

      expect(result).toBe(-4);
    });
  });

  describe('Result Formatting — formatResult()', () => {
    it('should format integer result without decimals', () => {
      const formatResult = (window as any).formatResult;
      const result = formatResult(42);

      expect(result).toBe('42');
    });

    it('should format decimal result with precision', () => {
      const formatResult = (window as any).formatResult;
      const result = formatResult(3.14159);

      expect(result).toBe('3.14159');
    });

    it('should round to 10 decimal places', () => {
      const formatResult = (window as any).formatResult;
      const result = formatResult(1.123456789012345);

      expect(result).toBe('1.1234567890');
    });

    it('should format large numbers with thousand separators', () => {
      const formatResult = (window as any).formatResult;
      const result = formatResult(1000000);

      expect(result).toBe('1,000,000');
    });

    it('should format very large numbers in scientific notation', () => {
      const formatResult = (window as any).formatResult;
      const result = formatResult(1e16);

      expect(result).toContain('e+');
    });

    it('should format very small numbers in scientific notation', () => {
      const formatResult = (window as any).formatResult;
      const result = formatResult(1e-7);

      expect(result).toContain('e-');
    });

    it('should format zero correctly', () => {
      const formatResult = (window as any).formatResult;
      const result = formatResult(0);

      expect(result).toBe('0');
    });

    it('should format negative numbers correctly', () => {
      const formatResult = (window as any).formatResult;
      const result = formatResult(-42);

      expect(result).toBe('-42');
    });

    it('should handle floating point precision edge case (0.1 + 0.2)', () => {
      const formatResult = (window as any).formatResult;
      const result = formatResult(0.1 + 0.2);

      expect(result).toBe('0.3');
    });
  });

  describe('Event Handling', () => {
    it('should attach click event listener to Enter button', () => {
      const enterButton = document.getElementById('enterButton') as HTMLButtonElement;
      const clickEvent = new window.MouseEvent('click', { bubbles: true });
      
      let clicked = false;
      enterButton.addEventListener('click', () => { clicked = true; });
      enterButton.dispatchEvent(clickEvent);

      expect(clicked).toBe(true);
    });

    it('should trigger calculation on Enter key press in first input', () => {
      const number1Input = document.getElementById('number1') as HTMLInputElement;
      const resultContainer = document.getElementById('resultContainer') as HTMLDivElement;

      number1Input.value = '5';
      (document.getElementById('number2') as HTMLInputElement).value = '3';

      const keyEvent = new window.KeyboardEvent('keypress', { 
        key: 'Enter', 
        bubbles: true 
      });
      number1Input.dispatchEvent(keyEvent);

      // Result container should become visible
      expect(resultContainer.classList.contains('visible')).toBe(true);
    });

    it('should trigger calculation on Enter key press in second input', () => {
      const number2Input = document.getElementById('number2') as HTMLInputElement;
      const resultContainer = document.getElementById('resultContainer') as HTMLDivElement;

      (document.getElementById('number1') as HTMLInputElement).value = '5';
      number2Input.value = '3';

      const keyEvent = new window.KeyboardEvent('keypress', { 
        key: 'Enter', 
        bubbles: true 
      });
      number2Input.dispatchEvent(keyEvent);

      expect(resultContainer.classList.contains('visible')).toBe(true);
    });

    it('should clear error on input in first field', () => {
      const number1Input = document.getElementById('number1') as HTMLInputElement;
      const error1 = document.getElementById('error1') as HTMLDivElement;

      // Manually set error state
      error1.textContent = 'Test error';
      error1.classList.add('visible');
      number1Input.classList.add('input-error');

      // Trigger input event
      const inputEvent = new window.Event('input', { bubbles: true });
      number1Input.dispatchEvent(inputEvent);

      expect(error1.classList.contains('visible')).toBe(false);
      expect(error1.textContent).toBe('');
      expect(number1Input.classList.contains('input-error')).toBe(false);
    });

    it('should clear error on input in second field', () => {
      const number2Input = document.getElementById('number2') as HTMLInputElement;
      const error2 = document.getElementById('error2') as HTMLDivElement;

      error2.textContent = 'Test error';
      error2.classList.add('visible');
      number2Input.classList.add('input-error');

      const inputEvent = new window.Event('input', { bubbles: true });
      number2Input.dispatchEvent(inputEvent);

      expect(error2.classList.contains('visible')).toBe(false);
      expect(error2.textContent).toBe('');
      expect(number2Input.classList.contains('input-error')).toBe(false);
    });
  });

  describe('Error Display Logic', () => {
    it('should show error when first input is empty', () => {
      const enterButton = document.getElementById('enterButton') as HTMLButtonElement;
      const number1Input = document.getElementById('number1') as HTMLInputElement;
      const error1 = document.getElementById('error1') as HTMLDivElement;

      number1Input.value = '';
      (document.getElementById('number2') as HTMLInputElement).value = '5';

      enterButton.click();

      expect(error1.classList.contains('visible')).toBe(true);
      expect(error1.textContent).toBe('First number is required');
      expect(number1Input.classList.contains('input-error')).toBe(true);
    });

    it('should show error when second input is empty', () => {
      const enterButton = document.getElementById('enterButton') as HTMLButtonElement;
      const number2Input = document.getElementById('number2') as HTMLInputElement;
      const error2 = document.getElementById('error2') as HTMLDivElement;

      (document.getElementById('number1') as HTMLInputElement).value = '5';
      number2Input.value = '';

      enterButton.click();

      expect(error2.classList.contains('visible')).toBe(true);
      expect(error2.textContent).toBe('Second number is required');
      expect(number2Input.classList.contains('input-error')).toBe(true);
    });

    it('should show error when first input is non-numeric', () => {
      const enterButton = document.getElementById('enterButton') as HTMLButtonElement;
      const number1Input = document.getElementById('number1') as HTMLInputElement;
      const error1 = document.getElementById('error1') as HTMLDivElement;

      number1Input.value = 'abc';
      (document.getElementById('number2') as HTMLInputElement).value = '5';

      enterButton.click();

      expect(error1.classList.contains('visible')).toBe(true);
      expect(error1.textContent).toBe('First number must be a valid number');
      expect(number1Input.classList.contains('input-error')).toBe(true);
    });

    it('should show error when second input is non-numeric', () => {
      const enterButton = document.getElementById('enterButton') as HTMLButtonElement;
      const number2Input = document.getElementById('number2') as HTMLInputElement;
      const error2 = document.getElementById('error2') as HTMLDivElement;

      (document.getElementById('number1') as HTMLInputElement).value = '5';
      number2Input.value = 'xyz';

      enterButton.click();

      expect(error2.classList.contains('visible')).toBe(true);
      expect(error2.textContent).toBe('Second number must be a valid number');
      expect(number2Input.classList.contains('input-error')).toBe(true);
    });

    it('should focus first input field when first field validation fails', () => {
      const enterButton = document.getElementById('enterButton') as HTMLButtonElement;
      const number1Input = document.getElementById('number1') as HTMLInputElement;

      number1Input.value = '';
      (document.getElementById('number2') as HTMLInputElement).value = '5';

      const focusSpy = vi.spyOn(number1Input, 'focus');
      enterButton.click();

      expect(focusSpy).toHaveBeenCalled();
    });

    it('should focus second input field when second field validation fails', () => {
      const enterButton = document.getElementById('enterButton') as HTMLButtonElement;
      const number2Input = document.getElementById('number2') as HTMLInputElement;

      (document.getElementById('number1') as HTMLInputElement).value = '5';
      number2Input.value = '';

      const focusSpy = vi.spyOn(number2Input, 'focus');
      enterButton.click();

      expect(focusSpy).toHaveBeenCalled();
    });
  });

  describe('Result Display Logic', () => {
    it('should display result field after successful calculation', () => {
      const enterButton = document.getElementById('enterButton') as HTMLButtonElement;
      const resultContainer = document.getElementById('resultContainer') as HTMLDivElement;

      (document.getElementById('number1') as HTMLInputElement).value = '5';
      (document.getElementById('number2') as HTMLInputElement).value = '3';

      enterButton.click();

      expect(resultContainer.classList.contains('visible')).toBe(true);
    });

    it('should display correct sum in result field', () => {
      const enterButton = document.getElementById('enterButton') as HTMLButtonElement;
      const resultValue = document.getElementById('resultValue') as HTMLDivElement;

      (document.getElementById('number1') as HTMLInputElement).value = '10';
      (document.getElementById('number2') as HTMLInputElement).value = '20';

      enterButton.click();

      expect(resultValue.textContent).toBe('30');
    });

    it('should update result when inputs change and Enter is clicked again', () => {
      const enterButton = document.getElementById('enterButton') as HTMLButtonElement;
      const resultValue = document.getElementById('resultValue') as HTMLDivElement;
      const number1Input = document.getElementById('number1') as HTMLInputElement;
      const number2Input = document.getElementById('number2') as HTMLInputElement;

      number1Input.value = '5';
      number2Input.value = '3';
      enterButton.click();
      expect(resultValue.textContent).toBe('8');

      number1Input.value = '10';
      number2Input.value = '20';
      enterButton.click();
      expect(resultValue.textContent).toBe('30');
    });

    it('should not display result field when validation fails', () => {
      const enterButton = document.getElementById('enterButton') as HTMLButtonElement;
      const resultContainer = document.getElementById('resultContainer') as HTMLDivElement;

      (document.getElementById('number1') as HTMLInputElement).value = '';
      (document.getElementById('number2') as HTMLInputElement).value = '5';

      enterButton.click();

      expect(resultContainer.classList.contains('visible')).toBe(false);
    });
  });

  describe('Edge Cases & Boundary Conditions', () => {
    it('should handle addition of two very large numbers', () => {
      const addNumbers = (window as any).addNumbers;
      const formatResult = (window as any).formatResult;

      const result = addNumbers(999999999999999, 999999999999999);
      const formatted = formatResult(result);

      expect(formatted).toContain('e+'); // Scientific notation
    });

    it('should handle addition of two very small decimals', () => {
      const addNumbers = (window as any).addNumbers;
      const result = addNumbers(0.0000001, 0.0000002);

      expect(result).toBeCloseTo(0.0000003, 7);
    });

    it('should handle floating point precision issue (0.1 + 0.2)', () => {
      const enterButton = document.getElementById('enterButton') as HTMLButtonElement;
      const resultValue = document.getElementById('resultValue') as HTMLDivElement;

      (document.getElementById('number1') as HTMLInputElement).value = '0.1';
      (document.getElementById('number2') as HTMLInputElement).value = '0.2';

      enterButton.click();

      expect(resultValue.textContent).toBe('0.3');
    });

    it('should handle negative zero edge case', () => {
      const addNumbers = (window as any).addNumbers;
      const result = addNumbers(-0, 0);

      expect(result).toBe(0);
    });

    it('should handle whitespace in input values', () => {
      const enterButton = document.getElementById('enterButton') as HTMLButtonElement;
      const error1 = document.getElementById('error1') as HTMLDivElement;

      (document.getElementById('number1') as HTMLInputElement).value = '   ';
      (document.getElementById('number2') as HTMLInputElement).value = '5';

      enterButton.click();

      expect(error1.classList.contains('visible')).toBe(true);
      expect(error1.textContent).toBe('First number is required');
    });

    it('should handle multiple rapid clicks on Enter button', () => {
      const enterButton = document.getElementById('enterButton') as HTMLButtonElement;
      const resultValue = document.getElementById('resultValue') as HTMLDivElement;

      (document.getElementById('number1') as HTMLInputElement).value = '5';
      (document.getElementById('number2') as HTMLInputElement).value = '3';

      enterButton.click();
      enterButton.click();
      enterButton.click();

      expect(resultValue.textContent).toBe('8');
    });

    it('should clear previous errors before new validation', () => {
      const enterButton = document.getElementById('enterButton') as HTMLButtonElement;
      const error1 = document.getElementById('error1') as HTMLDivElement;
      const error2 = document.getElementById('error2') as HTMLDivElement;

      // First invalid submission
      (document.getElementById('number1') as HTMLInputElement).value = '';
      (document.getElementById('number2') as HTMLInputElement).value = '5';
      enterButton.click();
      expect(error1.classList.contains('visible')).toBe(true);

      // Valid submission should clear errors
      (document.getElementById('number1') as HTMLInputElement).value = '10';
      enterButton.click();
      expect(error1.classList.contains('visible')).toBe(false);
      expect(error2.classList.contains('visible')).toBe(false);
    });
  });

  describe('Performance & Response Time', () => {
    it('should complete calculation in under 100ms', () => {
      const enterButton = document.getElementById('enterButton') as HTMLButtonElement;
      
      (document.getElementById('number1') as HTMLInputElement).value = '999999999';
      (document.getElementById('number2') as HTMLInputElement).value = '888888888';

      const startTime = performance.now();
      enterButton.click();
      const endTime = performance.now();

      const executionTime = endTime - startTime;
      expect(executionTime).toBeLessThan(100);
    });

    it('should compute addition in under 1ms', () => {
      const addNumbers = (window as any).addNumbers;

      const startTime = performance.now();
      addNumbers(123456789, 987654321);
      const endTime = performance.now();

      const executionTime = endTime - startTime;
      expect(executionTime).toBeLessThan(1);
    });
  });
});
