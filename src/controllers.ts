import S, { DataSignal } from "s-js";
import SArray, { SArray as SArrayType, SDataArray } from "s-array";

import * as M from "./model";


class TaskList implements M.ITaskList {

    findTask(taskQuery: string) : SArrayType<M.ITask> {
        return this.tasks.filter(t => t.title().indexOf(taskQuery) !== -1);
    }

    addTask(task: M.ITask): void {
        this.tasks.push(task);
    }

    tasks: SDataArray<M.ITask> = SArray([]);
}


class Task implements M.ITask {
    
    private static counter = 0;

    assignLabel(label: M.ILabel): void {
        throw new Error("Not implemented"); }

    unAssingLabel(label: M.ILabel): void { 
        throw new Error("Not implemented"); }

    title = S.data("");
    assignedLabels = SArray([]);
    id = ++Task.counter;
    createdOn = new Date();
}


class Date implements M.IDate {
    value = "";
}


class AppState implements M.IAppState {
    taskStore: M.ITaskList = new TaskList();
    taskQuery = S.data("");
    taskName = S.data("");
}


export class TaskController {
    model: M.IAppState = new AppState();
    filteredTasks: SArrayType<M.ITask>;

    constructor() {

        const t1 = new Task(); t1.title("task 1 a");
        this.model.taskStore.addTask(t1);
        const t2 = new Task(); t2.title("task 2 ab");
        this.model.taskStore.addTask(t2);
        const t3 = new Task(); t3.title("task 3 abc");
        this.model.taskStore.addTask(t3);
        const t4 = new Task(); t4.title("task 4 abcd");
        this.model.taskStore.addTask(t4);

        this.filteredTasks = this.model.taskStore.findTask(
            this.model.taskQuery());
    }

    addTask(): void {
        const t: M.ITask = new Task();
        t.title(this.model.taskName());
        this.model.taskName("");
        this.model.taskStore.addTask(t);
    }

    findTask(): SArrayType<M.ITask> {
        const q = this.model.taskQuery();
        return this.model.taskStore.tasks
            .filter(t => t.title().indexOf(q) !== -1);
    }
}