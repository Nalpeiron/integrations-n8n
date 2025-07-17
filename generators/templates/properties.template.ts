import type { INodeProperties } from 'n8n-workflow';

export const {{exportName}}: INodeProperties[] = [
	// {{resource.displayName}} Operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['{{resource.name}}'],
			},
		},
		options: [
{{operationOptions}}
		],
		default: '{{resource.operations.0.name}}',
	},
{{parameterFields}}
];