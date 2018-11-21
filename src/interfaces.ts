import { DataSignal } from "s-js";
import { SArray, SDataArray } from "s-array";


// General ==================================================================


export type Indexer<T> = { [key: string]: T };

export type JsonValueType =
    string | number | boolean | object | string[] | number[] | boolean[] | object[];

export function isValueSignal(v: any): v is ValueSignal<any> {
    return typeof v === "function" && (v as any).name === "data";
}

export function isArraySignal(v: NonNullable<object>): v is WritableArraySignal<any> {
    return typeof (v as any).mapS === "function";
}

export type ArraySignal<T> = SArray<T>;

export type WritableArraySignal<T> = SDataArray<T>;

export type ValueSignal<T> = DataSignal<T>;


// Data =====================================================================


export interface IColor {
    readonly value: string;
}

export interface IDateTime {
    readonly value: string;
}

export interface IDomainObject {
    readonly id: number;
    readonly createdOn: IDateTime;
}

export function isDomainObject(v: NonNullable<object>): v is IDomainObject {
    return typeof (v as any).id === "number" && typeof (v as any).createdOn.value === "string";
}

export interface IList<T> extends ArraySignal<T> {
}

export interface IWritableList<T> extends IList<T> {
    push(label: T): void;
    remove(label: T): void;
}

export interface ILabel extends IDomainObject {
    name: string;
    readonly style: ILabelStyle;
    //readonly associatedLabels: WritableArraySignal<ILabel>;
}

export interface ILabelStyle {
    backColor: IColor;
    readonly textColor: IColor;
    customTextColor: IColor;
    textColorInUse: LabelTextColor;
}

export enum LabelTextColor {
    BlackOrWhite,
    Inverted,
    Custom
}

export interface ITask extends IDomainObject {
    title: string;
    completedOn: IDateTime | undefined;
    readonly associatedLabels: WritableArraySignal<ILabel>;
}

export interface ITaskList extends IList<ITask> {
    unshift(task: ITask): void;
}

export interface ILabelList extends IList<ILabel> {
    unshift(label: ILabel): void;
    remove(label: ILabel): void;
}

export interface INotesList extends IList<INote> {
    unshift(label: ILabel): void;
    remove(label: ILabel): void;
}

export interface INote extends IDomainObject {
    text: string;
    readonly associatedLabels: WritableArraySignal<ILabel>;
    readonly labelsFromText: ArraySignal<ILabel>;
    readonly allLabels: ArraySignal<ILabel>;
}


// Controllers ==============================================================


export interface IApp {
    readonly data: IAppData;
    readonly activity: IAppActivities;
    readonly settings: IAppRuntimeSettings;

    readonly localStore: IDataStore;
    readonly clock: IClock;
    readonly idCounter: IIdProvider<number>;

    generateLocalStorageDownload(): void;
    importLocalStorageDownload(): void;
}

export interface IAppData {
    readonly tasks: ITaskList;
    readonly labels: ILabelList;
    init(): void;
    load(): void;
}

export interface IAppActivities {
    readonly dashboard: IDashboard;
    readonly selectTask: ISelectTaskActivity;
    readonly editTaskTitle: IEditTaskTitleActivity;

    init(): void;
    load(): void;
}

export interface IAppRuntimeSettings {
    readonly labelPrefix: string;
}

export interface IAppActivitiesSettings {
    taskLists: Array<{
        taskQueryText: string;
        newTaskTitle: string;
    }>;
    selectedTask?: number;
}

export interface IDashboard {
    readonly items: ArraySignal<IDashItem>;
    unshift(di: IDashItem): void;
    remove(di: IDashItem): void;
    readonly selected: ValueSignal<IDashItem | undefined>;
}

export interface IDashItem {
    readonly addTaskActivity: IAddTaskActivity;
    readonly searchTaskListActivity: ISearchTaskListActivity;
    readonly estimatedHeight: number;
}

export interface IActivityController {
    //perform, commit, rollback, reset
}


export interface ISelectTaskActivity extends IActivityController {
    selectedTask: ITask | undefined;
}

export interface IAddTaskActivity extends IActivityController {
    newTitle: ValueSignal<string>;
    keyUp(e: KeyboardEvent): void;
    confirm(): void;
    cancel(): void;
}

export interface IEditTaskTitleActivity extends IActivityController {
    begin(t: ITask, titleTd: HTMLTableDataCellElement): void;
    newName: ValueSignal<string>;
    keyUp(e: KeyboardEvent): void;
    confirm(): void;
    cancel(): void;
}

export interface ISearchTaskListActivity extends IActivityController {
    begin(): void;
    addOrRemoveLabelFromQuery(l: ILabel): void;
    keyUp(e: KeyboardEvent): void;
    query: IQueryMatcher;
    rollback(): void;
    //searchedTasks(taskQuery: string): SArray<ITask>;
}

export interface ITabBarActivity extends IWritableList<ITabPage> {
}

export interface IQueryElement {
    makeString(): string;
}

export interface IQueryMatcher {
    readonly text: ValueSignal<string>;
    generalSearchMatches(queryText: string): boolean;
    resultTasks(): ITask[];
    matches(obj: IDomainObject): boolean;
    taskMatches(task: ITask): boolean;
    labelMatches(label: ILabel): boolean;
    readonly labels: ArraySignal<ILabel>;
    includeLabel(label: ILabel): void;
    excludeLabel(label: ILabel): void;
    readonly firstLabelColor: string | undefined;
}

export interface ITabPage {
    title: string;
    readonly search: IQueryMatcher;
    readonly filter: IQueryMatcher;
    displayColumnsCount: number;
    close(): void;
}

export interface IToolbarActivity {
    showLabelsPopup(): void;
    showTasksPopup(): void;
    showSearchPopup(): void;
    addTaskListView(): void;
}


export interface IPopUpMenu extends IWindow {
    showAt(content: HTMLElement, e: MouseEvent): void;
}


export interface IWindow {
    showBelow(content: HTMLElement, el: HTMLElement): void;
    hide(): void;
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


export interface IReadonlyValueSignal<T> {
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