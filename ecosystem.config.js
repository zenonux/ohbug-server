module.exports = {
  apps : [{
    name: 'dashboard',
    script: 'yarn workspace @ohbug-server/dashboard start:prod',

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
