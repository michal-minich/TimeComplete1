import { IQueryElement, IApp } from "../interfaces";


export class QueryText implements IQueryElement {

    constructor(public value: string) {}

    makeString(): string { return this.value; }
}


export class QueryLabel implements IQueryElement {

    constructor(private readonly app: IApp, public value: string) {}

    makeString(): string { return this.app.data.settings.labelPrefix() + this.value; }
}


export module QueryParser {

    export function parse(app: IApp, queryTextText: string): IQueryElement[] {
        const queryItems: IQueryElement[] = [];
        const iterator = getTokenIterator(queryTextText, 0);
        let tok: string | undefined;
        while ((tok = iterator()) !== undefined) {
            if (tok[0] === app.data.settings.labelPrefix()) {
                queryItems.push(new QueryLabel(app, tok.substring(1)));
            } else {
                queryItems.push(new QueryText(tok));
            }
        }
        return queryItems;
    }


    export function makeString(elements: ReadonlyArray<IQueryElement>): string {
        return elements.map(e => e.makeString()).join();
    };


    function getTokenIterator(qt: string, pos: number): () => string | undefined {

        const currentCode = (): number => { return qt[pos].charCodeAt(0); };

        const hasWork = (): boolean => { return pos < qt.length };

        return (): string | undefined => {
            // ReSharper disable InconsistentNaming
            const ord_0 = "0".charCodeAt(0);
            const ord_9 = "9".charCodeAt(0);
            const ord_hash = "#".charCodeAt(0);
            const ord_dash = "-".charCodeAt(0);
            const ord_space = " ".charCodeAt(0);
            // ReSharper restore InconsistentNaming
            while (hasWork()) {
                let ordCh = currentCode();
                if (ordCh === ord_space) {
                    ++pos;
                    continue;
                }
                const startPos = pos;
                do {
                    ordCh = currentCode();
                    if (ordCh === ord_space)
                        break;
                    ++pos;
                } while (hasWork());

                const len = pos - startPos;
                if (len > 0)
                    return qt.substr(startPos, len);
            }
            return undefined;
        };
    }
}