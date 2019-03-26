import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import { IApp, IDashboardMenuUc, IPopupUc } from "../../interfaces";

import PopupUc from "../PopupUc";
import { R } from "../../common";


export default class DashboardMenuUc implements IDashboardMenuUc {

    constructor(app: IApp) {

        const v = getControlledView(app, this);
        this.popup = new PopupUc(app, v);
    }


    readonly autoCols = R.data(false);
    readonly popup: IPopupUc;
    readonly dashEditToggle = R.data(false);


    get view() {
        return this.popup.view;
    }


    hide(): void {
        this.popup.hide();
    };


    showBelow(el: HTMLElement): void {
        this.dashEditToggle(false);
        this.popup.showBelow(el);
    }
}


function getControlledView(app: IApp, owner: DashboardMenuUc) {


    const newName = R.data("");


    function incCol() {
        const d = app.data.dashboard;
        if (+d.columnsCount - 24 === 0)
            return;
        ++d.columnsCount;
    }


    function decCol() {
        const d = app.data.dashboard;
        if (d.columnsCount === 1)
            return;
        --d.columnsCount;
    }


    function edit() {
        newName(app.data.selectedTab.title);
        const val = owner.dashEditToggle();
        owner.dashEditToggle(!val);
    }


    function saveDashEdit() {
        owner.dashEditToggle(false);
        if (newName().trim() === "") {
            cancelDashEdit();
        } else {
            app.data.selectedTab.title = newName();
            cleanup();
        }
    }


    function cancelDashEdit() {
        owner.dashEditToggle(false);
    }


    function cleanup(): void {
        owner.dashEditToggle(false);
    }


    function keyUp(e: KeyboardEvent): void {
        if (e.key === "Enter") {
            saveDashEdit();
            e.preventDefault();
        } else if (e.key === "Escape") {
            cancelDashEdit();
        }
    }


    function del() {
        owner.hide();
        const index = app.data.fields.selectedTabIndex;
        close(index);
    }


    function close(index: number): void {
        const tab = app.data.selectedTab;
        if (!confirm("Close Dashboard '" + tab.title + "'?")) {
            return;
        }
        const selIx = app.data.fields.selectedTabIndex;
        if (selIx > index || selIx === (app.data.tabs().length - 1))
            app.data.fields.selectedTabIndex = selIx - 1;
        app.data.tabDelete(tab);
    }


    const view =
        <ul className="menu">
            <li className="columns-menu">
                <span>Columns</span>
                <input className="hidden"
                       type="checkbox"
                       id="auto-columns-count"
                       fn={data(owner.autoCols)}/>
                <label className="hidden"
                       htmlFor="auto-columns-count">
                    Auto
                </label>
                <fieldset disabled={owner.autoCols()}>
                    <button onMouseDown={decCol}>-</button>
                    <span className="dash-columns-input">
                        {() => app.data.dashboard.columnsCount}
                    </span>
                    <button onMouseDown={incCol}>+</button>
                </fieldset>
            </li>
            <li>
                <input
                    className="view-filter"
                    type="search"
                    placeholder="Dashboard Filter"
                    fn={data(app.data.dashboard.query.text)}/>
            </li>
            <li onMouseDown={edit}>Edit</li>
            <li className={owner.dashEditToggle() ? "" : "hidden"}>
                <input
                    onKeyUp={keyUp}
                    fn={data(newName)}/>
            </li>
            <li onMouseDown={del}>Delete</li>
        </ul>;

    return view;
}