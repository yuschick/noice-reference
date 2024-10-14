import { SettingsRoutes } from '@common/route';

export const PAYMENT_RECEIPT_PATH = ':paymentId';

export const userSettingsRoutesWithLabels: { label: string; id: SettingsRoutes }[] = [
  {
    label: 'Profile info',
    id: SettingsRoutes.Profile,
  },
  {
    label: 'Account',
    id: SettingsRoutes.Account,
  },
  {
    label: 'Privacy',
    id: SettingsRoutes.Privacy,
  },
  {
    label: 'Wallet',
    id: SettingsRoutes.Wallet,
  },
  {
    label: 'Subscriptions',
    id: SettingsRoutes.Subscriptions,
  },
  {
    label: 'Connections',
    id: SettingsRoutes.Connections,
  },
  {
    label: 'Notifications',
    id: SettingsRoutes.Notifications,
  },
];
