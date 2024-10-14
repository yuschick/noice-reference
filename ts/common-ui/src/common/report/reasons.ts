import { ReportContext } from '@noice-com/schemas/support/support.pb';

import { SupportReportReason } from '@common-gen';

export interface ReasonTree<T> {
  label: string;
  nodes: T;
}

export interface TreeNode {
  label: string;
  subtree?: ReasonTree<TreeNode[]>;
  reason?: SupportReportReason;
}

export interface ContextInfo {
  name?: keyof Omit<ReportContext, 'user' | 'channel'>;
}

const HarassmentAbuseAndHateSubtree: ReasonTree<TreeNode[]> = {
  label: "Please tell us more about the behavior you're seeing?",
  nodes: [
    {
      label:
        'The $role is engaging in hateful behavior, promoting hatred, prejudice or intolerance towards me, someone else or a group of people based on their race, ethnicity, color, caste, national origin, immigration status, religion, sex, gender, gender identity, gender expression, sexual orientation, disability, medical condition or veteran status',
      reason: SupportReportReason.ReportReasonHatefulBehavior,
    },
    {
      label: 'The $role is threatening or attempting to blackmail me or someone else',
      reason: SupportReportReason.ReportReasonHarassmentBlackmail,
    },
    {
      label:
        "The $role keeps trying to contact me even though I've blocked them or asked them to stop",
      reason: SupportReportReason.ReportReasonHarassmentStalking,
    },
    {
      label:
        "The $role is being sexually explicit, aggressive or suggestive towards me or others in the channel, and blocking them doesn't seem to be enough",
      reason: SupportReportReason.ReportReasonHarassmentSexualNonConsensual,
    },
    {
      label:
        "The $role is posting links to my or someone else's personal intimate images without permission",
      reason: SupportReportReason.ReportReasonHarassmentNonConsensualIntimateImages,
    },
    {
      label:
        'The $role is encouraging others to harass, intimidate or bully me or someone else',
      reason: SupportReportReason.ReportReasonHarassmentIncitement,
    },
    {
      label: 'The $role is doing something else',
      reason: SupportReportReason.ReportReasonHarassment,
    },
  ],
};

const ViolativeContentSubtree: ReasonTree<TreeNode[]> = {
  label: "Please tell us more about the content that you're reporting?",
  nodes: [
    {
      label: 'It contains child sexual exploitation',
      reason: SupportReportReason.ReportReasonChildSafetyCse,
    },
    {
      label: 'It features other forms of child abuse',
      reason: SupportReportReason.ReportReasonChildSafetyChildAbuse,
    },
    {
      label: 'It shows dangerous or harmful acts involving minors',
      reason: SupportReportReason.ReportReasonChildSafetyDangerous,
    },
    {
      label: 'It shows minors consuming alcohol, nicotine or vaping products',
      reason: SupportReportReason.ReportReasonIllegalAlcoholNicotine,
    },
    {
      label:
        'It contains hateful behavior, promoting hatred, prejudice or intolerance towards me, someone else or a group of people based on their race, ethnicity, color, caste, national origin, immigration status, religion, sex, gender, gender identity, gender expression, sexual orientation, disability, medical condition or veteran status',
      reason: SupportReportReason.ReportReasonHatefulBehavior,
    },
    {
      label: 'It shows consumption of illegal or regulated substances',
      reason: SupportReportReason.ReportReasonIllegalDrugs,
    },
    {
      label:
        'It contains abusive imagery intending to harass, threaten or bully me or someone else',
      reason: SupportReportReason.ReportReasonHarassment,
    },
    {
      label:
        "It contains my or someone else's personal intimate sexual images shared without permission",
      reason: SupportReportReason.ReportReasonHarassmentNonConsensualIntimateImages,
    },
    {
      label: 'It contains graphic real world violence',
      reason: SupportReportReason.ReportReasonGraphicMediaViolence,
    },
    {
      label: 'It shows animal abuse',
      reason: SupportReportReason.ReportReasonGraphicMediaAnimalAbuse,
    },
    {
      label:
        "It contains real-world footage that's not violent but is disgusting or nauseating",
      reason: SupportReportReason.ReportReasonGraphicMediaGore,
    },
    {
      label: 'It contains sexually explicit imagery, porn, or nudity',
      reason: SupportReportReason.ReportReasonSexualBehaviorExplicit,
    },
    {
      label: 'It contains sexually suggestive material',
      reason: SupportReportReason.ReportReasonSexualBehaviorSuggestive,
    },
    {
      label:
        'It is selling, promoting or offering illegal goods like drugs, regulated goods like nicotine or alcohol, or regulated or illegal services like prostitution or sexual services',
      reason: SupportReportReason.ReportReasonIllegalActivitySale,
    },
    {
      label: 'It shows real-world firearms or explosives or explains how to make them',
      reason: SupportReportReason.ReportReasonIllegalActivityWeapons,
    },
    {
      label:
        "It contains footage of a video game that is inherently violative of Noice's rules",
      reason: SupportReportReason.ReportReasonRestrictedGamesInherentlyViolative,
    },
    {
      label: 'It contains footage of an adult video game in an all-audiences channel',
      reason: SupportReportReason.ReportReasonRestrictedGamesMature,
    },
    {
      label: "It is a repost of someone else's material or content",
      reason: SupportReportReason.ReportReasonSpam,
    },
  ],
};

const OtherIssuesSubtree: ReasonTree<TreeNode[]> = {
  label: "Please tell us more about the behavior that you're reporting?",
  nodes: [
    {
      label:
        'Inauthentic gameplay like playing prerecorded game footage or threatening to interrupt the stream unless players take certain actions',
      reason: SupportReportReason.ReportReasonInauthenticGameplay,
    },
    {
      label:
        "Instructions or services to steal, hack or gain unauthorized entry into someone else's data or property",
      reason: SupportReportReason.ReportReasonIllegalManipulation,
    },
    {
      label: 'A scam, pyramid scheme or other form of financial fraud',
      reason: SupportReportReason.ReportReasonIllegalManipulation,
    },
    {
      label: 'An offer of services or instructions on how to create spam',
      reason: SupportReportReason.ReportReasonIllegalSpam,
    },
    {
      label:
        'The account is owned by someone who is not allowed to have an account on Noice',
      reason: SupportReportReason.ReportReasonOffPlatform,
    },
    {
      label:
        'The account is owned by someone who has engaged in off-platform behavior that goes against the Noice guidelines',
      reason: SupportReportReason.ReportReasonOffPlatform,
    },
    {
      label: 'The account is circumventing enforcement by Noice',
      reason: SupportReportReason.ReportReasonSpamSuspensionEvasion,
    },
    {
      label: 'Something else not listed',
      reason: SupportReportReason.ReportReasonUnknown,
    },
  ],
};

const channelNodes = [
  {
    label: 'This creator is saying they intend to hurt someone physically in real life',
    reason: SupportReportReason.ReportReasonViolenceExtremism,
  },
  {
    label:
      'This creator is saying they intend to hurt themselves physically in real life',
    reason: SupportReportReason.ReportReasonSelfHarm,
  },
  {
    label:
      'This creator is being hateful, abusive or harassing towards me, someone else or a group of people',
    subtree: HarassmentAbuseAndHateSubtree,
  },
  {
    label: "This livestream contains content that is disturbing or shouldn't be on Noice",
    subtree: ViolativeContentSubtree,
  },
  {
    label: 'This livestream is failing to moderate its chat according to their own rules',
    subtree: ViolativeContentSubtree,
  },
  {
    label: 'Something else',
    subtree: OtherIssuesSubtree,
  },
];

const LivestreamTree: ReasonTree<TreeNode[]> = {
  label: "What is the behavior that you're seeing in the livestream?",
  nodes: channelNodes,
};

const ChannelReportTree: ReasonTree<TreeNode[]> = {
  label: "What is the behavior that you're seeing in the channel?",
  nodes: channelNodes,
};

const userNodes = [
  {
    label:
      'This $role is saying in chat that they intend to hurt someone physically in real life',
    reason: SupportReportReason.ReportReasonViolenceExtremism,
  },
  {
    label:
      'This $role is saying in chat that they intend to hurt themselves physically in real life',
    reason: SupportReportReason.ReportReasonSelfHarm,
  },
  {
    label:
      'This $role is being hateful, abusive or harassing towards me, someone else or a group of people',
    subtree: HarassmentAbuseAndHateSubtree,
  },
  {
    label: "This $role is posting content that is disturbing or shouldn't be on Noice",
    subtree: ViolativeContentSubtree,
  },
  {
    label: 'This $role is posting spammy links or comments',
    reason: SupportReportReason.ReportReasonSpam,
  },
  {
    label: 'Something else',
    subtree: OtherIssuesSubtree,
  },
];

const ChatTree: ReasonTree<TreeNode[]> = {
  label: "What is the behavior that you're seeing in the chat?",
  nodes: userNodes,
};

const UserReportTree: ReasonTree<TreeNode[]> = {
  label: "What is the behavior that you're seeing from the user?",
  nodes: userNodes,
};

export enum UserRole {
  User = 'user',
  Creator = 'creator',
}

const preprocessReasonLabels = (role: UserRole, reasonTree: ReasonTree<TreeNode[]>) => {
  const roleRegex = /\$role/;

  reasonTree.nodes = reasonTree.nodes.map((n) => {
    n.label = n.label.replace(roleRegex, role);

    if (n.subtree) {
      preprocessReasonLabels(role, n.subtree);
    }

    return n;
  });

  return reasonTree;
};

export const getChatTree = (role: UserRole) => preprocessReasonLabels(role, ChatTree);

export const getLivestreamTree = (role: UserRole) =>
  preprocessReasonLabels(role, LivestreamTree);

export const getUserReportTree = (role: UserRole) =>
  preprocessReasonLabels(role, UserReportTree);

export const getChannelReportTree = (role: UserRole) =>
  preprocessReasonLabels(role, ChannelReportTree);
