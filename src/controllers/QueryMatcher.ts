import S, { DataSignal } from "s-js";
import SArray, { SDataArray } from "s-array";
import {
        ILabel,
        IQueryMatcher,
        IQueryElement,
        IDomainObject,
        ITask,
    }
    from "../interfaces";
import App from "./App";
import { QueryText, QueryLabel, QueryParser } from "../operations/QueryParser";


export class QueryMatcher implements IQueryMatcher {

    readonly textSignal: DataSignal<string>;
    readonly labels: SDataArray<ILabel>;

    constructor() {
        this.textSignal = S.data("");
        this.labels = SArray([]);
    }

    generalSearchMatches(queryText: string): boolean { return false; }

    matches(obj: IDomainObject): boolean { return false; }

    labelMatches(label: ILabel): boolean { return false; }

    includeLabel(label: ILabel): void {}

    excludeLabel(label: ILabel): void {}

    get text(): string { return this.textSignal(); }

    set text(value: string) { this.textSignal(value); }

    get textSample(): string { return S.sample(this.textSignal); }


    queryItems: IQueryElement[] = [];
    firstLabelColor: string | undefined;

    parseTokens() {
            this.queryItems = QueryParser.parse(this.text);
            const label = this.firstLabel();
            if (label) {
                const l = App.instance.data.labels.items().find(l => l.name === label.value);
                if (l)
                    this.firstLabelColor = l.style.backColor.value;
            }
    }

    taskMatches(t: ITask): boolean {
        this.parseTokens();
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


    get existingLabels(): ILabel[] {
        const ls: ILabel[] = [];
        for (let qi of this.queryItems)
            if (qi instanceof QueryLabel) {
                const l = App.instance.data.labels.items()
                    .find(l2 => l2.name === (qi as QueryLabel).value);
                if (l)
                    ls.push(l);
            };
        return ls;
    }
}