import { ChannelViolation, ModerationViolation } from '@common-gen';

export const getChannelViolationText = (violation: ChannelViolation) => {
  if (violation === ChannelViolation.ViolationSpam) {
    return 'Spam';
  }

  return 'Other';
};

export const getPlatformViolationText = (violation: ModerationViolation) => {
  switch (violation) {
    case ModerationViolation.ViolationChildSafety:
      return 'Child Safety';
    case ModerationViolation.ViolationCircumventionEvasion:
      return 'Circumvention & Evasion';
    case ModerationViolation.ViolationHatefulBehavior:
      return 'Hateful Behavior';
    case ModerationViolation.ViolationPlatformManipulation:
      return 'Platform Manipulation';
    case ModerationViolation.ViolationIllegalHarmfulAndRestrictedActivity:
      return 'Illegal, Harmful and Restricted Activity';
    case ModerationViolation.ViolationSelfHarm:
      return 'Self-Harm';
    case ModerationViolation.ViolationSexualBehavior:
      return 'Sexual Behavior';
    case ModerationViolation.ViolationRestrictedGamesAndGamesWithGraphicFootage:
      return 'Restricted Games & Games with Graphic Footage';
    case ModerationViolation.ViolationResponsibleStreaming:
      return 'Responsible Streaming';
    case ModerationViolation.ViolationOffPlatformBehavior:
      return 'Off-Platform Behavior';
    case ModerationViolation.ViolationViolence:
      return 'Violence';
    case ModerationViolation.ViolationHarassmentTargetedAbuse:
      return 'Harassment & Targeted Abuse';
    case ModerationViolation.ViolationGraphicRealWorldMedia:
      return 'Graphic Real-World Media';
    case ModerationViolation.ViolationRepeatedCopyrightInfringement:
      return 'Repeated Copyright Infringement';
    case ModerationViolation.ViolationExtremism:
      return 'Extremism';
    case ModerationViolation.ViolationOther:
      return 'Other';
    default:
      return violation;
  }
};
