import TaskListActivity from "./TaskListActivity";
import SelectTaskActivity from "./SelectTaskActivity";
import EditTaskTitleActivity from "./EditTaskTitleActivity";
import Dashboard from "../data/Dashboard";
import SessionStore from "../io/SessionStore";
import Clock from "../io/Clock";
import Serializer from "../operations/Serializer";
import IncrementCounter from "../operations/IncrementCounter";
import { download, saveWithSerialize, R, findById } from "../common";
import {
    IApp,
    IAppData,
    IAppActivities,
    IDataStore,
    ISelectTaskActivity,
    IEditTaskTitleActivity,
    IClock,
    IIdProvider,
    ILabelList,
    ITaskList,
    IAppActivitiesSettings,
    IDashboard,
    IAppRuntimeSettings,
    INotesList
} from "../interfaces";
import AppRuntimeSettings from "./AppRuntimeSettings";
import mainView from "../views/MainView";


export default class App implements IApp {

    readonly data: IAppData;
    readonly activity: IAppActivities;
    readonly settings: IAppRuntimeSettings;

    readonly localStore: IDataStore = new SessionStore();
    readonly clock: IClock = new Clock();
    readonly idCounter: IIdProvider<number> = new IncrementCounter();

    constructor(el: Element) {

        this.data = new AppData(this);
        this.activity = new AppActivities(this);
        this.settings = new AppRuntimeSettings();

        this.data.load();
        this.activity.load();

        el.appendChild(mainView(this));
    }


    generateLocalStorageDownload(): void {
        const data = {
            labels: this.localStore.load("labels"),
            tasks: this.localStore.load("tasks"),
            activities: this.localStore.load("activities")
        };
        download("export.json", JSON.stringify(data));
    }


    importLocalStorageDownload(): void {
    }
}


export class AppData implements IAppData {
    tasks!: ITaskList;
    labels!: ILabelList;
    notes!: INotesList;

    constructor(private readonly app: IApp) {}

    init(): void {
        this.labels = R.array();
        this.tasks = R.array();
        this.notes = R.array();
    }

    load(): void {
        const savedLabels = new SessionStore().loadOrUndefined("labels");
        this.labels = savedLabels === undefined
            ? R.array()
            : new Serializer(this.app).fromPlainObject<ILabelList>(savedLabels, "LabelList");

        const savedTasks = new SessionStore().loadOrUndefined("tasks");
        this.tasks = savedTasks === undefined
            ? R.array()
            : new Serializer(this.app).fromPlainObject<ITaskList>(savedTasks, "TaskList");

        R.compute(() => {
            const labels = this.labels();
            saveWithSerialize(this.app, "labels", labels);
        });

        R.compute(() => {
            const tasks = this.tasks();
            saveWithSerialize(this.app, "tasks", tasks);
        });
    }
}


export class AppActivities implements IAppActivities {

    private readonly app: IApp;
    readonly dashboard: IDashboard;
    readonly selectTask: ISelectTaskActivity;
    readonly editTaskTitle: IEditTaskTitleActivity;

    constructor(app: IApp) {
        this.app = app;
        this.dashboard = new Dashboard(app, []);
        this.selectTask = new SelectTaskActivity(app);
        this.editTaskTitle = new EditTaskTitleActivity(app);
    }

    init(): void {
        this.dashboard.unshift(new TaskListActivity(this.app));
    }

    load(): void {
        const s = this.app.localStore.loadOrUndefined<IAppActivitiesSettings>("activities");
        if (s) {
            for (let tl of s.taskLists) {
                const tla = new TaskListActivity(this.app);
                tla.searchTaskListActivity.query.text(tl.taskQueryText);
                tla.addTaskActivity.newTitle(tl.newTaskTitle);
                this.dashboard.unshift(tla);
            }
            if (s.selectedTask) {
                const t = findById(this.app.data.tasks, s.selectedTask);
                this.selectTask.selectedTask = t;
            }
        }
        if (this.dashboard.items().length === 0)
            this.dashboard.unshift(new TaskListActivity(this.app));

        R.compute(() => this.save());
    }


    private save(): void {
        const st = this.selectTask.selectedTask;
        const s: IAppActivitiesSettings = {
            taskLists: this.dashboard.items().map(tl => ({
                taskQueryText: tl.searchTaskListActivity.query.text(),
                newTaskTitle: tl.addTaskActivity.newTitle()
            })),
            selectedTask: st ? st.id : undefined
        };
        this.app.localStore.save("activities", s);
    }
}