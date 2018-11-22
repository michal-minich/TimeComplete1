import { R, saveWithSerialize } from "../common";
import SessionStore from "../io/SessionStore"
import Serializer from "../operations/Serializer"
import { IData, ITask, WritableArraySignal, ILabel, INote, ISettings, IApp, ITabPage } from "../interfaces";
import Settings from "./Settings";

export class Data implements IData {

    tasks!: WritableArraySignal<ITask>;
    labels!: WritableArraySignal<ILabel>;
    notes!: WritableArraySignal<INote>;
    tabs!: WritableArraySignal<ITabPage>;

    readonly settings: ISettings;
    selectedTask: ITask | undefined;


    constructor(private readonly app: IApp) {
        this.settings = new Settings();
    }


    init(): void {
        this.labels = R.array();
        this.tasks = R.array();
        this.notes = R.array();
        this.tabs = R.array();
    }


    load(): void {
        const savedLabels = new SessionStore().loadOrUndefined("labels");
        this.labels = savedLabels === undefined
            ? R.array()
            : new Serializer(this.app).fromPlainObject<WritableArraySignal<ILabel>>(
                savedLabels,
                "LabelList");

        const savedTasks = new SessionStore().loadOrUndefined("tasks");
        this.tasks = savedTasks === undefined
            ? R.array()
            : new Serializer(this.app).fromPlainObject<WritableArraySignal<ITask>>(
                savedTasks,
                "TaskList");

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