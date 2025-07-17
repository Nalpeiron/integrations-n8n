export class NameConverter {
	/**
	 * Convert API path segment to resource name (camelCase)
	 * Examples: 'customers' -> 'customer', 'api-clients' -> 'apiClient'
	 */
	toResourceName(segment: string): string {
		// Remove common prefixes/suffixes
		let cleaned = segment.replace(/^api-/, '').replace(/-api$/, '').replace(/s$/, ''); // Remove plural 's'

		// Handle special plurals
		const specialPlurals: Record<string, string> = {
			identities: 'identity',
			companies: 'company',
			categories: 'category',
			properties: 'property',
			activities: 'activity',
			authorities: 'authority',
			entities: 'entity',
		};

		if (specialPlurals[cleaned]) {
			cleaned = specialPlurals[cleaned];
		}

		return this.toCamelCase(cleaned);
	}

	/**
	 * Convert to display name (Title Case)
	 * Examples: 'apiClient' -> 'API Client', 'customer' -> 'Customer'
	 */
	toDisplayName(name: string): string {
		// Split on camelCase boundaries and dashes/underscores
		const words = name
			.replace(/([a-z])([A-Z])/g, '$1 $2')
			.split(/[-_\s]+/)
			.filter(Boolean);

		// Capitalize each word, with special handling for acronyms
		return words
			.map((word) => {
				// Handle common acronyms
				const acronyms = ['API', 'ID', 'URL', 'HTTP', 'JSON', 'XML', 'JWT', 'OAuth', 'RSA'];
				const upperWord = word.toUpperCase();

				if (acronyms.includes(upperWord)) {
					return upperWord;
				}

				return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
			})
			.join(' ');
	}

	/**
	 * Convert to file name (kebab-case)
	 * Examples: 'apiClient' -> 'api-client', 'customer' -> 'customer'
	 */
	toFileName(name: string): string {
		return name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	}

	/**
	 * Convert to handler class name
	 * Examples: 'customer' -> 'CustomerResourceHandler'
	 */
	toHandlerClassName(resourceName: string): string {
		const pascalCase = this.toPascalCase(resourceName);
		return `${pascalCase}ResourceHandler`;
	}

	/**
	 * Convert to properties export name
	 * Examples: 'customer' -> 'customerProperties'
	 */
	toPropertiesExportName(resourceName: string): string {
		return `${resourceName}Properties`;
	}

	/**
	 * Convert to camelCase
	 * Examples: 'api-client' -> 'apiClient', 'customer_notes' -> 'customerNotes'
	 */
	toCamelCase(str: string): string {
		return str.toLowerCase().replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''));
	}

	/**
	 * Convert to PascalCase
	 * Examples: 'apiClient' -> 'ApiClient', 'customer' -> 'Customer'
	 */
	toPascalCase(str: string): string {
		const camelCase = this.toCamelCase(str);
		return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
	}

	/**
	 * Convert operation name to method name
	 * Examples: 'getCustomer' -> 'getCustomer', 'list' -> 'listCustomers'
	 */
	toMethodName(operation: string, resourceName: string): string {
		if (operation === 'list') {
			return `list${this.toPascalCase(this.toPlural(resourceName))}`;
		}

		if (operation === 'get') {
			return `get${this.toPascalCase(resourceName)}`;
		}

		if (operation === 'create') {
			return `create${this.toPascalCase(resourceName)}`;
		}

		if (operation === 'update') {
			return `update${this.toPascalCase(resourceName)}`;
		}

		if (operation === 'delete') {
			return `delete${this.toPascalCase(resourceName)}`;
		}

		// For custom operations, use as-is (they're already properly cased from the parser)
		return operation;
	}

	/**
	 * Convert to plural form
	 */
	toPlural(word: string): string {
		// Simple pluralization rules
		if (word.endsWith('y')) {
			return word.slice(0, -1) + 'ies';
		}

		if (
			word.endsWith('s') ||
			word.endsWith('sh') ||
			word.endsWith('ch') ||
			word.endsWith('x') ||
			word.endsWith('z')
		) {
			return word + 'es';
		}

		return word + 's';
	}

	/**
	 * Generate operation display name from operation type and resource
	 */
	toOperationDisplayName(operation: string, resourceDisplayName: string): string {
		const baseOperations: Record<string, string> = {
			get: 'Get',
			list: 'List',
			create: 'Create',
			update: 'Update',
			delete: 'Delete',
		};

		// Handle basic operations
		if (baseOperations[operation]) {
			const verb = baseOperations[operation];
			if (operation === 'list') {
				return `${verb} ${this.toPlural(resourceDisplayName)}`;
			}
			return `${verb} ${resourceDisplayName}`;
		}

		// Handle compound operations like listActivations, getGroups, etc.
		for (const [baseOp, verb] of Object.entries(baseOperations)) {
			if (operation.startsWith(baseOp)) {
				// Extract the suffix (e.g., "Activations" from "listActivations")
				const suffix = operation.slice(baseOp.length);
				if (suffix) {
					// Convert to display name (e.g., "Activations" -> "Activations")
					const suffixDisplay = this.toDisplayName(suffix);

					if (baseOp === 'list') {
						return `${verb} ${resourceDisplayName} ${suffixDisplay}`;
					} else {
						return `${verb} ${resourceDisplayName} ${suffixDisplay}`;
					}
				}
			}
		}

		// Fallback for unknown operations
		return this.toDisplayName(operation);
	}

	/**
	 * Generate operation action text for n8n (sentence case)
	 */
	toOperationAction(operation: string, resourceDisplayName: string): string {
		const displayName = this.toOperationDisplayName(operation, resourceDisplayName);
		// Convert to sentence case: first letter uppercase, rest lowercase
		return displayName.charAt(0).toUpperCase() + displayName.slice(1).toLowerCase();
	}
}
