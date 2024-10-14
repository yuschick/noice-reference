import { SettingsGroup } from '../../SettingsGroup';

import { CookiesSettingsButton } from '@common/cookies';

export function CookiesConsent() {
  return (
    <SettingsGroup
      description="Manage and control your consent"
      title="Cookies Preferences"
    >
      <SettingsGroup.Action>
        <CookiesSettingsButton label="Manage Preferences" />
      </SettingsGroup.Action>
    </SettingsGroup>
  );
}
