# Serverless - AWS Node.js Typescript


This project is a modified version of a template that has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

These modifications are:
- HTTP API: This project runs on AWS API Gateway **HTTP API** instead of the API Gateway **REST API**. The main goal of this is to save costs (see [pricing](https://aws.amazon.com/api-gateway/pricing/))
  - If you would like to use the REST API, then simply go to `src/<your-function-name>/index.ts` and change `httpApi` to `http`
  - I highly recommend checking out the [differences between HTTP APIs and REST APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) and choosing your API type based on the features that you need.
- Validation: Since [tbe REST API has built-in validation](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-method-request-validation.html), and HTTP API does **not**, this modified package compensates by including middy's [validator middleware](https://github.com/middyjs/middy/tree/main/packages/validator) that validates JSON schemas using [ajv](https://github.com/ajv-validator/ajv).
- Response Serialization: Serialization of the HTTP response from a JavaScript object to a JSON is done using middy [http-response-serializer](https://github.com/middyjs/middy/tree/main/packages/http-response-serializer) middleware.
- Handling Error Messages: This package also uses middy [http-error-handle](https://github.com/middyjs/middy/tree/main/packages/http-error-handler) to handle errors coming from the validation or the developer.

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

### Using Yarn

- Run `yarn` to install the project dependencies
- Run `yarn sls deploy` to deploy this stack to AWS

## Test your service

This template contains a single lambda function triggered by an HTTP request made on the provisioned API Gateway HTTP API `/hello` route with `POST` method. The request body must be provided as `application/json`. The body structure is tested by a validator middlware against `src/functions/hello/schema.ts` JSON-Schema definition: it must contain the `name` property.

- requesting any other path than `/hello` with any other method than `POST` will result in API Gateway returning a `404 Not Found` HTTP error code
- sending a `POST` request to `/hello` with a payload **not** containing a string property named `name` will result in API Gateway returning a `400 Bad Request` HTTP error code
- sending a `POST` request to `/hello` with a payload containing a string property named `name` will result in API Gateway returning a `200 OK` HTTP status code with a message saluting the provided name and the detailed event processed by the lambda.

> :warning: As is, this template, once deployed, opens a **public** endpoint within your AWS account resources. Anybody with the URL can actively execute the API Gateway endpoint and the corresponding lambda. You should protect this endpoint with the authentication method of your choice.

### Locally

In order to test the hello function locally, run the following command:

- `npx sls invoke local -f hello --path src/functions/hello/mock.json` if you're using NPM
- `yarn sls invoke local -f hello --path src/functions/hello/mock.json` if you're using Yarn

Check the [sls invoke local command documentation](https://www.serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/) for more information.

### Remotely

Copy and replace your `url` - found in Serverless `deploy` command output - and `name` parameter in the following `curl` command in your terminal or in Postman to test your newly deployed application.

```
curl --location --request POST 'https://myApiEndpoint/dev/hello' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Frederic"
}'
```

## Template features

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas

```
.
├── src
│   ├── functions               # Lambda configuration and source code folder
│   │   ├── hello
│   │   │   ├── handler.ts      # `Hello` lambda source code
│   │   │   ├── index.ts        # `Hello` lambda Serverless configuration
│   │   │   ├── mock.json       # `Hello` lambda input parameter, if any, for local invocation
│   │   │   └── schema.ts       # `Hello` lambda input event JSON-Schema
│   │   │
│   │   └── index.ts            # Import/export of all lambda configurations
│   │
│   └── libs                    # Lambda shared code
│       └── apiGateway.ts       # API Gateway specific helpers
│       └── handlerResolver.ts  # Sharable library for resolving lambda handlers
│       └── lambda.ts           # Lambda middleware
│
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── tsconfig.paths.json         # Typescript paths
└── webpack.config.js           # Webpack configuration
```

### 3rd party libraries

- [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts) - uses JSON-Schema definitions used by API Gateway for HTTP request validation to statically generate TypeScript types in your Lambda's handler code base
- [middy](https://github.com/middyjs/middy) - middleware engine for Node.Js Lambda. 
  - [http-json-body-parser](https://github.com/middyjs/middy/tree/master/packages/http-json-body-parser) to convert API Gateway `event.body` property, originally passed as a stringified JSON, to its corresponding parsed object. 
  - [validator](https://github.com/middyjs/middy/tree/main/packages/validator) to validate API Gateway `event`s
  - [http-error-handle](https://github.com/middyjs/middy/tree/main/packages/http-error-handler) to handle errors coming from the validation or the developer.
- [@serverless/typescript](https://github.com/serverless/typescript) - provides up-to-date TypeScript definitions for your `serverless.ts` service file

### Advanced usage

Any tsconfig.json can be used, but if you do, set the environment variable `TS_NODE_CONFIG` for building the application, eg `TS_NODE_CONFIG=./tsconfig.app.json npx serverless webpack`
