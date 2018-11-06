import S, { DataSignal } from "s-js";
import TaskListActivity from "./TaskListActivity";
import AddLabelActivity from "./AddLabelActivity";
import AssociateLabelWithTaskActivity from "./AssociateLabelWithTaskActivity";
import SelectTaskActivity from "./SelectTaskActivity";
import EditLabelActivity from "./EditLabelActivity";
import EditTaskTitleActivity from "./EditTaskTitleActivity";
import ChangeTaskCompletionActivity from "./ChangeTaskCompletionActivity";
import TaskListGroup from "./TaskListGroup";
import Color from "../data/Color";
import TaskList from "../data/TaskList";
import LabelList from "../data/LabelList";
import LabelStyle from "../data/LabelStyle";
import Label from "../data/Label";
import Task from "../data/Task";
import { SessionStore } from "../io/SessionStore";
import Clock from "../io/Clock";
import Serializer from "../operations/Serializer";
import IncrementCounter from "../operations/IncrementCounter";
import { Common } from "../common";
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
    IIdProvider,
    ILabelList,
    ITaskList,
    IAppActivitiesSettings,
    ITaskListGroup,
    IEditLabelActivity
} from "../interfaces";


export default class App implements IApp {
    static instance: IApp;

    readonly data: IAppData;
    readonly activity: IAppActivities;

    readonly localStore: IDataStore = new SessionStore();
    readonly clock: IClock = new Clock();
    readonly idCounter: IIdProvider<number> = new IncrementCounter();

    constructor() {
        App.instance = this;

        this.data = new AppData();
        this.activity = new AppActivities(this);

        this.data.load();
        this.activity.load();

        //initSampleData(this);
    }


    generateLocalStorageDownload(): void {
        const data = {
            labels: App.instance.localStore.load("labels"),
            tasks: App.instance.localStore.load("tasks"),
            activities: App.instance.localStore.load("activities")
        };
        Common.download("export.json", JSON.stringify(data));
    }
}


export class AppData implements IAppData {
    tasks!: ITaskList;
    labels!: ILabelList;

    load(): void {
        const savedLabels = new SessionStore().loadOrUndefined("labels");
        this.labels = savedLabels === undefined
            ? new LabelList([])
            : new Serializer().fromPlainObject<LabelList>(savedLabels, "LabelList");

        const savedTasks = new SessionStore().loadOrUndefined("tasks");
        this.tasks = savedTasks === undefined
            ? new TaskList([])
            : new Serializer().fromPlainObject<TaskList>(savedTasks, "TaskList");

        S(() => {
            Common.saveWithSerialize("labels", this.labels.items());
        });

        S(() => {
            Common.saveWithSerialize("tasks", this.tasks.items());
        });
    }
}


export class AppActivities implements IAppActivities {

    private readonly app: IApp;
    readonly taskLists: ITaskListGroup;

    selectedTaskList!: DataSignal<ITaskListActivity>;
    readonly addLabel: IAddLabelActivity;
    readonly associateLabelWithTask: IAssociateLabelWithTaskActivity;
    readonly selectTask: ISelectTaskActivity;
    readonly editTaskTitle: IEditTaskTitleActivity;
    readonly changeTaskCompletion: IChangeTaskCompletionActivity;
    readonly editLabel: IEditLabelActivity;

    constructor(app: IApp) {
        this.app = app;
        this.taskLists = new TaskListGroup(app, []);
        this.addLabel = new AddLabelActivity(app);
        this.associateLabelWithTask = new AssociateLabelWithTaskActivity(app);
        this.selectTask = new SelectTaskActivity(app);
        this.editTaskTitle = new EditTaskTitleActivity(app);
        this.changeTaskCompletion = new ChangeTaskCompletionActivity(app);
        this.editLabel = new EditLabelActivity(app);
    }


    load(): void {
        const s = this.app.localStore.loadOrUndefined<IAppActivitiesSettings>("activities");
        if (s) {
            for (let tl of s.taskLists) {
                const tla = new TaskListActivity(this.app);
                tla.searchTaskListActivity.taskQueryText(tl.taskQueryText);
                tla.addTaskActivity.newTitle(tl.newTaskTitle);
                this.taskLists.add(tla);
            }
            if (s.selectedTask) {
                const t = this.app.data.tasks.byId(s.selectedTask);
                this.selectTask.selectedTask = t;
            }
        }
        if (this.taskLists.items().length === 0)
            this.taskLists.add(new TaskListActivity(this.app));
        this.selectedTaskList = S.data(this.taskLists.items()[0]);

        S(() => this.save());
    }


    private save(): void {
        const st = this.selectTask.selectedTask;
        const s: IAppActivitiesSettings = {
            taskLists: this.taskLists.items().map(tl => ({
                taskQueryText: tl.searchTaskListActivity.taskQueryText(),
                newTaskTitle: tl.addTaskActivity.newTitle()
            })),
            selectedTask: st ? st.id : undefined
        };
        this.app.localStore.save("activities", s);
    }
}


export function initSampleData(app: IApp) {

    const lRed = new Label("red", new LabelStyle(new Color("red"), new Color("white")));
    app.data.labels.addLabel(lRed);

    const lGreen = new Label("green", new LabelStyle(new Color("green"), new Color("white")));
    app.data.labels.addLabel(lGreen);

    const lBlue = new Label("blue", new LabelStyle(new Color("blue"), new Color("white")));
    app.data.labels.addLabel(lBlue);

    for (let i = 0; i < 50; i++) {
        const lbl = new Label("label " + i, new LabelStyle(new Color("gray"), new Color("white")));
        app.data.labels.addLabel(lbl);
    }

    const t1 = new Task("task 1 a");
    app.data.tasks.addTask(t1);
    const t2 = new Task("task 2 ab");
    app.data.tasks.addTask(t2);
    t2.associatedLabels.add(lGreen);
    const t3 = new Task("task 3 abc");
    t3.completedOn = app.clock.now();
    t3.associatedLabels.add(lRed);
    t3.associatedLabels.add(lBlue);
    app.data.tasks.addTask(t3);
    const t4 = new Task("task 4 abcd");
    app.data.tasks.addTask(t4);
    t4.associatedLabels.add(lRed);

    for (let i = 0; i < 20; i++) {
        const t = new Task("task " + i);
        app.data.tasks.addTask(t);
    }
}