import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import type { FromSchema, JSONSchema7 } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<InputSchema extends JSONSchema7> = Omit<APIGatewayProxyEvent, "body"> & Required<FromSchema<InputSchema>>

// This type is sound because we are sure that the reponse body will be serialized by @middy/http-response-serializer
type SerializedAPIGatewayProxyResult<OutputSchema extends JSONSchema7> = Omit<APIGatewayProxyResult, "body"> & Required<FromSchema<OutputSchema>>;

export type LambdaHandler<InputSchema extends JSONSchema7, OutputSchema extends JSONSchema7> = Handler<
  ValidatedAPIGatewayProxyEvent<InputSchema>,
  SerializedAPIGatewayProxyResult<OutputSchema>
>;
