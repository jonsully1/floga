import { api } from "./api";
import { auth } from "./auth";

export const frontend = new sst.aws.Nextjs("Frontend", {
  path: "packages/frontend",
  environment: {
    API_AUTH_URL: auth.authenticator.url,
    API_URL: api.url,
  },
});
