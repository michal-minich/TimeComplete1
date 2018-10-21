import S from "s-js";
import { SArray as SArrayType } from "s-array";
import { IApp, ISearchTaskListActivity, ITask, ILabel } from "../interfaces";


export class SearchTaskListActivity implements ISearchTaskListActivity {
    taskQuery = S.data("");
    private originalTitle = "";

    private readonly app: IApp;

    constructor(app: IApp) {
        this.app = app;
    }


    resultTasks(): SArrayType<ITask> {
        return this.app.taskStore.searchedTasks(this.taskQuery());
    }


    begin(): void {
        this.originalTitle = this.taskQuery();
        this.app.selectTaskActivity.unselect();
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
            this.taskQuery(q.replace(`#${ln}`, "").replace("  ", " "));
        }
    }
}