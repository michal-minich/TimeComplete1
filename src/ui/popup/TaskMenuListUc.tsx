import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, ITaskMenuListUc, IPopupUc, ITask } from "../../interfaces";

import PopupUc from "../PopupUc";
import TaskDashItem from "../../data/dash/TaskDashItem";
import Task from "../../data/domain/Task";


export default class TaskMenuListUc implements ITaskMenuListUc {

    constructor(app: IApp) {

        const v = getControlledView(app, this.hide);
        this.popup = new PopupUc(app, v);
    }


    readonly popup: IPopupUc;


    get view() {
        return this.popup.view;
    }


    readonly hide: () => void = () => {
        this.popup.hide();
    };


    showBelow(el: HTMLElement): void {
        this.popup.showBelow(el);
    }
}


function getControlledView(app: IApp, hide: () => void) {

    function activateTask(n: ITask): void {
        app.data.dashboard.unshift(new TaskDashItem(app, n));
        hide();
    }


    function taskView(n: ITask): HTMLElement {
        const v =
            <div className="task"
                 onClick={() => activateTask(n)}>
                {(n.title + ": " + n.text).substring(0, 100)}
            </div>;
        return v;
    }


    function addTask(): void {
        const n = Task.createNew(app, "Task", "");
        app.data.taskAdd(n);
        app.data.dashboard.unshift(new TaskDashItem(app, n));
    }


    const view =
        <ul className="task-menu menu">
            <li onClick={addTask}>Add New Task</li>
            <div className="task-list">
                {app.data.tasks().map(taskView)}
            </div>
        </ul>;

    return view;
}