import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import {
    IApp,
    ITaskMenuUc,
    IPopupUc,
    ITasksDashItem,
    ITask,
    ValueSignal
} from "../../interfaces";
import PopupUc from "../PopupUc";
import TasksDashItem from "../../data/dash/TasksDashItem";
import { R } from "../../common";


export default class TaskMenuUc implements ITaskMenuUc {

    constructor(app: IApp) {

        this.doneCount = R.data(0);
        this.todoCount = R.data(0);
        this.popup = new PopupUc(app, getControlledView(app, this));
    }


    readonly doneCount: ValueSignal<number>;
    readonly todoCount: ValueSignal<number>;
    readonly popup: IPopupUc;


    get view() {
        return this.popup.view;
    }


    showBelow(el: HTMLElement, tasks: ITask[]): void {
        const done = tasks.filter(t => t.completedOn !== undefined).length;
        this.doneCount(done);
        this.todoCount(tasks.length - done);
        this.popup.showBelow(el);
    }
}


function getControlledView(app: IApp, owner: TaskMenuUc) {


    function hide2(): void {
        owner.popup.hide();
    }


    function completeAll(): void {
        owner.popup.hide();
    }


    function uncompleteAll(): void {
        owner.popup.hide();
    }


    function del(): void {
        owner.popup.hide();
        const n = app.data.dashboard.selected()!;
        app.data.dashboard.remove(n);
    };


    function duplicate(): void {
        owner.popup.hide();
        const tl = app.data.dashboard.selected()! as ITasksDashItem;
        const tl2 = new TasksDashItem(app, tl.query.text());
        app.data.dashboard.unshift(tl2);
    };


    const view =
        <ul className="more-menu menu">
            <li onMouseDown={duplicate}>Duplicate</li>
            <li className={owner.todoCount() === 0 ? "hidden" : ""}
                onMouseDown={completeAll}>
                Mark All Done <span className="gray">({owner.todoCount()})</span>
            </li>
            <li className={owner.doneCount() === 0 ? "hidden" : ""}
                onMouseDown={uncompleteAll}>
                Mark All Todo <span className="gray">({owner.doneCount()})</span>
            </li>
            <li onMouseDown={hide2}>Hide</li>
            <li onMouseDown={del}>Delete</li>
        </ul>;

    return view;

}