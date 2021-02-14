import { registerAs } from '@nestjs/config'
const config = require('../../../../config')

export const securityConfig = registerAs('security', () => config.security)
