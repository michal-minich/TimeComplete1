﻿
import S, { DataSignal as DataSignalType } from "s-js";
import SArray, { SArray as SArrayType, SDataArray } from "s-array";


import * as M from "../models/all";
import * as I from "../interfaces";
import * as Q from "../query";
import * as V from "../views";



class SessionStore implements I.IDataStore {
    save(key: string, value: any): void {
        const v = JSON.stringify(value);
        window.localStorage.setItem(key, v);
    }

    load<T>(key: string): T | undefined {
        const value = window.localStorage.getItem(key);
        return value ? JSON.parse(value!) as T : undefined;
    }
}


class TaskList implements I.ITaskList {

    searchedTasks(taskQuery: string): SArrayType<I.ITask> {
        
        new String("").padStart(1, "");
        const q = new Q.TaskQueryParser().parse(taskQuery);
        return this.tasks.filter(t => q.taskMatches(t));
    }


    addTask(task: I.ITask): void {
        this.tasks.unshift(task);
    }


    tasks: SDataArray<I.ITask> = SArray([]);
}


class Task implements I.ITask {

    static counter = 0;

    addLabelAssociation(label: I.ILabel): void {
        this.assignedLabels.push(label);
    }


    removeLabelAssociation(label: I.ILabel): void {
        this.assignedLabels.remove(label);
    }


    title = S.data("");
    assignedLabels = SArray<I.ILabel>([]);
    id = ++Task.counter;
    createdOn = new DateTime("2018");
    completedOn = S.data<I.IDateTime | undefined>(undefined);


    completedValue(): string {
        const con = this.completedOn();
        return con ? con.value : "";
    }
}


class Color implements I.IColor {
    value: string;

    constructor(value: string) { this.value = value; }
}


class Label implements I.ILabel {
    name = S.data("");
    color = S.data(new Color("gray"));
    id = ++Task.counter;
    createdOn = new DateTime("2018");
}


class DateTime implements I.IDateTime {
    constructor(value: string) {
        this.value = value;
    }

    value = "";
}


export class App implements I.IApp {
    static instance: App;
    readonly sessionStore: I.IDataStore = new SessionStore();
    readonly taskStore = new TaskList();
    readonly labelStore = new M.LabelList();
    readonly taskListsActivities: SArrayType<I.ITaskListActivity>;

    readonly selectedTaskListActivity: DataSignalType<I.ITaskListActivity>;
    readonly addLabelActivity: I.IAddLabelActivity;
    readonly associateLabelWithTaskActivity: I.IAssociateLabelWithTaskActivity;
    readonly selectTaskActivity: I.ISelectTaskActivity;
    readonly editTaskTitleActivity: I.IEditTaskTitleActivity;
    readonly changeTaskCompletionActivity: I.IChangeTaskCompletionActivity;


    constructor() {
        this.taskListsActivities = SArray<I.ITaskListActivity>([
            new TaskListActivity(this),
            new TaskListActivity(this),
            new TaskListActivity(this)
        ]);
        this.selectedTaskListActivity = S.data(this.taskListsActivities()[0]);
        this.addLabelActivity = new AddLabelActivity(this);
        this.associateLabelWithTaskActivity = new AssociateLabelWithActivity(this);
        this.selectTaskActivity = new SelectTaskActivity(this);
        this.editTaskTitleActivity = new EditTaskTitleActivity(this);
        this.changeTaskCompletionActivity = new ChangeTaskCompletionActivity(this);

        initSampleData(this);
    }
}


class TaskListActivity implements I.ITaskListActivity {
    private readonly app: I.IApp;

    readonly addTaskActivity: I.IAddTaskActivity;
    readonly searchTaskListActivity: I.ISearchTaskListActivity;

    constructor(app: I.IApp) {
        this.app = app;

        this.addTaskActivity = new AddTaskActivity(app);
        this.searchTaskListActivity = new SearchTaskListActivity(app);
    }
}


class SelectTaskActivity implements I.ISelectTaskActivity {
    private readonly app: I.IApp;

    constructor(app: I.IApp) {
        this.app = app;
    }

    selectedTask = S.data(undefined as (I.ITask | undefined));


    select(t: I.ITask): void {
        this.selectedTask(t);
    }

    unselect(): void {
        this.selectedTask(undefined);
    }

}


class AddTaskActivity implements I.IAddTaskActivity {

    newName = S.data("");

    private readonly app: I.IApp;

    constructor(app: I.IApp) {
        this.app = app;
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
        this.newName("");
    }


    keyUp(e: KeyboardEvent): void {
        if (e.keyCode === 13)
            this.commit();
        else if (e.keyCode === 27)
            this.rollback();
    }
}


class AddLabelActivity implements I.IAddLabelActivity {
    newName = S.data("");
    private readonly app: I.IApp;

    constructor(app: I.IApp) {
        this.app = app;
    }


    commit(): void {
        if (this.newName() === "")
            return;
        const l = new Label();
        l.name(this.newName());
        this.newName("");
        this.app.labelStore.addLabel(l);
        const t = this.app.selectTaskActivity.selectedTask();
        if (t) {
            t.addLabelAssociation(l);
        }
    }


    rollback(): void {
        this.newName("");
    }


    keyUp(e: KeyboardEvent): any {
        if (e.keyCode === 13)
            this.commit();
        else if (e.keyCode === 27)
            this.rollback();
    }
}


class EditTaskTitleActivity implements I.IEditTaskTitleActivity {

    newTitle = S.data("");
    private originalTitle = "";
    private readonly app: I.IApp;

    constructor(app: I.IApp) {
        this.app = app;
    }


    begin(t: I.ITask, titleTd: HTMLTableDataCellElement, tla: I.ITaskListActivity): void {
        this.originalTitle = t.title();
        this.app.selectTaskActivity.select(t);
        this.newTitle(t.title());
        V.AppView.taskEditTextBox.value = t.title();
        const r = titleTd.getBoundingClientRect();
        const txtStyle = V.AppView.taskEditTextBox.style;
        txtStyle.left = r.left + "px";
        txtStyle.top = r.top + "px";
        txtStyle.width = r.width + "px";
        txtStyle.height = (r.height - 1) + "px";
        txtStyle.display = "block";
        setTimeout(() => V.AppView.taskEditTextBox.focus(), 0);
    }


    commit(): void {
        if (this.newTitle().trim() === "") {
            this.rollback();
        } else {
            this.app.selectTaskActivity.selectedTask()!.title(this.newTitle());
            this.cleanup();
        }
    }


    rollback(): void {
        this.cleanup();
    }


    cleanup(): void {
        V.AppView.taskEditTextBox.style.display = "none";
        this.newTitle("");
    }


    keyUp(e: KeyboardEvent): void {
        if (e.keyCode === 13)
            this.commit();
        else if (e.keyCode === 27)
            this.rollback();
    }
}


class ChangeTaskCompletionActivity implements I.IChangeTaskCompletionActivity {
    private readonly app: I.IApp;

    constructor(app: I.IApp) {
        this.app = app;
    }

    perform(task: I.ITask, isDone: HTMLInputElement): any {
        //this.app.selectTaskActivity.selectedTask(task);
        if (isDone.checked) {
            task.completedOn(new DateTime("2019"));
        } else {
            task.completedOn(undefined);
        }
    }
}


class AssociateLabelWithActivity implements I.IAssociateLabelWithTaskActivity {
    private readonly app: I.IApp;

    constructor(app: I.IApp) {
        this.app = app;
    }
    
    changeAssociation(label: I.ILabel): void {
        const t = this.app.selectTaskActivity.selectedTask()!;
        if (t.assignedLabels().some(al => al.name() === label.name())) {
            t.removeLabelAssociation(label);
        } else {
            t.addLabelAssociation(label);
        }
    }
}


class SearchTaskListActivity implements I.ISearchTaskListActivity {
    taskQuery = S.data("");
    private originalTitle = "";

    private readonly app: I.IApp;

    constructor(app: I.IApp) {
        this.app = app;
    }


    resultTasks(): SArrayType<I.ITask> {
        return this.app.taskStore.searchedTasks(this.taskQuery());
    }


    begin(): void {
        this.originalTitle = this.taskQuery();
        this.app.selectTaskActivity.unselect();
    }


    addSearch(): void {
    }


    rollback(): void {
        if (this.originalTitle === "__NEXT_EMPTY__") {
            this.originalTitle = this.taskQuery();
            this.clear();

        } else {
            this.taskQuery(this.originalTitle);
            this.originalTitle = "__NEXT_EMPTY__";
        }
    }

    clear(): void {
        this.taskQuery("");
    }

    keyUp(e: KeyboardEvent): void {
        if (e.keyCode === 27)
            this.rollback();
    }


    addOrRemoveLabelFromQuery(l: I.ILabel): void {
        const ln = l.name();
        const q = this.taskQuery().trim().replace("  ", " ");
        if (q.indexOf(ln) === -1) {
            this.taskQuery(q + " #" + ln);
        } else {
            this.taskQuery(q.replace(`#${ln}`, "").replace("  ", " "));
        }
    }
}


export function initSampleData(app: I.IApp) {

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
        lbl.name(`label${i}`);
        lbl.color(new Color("gray"));
        app.labelStore.addLabel(lbl);
    }

    const t1 = new Task();
    t1.title("task 1 a");
    app.taskStore.addTask(t1);
    const t2 = new Task();
    t2.title("task 2 ab");
    app.taskStore.addTask(t2);
    t2.addLabelAssociation(lGreen);
    const t3 = new Task();
    t3.title("task 3 abc");
    t3.completedOn(new DateTime("2018"));
    t3.addLabelAssociation(lRed);
    t3.addLabelAssociation(lBlue);
    app.taskStore.addTask(t3);
    const t4 = new Task();
    t4.title("task 4 abcd");
    app.taskStore.addTask(t4);
    t4.addLabelAssociation(lRed);

    for (let i = 0; i < 20; i++) {
        const t = new Task();
        t.title(`task ${i}`);
        app.taskStore.addTask(t);
    }
}