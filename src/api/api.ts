 
import 'src/services/env/env.service';
import fastify, { FastifyInstance, FastifyLoggerOptions } from 'fastify';
import autoload from '@fastify/autoload';
import path from 'path';
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from 'fastify-type-provider-zod';
import { getUUIDService } from 'src/services/uuid/uuid.service';
import { errorHandler } from './errors/error.handler';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import crypto from 'crypto';
import { getRepos } from 'src/repos';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import autoTagging from './plugins/auto-tagging.plugin';
import requestId from './plugins/request-id.plugin';
import responseTime from './plugins/response-time.plugin';
import healthCheck from './plugins/health-check.plugin';
import routePrinter from './plugins/route-printer.plugin';
import { EErrorCodes, getErrorCodesDescription } from './errors/EErrorCodes';
import { fastifyBasicAuth } from '@fastify/basic-auth';
import { getDb, dbHealthCheck } from 'src/services/drizzle/drizzle.service';

function getLoggerOptions(): FastifyLoggerOptions {
  const localPrintOpts = {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss.l Z',
        ignore: 'pid,hostname'
      }
    }
  };

  const opts: FastifyLoggerOptions & {redact: string[]} = {
    level: 'trace',
    redact: ['req.headers.authorization', 'req.headers["impersonate-authorization"]'],
    serializers: {
      req (request) {
        return {
          ip: request.ip,
          method: request.method,
          url: request.url,
          path: request.routeOptions.url,
          query: request.query,
          parameters: request.params,
          headers: request.headers
        };
      }
    }
  };

  return process.env.NODE_ENV === 'local' ? { ...localPrintOpts, ...opts } : opts;
}

async function setupSwagger(server: FastifyInstance, userName: string, pwd: string) {
  await server.register(fastifyBasicAuth, {
    validate(u, p, _req, _reply, done) {
      if (u === userName && pwd === p) {
        done();
      } else {
        done(new Error('Unauthorized'));
      }
    },
    authenticate: true
  });
  await server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'fastify-boilerplate',
        description: 'fastify-boilerplate',
        version: '1.0.0'
      },
      servers: [],
      security: [{ auth: [] }],
      components: {
        securitySchemes: {
          auth: {
            description: 'Authorization header token, sample: "Bearer {TOKEN}"',
            type: 'apiKey',
            name: 'authorization',
            in: 'header'
          }
        },
        schemas: {
          ErrorCodes: {
            type: 'integer',
            enum: Object.values(EErrorCodes).filter((value) => typeof value === 'number'),
            description: getErrorCodesDescription()
          }
        }
      }
    },
    transform: jsonSchemaTransform
  });
  await server.register(fastifySwaggerUI, {
    routePrefix: '/api/documentation',
    logLevel: 'silent',
    uiHooks: {
      onRequest: server.basicAuth
    }
  });
}

async function run() {
  const server = fastify({
    // get from reverse proxy
    // or using genReqId
    genReqId: () => crypto.randomUUID(),
    // if reverse proxy has x-request-id use if for request id
    requestIdHeader: 'x-request-id',
    trustProxy: true,
    logger: getLoggerOptions(),
    exposeHeadRoutes: false
  });

  // global node js error handlers
  process.on('uncaughtException', (err) => {
    server.log.error(err);
    process.exit(1);
  });
  process.on('unhandledRejection', (err) => {
    server.log.error(err);
    process.exit(1);
  });

  server.register(helmet);
  server.register(cors);

  // TODO check why in docker build it fails without "!"
  if (['local', 'staging'].includes(process.env.NODE_ENV!)) {
    await setupSwagger(server, process.env.SWAGGER_USER, process.env.SWAGGER_PWD);
  }

  // set error handler
  server.setErrorHandler(errorHandler);

  // set not found handler
  server.setNotFoundHandler((_1, r) => {
    return r.status(404).send(404);
  });

  // set zod req/res validator and serializer
  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  // load context
  server.decorate('uuid', getUUIDService());
  // server.decorate(
  //   'identityService',
  //   getAWSCognitoService(process.env.AWS_REGION)
  // );
  server.decorate(
    'db',
    getDb({
      host: process.env.PGHOST || '',
      port: parseInt(process.env.PGPORT || ''),
      db: process.env.PGDATABASE || '',
      user: process.env.PGUSERNAME || '',
      pwd: process.env.PGPASSWORD || '',
      logsEnabled: process.env.NODE_ENV == 'local'
    })
  );
  server.decorate('repos', getRepos(server.db));

  server.register(autoTagging);

  // load plugins
  server.register(responseTime);
  server.register(healthCheck, {
    healthChecksPromises: [
      () => dbHealthCheck(server.db)
    ],
    path: '/api/health'
  });
  server.register(requestId);
  server.register(routePrinter, {
    skip: ['/api/documentation'],
    logLevel: 'silent'
  });

  // load routes
  server.register(autoload, {
    dir: path.join(__dirname, 'routes'),
    ignoreFilter: 'schemas',
    options: {
      prefix: '/api'
    },
    autoHooks: true,
    cascadeHooks: true,
    routeParams: true
  });
  await server.ready();
  await server.listen({
    port: parseInt(process.env.PORT || ''),
    host: process.env.HOST || ''
  });
}

run();