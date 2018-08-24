import * as M from "./model";


export class TaskQuery {
    queryItems: IQueryItem[] = [];

    taskMatches(t: M.ITask): boolean {
        const title = t.title();
        for (let qi of this.queryItems) {
            if (qi instanceof QueryText) {
                if (title.indexOf(qi.value) === -1)
                    return false;
            } else if (qi instanceof QueryLabel) {
                let found = false;
                for (const al of t.assignedLabels()) {
                    if (al.name().indexOf(qi.value) !== -1) {
                        found = true;
                        break;
                    }
                }
                if (!found)
                    return false;
            }
        }
        return true;
    }
}


export interface IQueryItem {
}


export class QueryText implements IQueryItem {
    value: string;

    constructor(value: string) { this.value = value; }
}


export class QueryLabel implements IQueryItem {
    value: string;

    constructor(value: string) { this.value = value; }
}


export class TaskQueryParser {
    private pos: number = 0;
    private qt: string = "";

    parse(queryText: string): TaskQuery {
        this.qt = queryText;
        this.pos = 0;
        let tok: string | undefined;
        const q = new TaskQuery();
        while ((tok = this.nextToken()) !== undefined) {
            if (tok[0] === "#") {
                q.queryItems.push(new QueryLabel(tok.substring(1)));
            } else {
                q.queryItems.push(new QueryText(tok));
            }
        }
        //console.log(q.queryItems);
        return q;
    }

    private nextToken(): string | undefined {
// ReSharper disable InconsistentNaming
        const ord_0 = "0".charCodeAt(0);
        const ord_9 = "9".charCodeAt(0);
        const ord_hash = "#".charCodeAt(0);
        const ord_dash = "-".charCodeAt(0);
        const ord_space = " ".charCodeAt(0);
// ReSharper restore InconsistentNaming
        while (this.hasWork()) {
            let ordCh = this.currentCode();
            if (ordCh === ord_space) {
                ++this.pos;
                continue;
            }
            const startPos = this.pos;
            do {
                ordCh = this.currentCode();
                if (ordCh === ord_space)
                    break;
               ++this.pos;
            } while (this.hasWork())

            const len = this.pos - startPos;
            if (len > 0)
                return this.qt.substr(startPos, len);
        }
        return undefined;
    }

    private currentCode(): number { return this.qt[this.pos].charCodeAt(0); }

    private hasWork(): boolean { return this.pos < this.qt.length }
}