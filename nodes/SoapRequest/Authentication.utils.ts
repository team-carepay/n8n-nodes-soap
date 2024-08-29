import {IExecuteFunctions} from "n8n-workflow";
import {
    AUTHENTICATION,
    SOAP_API_CREDENTIAL,
    SOAP_API_CREDENTIALS_TYPE
} from "./Authentication.operations";
import {SOAP_BODY, SOAP_HEADERS} from "./Soap.operations";

export async function interpolateSOAPBodyCredentials(execution: IExecuteFunctions, index: number): Promise<string> {
    return await interpolateCredentials(execution, index, SOAP_BODY);
}

export async function interpolateSOAPHeaderCredentials(execution: IExecuteFunctions, index: number): Promise<string> {
    return await interpolateCredentials(execution, index, SOAP_HEADERS);
}

async function interpolateCredentials(execution: IExecuteFunctions, index: number, parameterName: string): Promise<string> {
    let content = execution.getNodeParameter(parameterName, index, '', {
        rawExpressions: true // we need to manually evaluate the expression because we want to replace the credentials.
    }) as string;

    const authentication = execution.getNodeParameter(AUTHENTICATION, index, '') as string
    const credentials = authentication === SOAP_API_CREDENTIALS_TYPE
        ? await execution.getCredentials(SOAP_API_CREDENTIAL, index)
        : undefined;

    if (credentials !== undefined) {
        const username = credentials['username'];
        const password = credentials['password'];

        content = content
            .replace(/{{\s?\$credentials\.username\s?}}/g, username.toString())
            .replace(/{{\s?\$credentials\.password\s?}}/g, password.toString());
    }
    const evaluatedExpression = execution.evaluateExpression(content, index) as string;
    return evaluatedExpression.indexOf('=') === 0
        ? evaluatedExpression.substring(1) // because we are manually evaluating the expression, we need to remove the first character (=)
        : evaluatedExpression;
}