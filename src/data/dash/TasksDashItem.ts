import { IApp, ITasksDashItem, ValueSignal, IQuery } from "../../interfaces";
import { R } from "../../common";
import Query from "./../Query";


export default class TasksDashItem implements ITasksDashItem {

    readonly query: IQuery;
    readonly newTitle: ValueSignal<string>;

    
    private readonly visibleSignal: ValueSignal<boolean>;

    get visible(): boolean { return this.visibleSignal(); }

    set visible(value: boolean) { this.visibleSignal(value); }


    constructor(private readonly app: IApp, query: string) {
        this.query = new Query(app, query);
        this.newTitle = R.data("");
        this.visibleSignal = R.data(true);
    }

    get estimatedHeight(): number {
        return R.sample(() =>
            this.query.matcher.resultTasks().length * 15 + 30);
    }
}