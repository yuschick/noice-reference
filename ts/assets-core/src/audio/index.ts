// ! IMPORTANT ! Make sure that you keep this in alphabetical order so they are easier to compare to the directory.
// 1. These are batched so that we dont have to asyncronously import each path.
// 2. This gets imported via the individual sound loaders.
// 3. Try to always make sure the exported variable is named the same as the imports! ex:
// export <soundname> = [<soundname>Mp3, <soundname>Webm>];
// This makes tweaking these and adding new ones MUCH easier.

import AssetRevealMp3 from './ui_asset_reveal.mp3';
import AssetRevealWebm from './ui_asset_reveal.webm';
import ButtonClickCancelMp3 from './ui_cancel_action.mp3';
import ButtonClickCancelWebm from './ui_cancel_action.webm';
import CardHoverMp3 from './ui_cards_hover.mp3';
import CardHoverWebm from './ui_cards_hover.webm';
import ButtonClickConfirmMp3 from './ui_confirm_action.mp3';
import ButtonClickConfirmWebm from './ui_confirm_action.webm';
import CurrencyCoinRewardMp3 from './ui_currencies_coin_reward.mp3';
import CurrencyCoinRewardWebm from './ui_currencies_coin_reward.webm';
import CurrencyCoinCountDownMp3 from './ui_currencies_coins_count_down.mp3';
import CurrencyCoinCountDownWebm from './ui_currencies_coins_count_down.webm';
import CurrencyCoinCountUpMp3 from './ui_currencies_coins_count_up.mp3';
import CurrencyCoinCountUpWebm from './ui_currencies_coins_count_up.webm';
import CurrencyXpCountUpMp3 from './ui_currencies_xp_count_up.mp3';
import CurrencyXpCountUpWebm from './ui_currencies_xp_count_up.webm';
import CurrencyXpCountUpEndMp3 from './ui_currencies_xp_count_up_end.mp3';
import CurrencyXpCountUpEndWebm from './ui_currencies_xp_count_up_end.webm';
import GenericAttentionMp3 from './ui_generic_attention.mp3';
import GenericAttentionWebm from './ui_generic_attention.webm';
import GenericHoverMp3 from './ui_generic_hover_over_action.mp3';
import GenericHoverWebm from './ui_generic_hover_over_action.webm';
import MenuCloseMp3 from './ui_generic_menu_close.mp3';
import MenuCloseWebm from './ui_generic_menu_close.webm';
import MenuOpenMp3 from './ui_generic_menu_open.mp3';
import MenuOpenWebm from './ui_generic_menu_open.webm';
import NotificationDingMp3 from './ui_notifications_appear.mp3';
import NotificationDingWebm from './ui_notifications_appear.webm';
import NotificationDingImportantMp3 from './ui_notifications_appear_important.mp3';
import NotificationDingImportantWebm from './ui_notifications_appear_important.webm';
import NotificationPlatformMp3 from './ui_notifications_platform.mp3';
import NotificationPlatformWebm from './ui_notifications_platform.webm';
import RankUpMp3 from './ui_player_rank_up.mp3';
import RankUpWebm from './ui_player_rank_up.webm';
import ProgressionCardDuplicateValueUpMp3 from './ui_progression_card_duplicate_value_up.mp3';
import ProgressionCardDuplicateValueUpWebm from './ui_progression_card_duplicate_value_up.webm';
import ProgressionCardLevelUpMp3 from './ui_progression_card_level_up.mp3';
import ProgressionCardLevelUpWebm from './ui_progression_card_level_up.webm';
import ProgressionCardUnlockedMp3 from './ui_progression_card_unlocked.mp3';
import ProgressionCardUnlockedWebm from './ui_progression_card_unlocked.webm';
import ScoringCardSucceedsVariationMp3 from './ui_scoring_card_succeeds_variation.mp3';
import ScoringCardSucceedsVariationWebm from './ui_scoring_card_succeeds_variation.webm';

export const ButtonClickCancel = [ButtonClickCancelWebm, ButtonClickCancelMp3];
export const ButtonClickConfirm = [ButtonClickConfirmWebm, ButtonClickConfirmMp3];
export const CardHover = [CardHoverWebm, CardHoverMp3];
export const CurrencyCoinReward = [CurrencyCoinRewardWebm, CurrencyCoinRewardMp3];
export const CurrencyCoinCountDown = [
  CurrencyCoinCountDownWebm,
  CurrencyCoinCountDownMp3,
];
export const CurrencyCoinCountUp = [CurrencyCoinCountUpWebm, CurrencyCoinCountUpMp3];
export const CurrencyXpCountUpEnd = [CurrencyXpCountUpEndWebm, CurrencyXpCountUpEndMp3];
export const CurrencyXpCountUp = [CurrencyXpCountUpWebm, CurrencyXpCountUpMp3];
export const GenericAttention = [GenericAttentionWebm, GenericAttentionMp3];
export const GenericHover = [GenericHoverWebm, GenericHoverMp3];
export const MenuOpen = [MenuOpenWebm, MenuOpenMp3];
export const MenuClose = [MenuCloseWebm, MenuCloseMp3];
export const NotificationDingImportant = [
  NotificationDingImportantWebm,
  NotificationDingImportantMp3,
];
export const NotificationDing = [NotificationDingWebm, NotificationDingMp3];
export const NotificationPlatform = [NotificationPlatformWebm, NotificationPlatformMp3];
export const RankUp = [RankUpWebm, RankUpMp3];
export const ProgressionCardDuplicateValueUp = [
  ProgressionCardDuplicateValueUpWebm,
  ProgressionCardDuplicateValueUpMp3,
];
export const ProgressionCardLevelUp = [
  ProgressionCardLevelUpWebm,
  ProgressionCardLevelUpMp3,
];
export const ProgressionCardUnlocked = [
  ProgressionCardUnlockedWebm,
  ProgressionCardUnlockedMp3,
];
export const ScoringCardSucceedsVariation = [
  ScoringCardSucceedsVariationWebm,
  ScoringCardSucceedsVariationMp3,
];

export const AssetReveal = [AssetRevealWebm, AssetRevealMp3];
