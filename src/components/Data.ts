import { R, download } from "../common";
import LocalStore from "../io/LocalStore"
import Serializer from "../operations/Serializer"
import {
        IData,
        ITask,
        WritableArraySignal,
        ILabel,
        INote,
        ISettings,
        IApp,
        ITab,
        ISyncLog,
        IDashboard,
        IDataStore
    } from
    "../interfaces";
import Settings from "../data/Settings";
import { addTab } from "../data/domain/Tab";
import { SyncLog } from "../components/SyncLog";


export default class Data implements IData {

    readonly localStore: IDataStore;
    readonly sync: ISyncLog;
    tasks!: WritableArraySignal<ITask>;
    labels!: WritableArraySignal<ILabel>;
    notes!: WritableArraySignal<INote>;
    tabs!: WritableArraySignal<ITab>;
    settings!: ISettings;
    selectedTask: ITask | undefined;


    constructor(private readonly app: IApp) {
        this.localStore = new LocalStore();
        this.sync = new SyncLog(app);
    }


    load() {

        try {

            this.settings = this.loadObj<ISettings>("settings", "Settings", () => new Settings());
            this.labels = this.loadArray<ILabel>("labels", "Label");
            this.tasks = this.loadArray<ITask>("tasks", "Task");
            this.notes = this.loadArray<INote>("notes", "Note");
            this.tabs = this.loadArray<ITab>("tabs", "Tab");

        } catch (ex) {

            this.settings = new Settings();
            this.labels = R.array();
            this.tasks = R.array();
            this.notes = R.array();
            this.tabs = R.array();

            console.log(ex);
            return;

        } finally {

            if (this.tabs().length === 0)
                addTab(this.app);
        }

        this.setupStoreSave();
    }


    get dashboard(): IDashboard {
        return this.tabs()[this.settings.selectedTabIndex].content as IDashboard;
    }

    
    getNextId(): number {
        return ++this.app.data.settings.lastId;
    }


    private setupStoreSave() {

        R.onAny(() => {
            const labels = this.labels();
            this.saveWithSerialize(this.app, "labels", labels);
        });

        R.onAny(() => {
            const tasks = this.tasks();
            this.saveWithSerialize(this.app, "tasks", tasks);
        });

        R.onAny(() => {
            const notes = this.notes();
            this.saveWithSerialize(this.app, "notes", notes);
        });

        R.onAny(() => {
            const tabs = this.tabs();
            this.saveWithSerialize(this.app, "tabs", tabs);
        });

        R.onAny(() => {
            const sett = this.settings;
            this.saveWithSerialize(this.app, "settings", sett);
        });
    }


    private loadArray<T extends object>(key: string, type: string): WritableArraySignal<T> {
        const arr = new LocalStore().loadOrUndefined(key);
        return arr === undefined
            ? R.array()
            : new Serializer(this.app)
            .fromArray<T>(arr as object[], type);
    }


    private loadObj<T extends object>(key: string, type: string, init: () => T): T {
        const o = new LocalStore().loadOrUndefined(key);
        return o === undefined
            ? init()
            : new Serializer(this.app).fromPlainObject<T>(o, type);
    }


    private saveWithSerialize<T extends object>(
        app: IApp,
        key: string,
        value: T): void {

        const sv = new Serializer(app).toPlainObject(value);
        this.localStore.save(key, sv);
    }


    generateLocalStorageDownload(): void {
        const s = this.localStore;
        const data = {
            labels: s.load("labels"),
            tasks: s.load("tasks"),
            notes: s.load("notes"),
            tabs: s.load("tabs"),
            settings: s.load("settings")
        };
        download("export.json", JSON.stringify(data));
    }


    private handleFiles(input: HTMLInputElement) {
        const file: any = input.files![0];
        const fr = new FileReader();
        fr.addEventListener("load",
            () => {
                const json = fr.result as string;
                const obj = JSON.parse(json) as any;
                new LocalStore().save("labels", obj.labels);
                new LocalStore().save("tasks", obj.tasks);
                new LocalStore().save("notes", obj.notes);
                new LocalStore().save("tabs", obj.tabs);
                new LocalStore().save("settings", obj.settings);
                console.log(obj);
            });
        fr.readAsText(file);
    }


    importLocalStorageDownload(): void {
        const input = document.createElement("input")!;
        input.type = "file";
        input.addEventListener("change", () => this.handleFiles(input), false);
        input.click();
    }


    taskAdd(t: ITask): void {
        this.tasks.unshift(t);
        this.sync.pushTaskCreate(t);
    }


    taskDelete(t: ITask): void {
        this.tasks.remove(t);
        this.sync.pushDelete(t);
    }


    labelAdd(l: ILabel): void {
        this.labels.unshift(l);
        this.sync.pushLabelCreate(l);
    }


    labelDelete(l: ILabel): void {
        this.labels.remove(l);
        this.sync.pushDelete(l);
    }


    noteAdd(n: INote): void {
        this.notes.unshift(n);
        this.sync.pushNoteCreate(n);
    }


    noteDelete(n: INote): void {
        this.notes.remove(n);
        this.sync.pushDelete(n);
    }


    tabAdd(t: ITab): void {
        this.tabs.push(t);
        this.sync.pushTabCreate(t);
    }


    tabDelete(t: ITab): void {
        this.tabs.remove(t);
        this.sync.pushDelete(t);
    }
}