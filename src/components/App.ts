import TasksDashItem from "../data/TasksDashItem";
import Dashboard from "../data/Dashboard";
import SessionStore from "../io/SessionStore";
import Clock from "../io/Clock";
import IncrementCounter from "../operations/IncrementCounter";
import { download, R, findById } from "../common";
import {
    IApp,
    IData,
    IDataStore,
    IClock,
    IIdProvider,
    IAppActivitiesSettings,
    IDashboard,
} from "../interfaces";
import mainView from "../views/MainView";
import { Data } from "../data/Data";


export default class App implements IApp {

    readonly data: IData;
    readonly dashboard: IDashboard;

    readonly localStore: IDataStore = new SessionStore();
    readonly clock: IClock = new Clock();
    readonly idCounter: IIdProvider<number> = new IncrementCounter();


    constructor(el: Element) {

        this.data = new Data(this);
        this.dashboard = new Dashboard(this, []);

        this.data.load();
        this.load();

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


    init(): void {
        this.dashboard.unshift(new TasksDashItem(this));
    }


    load(): void {
        const s = this.localStore.loadOrUndefined<IAppActivitiesSettings>("activities");
        if (s) {
            for (const tl of s.taskLists) {
                if (tl.taskQueryText !== undefined) {
                    const tla = new TasksDashItem(this);
                    tla.query.text(tl.taskQueryText);
                    tla.newTitle(tl.newTaskTitle!);
                    this.dashboard.unshift(tla);
                }
            }
            if (s.selectedTask) {
                const t = findById(this.data.tasks, s.selectedTask);
                this.data.selectedTask = t;
            }
        }
        if (this.dashboard.items().length === 0)
            this.dashboard.unshift(new TasksDashItem(this));

        R.compute(() => this.save());
    }


    private save(): void {
        const st = this.data.selectedTask;
        const s: IAppActivitiesSettings = {
            taskLists: this.dashboard.items().map(di => ({
                taskQueryText: di instanceof TasksDashItem ? di.query.text() : undefined,
                newTaskTitle: di instanceof TasksDashItem ? di.newTitle() : undefined
            })),
            selectedTask: st ? st.id : undefined
        };
        this.localStore.save("activities", s);
    }
}