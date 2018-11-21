import Task from "../data/Task";
import { IApp, IAddTaskActivity, ISearchTaskListActivity, ILabel } from "../interfaces";
import QueryMatcher from "./QueryMatcher";
import { R } from "../common";


export class AddTaskActivity implements IAddTaskActivity {

    private searchTaskListActivity: ISearchTaskListActivity;
    readonly newTitle = R.data("");


    constructor(private readonly app: IApp, searchTaskListActivity: ISearchTaskListActivity) {
        this.searchTaskListActivity = searchTaskListActivity;
    }


    commit(): void {
        if (this.newTitle() === "")
            return;
        let title = this.newTitle();
        this.newTitle("");
        const sq = new QueryMatcher(this.app);
        sq.text(this.searchTaskListActivity.query.text());
        const tq = new QueryMatcher(this.app);
        tq.text(title);
        for (const l of tq.existingLabels) {
            title = title.replace("#" + l.name, "");
        }
        title = title.trim().replace("  ", " ");
        const t = new Task(this.app, title);
        this.associateLabels(t, sq.existingLabels);
        this.associateLabels(t, tq.existingLabels);
        this.app.data.tasks.unshift(t);
    }


    private associateLabels(t: Task, ls: ILabel[]) {
        for (const l of ls) {
            t.associatedLabels.push(l);
        }
    }


    rollback(): void {
        this.newTitle("");
    }


    keyUp(e: KeyboardEvent): void {
        if (e.keyCode === 13)
            this.commit();
        else if (e.keyCode === 27)
            this.rollback();
    }
}