import type { IDataObject, IExecuteFunctions, INode } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export abstract class BaseResourceHandler {
	abstract executeOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<any>;

	/**
	 * Get a node parameter value
	 */
	protected getNodeParameter(
		executeFunctions: IExecuteFunctions,
		parameterName: string,
		itemIndex: number,
		fallbackValue?: any,
	): any {
		return executeFunctions.getNodeParameter(parameterName, itemIndex, fallbackValue);
	}

	/**
	 * Handle unknown operations by throwing an error
	 */
	protected handleUnknownOperation(operation: string, node: INode): never {
		throw new NodeApiError(node, {
			message: `Unknown operation: ${operation}`,
			description: `The operation "${operation}" is not supported`,
		});
	}

	/**
	 * Convert n8n fixedCollection key/value entries into a plain object for API payloads.
	 */
	protected convertFixedCollectionToObject(value: unknown): IDataObject {
		if (!value || typeof value !== 'object') {
			return {};
		}

		const entries = (value as IDataObject).entries;
		if (!Array.isArray(entries)) {
			return {};
		}

		const result: IDataObject = {};
		for (const entry of entries) {
			if (!entry || typeof entry !== 'object') {
				continue;
			}

			const key = (entry as IDataObject).key;
			if (typeof key !== 'string') {
				continue;
			}

			const normalizedKey = key.trim();
			if (!normalizedKey) {
				continue;
			}

			result[normalizedKey] = (entry as IDataObject).value;
		}

		return result;
	}

	/**
	 * Convert n8n fixedCollection entries into an array for API payloads.
	 */
	protected convertFixedCollectionToArray(value: unknown): unknown[] {
		if (!value || typeof value !== 'object') {
			return [];
		}

		const entries = (value as IDataObject).entries;
		if (!Array.isArray(entries)) {
			return [];
		}

		const result: unknown[] = [];
		for (const entry of entries) {
			if (!entry || typeof entry !== 'object') {
				continue;
			}

			if (Object.prototype.hasOwnProperty.call(entry, 'value')) {
				result.push((entry as IDataObject).value);
			}
		}

		return result;
	}

	/**
	 * Ensure required object properties from schema are populated with sensible defaults.
	 * This prevents required collection payloads from being sent as an empty object.
	 */
	protected applySchemaDefaultsToObject(value: unknown, schema: IDataObject): IDataObject {
		const result: IDataObject =
			value && typeof value === 'object' && !Array.isArray(value)
				? ({ ...(value as IDataObject) } as IDataObject)
				: {};

		if (!schema || typeof schema !== 'object') {
			return result;
		}

		const requiredFields = Array.isArray(schema.required) ? schema.required : [];
		const properties =
			schema.properties &&
			typeof schema.properties === 'object' &&
			!Array.isArray(schema.properties)
				? (schema.properties as IDataObject)
				: {};

		for (const requiredField of requiredFields) {
			if (typeof requiredField !== 'string') {
				continue;
			}

			const currentValue = result[requiredField];
			if (currentValue !== undefined && currentValue !== null && currentValue !== '') {
				continue;
			}

			const fieldSchema =
				properties[requiredField] && typeof properties[requiredField] === 'object'
					? (properties[requiredField] as IDataObject)
					: undefined;

			const defaultValue = this.getSchemaDefaultValue(fieldSchema);
			if (defaultValue !== undefined) {
				result[requiredField] = defaultValue;
			}
		}

		return result;
	}

	private getSchemaDefaultValue(fieldSchema?: IDataObject): unknown {
		if (!fieldSchema || typeof fieldSchema !== 'object') {
			return undefined;
		}

		if (fieldSchema.default !== undefined && fieldSchema.default !== null) {
			return fieldSchema.default;
		}

		if (Array.isArray(fieldSchema.enum) && fieldSchema.enum.length > 0) {
			return fieldSchema.enum[0];
		}

		if (fieldSchema.type === 'object') {
			const nested = this.applySchemaDefaultsToObject({}, fieldSchema);
			return Object.keys(nested).length > 0 ? nested : undefined;
		}

		return undefined;
	}
}
