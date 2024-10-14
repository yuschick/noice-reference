export type StreamSettingsPageId =
  | 'main'
  | 'render-metrics'
  | 'stream-quality'
  | 'render-quality-profile'
  | 'render-settings'
  | 'render-settings-frame-rate'
  | 'render-settings-crowd-animation-rate'
  | 'render-settings-crowd-detail'
  | 'render-settings-crowd-mode'
  | 'render-settings-shadow-type'
  | 'render-settings-shadow-quality'
  | 'render-settings-lighting-type'
  | 'render-settings-anti-aliasing'
  | 'render-settings-crowd-resolution';

export interface StreamSettingsPageProps {
  onSelectPage(id: StreamSettingsPageId): void;
}

export interface StreamSettingsPage {
  type: StreamSettingsPageId;
  parent: StreamSettingsPageId;
  component: React.ComponentType<StreamSettingsPageProps>;
}
