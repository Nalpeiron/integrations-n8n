// Resource handler exports
import { BaseResourceHandler } from './base-resource-handler';
import { AttributeResourceHandler } from './handlers/attribute-handler';
import { CustomerResourceHandler } from './handlers/customer-handler';
import { EntitlementResourceHandler } from './handlers/entitlement-handler';
import { FeatureResourceHandler } from './handlers/feature-handler';
import { LocallicenseserverResourceHandler } from './handlers/local-license-server-handler';
import { OfferingResourceHandler } from './handlers/offering-handler';
import { PlanResourceHandler } from './handlers/plan-handler';
import { ProductResourceHandler } from './handlers/product-handler';

// Resource handler registry
export const resourceHandlers: Record<string, BaseResourceHandler> = {
	attribute: new AttributeResourceHandler(),
	customer: new CustomerResourceHandler(),
	entitlement: new EntitlementResourceHandler(),
	feature: new FeatureResourceHandler(),
	localLicenseServer: new LocallicenseserverResourceHandler(),
	offering: new OfferingResourceHandler(),
	plan: new PlanResourceHandler(),
	product: new ProductResourceHandler(),
	// Generated handlers will be added here by the generator
};

export { BaseResourceHandler };
