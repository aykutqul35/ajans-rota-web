import { neon } from '@neondatabase/serverless';

// The database URL must be provided in the environment variables
// Local development: defined in .env
// Vercel deployment: defined in the Vercel project settings
const sql = neon(process.env.DATABASE_URL);

export default sql;
