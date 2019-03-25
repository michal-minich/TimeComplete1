import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import {
    IApp,
    IDashboard,
    ITaskNoteMenuUc,
    IPopupUc,
    ITaskDashItem,
    ITask
} from "../../interfaces";
import PopupUc from "../PopupUc";
import TaskDashItem from "../../data/dash/TaskDashItem";
import Task from "../../data/domain/Task";


export default class TaskNoteMenuUc implements ITaskNoteMenuUc {

    constructor(app: IApp) {

        const v = getControlledView(app, this.hide);
        this.popup = new PopupUc(app, v);
    }


    private readonly popup: IPopupUc;


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

    function duplicate(): void {
        hide();
        const n = app.data.dashboard.selected()! as ITaskDashItem;
        const n2 = Task.createNew(app, n.task.title, n.task.text);
        app.data.taskAdd(n2);
        app.data.dashboard.unshift(new TaskDashItem(app, n2));
    };


    function hideDashItem(): void {
        hide();
        const tdi = app.data.dashboard.selected()! as ITaskDashItem;
        const t = tdi.task;
        tdi.visible = false;
        //removeTdiByTask(app.data.dashboard, t);
    };

    
    function close(): void {
        hide();
        const n = app.data.dashboard.selected()!;
        app.data.dashboard.remove(n);
    };


    function del(): void {
        hide();
        const tdi = app.data.dashboard.selected()! as ITaskDashItem;
        const t = tdi.task;
        for (const tab of app.data.tabs()) {
            const d = tab.content as IDashboard;
            removeTdiByTask(d, t);
        }
        app.data.taskDelete(t);
    };


    function removeTdiByTask(d: IDashboard, t: ITask) {
        const ndiToRemove = d.items()
            .filter(ndi2 => ndi2 instanceof TaskDashItem && ndi2.task === t);
        for (const r of ndiToRemove)
            d.remove(r);
    }


    const view =
        <ul className="more-menu menu">
            <li onMouseDown={duplicate}>Duplicate</li>
            <li onMouseDown={hideDashItem}>Hide</li>
            <li onMouseDown={close}>Close</li>
        </ul>;
    return view;

}