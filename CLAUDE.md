# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Build**: `npm run build` - Compiles TypeScript and copies icons
- **Dev mode**: `npm run dev` - Watches TypeScript files for changes
- **Lint**: `npm run lint` - Check for code issues
- **Lint fix**: `npm run lint:fix` - Automatically fix linting issues where possible
- **Format**: `npm run format` - Format code with Prettier
- **Pre-publish**: `npm run prepublishOnly` - Build and lint before publishing
- **Generate All**: `npm run generate:all` - Regenerate all resources, properties, and webhooks from OpenAPI
- **Generate Actions**: `npm run generate:actions` - Generate both Zentitle and Zengain action nodes
- **Generate Actions Zentitle**: `npm run generate:actions:zentitle` - Generate Zentitle action nodes (GET-only, excluding tenant resource)
- **Generate Actions Zengain**: `npm run generate:actions:zengain` - Generate Zengain action nodes (GET-only)
- **Generate Webhooks**: `npm run generate:webhooks` - Generate both Zentitle and Zengain webhook nodes
- **Generate Webhooks Zentitle**: `npm run generate:webhooks:zentitle` - Generate Zentitle webhook events
- **Generate Webhooks Zengain**: `npm run generate:webhooks:zengain` - Generate Zengain webhook events

## OpenAPI Configuration

- **API Source**: https://api.nalpeiron.io/openapi/v1/2025-10-10/openapi.json
- **Last Generated Version**: Will be displayed during generation process
- **Generator**: Downloads OpenAPI spec dynamically, no local file storage required
- **Product Configuration**: `generators/config/product-config.ts` - Shared configuration for both products

## Architecture Overview

This is an n8n community node package for the Nalpeiron Growth Platform supporting both the Zentitle2 (license management) and Zengain (customer success & revenue optimization) components. The package provides four main node types:

### Node Structure

**Zentitle2 Nodes** (License Management Component):

- **Main Node** (`Nalpeiron/Zentitle2/NalpeironZentitle2.node.ts`): Handles API operations for various resources (API clients, activations, customers, products, etc.)
- **Trigger Node** (`Nalpeiron/Zentitle2/NalpeironZentitle2Trigger.node.ts`): Webhook-based trigger for real-time events

**Zengain Nodes** (Customer Success Component):

- **Main Node** (`Nalpeiron/Zengain/NalpeironZengain.node.ts`): Handles customer success and revenue optimization operations (customer lifecycle, account insights)
- **Trigger Node** (`Nalpeiron/Zengain/NalpeironZengainTrigger.node.ts`): Webhook-based trigger for customer success events

**Shared Components:**

- **Credentials** (`NalpeironApi.credentials.ts`): OAuth2-based authentication with tenant support (shared by both Growth Platform components)

### Key Files

**Zentitle2 Files:**

- `nodes/Nalpeiron/Zentitle2/utils.ts` - Shared utilities for OAuth2 authentication and API requests
- `nodes/Nalpeiron/Zentitle2/webhooks/` - Auto-generated webhook events and types
- `nodes/Nalpeiron/Zentitle2/properties/` - Auto-generated n8n property definitions
- `nodes/Nalpeiron/Zentitle2/resources/` - Auto-generated API resource handlers

**Zengain Files:**

- `nodes/Nalpeiron/Zengain/utils.ts` - Customer success and revenue optimization utilities (shared structure with Zentitle2)
- `nodes/Nalpeiron/Zengain/webhooks/` - Auto-generated webhook events and types for customer lifecycle events
- `nodes/Nalpeiron/Zengain/properties/` - Auto-generated n8n property definitions for customer success operations
- `nodes/Nalpeiron/Zengain/resources/` - Auto-generated API resource handlers for customer and account management

**Generator Files:**

- `generators/` - OpenAPI-based code generation system
- `generators/config/product-config.ts` - Shared configuration for both Growth Platform components (Zentitle2 and Zengain)
- `generators/openapi-generator.ts` - Generates action nodes with `--product` flag support
- `generators/webhook-generator.ts` - Generates webhook nodes with `--product` flag support
- `gulpfile.js` - Handles copying SVG icons to dist during build

### Authentication Flow

Uses OAuth2 client credentials flow with:

- Client ID/Secret for authentication
- Tenant ID for multi-tenant support
- RSA public key for webhook signature verification
- Base URL configuration for different environments

### Code Generation System

The project uses an advanced auto-generation system with product-based configuration:

- **OpenAPI Generator** (`generators/openapi-generator.ts`): Generates resources, properties, and handlers from OpenAPI spec using `--product` flag
- **Webhook Generator** (`generators/webhook-generator.ts`): Generates webhook events and types from OpenAPI webhook definitions using `--product` flag
- **Product Configuration** (`generators/config/product-config.ts`): Shared configuration defining tags, output directories, and exclusions
- **Template Engine**: Uses TypeScript templates for consistent code generation
- **Property Registry**: Centralized management of all n8n node properties
- **Tag-based Filtering**: Filters OpenAPI operations by product-specific tags (Zentitle/Zengain)
- **Resource Exclusion**: Supports excluding specific resources (e.g., tenant resource from Zentitle)

### Build Process

1. TypeScript compilation to `dist/` directory
2. Icon copying via Gulp task (includes both zentitle2.svg and zengain.svg)
3. Auto-generated files in both `Zentitle2/` and `Zengain/` directories:
   - `properties/` - n8n node property definitions
   - `resources/handlers/` - API resource handlers
   - `webhooks/` - webhook events and types
4. n8n package registration points to compiled JS files in dist for all four nodes

### Architecture Benefits

- **Maintainable**: All API operations auto-generated from single source of truth (OpenAPI spec)
- **Type-Safe**: Full TypeScript interfaces for all operations and webhook events
- **Consistent**: Uniform patterns across all resources and operations for both products
- **Extensible**: Easy to add new resources by updating OpenAPI spec and regenerating
- **Multi-Product Support**: Tag-based filtering enables multiple products from same OpenAPI spec
- **Simplified Generation**: Product-based configuration reduces command complexity by ~80%
- **Shared Configuration**: Centralized product settings ensure consistency

The package follows n8n's community node standards and includes comprehensive guides for API setup, webhook configuration, and troubleshooting for both Zentitle2 (license management) and Zengain (customer success & revenue optimization) components of the Nalpeiron Growth Platform.
