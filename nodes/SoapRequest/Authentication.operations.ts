import {INodeProperties} from "n8n-workflow";

export const AUTHENTICATION = 'authentication';
export const SOAP_API_CREDENTIAL = 'soapApi';
export const SOAP_API_CREDENTIALS_TYPE = 'soapAPICredentialType';

export const authenticationOperations: INodeProperties[] = [
    {
        displayName: 'Authentication',
        name: AUTHENTICATION,
        noDataExpression: true,
        type: 'options',
        options: [
            {
                name: 'None',
                value: 'none',
            },
            {
                name: 'SOAP API Credential Type',
                value: SOAP_API_CREDENTIALS_TYPE,
            }
        ],
        default: 'none',
    },
    {
        displayName: 'SOAP Api Credentials',
        name: SOAP_API_CREDENTIAL,
        type: 'credentials',
        noDataExpression: true,
        required: true,
        default: '',
        displayOptions: {
            show: {
                authentication: [SOAP_API_CREDENTIALS_TYPE],
            },
        },
    },
];