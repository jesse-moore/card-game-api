if (process.env.NODE_ENV === 'production') {
    require('dotenv').config({ path: '.env.production' });
} else if (process.env.NODE_ENV === 'development') {
    require('dotenv').config({ path: '.env.dev' });
} else if (process.env.NODE_ENV === 'test') {
    require('dotenv').config({ path: '.env.test.local' });
}

const config = {
    SERVER_PORT: process.env.SERVER_PORT || 4000,
    DB_DATABASE: process.env.DB_DATABASE || '',
    DB_HOST: process.env.DB_HOST || '',
    DB_PORT: parseInt(process.env.DB_PORT || ''),
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_USERNAME: process.env.DB_USERNAME || '',
    COGNITO_POOL_ID: process.env.COGNITO_POOL_ID || '',
    AWS_REGION: process.env.AWS_REGION || '',
    S3_IMAGE_BUCKET: process.env.S3_IMAGE_BUCKET || '',
};

export { config };
