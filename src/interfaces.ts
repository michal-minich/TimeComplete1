import { DataSignal } from "s-js";
import { SArray } from "s-array";


// General ==================================================================


export type Indexer<T> = { [key: string]: T };

export type JsonValueType =
    string | number | boolean | object | string[] | number[] | boolean[] | object[];

export function isDataSignal(v: any): v is DataSignal<any> {
    return typeof v === "function" && (v as any).name === "data";
}

export function isSArray(v: any): v is SArray<any> {
    return typeof v === "function" && (v as any).name === "array";
}


// Data =====================================================================


export interface IColor {
    value: string;
}

export interface IDateTime {
    value: string;
}

export interface IDomainObject {
    readonly id: number;
    readonly createdOn: IDateTime;
}

export function isDomainObject(v: NonNullable<object>): v is IDomainObject {
    return typeof (v as any).id === "number" && typeof (v as any).createdOn.value === "string";
}

export interface IList<T> {
    readonly items: SArray<T>;
}

export interface IDomainObjectList<T extends IDomainObject> extends IList<T> {
    byId(id: number): T;
}

export function isDomainObjectList(v: NonNullable<object>): v is IDomainObjectList<any> {
    return typeof (v as any).items === "function" && typeof (v as any).byId === "function";
}

export interface ILabel extends IDomainObject {
    name: DataSignal<string>;
    color: DataSignal<IColor>;
    parent?: DataSignal<ILabel>;
}

export interface ITask extends IDomainObject {
    title: DataSignal<string>;
    completedOn: IDateTime | undefined;
    readonly associatedLabels: IAssociatedLabels;
}

export interface IAssociatedLabels extends IDomainObjectList<ILabel> {
    add(label: ILabel): void;
    remove(label: ILabel): void;
}

export interface ITaskList extends IDomainObjectList<ITask> {
    readonly items: SArray<ITask>;
    addTask(task: ITask): void;
}

export interface ILabelList extends IDomainObjectList<ILabel> {
    readonly items: SArray<ILabel>;
    addLabel(label: ILabel): void;
    removeLabel(label: ILabel): void;
}


// Controllers ==============================================================


export interface IApp {
    readonly data: IAppData;
    readonly activity: IAppActivities;

    readonly sessionStore: IDataStore;
    readonly clock: IClock;
    readonly idCounter: IIdProvider<number>;
}


export interface IAppData {
    readonly tasks: ITaskList;
    readonly labels: ILabelList;
    load(): void;
}


export interface IAppActivities {
    readonly taskLists: SArray<ITaskListActivity>;

    readonly selectedTaskList: DataSignal<ITaskListActivity>;
    readonly addLabel: IAddLabelActivity;
    readonly associateLabelWithTask: IAssociateLabelWithTaskActivity;
    readonly selectTask: ISelectTaskActivity;
    readonly editTaskTitle: IEditTaskTitleActivity;
    readonly changeTaskCompletion: IChangeTaskCompletionActivity;
}


export interface ITaskListActivity {
    readonly addTaskActivity: IAddTaskActivity;
    readonly searchTaskListActivity: ISearchTaskListActivity;
}

export interface IActivityController {
    //perform, commit, rollback, reset
}


export interface ISelectTaskActivity extends IActivityController {
    selectedTask: IReadonlyDataSignal<ITask | undefined>;
    select(t: ITask): void;
    unselect(): void;
}

export interface IAddTaskActivity extends IActivityController {
    newName: DataSignal<string>;
    keyUp(e: KeyboardEvent): void;
    commit(): void;
    rollback(): void;
}

export interface IAddLabelActivity extends IActivityController {
    newName: DataSignal<string>;
    keyUp(e: KeyboardEvent): any;
    commit(): void;
    rollback(): void;
}

export interface IEditTaskTitleActivity extends IActivityController {
    begin(t: ITask, titleTd: HTMLTableDataCellElement): void;
    newTitle: DataSignal<string>;
    keyUp(e: KeyboardEvent): void;
    commit(): void;
    rollback(): void;
}

export interface IChangeTaskCompletionActivity extends IActivityController {
    perform(task: ITask, isDone: HTMLInputElement): any;
}

export interface IAssociateLabelWithTaskActivity extends IActivityController {
    changeAssociation(label: ILabel): void;
}

export interface ISearchTaskListActivity extends IActivityController {
    begin(): void;
    addOrRemoveLabelFromQuery(l: ILabel): void;
    keyUp(e: KeyboardEvent): void;
    resultTasks(): SArray<ITask>;
    addSearch(): void;
    taskQuery: DataSignal<string>;
    rollback(): void;
    clear(): void;
    searchedTasks(taskQuery: string): SArray<ITask>;
}


// IO =======================================================================


export interface IClock {
    now(): IDateTime;
}

export interface IDataStore {
    save<T extends object>(key: string, value: T): void;
    load<T extends object>(key: string): T;
    loadOrUndefined<T extends object>(key: string): T | undefined;
}


// Operations ===============================================================


export interface IReadonlyDataSignal<T> {
    (): T;
}


export interface IIdProvider<T> {
    getNext(): T;
    readonly current: T;
}


export interface ISerializer {
    serialize<T extends object>(value: T): string;
    deserialize<T extends object>(value: string, type: string): T;
}