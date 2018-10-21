import S, { DataSignal as DataSignalType } from "s-js";
import SArray, { SArray as SArrayType } from "s-array";
import { TaskListActivity } from "./TaskListActivity";
import { AddLabelActivity } from "./AddLabelActivity";
import { AssociateLabelWithTaskActivity } from "./AssociateLabelWithTaskActivity";
import { SelectTaskActivity } from "./SelectTaskActivity";
import { EditTaskTitleActivity } from "./EditTaskTitleActivity";
import { ChangeTaskCompletionActivity } from "./ChangeTaskCompletionActivity";
import { Color } from "../data/Color";
import { TaskList } from "../data/TaskList";
import { LabelList } from "../data/LabelList";
import { Label } from "../data/Label";
import { Task } from "../data/Task";
import { SessionStore } from "../io/SessionStore";
import { clock } from "../common";
import {
    IApp,
    IDataStore,
    ITaskListActivity,
    IAddLabelActivity,
    IAssociateLabelWithTaskActivity,
    ISelectTaskActivity,
    IEditTaskTitleActivity,
    IChangeTaskCompletionActivity
} from "../interfaces";


export class App implements IApp {
    static instance: App;
    readonly sessionStore: IDataStore = new SessionStore();
    readonly taskStore = new TaskList();
    readonly labelStore = new LabelList();
    readonly taskListsActivities: SArrayType<ITaskListActivity>;

    readonly selectedTaskListActivity: DataSignalType<ITaskListActivity>;
    readonly addLabelActivity: IAddLabelActivity;
    readonly associateLabelWithTaskActivity: IAssociateLabelWithTaskActivity;
    readonly selectTaskActivity: ISelectTaskActivity;
    readonly editTaskTitleActivity: IEditTaskTitleActivity;
    readonly changeTaskCompletionActivity: IChangeTaskCompletionActivity;


    constructor() {
        App.instance = this;
        this.taskListsActivities = SArray<ITaskListActivity>([
            new TaskListActivity(this),
            new TaskListActivity(this),
            new TaskListActivity(this)
        ]);
        this.selectedTaskListActivity = S.data(this.taskListsActivities()[0]);
        this.addLabelActivity = new AddLabelActivity(this);
        this.associateLabelWithTaskActivity = new AssociateLabelWithTaskActivity(this);
        this.selectTaskActivity = new SelectTaskActivity(this);
        this.editTaskTitleActivity = new EditTaskTitleActivity(this);
        this.changeTaskCompletionActivity = new ChangeTaskCompletionActivity(this);

        initSampleData(this);
    }
}


export function initSampleData(app: IApp) {

    const lRed = new Label("red", new Color("red"));
    app.labelStore.addLabel(lRed);

    const lGreen = new Label("green", new Color("green"));
    app.labelStore.addLabel(lGreen);

    const lBlue = new Label("blue", new Color("blue"));
    app.labelStore.addLabel(lBlue);

    for (let i = 0; i < 50; i++) {
        const lbl = new Label("label " + i, new Color("gray"));
        app.labelStore.addLabel(lbl);
    }

    const t1 = new Task("task 1 a");
    app.taskStore.addTask(t1);
    const t2 = new Task("task 2 ab");
    app.taskStore.addTask(t2);
    t2.addLabelAssociation(lGreen);
    const t3 = new Task("task 3 abc");
    t3.completedOn(clock.now());
    t3.addLabelAssociation(lRed);
    t3.addLabelAssociation(lBlue);
    app.taskStore.addTask(t3);
    const t4 = new Task("task 4 abcd");
    app.taskStore.addTask(t4);
    t4.addLabelAssociation(lRed);

    for (let i = 0; i < 20; i++) {
        const t = new Task("task " + i);
        app.taskStore.addTask(t);
    }
}