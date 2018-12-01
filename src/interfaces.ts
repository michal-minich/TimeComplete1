import { DataSignal } from "s-js";
import { SArray, SDataArray } from "s-array";


// General ==================================================================


export type Indexer<T> = { [key: string]: T };

export type JsonValueType =
    string | number | boolean | object | string[] | number[] | boolean[] | object[];

export type ArraySignal<T> = SArray<T>;

export type WritableArraySignal<T> = SDataArray<T>;

export type ValueSignal<T> = DataSignal<T>;

export interface IReadonlyValueSignal<T> {
    (): T;
}


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

export interface ILabel extends IDomainObject {
    name: string;
    readonly style: IColorStyle;
    //readonly associatedLabels: WritableArraySignal<ILabel>;
}

export interface IColorStyle {
    backColor: IColor;
    readonly textColor: IColor;
    customTextColor: IColor;
    textColorInUse: TextColorUsage;
}

export const enum TextColorUsage {
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
    textSignal: ValueSignal<string>;
    readonly associatedLabels: WritableArraySignal<ILabel>;
    readonly labelsFromText: ArraySignal<ILabel>;
    readonly allLabels: ArraySignal<ILabel>;
}

export interface ITab {
    title: string;
    readonly style: IColorStyle;
    content: any;
}

export interface IDashboard {
    readonly items: ArraySignal<IDashItem>;
    unshift(di: IDashItem): void;
    remove(di: IDashItem): void;
    readonly selected: ValueSignal<IDashItem | undefined>;
}

export interface ITasksDashItem extends IDashItem {
    readonly newTitle: ValueSignal<string>;
    query: IQuery;
}

export interface INoteDashItem extends IDashItem {
    readonly note: INote;
    readonly width: number;
    readonly height: number;
}

export interface IQuery {
    readonly text: ValueSignal<string>;
    readonly matcher: IQueryMatcher;
}

export interface ISettings {
    readonly labelPrefix: ValueSignal<string>;
    readonly negationOperator: ValueSignal<string>;
    readonly selectedTabIndex: ValueSignal<number>;
    readonly dashboardColumnsCount: ValueSignal<number>;
    readonly lastId: ValueSignal<number>;
}


// Controllers ==============================================================


export interface IApp {
    readonly localStore: IDataStore;
    readonly clock: IClock;
    readonly idCounter: IIdProvider<number>;
    readonly dashboard: IDashboard;
    readonly data: IData;
}

export interface IData {
    readonly tasks: WritableArraySignal<ITask>;
    readonly labels: WritableArraySignal<ILabel>;
    readonly notes: WritableArraySignal<INote>;
    readonly tabs: WritableArraySignal<ITab>;
    readonly settings: ISettings;
    load(): void;
    selectedTask: ITask | undefined;
    generateLocalStorageDownload(): void;
    importLocalStorageDownload(): void;
}

export interface IDashItem {
    readonly estimatedHeight: number;
}

export interface ITasksDashBoard extends IDashboard {
    readonly filter: IQuery;
    displayColumnsCount: number;
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


export interface IIdProvider<T> {
    getNext(): T;
    readonly current: T;
}

export interface IQueryMatcher {
    update(query: IQuery): void;
    generalSearchMatches(queryText: string): boolean;
    resultTasks(): ITask[];
    matches(obj: IDomainObject): boolean;
    taskMatches(task: ITask): boolean;
    labelMatches(label: ILabel): boolean;
    readonly labels: ArraySignal<ILabel>;
    includeLabel(label: ILabel): void;
    excludeLabel(label: ILabel): void;
    readonly firstLabelColor: string | undefined;
    readonly existingLabels: ILabel[];
}

export interface IQueryElement {
    makeString(): string;
}

export interface ISerializer {
    serialize<T extends object>(value: T): string;
    deserialize<T extends object>(value: string, type: string): T;

    fromPlainObject<T extends object>(value: object, type: string): T;
    toPlainObject<T extends object>(value: T): object;
    fromArray<T extends object>(arr: object[], itemType: string): WritableArraySignal<T>;
    fromRefArray<T extends IDomainObject>(
        ids: number[],
        source: ArraySignal<T>): WritableArraySignal<T>;
}


// Views ====================================================================