import { KeyValuePair } from '@/types&interfaces/types';
import transformVariables from '@/utils/transformVariables';
import { describe, expect, it } from 'vitest';

describe('transformVariables', () => {
  it('should replace variables with corresponding values', () => {
    const str = 'Hello {{name}}, welcome to {{place}}!';
    const vars = [
      { key: 'name', value: 'Alice', editable: false },
      { key: 'place', value: 'Wonderland', editable: false },
    ];

    const result = transformVariables(str, vars);
    expect(result).toBe('Hello Alice, welcome to Wonderland!');
  });

  it('should not replace variables with editable status', () => {
    const str = 'Your password is {{password}}';
    const vars = [{ key: 'password', value: '12345', editable: true }];

    const result = transformVariables(str, vars);
    expect(result).toBe('Your password is {{password}}');
  });

  it('should handle no variables', () => {
    const str = 'Hello World!';
    const vars: KeyValuePair[] = [];

    const result = transformVariables(str, vars);
    expect(result).toBe('Hello World!');
  });

  it('should handle variables not present in the string', () => {
    const str = 'Hello {{name}}!';
    const vars = [{ key: 'age', value: '30', editable: false }];

    const result = transformVariables(str, vars);
    expect(result).toBe('Hello {{name}}!');
  });

  it('should handle multiple occurrences of the same variable', () => {
    const str = 'Your balance is {{balance}}. {{balance}} is your total balance.';
    const vars = [{ key: 'balance', value: '1000', editable: false }];

    const result = transformVariables(str, vars);
    expect(result).toBe('Your balance is 1000. 1000 is your total balance.');
  });
});
