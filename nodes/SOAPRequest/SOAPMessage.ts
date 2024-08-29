// Not exposed to enforce use of the Builder.
class SOAPMessage {
    private headers: string[];
    private body: string;
    private envelopeAttributes: Record<string, string>;

    constructor(headers: string[], body: string, envelopeAttributes: Record<string, string>) {
        this.headers = headers;
        this.body = body;
        this.envelopeAttributes = envelopeAttributes;
    }

    public toString(): string {
        const envelopeAttrs = Object.entries(this.envelopeAttributes)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');

        const headerSection = this.headers.length > 0
            ? `<soap:Header>${this.headers.join('')}</soap:Header>`
            : '';

        const bodySection = `<soap:Body>${this.body}</soap:Body>`;

        return `
            <?xml version=\"1.0\" encoding=\"utf-8\"?>
            <soap:Envelope ${envelopeAttrs}>
                ${headerSection}
                ${bodySection}
            </soap:Envelope>
        `
            .replace(/\n/g, '') //we remove all new lines and concatenate the string
            .replace(/\>\s+\</g, '><') // remove all spaces between tags;
            .trim();
    }
}

export class SOAPMessageBuilder {
    private headers: string[] = [];
    private body: string = '';
    private envelopeAttributes: Record<string, string> = {
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
        'xmlns:soap': 'http://www.w3.org/2003/05/soap-envelope'
    };

    public addHeader(header: string | undefined): this {
        if (header !== undefined) {
            this.headers.push(header);
        }
        return this;
    }

    public setBody(body: string): this {
        this.body = body;
        return this;
    }

    public build(): SOAPMessage {
        return new SOAPMessage(this.headers, this.body, this.envelopeAttributes);
    }
}