import {env} from '../utils/env';

function getAppPath() {
  let currentDir = __dirname;
  currentDir = currentDir.replace('/config', '');

  return currentDir;
}

export const appConfig = {
  node: env('NODE_ENV') || 'development',
  isProduction: env('NODE_ENV') === 'production',
  isStaging: env('NODE_ENV') === 'staging',
  isDevelopment: env('NODE_ENV') === 'development',
  name: env('APP_NAME'),
  port: Number(env('APP_PORT')) || 4000,
  routePrefix: env('APP_ROUTE_PREFIX'),
  url: env('APP_URL'),
  appPath: getAppPath(),
};
import express from 'express';
import { createServer } from 'http';
import { useContainer } from 'routing-controllers';
import { Container } from 'typedi';
import gameModule from '../modules/game/controllers';
import authModule from '../modules/auth';
import { env } from '../utils/env';

export const createApp = () => {
  const app = express();
  const httpServer = createServer(app);
  
  // Enable Typedi integration
  useContainer(Container);
  
  // Middleware setup
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Enable CORS if needed
  if (env.isDevelopment) {
    const cors = require('cors');
    app.use(cors());
  }
  
  // Initialize modules
  authModule(app);
  gameModule(app, httpServer);
  
  // Error handling middleware
  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err);
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.errors
    });
  });
  
  return httpServer;
};