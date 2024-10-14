import { CoreAssets } from '@noice-com/assets-core';
import {
  BiBody,
  BiCommentCheck,
  BiFlag,
  BiGridHorizontal,
  BiGroup,
  BiMoney,
  BiMoneyWithdraw,
  BiNoEntry,
  BiShield,
  BiSmile,
  BiSolidCollection,
  BiSolidLandmark,
  BiTrophy,
  BiUser,
  BiUserPlus,
  BiWallet,
} from 'react-icons/bi';

import { AddNewUser } from './pages/new-user/AddNewUser';
import {
  InventoryAvatarParts,
  InventoryCards,
  InventoryEmojis,
  InventoryEmotes,
  Moderation,
  UserChannelBans,
} from './pages/user';
import { UserWalletPayments } from './pages/UserWalletPayments/UserWalletPayments';
import { UserWalletTransactions } from './pages/UserWalletTransactions/UserWalletTransactions';
import { PlatformSuspensionAppeals } from './PlatformSuspensionAppeals/PlatformSuspensionAppeals';
import { SidebarUser } from './SidebarUser/SidebarUser';
import { User } from './User/User';
import { UserSubscriptions } from './User/UserSubscriptions/UserSubscriptions';
import { UserFeatureFlags } from './UserFeatureFlags/UserFeatureFlags';
import { UserFriends } from './UserFriends/UserFriends';
import { UserRanksAndProgression } from './UserRanksAndProgression/UserRanksAndProgression';
import { Users } from './Users/Users';
import { UserWallet } from './UserWallet/UserWallet';

import { Module } from '@common/module';
import { RedirectByPermission } from '@common/route';
import { AuthPlatformRole } from '@gen';

export const userModule: Module = {
  id: 'users',
  title: 'Users',
  pages: [
    {
      id: 'index',
      title: 'Users',
      icon: BiUser,
      description: 'List of all users',
      component: <Users />,
    },
    {
      id: 'suspension-appeals',
      title: 'Suspension appeals',
      icon: BiCommentCheck,
      description: 'List of pending user appeals for platform suspension',
      component: <PlatformSuspensionAppeals />,
      permissions: [AuthPlatformRole.PlatformRoleModerator],
    },
    {
      id: 'new-user',
      title: 'Add new user',
      component: <AddNewUser />,
      icon: BiUserPlus,
      permissions: [AuthPlatformRole.PlatformRolePxAgent],
    },
    {
      id: ':userId',
      title: 'Profile',
      icon: BiUser,
      component: <User />,
      contextualSidebarWrapper: SidebarUser,
      permissions: [
        AuthPlatformRole.PlatformRoleModerator,
        AuthPlatformRole.PlatformRolePxAgent,
      ],
      subPages: [
        {
          id: 'subscriptions',
          title: 'Subscriptions',
          icon: BiSolidCollection,
          component: <UserSubscriptions />,
          permissions: [AuthPlatformRole.PlatformRolePxAgent],
        },
        {
          id: 'friends',
          title: 'Friends',
          icon: BiGroup,
          component: <UserFriends />,
          permissions: [AuthPlatformRole.PlatformRoleModerator],
        },
        {
          id: 'inventory',
          title: 'Inventory',
          icon: BiGridHorizontal,
          component: <RedirectByPermission />,
          permissions: [
            AuthPlatformRole.PlatformRoleModerator,
            AuthPlatformRole.PlatformRolePxAgent,
          ],
          subSubPages: [
            {
              id: 'cards',
              title: 'Cards',
              icon: CoreAssets.Icons.BxCards,
              component: <InventoryCards />,
              permissions: [AuthPlatformRole.PlatformRolePxAgent],
            },
            {
              id: 'emojis',
              title: 'Emojis',
              icon: BiSmile,
              component: <InventoryEmojis />,
              permissions: [
                AuthPlatformRole.PlatformRoleModerator,
                AuthPlatformRole.PlatformRolePxAgent,
              ],
            },
            {
              id: 'emotes',
              title: 'Emotes',
              icon: BiBody,
              component: <InventoryEmotes />,
              permissions: [
                AuthPlatformRole.PlatformRoleModerator,
                AuthPlatformRole.PlatformRolePxAgent,
              ],
            },
            {
              id: 'avatarparts',
              title: 'Avatar Parts',
              icon: BiBody,
              component: <InventoryAvatarParts />,
              permissions: [
                AuthPlatformRole.PlatformRoleModerator,
                AuthPlatformRole.PlatformRolePxAgent,
              ],
            },
          ],
        },
        {
          id: 'wallet',
          title: 'Wallet',
          icon: BiWallet,
          component: <RedirectByPermission />,
          permissions: [AuthPlatformRole.PlatformRolePxAgent],
          subSubPages: [
            {
              id: 'currency',
              title: 'Wallet',
              icon: BiMoney,
              component: <UserWallet />,
              permissions: [AuthPlatformRole.PlatformRolePxAgent],
            },
            {
              id: 'transactions',
              title: 'Transactions',
              icon: BiMoneyWithdraw,
              component: <UserWalletTransactions />,
              permissions: [AuthPlatformRole.PlatformRolePxAgent],
            },
            {
              id: 'payments',
              title: 'Payments',
              icon: BiSolidLandmark,
              component: <UserWalletPayments />,
              permissions: [AuthPlatformRole.PlatformRolePxAgent],
            },
          ],
        },
        {
          id: 'ranks',
          title: 'Ranks & Progression',
          icon: BiTrophy,
          component: <UserRanksAndProgression />,
          permissions: [AuthPlatformRole.PlatformRolePxAgent],
        },
        {
          id: 'moderation',
          title: 'Moderation',
          icon: BiShield,
          component: <Moderation />,
          isSubSubPagesExcludedFromNavigation: true,
          permissions: [
            AuthPlatformRole.PlatformRoleModerator,
            AuthPlatformRole.PlatformRolePxAgent,
          ],
          subSubPages: [
            {
              id: 'channel-bans',
              title: 'Channel bans',
              icon: BiNoEntry,
              component: <UserChannelBans />,
              permissions: [AuthPlatformRole.PlatformRoleModerator],
            },
          ],
        },
        {
          id: 'feature-flags',
          title: 'Feature Flags',
          icon: BiFlag,
          component: <UserFeatureFlags />,
        },
      ],
    },
  ],
};
