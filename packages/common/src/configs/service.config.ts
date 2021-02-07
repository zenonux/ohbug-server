import { registerAs } from '@nestjs/config'
// tslint:disable-next-line:no-var-requires
const config = require('../../../../config')

export const serviceConfig = registerAs('service', () => config.service)
