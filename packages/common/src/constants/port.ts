const isProd = process.env.NODE_ENV === 'production'

export const TRANSFER_PORT = 6660
export const DASHBOARD_PORT = 6666

export const MICROSERVICE_MANAGER_HOST = isProd ? 'manager' : 'localhost'
export const MICROSERVICE_MANAGER_PORT = 8880

export const MICROSERVICE_NOTIFIER_HOST = isProd ? 'notifier' : 'localhost'
export const MICROSERVICE_NOTIFIER_PORT = 8881
