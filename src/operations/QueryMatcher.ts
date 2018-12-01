﻿import {
        ILabel,
        IQueryMatcher,
        IQueryElement,
        IDomainObject,
        ITask,
        IApp,
        ArraySignal,
        IQuery,
    }
    from "../interfaces";
import { QueryText, QueryLabel, QueryParser, NotOp } from "./QueryParser";
import { R } from "../common";


export default class QueryMatcher implements IQueryMatcher {

    private readonly labelsSignal: ArraySignal<ILabel>;
    private qis!: IQueryElement[];
    private lc: string | undefined;
    private wasUpdate = R.data(true);


    constructor(private readonly app: IApp) {
        this.labelsSignal = R.array();
    }


    update(query: IQuery): void {
        this.wasUpdate(true);
        this.qis = QueryParser.parse(this.app, query.text());
        const label = this.firstLabel();
        if (label) {
            const l = this.app.data.labels().find(l2 => l2.name === label.value);
            if (l)
                this.lc = l.style.backColor.value;
        }
    }

    get labels(): ArraySignal<ILabel> { return this.labelsSignal; }


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


    get queryItems(): IQueryElement[] { return this.qis; }


    get firstLabelColor(): string | undefined { return this.lc; }


    taskMatches(t: ITask): boolean {
        if (this.queryItems.length === 0)
            return true;
        for (const qi of this.queryItems) {
            const m = this.matchOne(qi, t);
            if (m)
                return true;
        }
        return false;
    }


    matchOne(qi: IQueryElement, t: ITask): boolean {
        if (qi instanceof QueryText) {
            return t.title.indexOf(qi.value) !== -1;
        } else if (qi instanceof NotOp) {
            const m = this.matchOne(qi.arg, t);
            return !m;
        } else if (qi instanceof QueryLabel) {
            for (const al of t.associatedLabels()) {
                if (al.name.indexOf(qi.value) !== -1) {
                    return true;
                }
            }
            return false;
        } else {
            throw qi;
        }
    }


    resultTasks(): ITask[] {
        this.wasUpdate();
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
        for (const qi of this.queryItems) {
            if (qi instanceof QueryLabel) {
                const l = this.app.data.labels()
                    .find(l2 => l2.name === (qi as QueryLabel).value);
                if (l)
                    ls.push(l);
            }
        }
        return ls;
    }
}