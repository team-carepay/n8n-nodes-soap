# n8n-nodes-soaprequest

<img src="https://n8n.io/images/nodes/n8n.svg" width="100" height="100"/>

A community node for making soap requests with n8n, the workflow automation tool. This node allows
you to not worry about the soap boilerplate in your n8n workflows.

## Features

- **request**: Send a soap request.
- **interpolate**: In order to not hardcode credentials in either the **soap:Body** or **soap:Header**, you
  can use the `interpolate` function. This allows you to use **_{{ $credentials.username }}_** and **_{{
  $credentials.password }}_** in your template and it will be interpolated with the selected SOAP API
  credentials.

## Installation

To install the node, follow these steps:

1. Navigate to your n8n installation directory.
2. Install the node package:

```bash
npm install n8n-nodes-soaprequest
```
3. Start or restart your n8n instance.

## Configuration

Before using the SOAP Request node, you need to configure the Soap API credentials in n8n.

1. Go to the n8n Credentials section.
2. Add new credentials and select "Soap API".
3. Enter your credentials.
4. Save the credentials.

## Usage

Once the credentials are set up, you can use the `SOAP Request` node in your workflows.

1. **Add the `SOAP Request` node**: Drag and drop the `SOAP Request` node into your workflow.
2. **Select credentials to connect with** : Choose the credentials you configured in the previous
   step.
3. **Configure Parameters**: set the right parameters for your soap request.
4. Execute Workflow: Run your workflow to make a soap request.

## License

This project is licensed under the MIT License. See
the [LICENSE](https://github.com/team-carepay/n8n-nodes-soaprequest/blob/main/LICENSE.md) file for details.