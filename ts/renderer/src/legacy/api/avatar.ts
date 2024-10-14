export interface Avatar {
  id: string;
  version: number;
  generatorVersion: string;

  slot: number;

  url: string;
  lodURLs?: string[];

  isMemberOfLocalGroup: boolean;

  applyShoeOffset: boolean;
}
