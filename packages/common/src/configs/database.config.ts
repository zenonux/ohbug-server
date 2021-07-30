import { registerAs } from '@nestjs/config'

const config = require('../../../../config')

export const databaseConfig = registerAs('database', () => config.database)
