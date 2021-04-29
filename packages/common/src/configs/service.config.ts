import { registerAs } from '@nestjs/config'

const config = require('../../../../config')

export const serviceConfig = registerAs('service', () => config.service)
