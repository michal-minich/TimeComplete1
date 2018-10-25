import S from "s-js";
import { SArray as SArrayType, SArray } from "s-array";
import { TaskQueryParser } from "../operations/query";
import { IApp, ISearchTaskListActivity, ITask, ILabel } from "../interfaces";


export class SearchTaskListActivity implements ISearchTaskListActivity {

    taskQuery = S.data("");
    private originalTitle = "";
    private readonly app: IApp;


    constructor(app: IApp) {
        this.app = app;
    }


    searchedTasks(taskQuery: string): SArray<ITask> {
        new String("").padStart(1, "");
        const q = new TaskQueryParser().parse(taskQuery);
        return this.app.data.tasks.items.filter(t => q.taskMatches(t));
    }


    resultTasks(): SArrayType<ITask> {
        return this.searchedTasks(this.taskQuery());
    }


    begin(): void {
        this.originalTitle = this.taskQuery();
        this.app.activity.selectTask.unselect();
    }


    addSearch(): void {
    }


    rollback(): void {
        if (this.originalTitle === "__NEXT_EMPTY__") {
            this.originalTitle = this.taskQuery();
            this.clear();

        } else {
            this.taskQuery(this.originalTitle);
            this.originalTitle = "__NEXT_EMPTY__";
        }
    }


    clear(): void {
        this.taskQuery("");
    }


    keyUp(e: KeyboardEvent): void {
        if (e.keyCode === 27)
            this.rollback();
    }


    addOrRemoveLabelFromQuery(l: ILabel): void {
        const ln = l.name();
        const q = this.taskQuery().trim().replace("  ", " ");
        if (q.indexOf(ln) === -1) {
            this.taskQuery(q + " #" + ln);
        } else {
            this.taskQuery(q.replace("#" + ln, "").replace("  ", " "));
        }
    }
}