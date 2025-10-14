import { ComputeManagementClient } from '@azure/arm-compute';
import { ResourceManagementClient } from '@azure/arm-resources';
import { ClientSecretCredential } from '@azure/identity';
import { Config } from '@backstage/config';
import { Logger } from 'winston';

export class AzureVMManager {
  private computeClient: ComputeManagementClient;
  private resourceClient: ResourceManagementClient;
  private subscriptionId: string;

  constructor(
    private readonly config: Config,
    private readonly logger: Logger,
  ) {
    const clientId = config.getString('azure.clientId');
    const clientSecret = config.getString('azure.clientSecret');
    const tenantId = config.getString('azure.tenantId');
    this.subscriptionId = config.getString('azure.subscriptionId');

    const credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);
    
    this.computeClient = new ComputeManagementClient(credentials, this.subscriptionId);
    this.resourceClient = new ResourceManagementClient(credentials, this.subscriptionId);
  }

  async listCustomImages() {
    try {
      const images = [];
      for await (const image of this.computeClient.images.list()) {
        images.push({
          id: image.id,
          name: image.name,
          location: image.location,
          resourceGroup: this.getResourceGroupFromId(image.id),
        });
      }
      return images;
    } catch (error) {
      this.logger.error('Error listing custom images:', error);
      throw error;
    }
  }

  async createVM(params: {
    name: string;
    resourceGroup: string;
    location: string;
    size: string;
    imageId: string;
  }) {
    const { name, resourceGroup, location, size, imageId } = params;

    try {
      // Ensure resource group exists
      await this.ensureResourceGroup(resourceGroup, location);

      // VM Creation parameters
      const vmParameters = {
        location: location,
        hardwareProfile: {
          vmSize: size,
        },
        storageProfile: {
          imageReference: {
            id: imageId,
          },
          osDisk: {
            createOption: 'FromImage',
            managedDisk: {
              storageAccountType: 'Premium_LRS',
            },
          },
        },
        osProfile: {
          computerName: name,
          adminUsername: 'azureuser',
          // In production, you should generate and securely store this password
          adminPassword: 'Password123!',
        },
      };

      // Create the VM
      const result = await this.computeClient.virtualMachines.beginCreateOrUpdate(
        resourceGroup,
        name,
        vmParameters,
      );

      return result;
    } catch (error) {
      this.logger.error('Error creating VM:', error);
      throw error;
    }
  }

  async listVMs() {
    try {
      const vms = [];
      for await (const vm of this.computeClient.virtualMachines.listAll()) {
        const status = await this.getVMStatus(
          this.getResourceGroupFromId(vm.id!)!,
          vm.name!,
        );

        vms.push({
          id: vm.id,
          name: vm.name,
          status,
          size: vm.hardwareProfile?.vmSize,
          location: vm.location,
          resourceGroup: this.getResourceGroupFromId(vm.id),
        });
      }
      return vms;
    } catch (error) {
      this.logger.error('Error listing VMs:', error);
      throw error;
    }
  }

  async startVM(resourceGroup: string, name: string) {
    try {
      await this.computeClient.virtualMachines.beginStart(resourceGroup, name);
      return { message: `Started VM ${name}` };
    } catch (error) {
      this.logger.error(`Error starting VM ${name}:`, error);
      throw error;
    }
  }

  async stopVM(resourceGroup: string, name: string) {
    try {
      await this.computeClient.virtualMachines.beginDeallocate(resourceGroup, name);
      return { message: `Stopped VM ${name}` };
    } catch (error) {
      this.logger.error(`Error stopping VM ${name}:`, error);
      throw error;
    }
  }

  async deleteVM(resourceGroup: string, name: string) {
    try {
      await this.computeClient.virtualMachines.beginDeleteMethod(resourceGroup, name);
      return { message: `Deleted VM ${name}` };
    } catch (error) {
      this.logger.error(`Error deleting VM ${name}:`, error);
      throw error;
    }
  }

  private async getVMStatus(resourceGroup: string, name: string) {
    try {
      const instanceView = await this.computeClient.virtualMachines.instanceView(
        resourceGroup,
        name,
      );
      const powerState = instanceView.statuses?.find(status =>
        status.code?.startsWith('PowerState/'),
      );
      return powerState?.displayStatus || 'unknown';
    } catch (error) {
      this.logger.error(`Error getting VM status for ${name}:`, error);
      throw error;
    }
  }

  private async ensureResourceGroup(name: string, location: string) {
    try {
      await this.resourceClient.resourceGroups.createOrUpdate(name, { location });
    } catch (error) {
      this.logger.error(`Error ensuring resource group ${name}:`, error);
      throw error;
    }
  }

  private getResourceGroupFromId(id: string | undefined): string | undefined {
    if (!id) return undefined;
    const match = id.match(/\/resourceGroups\/([^\/]+)\//i);
    return match ? match[1] : undefined;
  }
}