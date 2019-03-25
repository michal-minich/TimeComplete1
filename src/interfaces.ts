import { DataSignal } from "s-js";
import { SArray, SDataArray } from "s-array";


// General ====================================================================

export type SimpleType = string | number | boolean;

export type Indexer<T> = { [key: string]: T };

export type JsonValueType =
    | string
    | number
    | boolean
    | object
    | string[]
    | number[]
    | boolean[]
    | object[];

export type ArraySignal<T> = SArray<T>;

export type WritableArraySignal<T> = SDataArray<T>;

export type ValueSignal<T> = DataSignal<T>;

export interface IReadonlyValueSignal<T> {
    (): T;
}


// Data =======================================================================


export type DomainObjectType = "label" | "tab" | "task";

export interface IColor {
    readonly value: string;
}

export interface IDateTime {
    readonly value: number;
    toLocaleDateTimeString(): string;
}

export interface IHasAssociatedLabels {
    associatedLabels: ArraySignal<ILabel>;
}

export interface IDomainObject {
    readonly type: DomainObjectType;
    readonly id: number;
    version: number;
    readonly createdOn: IDateTime;
}

export interface ILabel extends IDomainObject {
    name: string;
    readonly style: IColorStyle;
    //readonly associatedLabels: WritableArraySignal<ILabel>;
}

export interface IColorStyle {
    owner: IDomainObject;
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

export interface ITask extends IDomainObject, IHasAssociatedLabels {
    title: string;
    text: string;
    completedOn: IDateTime | undefined;
    completedOnSignal: ValueSignal<IDateTime | undefined>;
    readonly associatedLabels: ArraySignal<ILabel>;
    addLabel(l: ILabel): void;
    removeLabel(l: ILabel): void;
    readonly labelsFromText: ArraySignal<ILabel>;
    readonly labelsFromUser: WritableArraySignal<ILabel>;

    textSignal: ValueSignal<string>;
    titleSignal: ValueSignal<string>;
}

export interface ITab extends IDomainObject {
    title: string;
    readonly style: IColorStyle | undefined;
    readonly customStyle: IColorStyle | undefined;
    content: any;
}

export interface ITasksDashItem extends IDashItem {
    readonly newTitle: ValueSignal<string>;
    readonly query: IQuery;
}

export interface ITaskDashItem extends IDashItem {
    readonly task: ITask;
    readonly width: number;
    readonly height: number;
}

export interface IQuery {
    readonly text: ValueSignal<string>;
    readonly matcher: IQueryMatcher;
}

export interface IDataFields {
    labelPrefix: string;
    negationOperator: string;
    selectedTabIndex: number;
    selectedDashItemIndex: number;
    selectedTaskId: number;
    lastId: number;
}

export interface IDashboard {
    readonly items: ArraySignal<IDashItem>;
    unshift(di: IDashItem): void;
    remove(di: IDashItem): void;
    readonly selected: ValueSignal<IDashItem | undefined>;
    readonly query: IQuery;
    columnsCount: number;
}

export interface IDashItem {
    readonly estimatedHeight: number;
    visible: boolean;
}


// Components ================================================================


export interface IApp {
    readonly clock: IClock;
    readonly serializer: ISerializer;
    readonly localStore: IDataStore;
    readonly sync: ISyncLog;
    readonly data: IData;
    readonly ui: IAppUc;
}

export interface IData {

    readonly tasks: ArraySignal<ITask>;
    readonly labels: ArraySignal<ILabel>;
    readonly tabs: ArraySignal<ITab>;
    readonly fields: IDataFields;

    readonly dashboard: IDashboard;
    selectedTask: ITask | undefined;
    getNextId(): number;

    taskAdd(t: ITask): void;
    taskDelete(t: ITask): void;

    labelAdd(l: ILabel): void;
    labelDelete(l: ILabel): void;

    tabAdd(t: ITab): void;
    tabDelete(t: ITab): void;
}


export interface ISyncLog {
    pushField<T extends SimpleType>(we: SyncChangeType, o: IDomainObject, value?: T): void;
    pushDelete(o: IDomainObject): void;
    pushLabelCreate(l: ILabel): void;
    pushTaskCreate(t: ITask): void;
    pushTabCreate(t: ITab): void;
}


// Sync =======================================================================


export interface ISyncEvent {
    eventId: number;
    on: number;
    type: SyncChangeType;
    data: IDomainObjectCreateEvent | IFieldChangeEvent | IDeleteEvent;
}

export type SyncChangeType =

    // domain objects
    | "object.create"
    | "object.delete"

    // label
    | "label.name"

    // task 
    | "task.title"
    | "task.text"
    | "task.completedOn"
    | "task.labelsFromUser.add"
    | "task.labelsFromUser.remove"

    // tab 
    | "tab.title"
    | "tab.content"

    // color style
    | "style.backColor"
    | "style.customTextColor"
    | "style.textColorInUse"

    // fields 
    | "fields.labelPrefix"
    | "fields.negationOperator"
    | "fields.selectedTabIndex"
    | "fields.selectedDashItemIndex"
    | "fields.selectedTaskId"
    | "fields.lastId"

    // dash 
    | "dash.task.task"
    | "dash.task.width"
    | "dash.task.height"
    | "dash.tasks.filter";


export interface IDomainObjectCreateEvent {
    type: DomainObjectType;
    id: number;
    createdOn: number;
}

export interface ILabelCreateEvent extends IDomainObjectCreateEvent {
    name: string;
    style: IColorStyleChangeEvent;
}

export interface ITaskCreateEvent extends IDomainObjectCreateEvent {
    title: string;
}

export interface ITabCreateEvent extends IDomainObjectCreateEvent {
    title: string;
    customStyle: IColorStyleChangeEvent | undefined;
}

export interface IFieldChangeEvent {
    id: number;
    version: number;
    value?: SimpleType;
}

export interface IDeleteEvent {
    id: number;
    version: number;
}

export interface IColorStyleChangeEvent {
    backColor: string;
    customTextColor: string;
    textColorInUse: TextColorUsage;
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
    readonly firstLabel: ILabel | undefined;
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


// User Controls ======================================================================

export interface IUc {
    readonly view: HTMLElement;
}

export interface IHasWindowViews {
    readonly windowViews: HTMLElement[];
}

export interface IWindowUc extends IUc {
    showBelow(el: HTMLElement): void;
    hide(): void;
}

export interface IPopupUc extends IWindowUc {
}

export interface ITaskMenuListUc extends IPopupUc {
}

export interface ITaskNoteMenuUc extends IPopupUc {
}

export interface ITaskMenuUc extends IUc {
    showBelow(el: HTMLElement, tasks: ITask[]): void;
}

export interface ILabelEditUc extends IUc {
    begin(label: ILabel, el: HTMLSpanElement): void;
    readonly editView: HTMLElement;
}

export interface IToolbarUc extends IUc {
    readonly view: HTMLElement;
    readonly taskMenuListUc: ITaskMenuListUc;
    readonly moreMenuUc: IPopupUc;
}

export interface IDashboardUc extends IUc {
}

export interface ITasksDashItemUc extends IUc {
}

export interface ITaskDashItemUc extends IUc {
}

export interface ITaskAddUc extends IUc {
}

export interface ITaskListUc {
    readonly view: HTMLElement[];
}

export interface ITabsUc extends IUc {
}

export interface ILabelAddUc extends IUc {
}

export interface ITaskTitleEditUc extends IUc {
    begin(t: ITask, titleTd: HTMLTableDataCellElement): void
}

export interface IAppUc extends IUc {
    //addWindowUc(wv: IWindowUc): void;
}

export interface ILabelsPopupUc extends IUc {
    readonly show: (
        over: HTMLElement,
        associated: ArraySignal<ILabel> | undefined,
        action: (label: ILabel, el: HTMLSpanElement) => void) => void;
}