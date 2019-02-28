import {
        IData,
        ITask,
        WritableArraySignal,
        ILabel,
        INote,
        IDataFields,
        IApp,
        ITab,
        IDashboard,
    } from
    "../interfaces";


export default class Data implements IData {


    tasks!: WritableArraySignal<ITask>;
    labels!: WritableArraySignal<ILabel>;
    notes!: WritableArraySignal<INote>;
    tabs!: WritableArraySignal<ITab>;
    fields!: IDataFields;


    constructor(private readonly app: IApp) {
    }


    get dashboard(): IDashboard {
        return this.tabs()[this.fields.selectedTabIndex].content as IDashboard;
    }


    private _selectedTask : ITask | undefined;
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
        this.tasks.unshift(t);
        this.app.sync.pushTaskCreate(t);
    }


    taskDelete(t: ITask): void {
        this.tasks.remove(t);
        this.app.sync.pushDelete(t);
    }


    labelAdd(l: ILabel): void {
        this.labels.unshift(l);
        this.app.sync.pushLabelCreate(l);
    }


    labelDelete(l: ILabel): void {
        this.labels.remove(l);
        this.app.sync.pushDelete(l);
    }


    noteAdd(n: INote): void {
        this.notes.unshift(n);
        this.app.sync.pushNoteCreate(n);
    }


    noteDelete(n: INote): void {
        this.notes.remove(n);
        this.app.sync.pushDelete(n);
    }


    tabAdd(t: ITab): void {
        this.tabs.push(t);
        this.app.sync.pushTabCreate(t);
    }


    tabDelete(t: ITab): void {
        this.tabs.remove(t);
        this.app.sync.pushDelete(t);
    }
}