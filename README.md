# @nalpeiron/n8n-nodes-nalpeiron

Automate your license management workflows with the [Nalpeiron Growth Platform](https://nalpeiron.com). This n8n community node lets you integrate license operations, customer management, and real-time notifications into your automation workflows.

![Version](https://img.shields.io/npm/v/@nalpeiron/n8n-nodes-nalpeiron)
![Downloads](https://img.shields.io/npm/dm/@nalpeiron/n8n-nodes-nalpeiron)
![License](https://img.shields.io/npm/l/@nalpeiron/n8n-nodes-nalpeiron)

## What You Can Do

### 📊 License Data & Reporting

- Retrieve license details and status information
- List and filter licenses by various criteria
- Track license usage and seat assignments
- Monitor license expiration dates

### 👥 Customer Information

- Get customer records and contact details
- List customers with filtering options
- Access customer-specific license information
- Handle multi-tenant customer scenarios

### 📦 Product & Feature Insights

- Retrieve product configurations and details
- List available features and capabilities
- Access product offerings and packages
- Query custom attributes and configurations

### 🔔 Real-Time Notifications

Listen for 17 different webhook events including:

- License creation, activation, and expiration
- Customer lifecycle events
- Seat management notifications
- Renewal and maintenance alerts

## Use Cases

Perfect for automating:

- **License Monitoring**: Track license status and expiration dates across your organization
- **Renewal Alerts**: Set up notifications for upcoming license expirations
- **Usage Reporting**: Generate reports on license utilization and seat assignments
- **Customer Insights**: Pull customer data for CRM and support systems
- **Compliance Tracking**: Monitor license compliance and usage patterns
- **Data Synchronization**: Keep external systems updated with license information

## Installation

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes** in n8n
2. Select **Install**
3. Enter `@nalpeiron/n8n-nodes-nalpeiron` as the package name
4. Click **Install**

### npm

```bash
npm install @nalpeiron/n8n-nodes-nalpeiron
```

## Setup Guide

### Step 1: Installation

Install via Community Nodes (recommended) or npm as shown above.

### Step 2: Create API Credentials

1. Log into your Nalpeiron Growth Platform account
2. Go to the API credentials section
3. Create new OAuth2 credentials
4. Note down your Client ID, Client Secret, and OAuth URL

### Step 3: Configure Credentials in n8n

1. In n8n, go to **Settings** > **Credentials**
2. Click **Add Credential** and select **Nalpeiron account**
3. Configure the following fields:
   - **Base URL**: Your Nalpeiron API endpoint (e.g., https://api.nalpeiron.com)
   - **Tenant ID**: Your Nalpeiron tenant identifier
   - **Client ID**: Your OAuth2 Client ID from Nalpeiron admin panel
   - **Client Secret**: Your OAuth2 Client Secret from Nalpeiron admin panel
   - **OAuth URL**: The OAuth2 endpoint URL (e.g., https://auth.nalpeiron.com/protocol/openid-connect/token)

### Step 4: Test Your Credentials

The credentials include a built-in test function:

1. Fill in your credential fields in the n8n UI
2. Click the **"Test"** button
3. Get immediate validation of your OAuth2 configuration

**What Gets Tested:**

- OAuth2 Token Request validation
- Access Token format verification
- Tenant-specific API access
- Error diagnosis with specific guidance for common issues

## Getting Started

After installation, you'll find two new nodes in your n8n palette:

- **📊 Nalpeiron Zentitle2** - Retrieve license data (get licenses, customers, products, usage information)
- **🔔 Nalpeiron Zentitle2 Trigger** - Listen for real-time events (license expiration, customer updates, renewals)

**Note:** The Nalpeiron Zentitle2 node is also available as an AI tool for enhanced automation and intelligent workflows.

### Example Workflows

**Renewal Alert System:**

```
Nalpeiron Trigger (license expires in 7 days) → Get Customer Details → Send Renewal Notice
```

## Resources

The node provides access to these Nalpeiron Growth Platform resources

## Webhook Events

The trigger node supports webhook events for real-time automation

## Webhook Setup

### Basic Setup

1. Add the **Nalpeiron Zentitle2 Trigger** node to your workflow
2. Select the events you want to listen for (supports multiple selection)
3. Webhooks are automatically registered
4. The webhook URL is automatically configured

### Authentication

**Note:** RSA signature verification has been removed from this community package to ensure compatibility with n8n Cloud verification requirements. All webhook requests are accepted without signature verification.

For production deployments requiring webhook authentication, consider implementing verification in your external systems or using n8n self-hosted with custom authentication logic.

### Auto-Setup Feature

The trigger node automatically manage webhooks:

- **Auto-Create**: Creates webhooks when the trigger activates
- **Auto-Update**: Updates webhook subscriptions when events change
- **Auto-Delete**: Removes webhooks when the trigger is deactivated

### Webhook Payload Structure

All webhooks follow this structure:

```json
{
	"eventId": "event_NsqUHwSXC0S4f4vuNkegSg",
	"eventDate": "2025-06-06T11:39:22.739326Z",
	"eventCode": "customer.created",
	"resourceId": "cust_ILLqMyx3UUy_n5cZqui7NQ",
	"callAttempt": 1,
	"payload": {
		// Event-specific data
	}
}
```

### Accessing Webhook Data in n8n

| Data          | Access Path                   | Example                  |
| ------------- | ----------------------------- | ------------------------ |
| Event Type    | `{{ $json.data.eventCode }}`  | `"customer.created"`     |
| Resource ID   | `{{ $json.data.resourceId }}` | `"cust_abc123"`          |
| Event Payload | `{{ $json.data.payload }}`    | Event-specific data      |
| Event Date    | `{{ $json.data.eventDate }}`  | `"2025-06-06T11:39:22Z"` |

## Troubleshooting

### Webhook Not Triggering

1. Check webhook URL is correctly registered in Nalpeiron Growth Platform
2. Verify selected events match the events being sent
3. Review n8n execution logs for errors
4. Test webhook manually using the "Test URL" feature

### API Calls Failing

1. Verify OAuth2 credentials are correct and have proper permissions
2. Check the base URL points to the correct environment


## License

MIT

## Support

For Nalpeiron Growth Platform API questions, please contact [Nalpeiron Support](https://nalpeiron.com/support).

## Links

- [n8n](https://n8n.io)
- [Nalpeiron Growth Platform](https://nalpeiron.com)
- [API Documentation](https://api.nalpeiron.io/docs)
