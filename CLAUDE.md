# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Build**: `npm run build` - Compiles TypeScript and copies icons
- **Dev mode**: `npm run dev` - Watches TypeScript files for changes
- **Lint**: `npm run lint` - Check for code issues
- **Lint fix**: `npm run lint:fix` - Automatically fix linting issues where possible
- **Format**: `npm run format` - Format code with Prettier
- **Pre-publish**: `npm run prepublishOnly` - Build and lint before publishing
- **Generate Webhooks**: `npm run generate:webhooks` - Regenerate webhook events from OpenAPI
- **Generate All**: `npm run generate:all` - Regenerate all resources, properties, and webhooks from OpenAPI
- **Generate Zentitle**: `npm run generate:zentitle` - Generate resources and properties from OpenAPI (GET-only, excluding zengain)

## OpenAPI Configuration

- **API Source**: https://api.nalpeiron.io/openapi/v1/2024-01-01/openapi.json
- **Last Generated Version**: Will be displayed during generation process
- **Generator**: Downloads OpenAPI spec dynamically, no local file storage required

## Architecture Overview

This is an n8n community node package for the Nalpeiron Growth Platform (Zentitle2 API). The package provides two main components:

### Node Structure

- **Main Node** (`Nalpeiron/Zentitle2/NalpeironZentitle2.node.ts`): Handles API operations for various resources (API clients, activations, customers, products, etc.)
- **Trigger Node** (`Nalpeiron/Zentitle2/NalpeironZentitle2Trigger.node.ts`): Webhook-based trigger for real-time events
- **Credentials** (`NalpeironApi.credentials.ts`): OAuth2-based authentication with tenant support

### Key Files

- `nodes/Nalpeiron/Zentitle2/utils.ts` - Shared utilities for OAuth2 authentication and API requests
- `nodes/Nalpeiron/Zentitle2/webhooks/` - Auto-generated webhook events and types
- `nodes/Nalpeiron/Zentitle2/properties/` - Auto-generated n8n property definitions
- `nodes/Nalpeiron/Zentitle2/resources/` - Auto-generated API resource handlers
- `generators/` - OpenAPI-based code generation system
- `generators/openapi.json` - OpenAPI specification for the API
- `gulpfile.js` - Handles copying SVG icons to dist during build

### Authentication Flow

Uses OAuth2 client credentials flow with:

- Client ID/Secret for authentication
- Tenant ID for multi-tenant support
- RSA public key for webhook signature verification
- Base URL configuration for different environments

### Code Generation System

The project uses an advanced auto-generation system:

- **OpenAPI Generator** (`generators/openapi-generator.ts`): Generates resources, properties, and handlers from OpenAPI spec
- **Webhook Generator** (`generators/webhook-generator.ts`): Generates webhook events and types from OpenAPI webhook definitions
- **Template Engine**: Uses TypeScript templates for consistent code generation
- **Property Registry**: Centralized management of all n8n node properties

### Build Process

1. TypeScript compilation to `dist/` directory
2. Icon copying via Gulp task
3. Auto-generated files in `properties/`, `resources/handlers/`, and `webhooks/`
4. n8n package registration points to compiled JS files in dist

### Architecture Benefits

- **Maintainable**: All API operations auto-generated from single source of truth (OpenAPI spec)
- **Type-Safe**: Full TypeScript interfaces for all operations and webhook events
- **Consistent**: Uniform patterns across all resources and operations
- **Extensible**: Easy to add new resources by updating OpenAPI spec and regenerating

The package follows n8n's community node standards and includes comprehensive guides for API setup, webhook configuration, and troubleshooting.
