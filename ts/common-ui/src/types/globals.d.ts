/* eslint-disable @typescript-eslint/naming-convention */

declare module '*.module.css';

declare const NOICE: import('./common').CommonNoiceEnv;

declare module '*.webm' {
  const src: string;
  export default src;
}

declare module '*.mp3' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const value: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default value;
}

declare module '*.svg?url' {
  const value: string;
  export default value;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.mp4' {
  const value: string;
  export default value;
}

interface Performance {
  memory: {
    usedJSHeapSize: number;
  };
}

interface Window {
  ___grecaptcha_cfg?: Record<string, unknown>;
}

declare namespace React {
  interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
    fetchPriority?: 'high' | 'low' | 'auto';
  }
}
