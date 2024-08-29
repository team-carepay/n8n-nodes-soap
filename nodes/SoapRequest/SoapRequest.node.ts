import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';
import {CONVERT_TO_JSON, METHOD, SEND_HEADERS, soapOperations, URL} from "./Soap.operations";
import {
    interpolateSOAPBodyCredentials,
    interpolateSOAPHeaderCredentials
} from "./Authentication.utils";
import {SOAPMessageBuilder} from "./SoapMessage";
import xpath from "xpath";
import {parseString,} from "xml2js";
import {DOMParser} from '@xmldom/xmldom';
import {authenticationOperations, SOAP_API_CREDENTIALS_TYPE} from "./Authentication.operations";

export class SOAPRequest implements INodeType {
    description: INodeTypeDescription = {
        credentials: [
            {
                name: 'soapApi',
                required: false,
                displayName: 'SOAP API',
                displayOptions: {
                    show: {
                        authentication: [SOAP_API_CREDENTIALS_TYPE],
                    },
                },
            },
        ],

        description: 'SOAP Request',
        displayName: 'SOAP Request',
        defaults: {
            name: 'SOAP Request',
        },
        group: ['transform'],
        inputs: ['main'],
        name: 'soapRequest',
        icon: 'file:soaprequest.svg',
        outputs: ['main'],
        properties: [
            ...authenticationOperations,
            ...soapOperations,
        ],
        version: 1,
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const method = (this.getNodeParameter(METHOD, 0, '') as string)
        const url = (this.getNodeParameter(URL, 0, '') as string)
        const sendHeaders = (this.getNodeParameter(SEND_HEADERS, 0, false) as boolean);
        const soapBody = await interpolateSOAPBodyCredentials(this, 0);
        const soapHeader = sendHeaders ? await interpolateSOAPHeaderCredentials(this, 0) : undefined;
        const soapMessage = new SOAPMessageBuilder()
            .addHeader(soapHeader)
            .setBody(soapBody)
            .build()
            .toString();

        const convertToJson = (this.getNodeParameter(CONVERT_TO_JSON, 0, false) as boolean);

        const options: any = {
            headers: {
                'Content-Type': 'application/soap+xml',
                'Accept': 'application/soap+xml',
            },
            method: method,
            uri: url,
            body: soapMessage,
            json: false,
            resolveWithFullResponse: true,
        };

        const response = await this.helpers.request.call(this, options);
        const doc = new DOMParser().parseFromString(response['body'], 'text/xml');
        const select = xpath.useNamespaces({"soap": "http://www.w3.org/2003/05/soap-envelope"});

        // @ts-ignore
        const responseBody = select("//soap:Body/*", doc).toString();
        let resultData = responseBody;

        if (convertToJson) {
            parseString(responseBody, {
                explicitArray: false,
                ignoreAttrs: true,
            }, (error, result) => {
                resultData = result
            });
        }

        return [this.helpers.returnJsonArray([{
            url,
            method,
            data: resultData,
            headers: response.headers,
            statusCode: response.statusCode,
            statusMessage: response.statusMessage
        }])];
    }
}
