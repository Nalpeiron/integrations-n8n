// Resource handler exports
import { BaseResourceHandler } from '../../shared/base-resource-handler';
import { CustomerResourceHandler } from './handlers/customer-handler';

// Resource handler registry
export const resourceHandlers: Record<string, BaseResourceHandler> = {
	customer: new CustomerResourceHandler(),
	// Generated handlers will be added here by the generator
};

export { BaseResourceHandler };
