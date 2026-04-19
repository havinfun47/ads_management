export const env = {
  facebookAppId: process.env.FACEBOOK_APP_ID ?? "",
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET ?? "",
  appUrl: process.env.APP_URL ?? "http://localhost:3000",
  graphApiVersion: process.env.META_GRAPH_API_VERSION ?? "v23.0",
};

export const metaScopes = [
  "public_profile",
  "email",
  "pages_show_list",
  "pages_read_engagement",
  "pages_manage_ads",
  "business_management",
  "ads_read",
  "ads_management",
] as const;
