import S, { DataSignal as DataSignalType } from "s-js";
import SArray, { SArray as SArrayType } from "s-array";
import * as C from "../controllers/all";
import { DateTime, Color, TaskList, LabelList, Label, Task } from "../data/all";
import { SessionStore } from "../io/SessionStore";
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
            new C.TaskListActivity(this),
            new C.TaskListActivity(this),
            new C.TaskListActivity(this)
        ]);
        this.selectedTaskListActivity = S.data(this.taskListsActivities()[0]);
        this.addLabelActivity = new C.AddLabelActivity(this);
        this.associateLabelWithTaskActivity = new C.AssociateLabelWithActivity(this);
        this.selectTaskActivity = new C.SelectTaskActivity(this);
        this.editTaskTitleActivity = new C.EditTaskTitleActivity(this);
        this.changeTaskCompletionActivity = new C.ChangeTaskCompletionActivity(this);

        initSampleData(this);
    }
}


export function initSampleData(app: IApp) {

    const lRed = new Label();
    lRed.name("red");
    lRed.color(new Color("red"));
    app.labelStore.addLabel(lRed);

    const lGreen = new Label();
    lGreen.name("green");
    lGreen.color(new Color("green"));
    app.labelStore.addLabel(lGreen);

    const lBlue = new Label();
    lBlue.name("blue");
    lBlue.color(new Color("blue"));
    app.labelStore.addLabel(lBlue);

    for (let i = 0; i < 50; i++) {
        const lbl = new Label();
        lbl.name(`label${i}`);
        lbl.color(new Color("gray"));
        app.labelStore.addLabel(lbl);
    }

    const t1 = new Task();
    t1.title("task 1 a");
    app.taskStore.addTask(t1);
    const t2 = new Task();
    t2.title("task 2 ab");
    app.taskStore.addTask(t2);
    t2.addLabelAssociation(lGreen);
    const t3 = new Task();
    t3.title("task 3 abc");
    t3.completedOn(new DateTime("2018"));
    t3.addLabelAssociation(lRed);
    t3.addLabelAssociation(lBlue);
    app.taskStore.addTask(t3);
    const t4 = new Task();
    t4.title("task 4 abcd");
    app.taskStore.addTask(t4);
    t4.addLabelAssociation(lRed);

    for (let i = 0; i < 20; i++) {
        const t = new Task();
        t.title(`task ${i}`);
        app.taskStore.addTask(t);
    }
}