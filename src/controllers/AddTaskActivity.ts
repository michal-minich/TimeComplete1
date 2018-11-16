import S from "s-js";
import Task from "../data/Task";
import { IApp, IAddTaskActivity, ISearchTaskListActivity, ILabel } from "../interfaces";
import { TaskQueryParser } from "../operations/query";


export class AddTaskActivity implements IAddTaskActivity {

    private searchTaskListActivity: ISearchTaskListActivity;
    readonly newTitle = S.data("");
    private readonly app: IApp;


    constructor(app: IApp, searchTaskListActivity: ISearchTaskListActivity) {
        this.searchTaskListActivity = searchTaskListActivity;
        this.app = app;
    }


    commit(): void {
        if (this.newTitle() === "")
            return;
        let title = this.newTitle();
        this.newTitle("");
        const sq = new TaskQueryParser().parse(this.searchTaskListActivity.taskQueryText());
        const tq = new TaskQueryParser().parse(title);
        for (const l of tq.existingLabels) {
            title = title.replace("#" + l.name, "");
        }
        title = title.trim().replace("  ", " ");
        const t = new Task(title);
        this.associateLabels(t, sq.existingLabels);
        this.associateLabels(t, tq.existingLabels);
        this.app.data.tasks.addTask(t);
    }


    private associateLabels(t: Task, ls: ILabel[]) {
        for (const l of ls) {
            t.associatedLabels.add(l);
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