import { DataSignal } from "s-js";
import { SArray, SDataArray  } from "s-array";


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

export interface IAppState {
    readonly taskStore: ITaskList;
    readonly labelStore: ILabelList;
    selectedTask?: ITask | undefined;
    taskQuery: DataSignal<string>;
    newTaskName: DataSignal<string>;
    newLabelName: DataSignal<string>;
    editTaskTitle: DataSignal<string>;
}

// query language
// free text ... 'text' matches %text%
// #label ... '#xx' matches #%xx%
// #label.. matches the label + all children
// #label..
// bool ops: ! and or < >= <= = (auto correct from ==) != (auto correct from <>)
// saved 'named' search will virtually assign 'named' as a label to matching tasks (and can be used as #named in other queries)
