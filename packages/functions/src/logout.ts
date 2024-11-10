import { Handler } from "aws-lambda";

export const handler: Handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Logged out" }), 
    headers: {
      "Set-Cookie": "sessionToken=; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=0",
    },
  };
};
