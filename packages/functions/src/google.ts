// import { Resource } from "sst";
import { Handler } from "aws-lambda";
import { Example } from "@socialize/core/example";
// import { session } from "./session";

export const handler: Handler = async (event, context) => {
  console.dir(event, { depth: null });
  console.dir(context, { depth: null });

  // const code = 'eyJhbGciOiJSUzUxMiJ9.eyJjbGllbnRfaWQiOiI3MzA3ODQzMDYtMjIxajBxMjVuajBhYnE0cnJpczZoZmFpM3Q0M3FpbzMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJyZWRpcmVjdF91cmkiOiJodHRwczovL2xvY2FsaG9zdDozMDAxIiwidG9rZW4iOiJleUpoYkdjaU9pSlNVelV4TWlKOS5leUowZVhCbElqb2lkWE5sY2lJc0luQnliM0JsY25ScFpYTWlPbnNpWlcxaGFXd2lPaUp2YzNWc2JHbDJZVzVxTGpBeFFHZHRZV2xzTG1OdmJTSjlMQ0psZUhBaU9qRTNOakkxTnpZek16TjkuWnp4RHdLVTFfV3QtaHNpNG5fc0lLTFUzTGhBS0doZ19vSm9aaHl2NEFfQklXSTV3MlEzZFJqa1BNbmxFSkpKVmxMZzllcm8wcWVfX1F5NmNqQTVNTWZ1aS0zaWJLTVU4S2JELWlkS1hnODZFdklObjdaM1F5V21PTVk0VVQxNUhlMHJUMFh4RlN6anlkaEREYWtfc2QzZ3Vha1ZTQ1NHWWdleFdXeFV4cmJmNGJkQm9JQmtoYlpremxYSHlmdkhIRHo2S2w4ZGxMRmZVZ09XMkFIS3pzZkNnTlR3ZVpkU1gxcjZaUXR5UkVHek9Eck5JRDd0LUZsOTdVOUJtMk9yMF9ESFhvWnhKRzNRN3YtQTdueE5aSGtyNFF3ajFsb0hFLVJrQThjZHVURWEyemwtbktabTlMSGwweTZTeXU1Q3Q5QlF2RlBLUUVtZ1d2bmxfVWd0MkhnIiwiZXhwIjoxNzMxMDE4NzYzfQ.Bnhn1hY-I-RVonIXf_qlPOzWf4uQpeJUpZVm2pTJ1MQzwJPjONEzjL5jFFSrKfn8nLiDKCUjkN-pOnL6TxmP7y6dzb7iHdKBbq4CaghuAOmaNF8ml2ZQHqg9RRF6bYwOUVqp4wvXF7Rs0zMpxiexkaZMpA7D99A_WpwXJmXUFAZWJkXapvtv2nkbVXLZC-kKgXQZTmQhut-mrbFjKlHaQo1WsxYvRydx2jMoppW_Emi0PxQ7LTxwTPZGeEqafjxlKxksW_Ocbe8Xq4seqaiRXAZQ8G0e55P0O4RTgPzbolGtnbMffBcBPxRynHRlrRN1D-4l7V8s4uqqJe8Y7o_Nlw&state='
  // const result = await session.verify(code);

  // const token = await session.create({ 
  //   type: "user",
  //   properties: {
  //     email: "os",
  //   },
  // ));

  // console.log("result:", result);

  return {
    statusCode: 200,
    body: `${Example.hello()} from /google/callback.`,
  };
};
