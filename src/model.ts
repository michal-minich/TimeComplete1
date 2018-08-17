import S, { DataSignal } from "s-js";
import { SArray, SDataArray  } from "s-array";


export interface IColor {
    value: string;
}

export interface IDate {
    value: string;
}

export interface IDomainObject {
    readonly id: number;
    readonly createdOn: IDate;
}

export interface ILabel extends IDomainObject {
    name: string;
    color: IColor;
    parent?: ILabel;
}

export interface ITask extends IDomainObject {
    title: DataSignal<string>;
    readonly assignedLabels: SArray<ILabel>;
    assignLabel(label: ILabel): void;
    unAssingLabel(label: ILabel): void;
}

export interface ITaskList {
    tasks: SDataArray<ITask>;
    findTask(taskQuery: string): SArray<ITask>;
    addTask(task: ITask): void;
}

export interface ILabelList {
    tasks: SDataArray<ILabel>;
    addLabel(label: ILabel): void;
    removeLabel(label: ILabel): void;
}

export interface IAppState {
    readonly taskStore: ITaskList;
    // readonly labelStore: ILabelList;
    selectedTask?: ITask;
    taskQuery: DataSignal<string>;
    taskName: DataSignal<string>;
}

// query language
// free text ... 'text' matches %text%
// #label ... '#xx' matches #%xx%
// #label.. matches the label + all children
// #label..
// bool ops: ! and or < >= <= = (auto correct from ==) != (auto correct from <>)
// saved 'named' search will virtually assign 'named' as a label to matching tasks (and can be used as #named in other queries)
