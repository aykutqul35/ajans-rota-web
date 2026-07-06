import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { log_id } = req.body;

  if (!log_id) {
    return res.status(400).json({ message: 'log_id is required' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Fetch current details
    const logs = await sql`SELECT details FROM ai_logs WHERE id = ${log_id}`;
    if (logs.length === 0) {
      return res.status(404).json({ message: 'Log not found' });
    }
    
    const details = logs[0].details || {};
    details.status = 'ONAYLANDI';
    
    // Update the log
    await sql`UPDATE ai_logs SET details = ${JSON.stringify(details)}::jsonb WHERE id = ${log_id}`;
    
    return res.status(200).json({ success: true, message: 'Log approved successfully' });
  } catch (error) {
    console.error('Error approving log:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
