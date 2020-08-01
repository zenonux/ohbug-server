export interface ReceiveSourceMapFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination?: string;
  filename: string;
  path: string;
  size: number;
}

export type SourceMapData = ReceiveSourceMapFile[];
