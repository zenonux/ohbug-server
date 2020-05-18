export type OAuthType = 'github';

export type OAuth = Record<
  OAuthType,
  {
    id: string;
    detail?: any;
  }
>;
