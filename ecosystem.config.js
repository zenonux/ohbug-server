module.exports = {
  apps : [{
    name: 'api',
    script: 'yarn workspace @ohbug-server/api start:prod',

    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
};
