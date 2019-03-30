import { IApp, ValueSignal, IQuery, IQueryMatcher }from "../interfaces";
import { R } from "../common";
import QueryMatcher from "../operations/QueryMatcher";


export default class Query implements IQuery {

    readonly textSignal: ValueSignal<string>;
    readonly matcher: IQueryMatcher;


    constructor(private readonly app: IApp, text?: string) {
        this.matcher = new QueryMatcher(app);
        this.textSignal = R.data(text || "");
        this.matcher.update(this);
    }


    get text(): string {
        return this.textSignal();
    }


    set text(value: string) {
        this.textSignal(value);
        this.matcher.update(this);
    }
}