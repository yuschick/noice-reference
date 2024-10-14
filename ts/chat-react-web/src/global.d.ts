/* eslint-disable @typescript-eslint/naming-convention */
interface NoiceEnv {
  PLATFORM_URL?: string;
}

declare const NOICE: NoiceEnv;

interface Window {
  NOICE: NoiceEnv;
}
