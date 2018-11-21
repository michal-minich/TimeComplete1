﻿import { AddTaskActivity, } from "./AddTaskActivity";
import { SearchTaskListActivity } from "./SearchTaskListActivity";
import { IApp, ITaskListActivity, IAddTaskActivity, ISearchTaskListActivity } from "../interfaces";
import { R } from "../common";


export default class TaskListActivity implements ITaskListActivity {

    private readonly app: IApp;
    readonly addTaskActivity: IAddTaskActivity;
    readonly searchTaskListActivity: ISearchTaskListActivity;


    constructor(app: IApp) {
        this.app = app;

        this.searchTaskListActivity = new SearchTaskListActivity(app);
        this.addTaskActivity = new AddTaskActivity(app, this.searchTaskListActivity);
    }

    get estimatedHeight(): number {
        return R.sample(() => this.searchTaskListActivity.query.resultTasks().length * 15 + 30);
    }
}