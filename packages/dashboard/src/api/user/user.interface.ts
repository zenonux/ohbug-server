export type OAuthType = 'github' | null;

export type OAuth = Record<
  OAuthType,
  {
    id: string;
    detail?: any;
  }
>;
