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


    get view() {
        return this.popup.view;
    }


    hide(): void {
        this.popup.hide();
    };


    showBelow(el: HTMLElement): void {
        this.popup.showBelow(el);
    }
}


function getControlledView(app: IApp, owner: DashboardMenuUc) {


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
        </ul>;

    return view;
}