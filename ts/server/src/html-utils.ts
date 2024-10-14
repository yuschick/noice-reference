const configRegex = /(window\.NOICE=)(\{.*\})/;

export const injectConfigToHtml = (html: string, config: any) => {
  return html.replace(configRegex, `$1 ${JSON.stringify(config)}`);
};
