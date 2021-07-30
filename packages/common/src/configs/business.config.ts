import { registerAs } from '@nestjs/config'

const config = require('../../../../config')

export const businessConfig = registerAs('business', () => config.business)
