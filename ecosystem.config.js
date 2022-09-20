const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  deploy: {
    production: {
      key: 'deploy.key',
      user: process.env.HOST_USER,
      host: [
        {
          host: process.env.HOST,
          port: process.env.HOST_PORT,
        },
      ],
      ssh_options: ['StrictHostKeyChecking=no'],
      ref: 'origin/main',
      repo: 'git@github.com:Les-Cop1/my-setup-back.git',
      path: process.env.HOST_PATH,
      'post-deploy': 'yarn setup && yarn build && pm2 startOrRestart production.config.js && pm2 save',
      env: {
        NODE_ENV: process.env.NODE_ENV,
        MONGO_URL: process.env.MONGO_URL,
        PORT: process.env.PORT,

        TZ: process.env.TZ,
        JWT_SECRET: process.env.JWT_SECRET,
        FILE_SECRET: process.env.FILE_SECRET,
      },
    },
  },
}
