import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, ITaskMenuUc, IPopupUc, ITasksDashItem, ITask } from "../../interfaces";
import PopupUc from "../PopupUc";
import TasksDashItem from "../../data/dash/TasksDashItem";
import { R } from "../../common";


export default class TaskMenuUc implements ITaskMenuUc {

    constructor(private readonly app: IApp) {

        this.popup = new PopupUc(app, this.render());
    }


    doneCount = R.data(0);
    todoCount = R.data(0);

    private readonly popup: IPopupUc;
    private tasks!: ITask[];


    get view() {
        return this.popup.view;
    }


    hide(): void {
        this.popup.hide();
    }


    showBelow(el: HTMLElement, tasks: ITask[]): void {
        this.tasks = tasks;
        const done = tasks.filter(t => t.completedOn !== undefined).length;
        this.doneCount(done);
        this.todoCount(tasks.length - done);
        this.popup.showBelow(el);
    }


    private hide2: () => void = () => {
        this.hide();
        const tdi = this.app.data.dashboard.selected()! as ITasksDashItem;
        tdi.visible = false;
    };


    private completeAll: () => void = () => {
        this.hide();
        if (!confirm("Mark all Done?")) {
            return;
        }
        for (const t of this.tasks) {
            t.completedOn = this.app.clock.now();
        }
    };


    private uncompleteAll: () => void = () => {
        this.hide();
        if (!confirm("Mark all Todo?")) {
            return;
        }
        for (const t of this.tasks) {
            t.completedOn = undefined;
        }
    };


    private delete: () => void = () => {
        this.hide();
        const n = this.app.data.dashboard.selected()!;
        this.app.data.dashboard.remove(n);
    };


    private duplicate: () => void = () => {
        this.hide();
        const tdi = this.app.data.dashboard.selected()! as ITasksDashItem;
        const tdi2 = new TasksDashItem(this.app, tdi.query.text());
        this.app.data.dashboard.unshift(tdi2);
    };


    private render() {

        const view =
            <ul className="more-menu menu">
                <li onMouseDown={this.duplicate}>Duplicate</li>
                <li className={this.todoCount() === 0 ? "hidden" : ""}
                    onMouseDown={this.completeAll}>
                    Mark All Done <span className="gray">({this.todoCount()})</span>
                </li>
                <li className={this.doneCount() === 0 ? "hidden" : ""}
                    onMouseDown={this.uncompleteAll}>
                    Mark All Todo <span className="gray">({this.doneCount()})</span>
                </li>
                <li onMouseDown={this.hide2}>Hide</li>
                <li onMouseDown={this.delete}>Delete</li>
            </ul>;

        return view;
    }
}