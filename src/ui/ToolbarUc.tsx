import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import {
    IApp,
    IToolbarUc,
    IPopupUc,
    ILabelEditUc,
    ILabelsPopupUc,
    IDashItem,
} from "../interfaces";
import TasksDashItem from "../data/dash/TasksDashItem";
import PopupUc from "./PopupUc";
import TaskDashItem from "../data/dash/TaskDashItem";
import { R, getButton } from "../common";
import { AppDataOps } from "../operations/AppDataOps";
import Task from "../data/domain/Task";


export default class ToolbarUc implements IToolbarUc {

    constructor(
        private readonly app: IApp,
        readonly elv: ILabelEditUc,
        readonly lpv: ILabelsPopupUc) {

        this.view = getControlledView(app, this);
        this.taskMenuListUc = new PopupUc(this.app, getControlledView_DashboardMenu(app, this));
        this.moreMenuUc = new PopupUc(this.app, getControlledView_MoreMenu(app, this));
    }

    readonly autoCols = R.data(true);
    readonly view: HTMLElement;
    readonly taskMenuListUc: IPopupUc;
    readonly moreMenuUc: IPopupUc;


}


function getDiText(di: IDashItem) {
    if (di instanceof TasksDashItem)
        return di.query.text;
    if (di instanceof TaskDashItem)
        return di.task.title;
    else
        throw undefined;
}


function getControlledView(app: IApp, owner: ToolbarUc) {


    function showLabels(e: MouseEvent): void {
        owner.lpv.show(
            getButton(e.target),
            undefined,
            (l, el) => owner.elv.begin(l, el));
    }


    function showTaskListView(e: MouseEvent): void {
        owner.taskMenuListUc.showBelow(getButton(e.target));
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
                  onMouseDown={showLabels}>
                Labels <span className="drop-down-triangle">&#x25BC;</span>
            </span>
            <span className="menu-button button"
                  onMouseDown={showTaskListView}>
                Tasks <span className="drop-down-triangle">&#x25BC;</span>
            </span>
            <span className="menu-button button"
                  onMouseDown={showMoreMenu}>
                More <span className="drop-down-triangle">&#x25BC;</span>
            </span>
        </div>;
    return view;
}


function getControlledView_DashboardMenu(app: IApp, owner: ToolbarUc) {


    function addTask(): void {
        const n = Task.createNew(app, "", "");
        app.data.taskAdd(n);
        owner.taskMenuListUc.hide();
        app.data.dashboard.unshift(new TaskDashItem(app, n));
    };


    function addTaskList(): void {
        const tdi = new TasksDashItem(app, "");
        app.data.dashboard.unshift(tdi);
        owner.taskMenuListUc.hide();
    };


    const view =
        <ul className="add-menu menu">
            <li onClick={addTaskList}>Add New Task List</li>
            <li onClick={addTask}>Add New Task</li>
            <li className="menu-sep"></li>
            {app.data.dashboard.items()
                .filter(i => !i.visible)
                .map(di =>
                    <li onClick={() => di.visible = true}>
                        {getDiText(di)}
                    </li>)
            }
            <li className="menu-sep"></li>
            <li>
                <input
                    className="view-filter"
                    type="search"
                    placeholder="Dashboard Filter"
                    fn={data(app.data.dashboard.query.text)}/>
            </li>
        </ul>;
    return view;

}


function getControlledView_MoreMenu(app: IApp, owner: ToolbarUc) {

    const view =
        <ul className="more-menu menu">
            <li className="columns-menu">
                <span>Columns</span>
                <input type="checkbox"
                       id="auto-columns-count"
                       fn={data(owner.autoCols)}/>
                <label htmlFor="auto-columns-count">Auto</label>
                <fieldset disabled={owner.autoCols()}>
                    <button onMouseDown={
                        () => --app.data.dashboard.columnsCount
                    }>-</button>
                    <span className="dash-columns-input">{
                        () => app.data.dashboard.columnsCount
                    }</span>
                    <button onMouseDown={
                        () => ++app.data.dashboard.columnsCount
                    }>+</button>
                </fieldset>
            </li>
            <li onMouseDown={() => AppDataOps.exportData(app.localStore)}>
                Export Data
            </li>
            <li onClick={() => AppDataOps.importData(app.localStore)}>
                Import Data
            </li>
        </ul>;
    return view;

}