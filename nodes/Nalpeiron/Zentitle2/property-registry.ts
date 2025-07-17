import type { INodeProperties } from 'n8n-workflow';
import { getResourceOptions } from './resource-config';
import { attributeProperties } from './properties/attribute-properties';
import { customerProperties } from './properties/customer-properties';
import { entitlementProperties } from './properties/entitlement-properties';
import { featureProperties } from './properties/feature-properties';
import { localLicenseServerProperties } from './properties/local-license-server-properties';
import { offeringProperties } from './properties/offering-properties';
import { planProperties } from './properties/plan-properties';
import { productProperties } from './properties/product-properties';

// Import only the generated property modules (filtered for GET only, excluding Zengain)

export interface IPropertyRegistry {
	getResourceSelectionProperty(): INodeProperties;
	getResourceProperties(): INodeProperties[];
	getAllProperties(): INodeProperties[];
}

/**
 * Registry for managing all node properties in a centralized way
 */
class PropertyRegistry implements IPropertyRegistry {
	private readonly resourcePropertiesMap: Record<string, INodeProperties[]> = {
		// Generated properties for each resource
		attribute: attributeProperties,
		customer: customerProperties,
		entitlement: entitlementProperties,
		feature: featureProperties,
		localLicenseServer: localLicenseServerProperties,
		offering: offeringProperties,
		plan: planProperties,
		product: productProperties,
	};
	/**
	 * Get the main resource selection property
	 */
	getResourceSelectionProperty(): INodeProperties {
		return {
			displayName: 'Resource',
			name: 'resource',
			type: 'options',
			noDataExpression: true,
			options: getResourceOptions(),
			default: '',
		};
	}

	/**
	 * Get all resource-specific properties (operations, fields, etc.)
	 */
	getResourceProperties(): INodeProperties[] {
		const allProperties: INodeProperties[] = [];

		Object.values(this.resourcePropertiesMap).forEach((properties) => {
			allProperties.push(...properties);
		});

		return allProperties;
	}

	/**
	 * Get all properties for the node
	 */
	getAllProperties(): INodeProperties[] {
		return [this.getResourceSelectionProperty(), ...this.getResourceProperties()];
	}

	/**
	 * Get properties for a specific resource
	 */
	getPropertiesForResource(resourceValue: string): INodeProperties[] {
		return this.resourcePropertiesMap[resourceValue] || [];
	}

	/**
	 * Add or update properties for a resource (for future extensibility)
	 */
	registerResourceProperties(resourceValue: string, properties: INodeProperties[]): void {
		this.resourcePropertiesMap[resourceValue] = properties;
	}
}

// Export singleton instance
export const propertyRegistry = new PropertyRegistry();

/**
 * Convenience function to get all node properties
 */
export function getAllNodeProperties(): INodeProperties[] {
	return propertyRegistry.getAllProperties();
}

/**
 * Convenience function to get properties for a specific resource
 */
export function getResourceProperties(resourceValue: string): INodeProperties[] {
	return propertyRegistry.getPropertiesForResource(resourceValue);
}

/**
 * Convenience function to get the resource selection property
 */
export function getResourceSelectionProperty(): INodeProperties {
	return propertyRegistry.getResourceSelectionProperty();
}
