import * as I from "../interfaces";
import App from "../controllers/App";


export class TaskQuery {
    queryItems: IQueryItem[] = [];
    firstLabelColor: string | undefined;

    constructor(queryItems: IQueryItem[]) {
        this.queryItems = queryItems;
        const label = this.firstLabel();
        if (label) {
            const l = App.instance.data.labels.items().find(l => l.name === label.value);
            if (l)
                this.firstLabelColor = l.color.value;
        }
    }

    taskMatches(t: I.ITask): boolean {
        const title = t.title;
        for (let qi of this.queryItems) {
            if (qi instanceof QueryText) {
                if (title.indexOf(qi.value) === -1)
                    return false;
            } else if (qi instanceof QueryLabel) {
                let found = false;
                for (const al of t.associatedLabels.items()) {
                    if (al.name.indexOf(qi.value) !== -1) {
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


    private firstLabel(): QueryLabel | undefined {
        for (let qi of this.queryItems)
            if (qi instanceof QueryLabel)
                return qi;
        return undefined;
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

    parse(queryTextText: string): TaskQuery {
        this.qt = queryTextText;
        this.pos = 0;
        let tok: string | undefined;
        const queryItems: IQueryItem[] = [];
        while ((tok = this.nextToken()) !== undefined) {
            if (tok[0] === "#") {
                queryItems.push(new QueryLabel(tok.substring(1)));
            } else {
                queryItems.push(new QueryText(tok));
            }
        }
        const q = new TaskQuery(queryItems);
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
            } while (this.hasWork());

            const len = this.pos - startPos;
            if (len > 0)
                return this.qt.substr(startPos, len);
        }
        return undefined;
    }

    private currentCode(): number { return this.qt[this.pos].charCodeAt(0); }

    private hasWork(): boolean { return this.pos < this.qt.length }
}

// query language
// free text ... 'text' matches %text%
// #label ... '#xx' matches #%xx%
// #label.. matches the label + all children
// #label..
// bool ops: ! and or < >= <= = (auto correct from ==) != (auto correct from <>)
// saved 'named' search will virtually assign 'named' as a label to matching tasks (and can be used as #named in other queries)