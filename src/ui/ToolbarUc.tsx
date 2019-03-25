import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import {
    IApp,
    IToolbarUc,
    IPopupUc,
    ILabelEditUc,
    ILabelsPopupUc,
    IDashItem,
    IDashboardMenuUc,
} from "../interfaces";
import TasksDashItem from "../data/dash/TasksDashItem";
import PopupUc from "./PopupUc";
import TaskDashItem from "../data/dash/TaskDashItem";
import { getButton } from "../common";
import { AppDataOps } from "../operations/AppDataOps";
import Task from "../data/domain/Task";


export default class ToolbarUc implements IToolbarUc {

    constructor(
        private readonly app: IApp,
        readonly elv: ILabelEditUc,
        readonly lpv: ILabelsPopupUc,
        readonly dashboardMenu: IDashboardMenuUc) {

        this.view = getControlledView(app, this);
        this.taskMenuUc = new PopupUc(this.app, getControlledViewTasksMenu(app, this));
        this.moreMenuUc = new PopupUc(this.app, getControlledViewMoreMenu(app));
    }


    readonly view: HTMLElement;
    readonly taskMenuUc: IPopupUc;
    readonly moreMenuUc: IPopupUc;
}


function getControlledView(app: IApp, owner: ToolbarUc) {


    function showLabelsMenu(e: MouseEvent): void {
        owner.lpv.show(
            getButton(e.target),
            undefined,
            (l, el) => owner.elv.begin(l, el));
    }


    function showTasksMenu(e: MouseEvent): void {
        owner.taskMenuUc.showBelow(getButton(e.target));
    }


    function showDashboardMenu(e: MouseEvent): void {
        owner.dashboardMenu.showBelow(getButton(e.target));
    }


    function showMoreMenu(e: MouseEvent): void {
        owner.moreMenuUc.showBelow(getButton(e.target));
    }


    function selectedTabColor() {
        const tab = app.data.tabs()[app.data.fields.selectedTabIndex];
        if (tab.style)
            return tab.style.backColor.value;
        else
            return "gray";
    }


    const view =
        <div className="toolbar"
             style={{ borderTopColor: selectedTabColor() }}>
            <span className="menu-button button"
                  onMouseDown={showLabelsMenu}>
                Labels <span className="drop-down-triangle">&#x25BC;</span>
            </span>
            <span className="menu-button button"
                  onMouseDown={showTasksMenu}>
                Tasks <span className="drop-down-triangle">&#x25BC;</span>
            </span>
            <span className="menu-button button"
                  onMouseDown={showDashboardMenu}>
                Dashboard <span className="drop-down-triangle">&#x25BC;</span>
            </span>
            <span className="menu-button button"
                  onMouseDown={showMoreMenu}>
                More <span className="drop-down-triangle">&#x25BC;</span>
            </span>
        </div>;
    return view;
}


function getControlledViewTasksMenu(app: IApp, owner: ToolbarUc) {


    function addTask(): void {
        const n = Task.createNew(app, "", "");
        app.data.taskAdd(n);
        owner.taskMenuUc.hide();
        app.data.dashboard.unshift(new TaskDashItem(app, n));
    }


    function addTaskList(): void {
        const tdi = new TasksDashItem(app, "");
        app.data.dashboard.unshift(tdi);
        owner.taskMenuUc.hide();
    }


    function showDashItem(di: IDashItem) {
        owner.taskMenuUc.hide();
        di.visible = true;
    }

    const view =
        <ul className="add-menu menu">
            <li onClick={addTaskList}>Add New Task List</li>
            <li onClick={addTask}>Add New Task</li>
            <li className="menu-sep"></li>
            {app.data.dashboard.items()
                .filter(i => !i.visible)
                .map(di =>
                    <li onClick={() => showDashItem(di)}>
                        {getDiText(di)}
                    </li>)
            }
        </ul>;
    return view;

}


function getDiText(di: IDashItem) {
    if (di instanceof TasksDashItem)
        return di.query.text;
    if (di instanceof TaskDashItem)
        return di.task.title;
    else
        throw undefined;
}


function getControlledViewMoreMenu(app: IApp) {


    function exp() {
        AppDataOps.exportData(app.localStore);
    }


    function imp() {
        AppDataOps.importData(app.localStore);
    }


    const view =
        <ul className="more-menu menu">
            <li onMouseDown={exp}>Export Data</li>
            <li onClick={imp}>Import Data</li>
        </ul>;
    return view;

}