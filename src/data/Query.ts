import { IApp, ValueSignal, IQuery, IQueryMatcher }from "../interfaces";
import { R } from "../common";
import QueryMatcher from "../operations/QueryMatcher";


export default class Query implements IQuery {

    readonly text: ValueSignal<string>;
    readonly matcher: IQueryMatcher;


    constructor(private readonly app: IApp, text?: string) {
        this.text = R.data(text || "");
        this.matcher = new QueryMatcher(app);
        R.on(this.text, () => this.matcher.update(this));
    }
}