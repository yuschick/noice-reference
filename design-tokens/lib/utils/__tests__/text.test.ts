import { convertToCamelCase } from '../text';

describe('convertToCamelCase', () => {
  it('should convert a string to camel case', () => {
    expect(convertToCamelCase('hello-world')).toBe('helloWorld');
    expect(convertToCamelCase('--NOI-hello-world')).toBe('noiHelloWorld');
  });
});
