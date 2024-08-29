import {IAuthenticateGeneric, ICredentialType, INodeProperties,} from 'n8n-workflow';

export class SOAPApi implements ICredentialType {
  name = 'soapApi';
  displayName = 'SOAP API';
  properties: INodeProperties[] = [
    {
      displayName: 'Username',
      name: 'username',
      type: 'string',
      default: '',
    },
    {
      displayName: 'Password',
      name: 'password',
      type: 'string',
      typeOptions: {password: true},
      default: '',
    }
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        username: '={{$credentials.username}}',
        password: '={{$credentials.password}}',
      },
    },
  };
}
