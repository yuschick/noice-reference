export type ZendeskWidgetAPI = (
  name: string,
  action: string,
  callback?: (param?: any) => void,
) => void;
