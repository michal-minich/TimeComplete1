import S from "s-js";
import SArray, { SArray as SArrayType, SDataArray } from "s-array";

import * as M from "./model";
import * as Q from "./query";


class LabelList implements M.ILabelList {
    addLabel(label: M.ILabel): void {
        this.labels.unshift(label);
    }

    removeLabel(label: M.ILabel): void {
        this.labels.remove(label);
    }

    labels: SDataArray<M.ILabel> = SArray([]);
}


class TaskList implements M.ITaskList {

    findTask(taskQuery: string): SArrayType<M.ITask> {
        const q = new Q.TaskQueryParser().parse(taskQuery);
        return this.tasks.filter(t => q.taskMatches(t));
    }

    addTask(task: M.ITask): void {
        this.tasks.unshift(task);
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
    labelStore: M.ILabelList = new LabelList();
    taskQuery = S.data("");
    newTaskName = S.data("");
    newLabelName = S.data("");
}


export class TaskController {
    model: M.IAppState = new AppState();

    constructor() {
        const lRed = new Label();
        lRed.name("red");
        lRed.color(new Color("red"));
        this.model.labelStore.addLabel(lRed);

        const lGreen = new Label();
        lGreen.name("green");
        lGreen.color(new Color("green"));
        this.model.labelStore.addLabel(lGreen);
        
        const lBlue = new Label();
        lBlue.name("blue");
        lBlue.color(new Color("blue"));
        this.model.labelStore.addLabel(lBlue);

        for (let i = 0; i < 50; i++) {
            const lbl = new Label();
            lbl.name("label" + i);
            lbl.color(new Color("gray"));
            this.model.labelStore.addLabel(lbl);
        }

        const t1 = new Task(); t1.title("task 1 a");
        this.model.taskStore.addTask(t1);
        const t2 = new Task(); t2.title("task 2 ab");
        this.model.taskStore.addTask(t2);
        t2.assignLabel(lGreen);
        const t3 = new Task(); t3.title("task 3 abc");
        t3.completedOn(new DateTime("2018"));
        t3.assignLabel(lRed);
        t3.assignLabel(lBlue);
        this.model.taskStore.addTask(t3);
        const t4 = new Task(); t4.title("task 4 abcd");
        this.model.taskStore.addTask(t4);
        t4.assignLabel(lRed);
        
        for (let i = 0; i < 20; i++) {
            const t = new Task(); t.title("task " + i);
            this.model.taskStore.addTask(t);
        }
    }

    addTask(e : KeyboardEvent): void {
        if (e.keyCode !== 13)
            return;
        if (this.model.newTaskName() === "")
            return;
        const t = new Task();
        t.title(this.model.newTaskName());
        this.model.newTaskName("");
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

    addLabel(e : KeyboardEvent): any {
        if (e.keyCode !== 13)
            return;
        if (this.model.newLabelName() === "")
            return;
        const l = new Label();
        l.name(this.model.newLabelName());
        this.model.newLabelName("");
        this.model.labelStore.addLabel(l);
    }
}