export default function handler(req, res) {
  const hasToken = !!process.env.BLOB_READ_WRITE_TOKEN;
  res.status(200).json({
    status: 'ok',
    hasBlobToken: hasToken,
    tokenPrefix: hasToken ? process.env.BLOB_READ_WRITE_TOKEN.substring(0, 10) : 'none'
  });
}
