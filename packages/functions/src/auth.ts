import { Resource } from "sst";
import { auth } from "sst/aws/auth";
import { GoogleAdapter } from "sst/auth/adapter";
import { session } from "./session";

export const handler = auth.authorizer({
  session,
  basePath: "/auth",
  providers: {
    google: GoogleAdapter({
      clientID: Resource.GoogleClientID.value,
      mode: "oidc",
    }),
  },
  callbacks: {
    auth: {
      async allowClient(clientID: string, redirect: string) {
        return true;
      },
      async error(error) {
        console.error("auth error", error);
        return new Response("auth error", { status: 401 });
      },
      async success(ctx, input) {
        if (input.provider === "google") {
          const newSession = await ctx.session({
            type: "user",
            properties: {
              email: input.tokenset.claims().email!,
            },
          });

          // create a new session token
          const sessionToken = await session.create({
            type: "user",
            properties: {
              email: input.tokenset.claims().email!,
            },
          });

          // Modify the response headers to add a new cookie
          newSession.headers.append(
            "set-cookie",
            `sessionToken=${sessionToken}; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=86400`,
          );

          return newSession;
        }

        throw new Error(`Unknown provider '${input.provider}'`);
      },
    },
  },
});
