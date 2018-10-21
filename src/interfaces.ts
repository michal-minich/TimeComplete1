import { DataSignal } from "s-js";
import { SArray } from "s-array";


export interface IReadonlyDataSignal<T> {
    (): T;
}

export interface ICanDeserialize {

}

export interface IIdProvider<T> {
    getNext(): T;
    readonly current: T;
}

export interface IDataStore {
    save<T>(key: string, value: T): void;
    load<T>(key: string): T | undefined;
}

export interface IColor {
    value: string;
}

export interface IDateTime {
    value: string;
}

export interface IClock {
    now(): IDateTime;
}

export interface IDomainObject {
    readonly id: number;
    readonly createdOn: IDateTime;
}

export interface ILabel extends IDomainObject {
    name: DataSignal<string>;
    color: DataSignal<IColor>;
    parent?: DataSignal<ILabel>;
}

export interface ITask extends IDomainObject {
    title: DataSignal<string>;
    completedOn: DataSignal<IDateTime | undefined>;
    readonly assignedLabels: SArray<ILabel>;
    addLabelAssociation(label: ILabel): void;
    removeLabelAssociation(label: ILabel): void;
}

export interface ITaskList {
    readonly tasks: SArray<ITask>;
    addTask(task: ITask): void;
}

export interface ILabelList {
    readonly labels: SArray<ILabel>;
    addLabel(label: ILabel): void;
    removeLabel(label: ILabel): void;
}

export interface IApp {
    readonly taskStore: ITaskList;
    readonly labelStore: ILabelList;
    readonly taskListsActivities: SArray<ITaskListActivity>;

    readonly selectedTaskListActivity: DataSignal<ITaskListActivity>;
    readonly addLabelActivity: IAddLabelActivity;
    readonly associateLabelWithTaskActivity: IAssociateLabelWithTaskActivity;
    readonly selectTaskActivity: ISelectTaskActivity;
    readonly editTaskTitleActivity: IEditTaskTitleActivity;
    readonly changeTaskCompletionActivity: IChangeTaskCompletionActivity;
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
    begin(t: ITask, titleTd: HTMLTableDataCellElement, tla: ITaskListActivity): void;
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