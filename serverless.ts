import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';

const serverlessConfiguration: AWS = {
  service: 'aws-nodejs-typescript-http-api',
  frameworkVersion: '3',
  configValidationMode: 'error',
  custom: {
    // esbuild: {
    //   bundle: true,
    //   minify: true,
    // },
  },
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
  },
  // import the function via paths
  functions: { hello },
};

module.exports = serverlessConfiguration;
