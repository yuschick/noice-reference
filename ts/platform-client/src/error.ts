const INVALID_ARGUMENT = 3;
const NOT_FOUND = 5;
const UNAUTHENTICATED = 16;

export interface PlatformError {
  code: number;
  message: string;
  details?: any[];
}

export function isNotFound(e: PlatformError): boolean {
  return e.code === NOT_FOUND;
}

export function isInvalidArgument(e: PlatformError): boolean {
  return e.code === INVALID_ARGUMENT;
}

export function isUnauthenticated(e: PlatformError): boolean {
  return e.code === UNAUTHENTICATED;
}

export function getCause(e: PlatformError): string | undefined {
  return e.details?.find(({ cause }) => !!cause)?.cause;
}
