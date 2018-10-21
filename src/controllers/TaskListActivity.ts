import { AddTaskActivity, SearchTaskListActivity } from "./all";
import * as I from "../interfaces";


export class TaskListActivity implements I.ITaskListActivity {
    private readonly app: I.IApp;

    readonly addTaskActivity: I.IAddTaskActivity;
    readonly searchTaskListActivity: I.ISearchTaskListActivity;

    constructor(app: I.IApp) {
        this.app = app;

        this.addTaskActivity = new AddTaskActivity(app);
        this.searchTaskListActivity = new SearchTaskListActivity(app);
    }
}