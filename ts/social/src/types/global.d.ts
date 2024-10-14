/* eslint-disable @typescript-eslint/naming-convention */
interface NoiceEnv {
  CDN_URL: string;
}

declare const NOICE: NoiceEnv;

declare module '*.module.css';

declare module '*.svg' {
  const value: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default value;
}

declare module '*.webp' {
  const value: string;
  export default value;
}
