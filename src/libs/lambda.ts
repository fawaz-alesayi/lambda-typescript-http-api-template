import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import validator from "@middy/validator";
import httpErrorHandler from "@middy/http-error-handler";
import httpResponseSerializer from "@middy/http-response-serializer";

export const middyfy = (handler, inputSchema?: Record<string, any>, outputSchema?: Record<string, any>) => {
  return middy(handler)
    .use(middyJsonBodyParser())
    .use(
      validator({
        inputSchema: inputSchema ? inputSchema : {},
        outputSchema: outputSchema ? outputSchema : {},
      })
    )
    .use(
      httpResponseSerializer({
        serializers: [
          {
            regex: /^application\/json$/,
            serializer: ({ body }) => JSON.stringify(body),
          },
          {
            regex: /^text\/plain$/,
            serializer: ({ body }) => body,
          },
        ],
        default: "application/json",
      })
    )
    .use(httpErrorHandler());
};
