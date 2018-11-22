import {
        ILabel,
        IQueryMatcher,
        IQueryElement,
        IDomainObject,
        ITask,
        IApp,
        ValueSignal,
        ArraySignal,
    }
    from "../interfaces";
import { QueryText, QueryLabel, QueryParser } from "./QueryParser";
import { R } from "../common";


export default class QueryMatcher implements IQueryMatcher {

    readonly text: ValueSignal<string>;
    readonly labels: ArraySignal<ILabel>;


    constructor(private readonly app: IApp) {
        this.text = R.data("");
        this.labels = R.array();
    }


    generalSearchMatches(queryText: string): boolean {
        throw undefined;
    }


    matches(obj: IDomainObject): boolean {
        throw undefined;
    }


    labelMatches(label: ILabel): boolean {
        throw undefined;
    }


    includeLabel(label: ILabel): void {
        throw undefined;
    }


    excludeLabel(label: ILabel): void {
        throw undefined;
    }


    queryItems: IQueryElement[] = [];
    firstLabelColor: string | undefined;


    parseTokens() {
        this.queryItems = QueryParser.parse(this.app, this.text());
        const label = this.firstLabel();
        if (label) {
            const l = this.app.data.labels().find(l2 => l2.name === label.value);
            if (l)
                this.firstLabelColor = l.style.backColor.value;
        }
    }


    taskMatches(t: ITask): boolean {
        this.parseTokens();
        const title = t.title;
        for (const qi of this.queryItems) {
            if (qi instanceof QueryText) {
                if (title.indexOf(qi.value) === -1)
                    return false;
            } else if (qi instanceof QueryLabel) {
                let found = false;
                for (const al of t.associatedLabels()) {
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


    resultTasks(): ITask[] {
        return this.app.data.tasks().filter(t => this.taskMatches(t));
    }


    private firstLabel(): QueryLabel | undefined {
        for (const qi of this.queryItems)
            if (qi instanceof QueryLabel)
                return qi;
        return undefined;
    }


    get existingLabels(): ILabel[] {
        const ls: ILabel[] = [];
        for (const qi of this.queryItems)
            if (qi instanceof QueryLabel) {
                const l = this.app.data.labels()
                    .find(l2 => l2.name === (qi as QueryLabel).value);
                if (l)
                    ls.push(l);
            };
        return ls;
    }
}