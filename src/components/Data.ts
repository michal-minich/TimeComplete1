import {
        IData,
        ITask,
        ArraySignal,
        ILabel,
        IDataFields,
        IApp,
        ITab,
        IDashboard,
        WritableArraySignal,
    } from
    "../interfaces";


export default class Data implements IData {


    tasks!: ArraySignal<ITask>;
    labels!: ArraySignal<ILabel>;
    tabs!: ArraySignal<ITab>;
    fields!: IDataFields;


    constructor(private readonly app: IApp) {
    }


    get dashboard(): IDashboard {
        return this.tabs()[this.fields.selectedTabIndex].content as IDashboard;
    }


    get selectedTab(): ITab {
        return this.tabs()[this.fields.selectedTabIndex];
    }


    private _selectedTask: ITask | undefined;

    get selectedTask(): ITask | undefined {
        return this._selectedTask;
    }


    set selectedTask(value: ITask | undefined) {
        this.fields.selectedTaskId = value ? value.id : 0;
        this._selectedTask = value;
    }


    getNextId(): number {
        return ++this.app.data.fields.lastId;
    }


    taskAdd(t: ITask): void {
        (this.tasks as WritableArraySignal<ITask>).unshift(t);
        this.app.sync.pushTaskCreate(t);
    }


    taskDelete(t: ITask): void {
        (this.tasks as WritableArraySignal<ITask>).remove(t);
        this.app.sync.pushDelete(t);
    }


    labelAdd(l: ILabel): void {
        (this.labels as WritableArraySignal<ILabel>).unshift(l);
        this.app.sync.pushLabelCreate(l);
    }


    labelDelete(l: ILabel): void {
        (this.labels as WritableArraySignal<ILabel>).remove(l);
        this.app.sync.pushDelete(l);
    }


    tabAdd(t: ITab): void {
        (this.tabs as WritableArraySignal<ITab>).push(t);
        this.app.sync.pushTabCreate(t);
    }


    tabDelete(t: ITab): void {
        (this.tabs as WritableArraySignal<ITab>).remove(t);
        this.app.sync.pushDelete(t);
    }
}