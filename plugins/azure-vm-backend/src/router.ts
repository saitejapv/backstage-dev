import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { AzureVMManager } from './service/AzureVMManager';

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;

  const azureManager = new AzureVMManager(config, logger);
  const router = Router();
  router.use(express.json());

  router.get('/images', async (_, response) => {
    const images = await azureManager.listCustomImages();
    response.json(images);
  });

  router.get('/vms', async (_, response) => {
    const vms = await azureManager.listVMs();
    response.json(vms);
  });

  router.post('/vms', async (request, response) => {
    const { name, resourceGroup, location, size, imageId } = request.body;
    const result = await azureManager.createVM({
      name,
      resourceGroup,
      location,
      size,
      imageId,
    });
    response.json(result);
  });

  router.post('/vms/:resourceGroup/:name/start', async (request, response) => {
    const { resourceGroup, name } = request.params;
    const result = await azureManager.startVM(resourceGroup, name);
    response.json(result);
  });

  router.post('/vms/:resourceGroup/:name/stop', async (request, response) => {
    const { resourceGroup, name } = request.params;
    const result = await azureManager.stopVM(resourceGroup, name);
    response.json(result);
  });

  router.delete('/vms/:resourceGroup/:name', async (request, response) => {
    const { resourceGroup, name } = request.params;
    const result = await azureManager.deleteVM(resourceGroup, name);
    response.json(result);
  });

  router.use(errorHandler());
  return router;
}