import { IApp, ITasksDashItem, IQueryMatcher, ValueSignal } from "../interfaces";
import { R } from "../common";
import QueryMatcher from "../operations/QueryMatcher";


export default class TasksDashItem implements ITasksDashItem {

    query: IQueryMatcher;
    readonly newTitle: ValueSignal<string>;


    constructor(private readonly app: IApp) {
        this.query = new QueryMatcher(app);
        this.newTitle = R.data("");
    }

    get estimatedHeight(): number {
        return R.sample(() => this.query.resultTasks().length * 15 + 30);
    }
}