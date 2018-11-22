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

export interface ILabel extends IDomainObject {
    name: string;
    readonly style: IColorStyle;
    //readonly associatedLabels: WritableArraySignal<ILabel>;
}

export interface IColorStyle {
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

export interface INote extends IDomainObject {
    text: string;
    readonly associatedLabels: WritableArraySignal<ILabel>;
    readonly labelsFromText: ArraySignal<ILabel>;
    readonly allLabels: ArraySignal<ILabel>;
}


// Controllers ==============================================================


export interface IApp {
    readonly data: IData;

    readonly localStore: IDataStore;
    readonly clock: IClock;
    readonly idCounter: IIdProvider<number>;

    generateLocalStorageDownload(): void;
    importLocalStorageDownload(): void;

    readonly dashboard: IDashboard;

    init(): void;
    load(): void;
}

export interface IData {
    readonly tasks: WritableArraySignal<ITask>;
    readonly labels: WritableArraySignal<ILabel>;
    readonly notes: WritableArraySignal<INote>;
    readonly tabs: WritableArraySignal<ITabPage>;
    init(): void;
    load(): void;
    readonly settings: ISettings;
    selectedTask: ITask | undefined;
}

export interface ISettings {
    readonly labelPrefix: string;
}

export interface IAppActivitiesSettings {
    taskLists: Array<{
        taskQueryText: string | undefined;
        newTaskTitle: string | undefined;
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
    readonly estimatedHeight: number;
}

export interface ITasksDashBoard extends IDashboard {
    readonly filter: IQueryMatcher;
    displayColumnsCount: number;
}

export interface ITasksDashItem extends IDashItem {
    readonly newTitle: ValueSignal<string>;
    query: IQueryMatcher;
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
    readonly style: IColorStyle;
    close(): void;
    content: any;
}

export interface IToolbarActivity {
    showLabelsPopup(): void;
    showTasksPopup(): void;
    showNotesPopup(): void;
    showSearchPopup(): void;

    addTaskListView(): void;
    addNote(): void;
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