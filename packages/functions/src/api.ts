import { Resource } from "sst";
import { Handler } from "aws-lambda";
import { Example } from "@socialize/core/example";
import { session } from "./session";
import getCookie from "@core/utils/getCookie";

export const handler: Handler = async (event) => {
  const sessionToken = await getCookie(event, "sessionToken");
  if (!sessionToken) {
    return {
      statusCode: 401,
      body: "Unauthorized",
    };
  }

  const result = await session.verify(sessionToken.split("=")[1]);

  console.log("result:", result);

  return {
    statusCode: 200,
    body: `${Example.hello()} Linked to ${Resource.MyBucket.name}.`,
  };
};
