import "source-map-support/register";

import type { LambdaHandler } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

import InputSchema from "./inputSchema";

// You may also pass an output schema as a second type parameter for type-checking.
// const hello: LambdaHandler<typeof InputSchema typeof OutputSchema> ...
const hello: LambdaHandler<typeof InputSchema> = async (
  event
) => {
  return {
    statusCode: 200,
    body: {
      message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
      event,
    },
  };
};

// You may also pass an output schema.
// export const main = middyfy(hello, InputSchema, OutputSchema);
export const main = middyfy(hello, InputSchema);
