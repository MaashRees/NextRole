const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000', 10),
  useSSL: false,
  accessKey: process.env.MINIO_ROOT_USER || 'admin',
  secretKey: process.env.MINIO_ROOT_PASSWORD || 'adminpassword',
});

// Initialize buckets with retry logic (MinIO can take a few seconds to be ready)
const initializeBuckets = async (retries = 5, delay = 3000) => {
  const buckets = ['bronze', 'silver', 'gold'];
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      for (const bucket of buckets) {
        const exists = await minioClient.bucketExists(bucket);
        if (!exists) {
          await minioClient.makeBucket(bucket, 'eu-west-1');
          console.log(`[MinIO] Bucket '${bucket}' created.`);
        } else {
          console.log(`[MinIO] Bucket '${bucket}' already exists.`);
        }
      }
      return; // Success
    } catch (err) {
      console.warn(`[MinIO] Tentative ${attempt}/${retries} échouée: ${err.message}`);
      if (attempt < retries) {
        await new Promise(res => setTimeout(res, delay));
      } else {
        console.error('[MinIO] Impossible d\'initialiser les buckets après toutes les tentatives.');
      }
    }
  }
};

initializeBuckets();

module.exports = minioClient;
