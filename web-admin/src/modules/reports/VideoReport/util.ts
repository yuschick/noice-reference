import { SupportReportReason } from '@gen';

const reportReasonMap: Record<SupportReportReason, string> = {
  [SupportReportReason.ReportReasonChildSafetyChildAbuse]: 'Child abuse',
  [SupportReportReason.ReportReasonChildSafetyCse]: 'Child sexual exploit ',
  [SupportReportReason.ReportReasonChildSafetyDangerous]: 'Child safety',
  [SupportReportReason.ReportReasonChildSafetyUnderageUser]: 'Underage user',
  [SupportReportReason.ReportReasonGraphicMediaAnimalAbuse]: 'Media - animal abuse',
  [SupportReportReason.ReportReasonGraphicMediaGore]: 'Graphic gore',
  [SupportReportReason.ReportReasonGraphicMediaViolence]: 'Graphic violence',
  [SupportReportReason.ReportReasonHarassment]: 'Harassment',
  [SupportReportReason.ReportReasonHarassmentBlackmail]: 'Harassment - blackmail',
  [SupportReportReason.ReportReasonHarassmentIncitement]: 'Harassment - incitement',
  [SupportReportReason.ReportReasonHarassmentNonConsensualIntimateImages]: '',
  [SupportReportReason.ReportReasonHarassmentSexualNonConsensual]: '',
  [SupportReportReason.ReportReasonHarassmentStalking]: 'Harassment - stalking',
  [SupportReportReason.ReportReasonHatefulBehavior]: 'Hateful behaviours',
  [SupportReportReason.ReportReasonIllegalActivitySale]: 'Illegale - sale',
  [SupportReportReason.ReportReasonIllegalActivityWeapons]: 'Illegal - weapons',
  [SupportReportReason.ReportReasonIllegalAlcoholNicotine]: 'Illegal - alcohol/nicotine',
  [SupportReportReason.ReportReasonIllegalDrugs]: 'Illegal - drugs',
  [SupportReportReason.ReportReasonIllegalManipulation]: 'Illegal - manipulation',
  [SupportReportReason.ReportReasonIllegalSpam]: 'Illegal - spam',
  [SupportReportReason.ReportReasonImpersonation]: 'Impersonation',
  [SupportReportReason.ReportReasonInauthenticGameplay]: 'Inauthentic gameplay',
  [SupportReportReason.ReportReasonOffPlatform]: 'Off platform',
  [SupportReportReason.ReportReasonPlatformRulesViolation]: 'Rule violation',
  [SupportReportReason.ReportReasonPossibleIllegalActivity]: 'Possibly illegal',
  [SupportReportReason.ReportReasonRestrictedGamesInherentlyViolative]:
    'Restricted games - violative',
  [SupportReportReason.ReportReasonRestrictedGamesMature]: 'Restricted games - mature',
  [SupportReportReason.ReportReasonSelfHarm]: 'Self harm',
  [SupportReportReason.ReportReasonSexualBehaviorExplicit]: 'Explicit behavior',
  [SupportReportReason.ReportReasonSexualBehaviorSuggestive]: 'Suggestive behavior',
  [SupportReportReason.ReportReasonSpam]: 'Spam',
  [SupportReportReason.ReportReasonSpamSuspensionEvasion]: 'Spam suspension evasion',
  [SupportReportReason.ReportReasonUnknown]: 'Unknown',
  [SupportReportReason.ReportReasonUnspecified]: 'Unspecified',
  [SupportReportReason.ReportReasonViolenceExtremism]: 'Violence extremism',
};

/**
 * Format offset seconds to hh:mm:ss.
 */
export const formatTimeFromOffset = (offset: number): string => {
  const hour = Math.floor(offset / 3600);
  offset %= 3600;
  const min = Math.floor(offset / 60);
  const sec = offset % 60;

  return hour + ':' + (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec;
};

export const getReportReasonText = (reason: SupportReportReason): string => {
  return reportReasonMap[reason];
};
