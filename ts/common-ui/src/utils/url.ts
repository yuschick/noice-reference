export function getUrlFragment<T>(fragment: string): T {
  return fragment
    .substring(1)
    .split('&')
    .map((v) => v.split('='))
    .reduce((pre, [key, value]) => ({ ...pre, [key]: value }), {}) as T;
}
