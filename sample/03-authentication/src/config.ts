import { Sequelize } from 'sequelize';
import { resolve } from 'path';

export const configs = {
  development: {
    uri: process.env?.DEV_DB_URI ?? 'postgres://postgres:password@localhost:5432/dev_service_auth',
    logging: true
  },
  test: {
    uri: process.env?.TEST_DB_URI ?? `sqlite:///${resolve(__dirname, '../db/database.db')}`,
    logging: false
  },
  production: {
    uri: process.env?.PROD_DB_URI ?? 'postgres://postgres:password@localhost:5432/service_auth',
    logging: false
  }
}

const activeEnv = (process.env?.ACTIVE_ENV || 'test') as 'development' | 'test' | 'production';
const activeConfig = configs[activeEnv];
export const connection = new Sequelize(activeConfig.uri, { logging: activeConfig.logging });
