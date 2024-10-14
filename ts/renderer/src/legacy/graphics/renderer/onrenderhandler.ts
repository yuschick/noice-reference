export interface PreRenderProps {
  willRender: boolean;
  dynamicFrameLimiter: boolean;
  debugEnabled: boolean;
}

export interface OnRenderHandler {
  onPreRender({ willRender, dynamicFrameLimiter, debugEnabled }: PreRenderProps): void;
  onPostRender(): void;
  dispose(): void;
}
