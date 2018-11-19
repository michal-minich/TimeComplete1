import { QueryMatcher } from "./QueryMatcher";
import { IApp, ISearchTaskListActivity, ITask, ILabel } from "../interfaces";


export class SearchTaskListActivity implements ISearchTaskListActivity {

    query = new QueryMatcher();
    private originalTitle = "";
    private readonly app: IApp;


    constructor(app: IApp) {
        this.app = app;
    }


    resultTasks(): ITask[] {
        return this.app.data.tasks.items().filter(t => this.query.taskMatches(t));
    }


    begin(): void {
        this.originalTitle = this.query.text;
        this.app.activity.selectTask.selectedTask = undefined;
    }


    rollback(): void {
        if (this.originalTitle === "__NEXT_EMPTY__") {
            this.originalTitle = this.query.text;
            this.query.text = "";

        } else {
            this.query.text = this.originalTitle;
            this.originalTitle = "__NEXT_EMPTY__";
        }
    }


    keyUp(e: KeyboardEvent): void {
        if (e.keyCode === 27)
            this.rollback();
    }


    addOrRemoveLabelFromQuery(l: ILabel): void {
        const ln = l.name;
        const q = this.query.text.trim().replace("  ", " ");
        if (q.indexOf(ln) === -1) {
            this.query.text = q + " #" + ln;
        } else {
            this.query.text = q.replace("#" + ln, "").replace("  ", " ");
        }
    }
}