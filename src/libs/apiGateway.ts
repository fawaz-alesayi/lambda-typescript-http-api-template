import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<InputSchema> = Omit<APIGatewayProxyEvent, "body"> & Required<FromSchema<InputSchema>>

// This type is sound because we are sure that the reponse body will be serialized by @middy/http-response-serializer
type SerializedAPIGatewayProxyResult<OutputSchema> = Omit<APIGatewayProxyResult, "body"> & Required<FromSchema<OutputSchema>>;

export type LambdaHandler<InputSchema, OutputSchema = void> = Handler<
  ValidatedAPIGatewayProxyEvent<InputSchema>,
  SerializedAPIGatewayProxyResult<OutputSchema>
>;
