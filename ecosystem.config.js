module.exports = {
  apps: [
    {
      name: 'ohbug-server',
      script: 'npm run start:prod',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      env_test: {
        NODE_ENV: 'test',
      },
    },
  ],
};
