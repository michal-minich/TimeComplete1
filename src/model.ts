import { DataSignal } from "s-js";
import { SArray, SDataArray } from "s-array";


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

export interface ILabel extends IDomainObject {
    name: DataSignal<string>;
    color: DataSignal<IColor>;
    parent?: DataSignal<ILabel>;
}

export interface ITask extends IDomainObject {
    title: DataSignal<string>;
    completedOn: DataSignal<IDateTime | undefined>;
    readonly assignedLabels: SArray<ILabel>;
    assignLabel(label: ILabel): void;
    unAssignLabel(label: ILabel): void;
    completedValue(): string;
}

export interface ITaskList {
    tasks: SDataArray<ITask>;
    searchedTasks(taskQuery: string): SArray<ITask>;
    addTask(task: ITask): void;
}

export interface ILabelList {
    labels: SDataArray<ILabel>;
    addLabel(label: ILabel): void;
    removeLabel(label: ILabel): void;
}

export interface IApp {
    readonly taskStore: ITaskList;
    readonly labelStore: ILabelList;

    readonly selectTaskActivity: ISelectTaskActivity;
    readonly addTaskActivity: IAddTaskActivity;
    readonly addLabelActivity: IAddLabelActivity;
    readonly editTaskTitleActivity: IEditTaskTitleActivity;
    readonly changeTaskCompletionActivity: IChangeTaskCompletionActivity;
    readonly assignLabelToTaskActivity: IAssignLabelToTaskActivity;
    readonly searchTaskListActivity: ISearchTaskListActivity;
}


export interface IActivityController {
    //perform, commit, rollback, reset
}


export interface ISelectTaskActivity extends IActivityController {
    selectedTask: DataSignal<ITask | undefined>;
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

export interface IAssignLabelToTaskActivity extends IActivityController {
    startAssigningLabels(task: ITask, titleTd: HTMLTableDataCellElement, assignLabelPopup: HTMLTableElement): void;
}

export interface ISearchTaskListActivity extends IActivityController {
    addOrRemoveLabelFromQuery(l: ILabel): void;
    resultTasks(): SArray<ITask>;
    addSearch(): void;
    taskQuery: DataSignal<string>;
    resultTasks(): SArray<ITask>;
}


// query language
// free text ... 'text' matches %text%
// #label ... '#xx' matches #%xx%
// #label.. matches the label + all children
// #label..
// bool ops: ! and or < >= <= = (auto correct from ==) != (auto correct from <>)
// saved 'named' search will virtually assign 'named' as a label to matching tasks (and can be used as #named in other queries)