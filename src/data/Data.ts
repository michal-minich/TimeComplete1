import { R, download } from "../common";
import SessionStore from "../io/SessionStore"
import Serializer from "../operations/Serializer"
import {
        IData,
        ITask,
        WritableArraySignal,
        ILabel,
        INote,
        ISettings,
        IApp,
        ITab
    } from
    "../interfaces";
import Settings from "./Settings";
import { addTab } from "./Tab";


export default class Data implements IData {

    tasks!: WritableArraySignal<ITask>;
    labels!: WritableArraySignal<ILabel>;
    notes!: WritableArraySignal<INote>;
    tabs!: WritableArraySignal<ITab>;

    settings!: ISettings;
    selectedTask: ITask | undefined;


    constructor(private readonly app: IApp) {
    }


    load() {

        this.settings = this.loadObj<ISettings>("settings", "Settings", () => new Settings());
        this.labels = this.loadArray<ILabel>("labels", "Label");
        this.tasks = this.loadArray<ITask>("tasks", "Task");
        this.notes = this.loadArray<INote>("notes", "Note");
        this.tabs = this.loadArray<ITab>("tabs", "Tab");

        if (this.tabs().length === 0)
            addTab(this.app);

        R.compute(() => {
            const labels = this.labels();
            Data.saveWithSerialize(this.app, "labels", labels);
        });

        R.compute(() => {
            const tasks = this.tasks();
            Data.saveWithSerialize(this.app, "tasks", tasks);
        });

        R.compute(() => {
            const notes = this.notes();
            Data.saveWithSerialize(this.app, "notes", notes);
        });

        R.compute(() => {
            const tabs = this.tabs();
            Data.saveWithSerialize(this.app, "tabs", tabs);
        });

        R.compute(() => {
            const sett = this.settings;
            Data.saveWithSerialize(this.app, "settings", sett);
        });
    }


    loadArray<T extends object>(key: string, type: string): WritableArraySignal<T> {
        const arr = new SessionStore().loadOrUndefined(key);
        return arr === undefined
            ? R.array()
            : new Serializer(this.app)
            .fromArray<T>(arr as object[], type);
    }


    loadObj<T extends object>(key: string, type: string, init: () => T): T {
        const o = new SessionStore().loadOrUndefined(key);
        return o === undefined
            ? init()
            : new Serializer(this.app).fromPlainObject<T>(o, type);
    }


    static saveWithSerialize<T extends object>(
        app: IApp,
        key: string,
        value: T): void {

        const sv = new Serializer(app).toPlainObject(value);
        app.localStore.save(key, sv);
    }


    generateLocalStorageDownload(): void {
        const s = this.app.localStore;
        const data = {
            labels: s.load("labels"),
            tasks: s.load("tasks"),
            notes: s.load("notes"),
            tabs: s.load("tabs"),
            settings: s.load("settings")
        };
        download("export.json", JSON.stringify(data));
    }


    importLocalStorageDownload(): void {
    }
}