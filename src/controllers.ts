﻿import S from "s-js";
import SArray, { SArray as SArrayType, SDataArray } from "s-array";

import * as M from "./model";
import * as Q from "./query";
import * as V from "./views";
import IChangeTaskCompletionActivity = M.IChangeTaskCompletionActivity;


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

    searchedTasks(taskQuery: string): SArrayType<M.ITask> {
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


    unAssignLabel(label: M.ILabel): void {
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


export class App implements M.IApp {
    readonly taskStore = new TaskList();
    readonly labelStore = new LabelList();

    readonly selectTaskActivity: M.ISelectTaskActivity;
    readonly addTaskActivity: M.IAddTaskActivity;
    readonly addLabelActivity: M.IAddLabelActivity;
    readonly editTaskTitleActivity: M.IEditTaskTitleActivity;
    readonly changeTaskCompletionActivity: IChangeTaskCompletionActivity;
    readonly assignLabelToTaskActivity: M.IAssignLabelToTaskActivity;
    readonly searchTaskListActivity: M.ISearchTaskListActivity;

    constructor() {
        this.selectTaskActivity = new SelectTaskActivity(this);
        this.addTaskActivity = new AddTaskActivity(this);
        this.addLabelActivity = new AddLabelActivity(this);
        this.editTaskTitleActivity = new EditTaskTitleActivity(this);
        this.changeTaskCompletionActivity = new ChangeTaskCompletionActivity(this);
        this.assignLabelToTaskActivity = new AssignLabelToTaskActivity(this);
        this.searchTaskListActivity = new SearchTaskListActivity(this);
    }
}


class SelectTaskActivity implements M.ISelectTaskActivity {
    private readonly app: M.IApp;

    constructor(app: M.IApp) {
        this.app = app;
    }

    selectedTask = S.data(undefined as (M.ITask | undefined));

    perform(): void {
    }
}


class AddTaskActivity implements M.IAddTaskActivity {

    newName = S.data("");

    private readonly app: M.IApp;

    constructor(app: M.IApp) {
        this.app = app;
    }

    begin(): void {
    }

    commit(): void {
        if (this.newName() === "")
            return;
        const t = new Task();
        t.title(this.newName());
        this.newName("");
        this.app.taskStore.addTask(t);
    }

    rollback(): void {
    }


    keyUp(e: KeyboardEvent): void {
        if (e.keyCode === 13)
            this.commit();
        // todo if esc rollback
    }
}


class AddLabelActivity implements M.IAddLabelActivity {
    newName = S.data("");
    private readonly app: M.IApp;

    constructor(app: M.IApp) {
        this.app = app;
    }

    begin(): void {
    }

    commit(): void {
        if (this.newName() === "")
            return;
        const l = new Label();
        l.name(this.newName());
        this.newName("");
        this.app.labelStore.addLabel(l);
    }

    rollback(): void {
    }

    keyUp(e: KeyboardEvent): any {
        if (e.keyCode === 13)
            this.commit();
        // todo if esc rollback
    }
}


class EditTaskTitleActivity implements M.IEditTaskTitleActivity {

    newTitle = S.data("");
    private readonly app: M.IApp;

    constructor(app: M.IApp) {
        this.app = app;
    }


    begin(t: M.ITask, titleTd: HTMLTableDataCellElement): void {
        this.commit();
        this.app.selectTaskActivity.selectedTask(t);
        this.newTitle(t.title());
        const r = titleTd.getBoundingClientRect();
        const txtStyle = V.AppView.taskEditTextBox.style;
        txtStyle.left = r.left + "px";
        txtStyle.top = r.top + "px";
        txtStyle.width = r.width + "px";
        txtStyle.height = (r.height - 1) + "px";
        txtStyle.display = "block";
        V.AppView.taskEditTextBox.value = t.title();
        setTimeout(() => V.AppView.taskEditTextBox.focus(), 0);
    }


    private finishEditingTaskCounter = 0;

    commit(): void {
        ++this.finishEditingTaskCounter;
        if (this.app.selectTaskActivity.selectedTask() === undefined || this.finishEditingTaskCounter === 1)
            return;
        this.finishEditingTaskCounter = 0;
        this.app.selectTaskActivity.selectedTask()!.title(this.newTitle());
        this.newTitle("");
        this.app.selectTaskActivity.selectedTask(undefined);
        V.AppView.taskEditTextBox.style.display = "none";
    }


    rollback(): void {
    }


    keyUp(e: KeyboardEvent): void {
        if (e.keyCode === 13) {
            this.commit();
        }
        // todo if esc rollback
    }
}


class ChangeTaskCompletionActivity implements IChangeTaskCompletionActivity {
    private readonly app: M.IApp;

    constructor(app: M.IApp) {
        this.app = app;
    }

    perform(task: M.ITask, isDone: HTMLInputElement): any {
        //this.app.selectTaskActivity.selectedTask(task);
        if (isDone.checked) {
            task.completedOn(new DateTime("2019"));
        } else {
            task.completedOn(undefined);
        }
    }
}


class AssignLabelToTaskActivity implements M.IAssignLabelToTaskActivity {
    private readonly app: M.IApp;

    constructor(app: M.IApp) {
        this.app = app;
    }

    begin(): void {
    }

    commit(): void {
    }

    rollback(): void {
    }


    startAssigningLabels(task: M.ITask, titleTd: HTMLTableDataCellElement, assignLabelPopup: HTMLTableElement): void {
        console.log(task);
        console.log(assignLabelPopup);

        const r = titleTd.getBoundingClientRect();
        const txtStyle = assignLabelPopup.style;
        txtStyle.left = (r.left + r.width) + "px";
        txtStyle.top = r.top + "px";
        //txtStyle.width = r.width + "px";
        //txtStyle.height = (r.height - 1) + "px";
        //txtStyle.display = "block";
    }
}


class SearchTaskListActivity implements M.ISearchTaskListActivity {
    taskQuery = S.data("");

    private readonly app: M.IApp;

    constructor(app: M.IApp) {
        this.app = app;
    }


    resultTasks(): SArrayType<M.ITask> {
        return this.app.taskStore.searchedTasks(this.taskQuery());
    }


    addSearch(): void {
    }


    addOrRemoveLabelFromQuery(l: M.ILabel): void {
        const ln = l.name();
        const q = this.taskQuery().trim().replace("  ", " ");
        if (q.indexOf(ln) === -1) {
            this.taskQuery(q + " #" + ln);
        } else {
            this.taskQuery(q.replace("#" + ln, "").replace("  ", " "));
        }
    }
}


export function initSampleData(app: M.IApp) {

    const lRed = new Label();
    lRed.name("red");
    lRed.color(new Color("red"));
    app.labelStore.addLabel(lRed);

    const lGreen = new Label();
    lGreen.name("green");
    lGreen.color(new Color("green"));
    app.labelStore.addLabel(lGreen);

    const lBlue = new Label();
    lBlue.name("blue");
    lBlue.color(new Color("blue"));
    app.labelStore.addLabel(lBlue);

    for (let i = 0; i < 50; i++) {
        const lbl = new Label();
        lbl.name("label" + i);
        lbl.color(new Color("gray"));
        app.labelStore.addLabel(lbl);
    }

    const t1 = new Task();
    t1.title("task 1 a");
    app.taskStore.addTask(t1);
    const t2 = new Task();
    t2.title("task 2 ab");
    app.taskStore.addTask(t2);
    t2.assignLabel(lGreen);
    const t3 = new Task();
    t3.title("task 3 abc");
    t3.completedOn(new DateTime("2018"));
    t3.assignLabel(lRed);
    t3.assignLabel(lBlue);
    app.taskStore.addTask(t3);
    const t4 = new Task();
    t4.title("task 4 abcd");
    app.taskStore.addTask(t4);
    t4.assignLabel(lRed);

    for (let i = 0; i < 20; i++) {
        const t = new Task();
        t.title("task " + i);
        app.taskStore.addTask(t);
    }
}