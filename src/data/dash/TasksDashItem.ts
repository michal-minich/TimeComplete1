import { IApp, ITasksDashItem, ValueSignal, IQuery } from "../../interfaces";
import { R } from "../../common";
import Query from "./../Query";


export default class TasksDashItem implements ITasksDashItem {

    query: IQuery;
    readonly newTitle: ValueSignal<string>;


    constructor(private readonly app: IApp, query: string) {
        this.query = new Query(app, query);
        this.newTitle = R.data("");
    }

    get estimatedHeight(): number {
        return R.sample(() => this.query.matcher.resultTasks().length * 15 + 30);
    }
}