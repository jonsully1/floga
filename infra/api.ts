import { auth } from "./auth";
import { bucket } from "./storage";

export const api = new sst.aws.ApiGatewayV2("Api", {
  cors: {
    allowOrigins: ["https://localhost:3001"],
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["*"],
    allowCredentials: true,
  },
});

api.route("GET /user", {
  handler: "packages/functions/src/api.handler",
  link: [bucket, auth],
});

api.route("GET /logout", {
  handler: "packages/functions/src/logout.handler",
});

// api.route("GET /", {
//   handler: "packages/functions/src/user/list.handler",
// });

// api.route("GET /user", {
//   handler: "packages/functions/src/user/get.handler",
// });
