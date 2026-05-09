import type { Params } from 'nestjs-pino';

import { LoggingConfig } from '../config/logging.config';
import { readBackendPackageVersion } from './backend-version';

function defaultLogLevel(logging: LoggingConfig): string {
  const fromEnv = logging.logLevel?.trim();
  if (fromEnv) {
    return fromEnv;
  }

  return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
}

function useBetterStack(logging: LoggingConfig): boolean {
  return (
    process.env.NODE_ENV === 'production' &&
    Boolean(logging.betterStackSourceToken && logging.betterStackSourceToken.length > 0)
  );
}

export function buildPinoLoggerParams(logging: LoggingConfig): Params {
  const level = defaultLogLevel(logging);
  const prodWithBetterStack = useBetterStack(logging);
  const isProd = process.env.NODE_ENV === 'production';

  return {
    pinoHttp: {
      level,
      ...(isProd ? { base: { service: 'backend', version: readBackendPackageVersion() } } : {}),
      customProps: req => ({
        userId: (req as { user?: { userId?: string } }).user?.userId,
      }),
      transport: prodWithBetterStack
        ? {
            target: '@logtail/pino',
            options: {
              sourceToken: logging.betterStackSourceToken!,
              options: {},
            },
          }
        : isProd
          ? undefined
          : {
              target: 'pino-pretty',
              options: {
                singleLine: true,
                colorize: true,
              },
            },
      redact: {
        paths: [
          'req.headers.authorization',
          'req.headers.cookie',
          'password',
          'accessToken',
          'refreshToken',
        ],
      },
      autoLogging: isProd,
    },
  };
}
