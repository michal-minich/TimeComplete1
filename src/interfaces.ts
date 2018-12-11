import { DataSignal } from "s-js";
import { SArray, SDataArray } from "s-array";


// General ====================================================================

export type SimpleType = string | number | boolean;

export type Indexer<T> = { [key: string]: T };

export type JsonValueType =
    string | number | boolean | object | string[] | number[] | boolean[] | object[];

export type ArraySignal<T> = SArray<T>;

export type WritableArraySignal<T> = SDataArray<T>;

export type ValueSignal<T> = DataSignal<T>;

export interface IReadonlyValueSignal<T> {
    (): T;
}


// Data =======================================================================


export type DomainObjectType = "label" | "note" | "tab" | "task";

export interface IColor {
    readonly value: string;
}

export interface IDateTime {
    readonly value: string;
}

export interface IDomainObject {
    readonly type: DomainObjectType;
    readonly id: number;
    readonly createdOn: IDateTime;
}

export interface ILabel extends IDomainObject {
    name: string;
    readonly style: IColorStyle;
    //readonly associatedLabels: WritableArraySignal<ILabel>;
}

export interface IColorStyle {
    ownerId: number | undefined;
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
    completedOnSignal: ValueSignal<IDateTime | undefined>;
    readonly associatedLabels: ArraySignal<ILabel>;
    addLabel(l: ILabel): void;
    removeLabel(l: ILabel): void;
}

export interface INote extends IDomainObject {
    text: string;
    textSignal: ValueSignal<string>;
    title: string;
    titleSignal: ValueSignal<string>;
    readonly associatedLabels: WritableArraySignal<ILabel>;
    readonly labelsFromText: ArraySignal<ILabel>;
    readonly allLabels: ArraySignal<ILabel>;
}

export interface ITab extends IDomainObject {
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
    labelPrefix: string;
    negationOperator: string;
    selectedTabIndex: number;
    dashboardColumnsCount: number;
    lastId: number;
}


// Controllers ================================================================


export interface IApp {
    readonly localStore: IDataStore;
    readonly clock: IClock;
    readonly data: IData;
}

export interface IData {
    readonly idCounter: IIdProvider<number>;
    readonly sync: ISyncLog;
    readonly dashboard: IDashboard;
    readonly tasks: ArraySignal<ITask>;
    readonly labels: ArraySignal<ILabel>;
    readonly notes: ArraySignal<INote>;
    readonly tabs: ArraySignal<ITab>;
    readonly settings: ISettings;
    load(): void;
    selectedTask: ITask | undefined;
    generateLocalStorageDownload(): void;
    importLocalStorageDownload(): void;

    taskAdd(t: ITask): void;
    taskDelete(t: ITask): void;

    labelAdd(l: ILabel): void;
    labelDelete(l: ILabel): void;

    noteAdd(n: INote): void;
    noteDelete(n: INote): void;

    tabAdd(t: ITab): void;
    tabDelete(t: ITab): void;
}

export interface IDashItem {
    readonly estimatedHeight: number;
}

export interface ITasksDashBoard extends IDashboard {
    readonly filter: IQuery;
    displayColumnsCount: number;
}


// Sync =======================================================================


export interface IChange {
    what: WhatEvent;
    data: any;
}


export interface ISyncEvent extends IChange {
    eventId: number;
    on: string;
    what: WhatEvent;
    data: any;
}

export type WhatEvent =

    // domain objects
    | "object.create"
    | "object.delete"

    // label
    | "label.name"

    //task 
    | "task.title"
    | "task.completedOn"
    | "task.associatedLabels.add"
    | "task.associatedLabels.remove"

    //note 
    | "note.text"
    | "note.title"

    //tab 
    | "tab.title"
    | "tab.content"

    // color style
    | "style.backColor"
    | "style.customTextColor"
    | "style.textColorInUse"

    //settings 
    | "settings.labelPrefix"
    | "settings.negationOperator"
    | "settings.selectedTabIndex"
    | "settings.dashboardColumnsCount"
    | "settings.lastId";


export interface IDomainObjectCreateEvent {
    type: DomainObjectType;
    id: number;
    createdOn: string;
}

export interface ILabelCreateEvent extends IDomainObjectCreateEvent {
    name: string;
    style: IColorStyleChangeEvent;
}

export interface ITaskCreateEvent extends IDomainObjectCreateEvent {
    title: string;
}

export interface INoteCreateEvent extends IDomainObjectCreateEvent {
    text: string;
}

export interface ITabCreateEvent extends IDomainObjectCreateEvent {
    title: string;
    style: IColorStyleChangeEvent;
}

export interface IFieldChangeEvent {
    id: number;
    value?: SimpleType;
}

export interface IDeleteEvent {
    id: number;
}

export interface IColorStyleChangeEvent {
    backColor: string;
    customTextColor: string;
    textColorInUse: TextColorUsage;
}

export interface ISyncLog {
    pushField<T extends SimpleType>(we: WhatEvent, o: IDomainObject, value?: T): void;
    pushField2<T extends SimpleType>(we: WhatEvent, id: number, value?: T): void;
    pushDelete(o: IDomainObject): void;
    pushLabelCreate(l: ILabel): void;
    pushTaskCreate(t: ITask): void;
    pushNoteCreate(n: INote): void;
    pushTabCreate(t: ITab): void;
}


// IO =========================================================================


export interface IClock {
    now(): IDateTime;
}

export interface IDataStore {
    save<T extends object>(key: string, value: T): void;
    load<T extends object>(key: string): T;
    loadOrUndefined<T extends object>(key: string): T | undefined;
}


// Operations =================================================================


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


// Views ======================================================================