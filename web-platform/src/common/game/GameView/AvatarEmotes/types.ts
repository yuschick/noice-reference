export interface AvatarEmoteDef {
  id: string;
  name: string;
  icon: string;
  keyBinding?: string;
  type: 'emote' | 'emoji';
}

export interface RecentlyUsedEmote extends AvatarEmoteDef {
  keyBinding: string;
}
