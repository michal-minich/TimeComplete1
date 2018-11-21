import TaskListActivity from "./TaskListActivity";
import AssociateLabelWithTaskActivity from "./AssociateLabelWithTaskActivity";
import SelectTaskActivity from "./SelectTaskActivity";
import EditLabelActivity from "./EditLabelActivity";
import EditTaskTitleActivity from "./EditTaskTitleActivity";
import LabelsPopupActivity from "./LabelsPopupActivity";
import ChangeTaskCompletionActivity from "./ChangeTaskCompletionActivity";
import TaskListGroup from "./TaskListGroup";
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
    ITaskListActivity,
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
    IAppRuntimeSettings,
    ILabel,
    ITask,
    ValueSignal,
    INotesList
} from "../interfaces";
import AppRuntimeSettings from "./AppRuntimeSettings";


export default class App implements IApp {

    readonly data: IAppData;
    readonly activity: IAppActivities;
    readonly settings: IAppRuntimeSettings;

    readonly localStore: IDataStore = new SessionStore();
    readonly clock: IClock = new Clock();
    readonly idCounter: IIdProvider<number> = new IncrementCounter();

    constructor() {

        this.data = new AppData(this);
        this.activity = new AppActivities(this);
        this.settings = new AppRuntimeSettings();

        this.data.load();
        this.activity.load();
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
    readonly taskLists: ITaskListGroup;

    selectedTaskList!: ValueSignal<ITaskListActivity>;
    readonly associateLabelWithTask: IAssociateLabelWithTaskActivity;
    readonly selectTask: ISelectTaskActivity;
    readonly editTaskTitle: IEditTaskTitleActivity;
    readonly changeTaskCompletion: IChangeTaskCompletionActivity;
    readonly editLabel: IEditLabelActivity;
    readonly labelsPopup: ILabelsPopupActivity;

    constructor(app: IApp) {
        this.app = app;
        this.taskLists = new TaskListGroup(app, []);
        this.associateLabelWithTask = new AssociateLabelWithTaskActivity(app);
        this.selectTask = new SelectTaskActivity(app);
        this.editTaskTitle = new EditTaskTitleActivity(app);
        this.changeTaskCompletion = new ChangeTaskCompletionActivity(app);
        this.editLabel = new EditLabelActivity(app);
        this.labelsPopup = new LabelsPopupActivity(app);
    }

    init(): void {
        this.taskLists.add(new TaskListActivity(this.app));
        this.selectedTaskList = R.data(this.taskLists.items()[0]);
    }

    load(): void {
        const s = this.app.localStore.loadOrUndefined<IAppActivitiesSettings>("activities");
        if (s) {
            for (let tl of s.taskLists) {
                const tla = new TaskListActivity(this.app);
                tla.searchTaskListActivity.query.text(tl.taskQueryText);
                tla.addTaskActivity.newTitle(tl.newTaskTitle);
                this.taskLists.add(tla);
            }
            if (s.selectedTask) {
                const t = findById(this.app.data.tasks, s.selectedTask);
                this.selectTask.selectedTask = t;
            }
        }
        if (this.taskLists.items().length === 0)
            this.taskLists.add(new TaskListActivity(this.app));
        this.selectedTaskList = R.data(this.taskLists.items()[0]);

        R.compute(() => this.save());
    }


    private save(): void {
        const st = this.selectTask.selectedTask;
        const s: IAppActivitiesSettings = {
            taskLists: this.taskLists.items().map(tl => ({
                taskQueryText: tl.searchTaskListActivity.query.text(),
                newTaskTitle: tl.addTaskActivity.newTitle()
            })),
            selectedTask: st ? st.id : undefined
        };
        this.app.localStore.save("activities", s);
    }
}