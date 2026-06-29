import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  railwayUrl: process.env.RAILWAY_STATIC_URL || '',
  database: {
    url: process.env.DATABASE_URL!,
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  carlcare: {
    baseUrl: process.env.CARLCARE_API_BASE_URL || 'https://service.carlcare.com/CarlcareClient',
    apiKey: process.env.CARLCARE_API_KEY || '',
    apiSecret: process.env.CARLCARE_API_SECRET || '',
  },
  thailand: {
    mcc: process.env.THAILAND_MCC || '520',
  },
};
