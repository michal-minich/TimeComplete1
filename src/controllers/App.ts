import S, { DataSignal } from "s-js";
import TaskListActivity from "./TaskListActivity";
import AddLabelActivity from "./AddLabelActivity";
import AssociateLabelWithTaskActivity from "./AssociateLabelWithTaskActivity";
import SelectTaskActivity from "./SelectTaskActivity";
import EditLabelActivity from "./EditLabelActivity";
import EditTaskTitleActivity from "./EditTaskTitleActivity";
import LabelsPopupActivity from "./LabelsPopupActivity";
import ChangeTaskCompletionActivity from "./ChangeTaskCompletionActivity";
import TaskListGroup from "./TaskListGroup";
import TaskList from "../data/TaskList";
import LabelList from "../data/LabelList";
import { SessionStore } from "../io/SessionStore";
import Clock from "../io/Clock";
import Serializer from "../operations/Serializer";
import IncrementCounter from "../operations/IncrementCounter";
import { download, saveWithSerialize } from "../common";
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
    IEditLabelActivity,
    ILabelsPopupActivity,
    IAppRuntimeSettings
} from "../interfaces";
import AppRuntimeSettings from "./AppRuntimeSettings";


export default class App implements IApp {
    static instance: IApp;

    readonly data: IAppData;
    readonly activity: IAppActivities;
    readonly settings: IAppRuntimeSettings;

    readonly localStore: IDataStore = new SessionStore();
    readonly clock: IClock = new Clock();
    readonly idCounter: IIdProvider<number> = new IncrementCounter();

    constructor() {
        App.instance = this;

        this.data = new AppData();
        this.activity = new AppActivities(this);
        this.settings = new AppRuntimeSettings();

        this.data.load();
        this.activity.load();
    }


    generateLocalStorageDownload(): void {
        const data = {
            labels: App.instance.localStore.load("labels"),
            tasks: App.instance.localStore.load("tasks"),
            activities: App.instance.localStore.load("activities")
        };
        download("export.json", JSON.stringify(data));
    }


    importLocalStorageDownload(): void {
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
            saveWithSerialize("labels", this.labels.items());
        });

        S(() => {
            saveWithSerialize("tasks", this.tasks.items());
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
    readonly labelsPopup: ILabelsPopupActivity;

    constructor(app: IApp) {
        this.app = app;
        this.taskLists = new TaskListGroup(app, []);
        this.addLabel = new AddLabelActivity(app);
        this.associateLabelWithTask = new AssociateLabelWithTaskActivity(app);
        this.selectTask = new SelectTaskActivity(app);
        this.editTaskTitle = new EditTaskTitleActivity(app);
        this.changeTaskCompletion = new ChangeTaskCompletionActivity(app);
        this.editLabel = new EditLabelActivity(app);
        this.labelsPopup = new LabelsPopupActivity(app);
    }


    load(): void {
        const s = this.app.localStore.loadOrUndefined<IAppActivitiesSettings>("activities");
        if (s) {
            for (let tl of s.taskLists) {
                const tla = new TaskListActivity(this.app);
                tla.searchTaskListActivity.query.text = tl.taskQueryText;
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
                taskQueryText: tl.searchTaskListActivity.query.text,
                newTaskTitle: tl.addTaskActivity.newTitle()
            })),
            selectedTask: st ? st.id : undefined
        };
        this.app.localStore.save("activities", s);
    }
}