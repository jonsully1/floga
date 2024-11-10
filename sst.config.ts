/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "socialize",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    await import("./infra/storage");
    const { api } = await import("./infra/api");
    const { auth } = await import("./infra/auth");
    const { frontend } = await import("./infra/frontend");

    return {
      region: aws.getRegionOutput().name,
      api: api.url,
      auth: auth.authenticator.url,
      frontend: frontend.url,
    };
  },
});
