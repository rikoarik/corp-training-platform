const requiredKeys = ['DATABASE_URL', 'JWT_SECRET'] as const;

for (const key of requiredKeys) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  host: process.env.HOST ?? '0.0.0.0',
  databaseUrl: process.env.DATABASE_URL as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  uploadDir: process.env.UPLOAD_DIR ?? './uploads',
  appUrl: process.env.APP_URL ?? 'http://127.0.0.1:4174',
};
