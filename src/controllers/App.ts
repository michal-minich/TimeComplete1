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
import { Clock } from "../io/Clock";
import { IncrementCounter } from "../operations/IncrementCounter";
import {
    IApp,
    IAppData,
    IAppActivities,
    IDataStore,
    ITaskListActivity,
    IAddLabelActivity,
    IAssociateLabelWithTaskActivity,
    ISelectTaskActivity,
    IEditTaskTitleActivity,
    IChangeTaskCompletionActivity,
    IClock,
    IIdProvider
} from "../interfaces";


export class App implements IApp {
    static instance: IApp;

    readonly data: IAppData;
    readonly activity: IAppActivities;

    readonly sessionStore: IDataStore = new SessionStore();
    readonly clock: IClock = new Clock();
    readonly idCounter: IIdProvider<number> = new IncrementCounter();

    constructor() {
        App.instance = this;

        this.data = new AppData();
        this.activity = new AppActivities(this);

        initSampleData(this);
    }
}


export class AppData implements IAppData {
    readonly tasks = new TaskList();
    readonly labels = new LabelList();
}


export class AppActivities implements IAppActivities {

    readonly taskLists: SArrayType<ITaskListActivity>;

    readonly selectedTaskList: DataSignalType<ITaskListActivity>;
    readonly addLabel: IAddLabelActivity;
    readonly associateLabelWithTask: IAssociateLabelWithTaskActivity;
    readonly selectTask: ISelectTaskActivity;
    readonly editTaskTitle: IEditTaskTitleActivity;
    readonly changeTaskCompletion: IChangeTaskCompletionActivity;

    constructor(app: IApp) {

        this.taskLists = SArray<ITaskListActivity>([
            new TaskListActivity(app),
            new TaskListActivity(app),
            new TaskListActivity(app)
        ]);
        this.selectedTaskList = S.data(this.taskLists()[0]);
        this.addLabel = new AddLabelActivity(app);
        this.associateLabelWithTask = new AssociateLabelWithTaskActivity(app);
        this.selectTask = new SelectTaskActivity(app);
        this.editTaskTitle = new EditTaskTitleActivity(app);
        this.changeTaskCompletion = new ChangeTaskCompletionActivity(app);
    }
}


export function initSampleData(app: IApp) {

    const lRed = new Label("red", new Color("red"));
    app.data.labels.addLabel(lRed);

    const lGreen = new Label("green", new Color("green"));
    app.data.labels.addLabel(lGreen);

    const lBlue = new Label("blue", new Color("blue"));
    app.data.labels.addLabel(lBlue);

    for (let i = 0; i < 50; i++) {
        const lbl = new Label("label " + i, new Color("gray"));
        app.data.labels.addLabel(lbl);
    }

    const t1 = new Task("task 1 a");
    app.data.tasks.addTask(t1);
    const t2 = new Task("task 2 ab");
    app.data.tasks.addTask(t2);
    t2.addLabelAssociation(lGreen);
    const t3 = new Task("task 3 abc");
    t3.completedOn(app.clock.now());
    t3.addLabelAssociation(lRed);
    t3.addLabelAssociation(lBlue);
    app.data.tasks.addTask(t3);
    const t4 = new Task("task 4 abcd");
    app.data.tasks.addTask(t4);
    t4.addLabelAssociation(lRed);

    for (let i = 0; i < 20; i++) {
        const t = new Task("task " + i);
        app.data.tasks.addTask(t);
    }
}