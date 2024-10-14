export interface NotificationData {
  title: string;
  link: string;
  body: string;
  imageURL: string;
  data: {
    channel: {
      id: string;
      name: string;
    };
  };
}

export function buildDeepLinkFromNotificationData(data: NotificationData): string | null {
  if (!data || !data.link) {
    return null;
  }

  return data.link;
}
