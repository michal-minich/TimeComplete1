import S from "s-js";
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
    
    static counter = 0;

    assignLabel(label: M.ILabel): void {
        this.assignedLabels.push(label);
    }

    unAssingLabel(label: M.ILabel): void {
        this.assignedLabels.remove(label);
    }

    title = S.data("");
    assignedLabels = SArray<M.ILabel>([]);
    id = ++Task.counter;
    createdOn = new DateTime("2018");
    completedOn = S.data<M.IDateTime | undefined>(undefined);

    completedValue(): string {
        const con = this.completedOn();
        return con ? con.value : "";
    }
}


class Color implements M.IColor {
    value: string;

    constructor(value: string) { this.value = value; }
}


class Label implements M.ILabel {
    name = S.data("");
    color = S.data(new Color("gray"));
    id = ++Task.counter;
    createdOn = new DateTime("2018");
}


class DateTime implements M.IDateTime {
    constructor(value: string) {
        this.value = value;
    }

    value = "";
}


class AppState implements M.IAppState {
    taskStore: M.ITaskList = new TaskList();
    taskQuery = S.data("");
    taskName = S.data("");
}


export class TaskController {
    model: M.IAppState = new AppState();

    constructor() {
        
        const t1 = new Task(); t1.title("task 1 a");
        this.model.taskStore.addTask(t1);
        const t2 = new Task(); t2.title("task 2 ab");
        this.model.taskStore.addTask(t2);
        const t3 = new Task(); t3.title("task 3 abc");
        t3.completedOn(new DateTime("2018"));
        const redL = new Label();
        redL.name("red");
        redL.color(new Color("red"));
        t3.assignLabel(redL);
        this.model.taskStore.addTask(t3);
        const t4 = new Task(); t4.title("task 4 abcd");
        this.model.taskStore.addTask(t4);
    }

    addTask(): void {
        const t: M.ITask = new Task();
        t.title(this.model.taskName());
        this.model.taskName("");
        this.model.taskStore.addTask(t);
    }

    findTask(): SArrayType<M.ITask> {
        return this.model.taskStore.findTask(this.model.taskQuery());
    }


    changeTaskCompletion(task: M.ITask, isDone: HTMLInputElement): any {
        if (isDone.checked) {
            task.completedOn(new DateTime("2019"));
        } else {
            task.completedOn(undefined);
        }
    }
}