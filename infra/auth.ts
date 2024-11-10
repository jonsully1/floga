import { GoogleClientID } from "./secrets";

export const auth = new sst.aws.Auth("Auth", {
  authenticator: {
    link: [GoogleClientID],
    handler: "packages/functions/src/auth.handler",
    url: true,
  },
});
