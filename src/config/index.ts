import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const jwtAccessSecret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || process.env.JWT_EXPIRES_IN || '1d';

if (!jwtAccessSecret) {
  throw new Error(
    'Missing JWT secret. Set JWT_ACCESS_SECRET or JWT_SECRET in your environment.'
  );
}

export default {
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL,
  jwt_access_secret: jwtAccessSecret,
  jwt_access_expires_in: jwtExpiresIn,
};