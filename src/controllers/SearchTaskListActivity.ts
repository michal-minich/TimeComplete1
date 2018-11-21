import { IApp, ISearchTaskListActivity, ILabel, IQueryMatcher } from "../interfaces";
import QueryMatcher from "./QueryMatcher";


export class SearchTaskListActivity implements ISearchTaskListActivity {

    query: IQueryMatcher;
    private originalTitle = "";
    private readonly app: IApp;


    constructor(app: IApp) {
        this.app = app;
        this.query = new QueryMatcher(app);
    }


    begin(): void {
        this.originalTitle = this.query.text();
        this.app.activity.selectTask.selectedTask = undefined;
    }


    rollback(): void {
        if (this.originalTitle === "__NEXT_EMPTY__") {
            this.originalTitle = this.query.text();
            this.query.text("");

        } else {
            this.query.text(this.originalTitle);
            this.originalTitle = "__NEXT_EMPTY__";
        }
    }


    keyUp(e: KeyboardEvent): void {
        if (e.keyCode === 27)
            this.rollback();
    }


    addOrRemoveLabelFromQuery(l: ILabel): void {
        const ln = l.name;
        const q = this.query.text().trim().replace("  ", " ");
        if (q.indexOf(ln) === -1) {
            this.query.text(q + " #" + ln);
        } else {
            this.query.text(q.replace("#" + ln, "").replace("  ", " "));
        }
    }
}