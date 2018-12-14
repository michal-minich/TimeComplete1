import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp } from "../../interfaces";
import popupView from "../PopupView";


export type TaskMenuView = ReturnType<typeof taskMenuView>

export default function taskMenuView(app: IApp) {


    function closeSelected() {
        const n = app.data.dashboard.selected()!;
        app.data.dashboard.remove(n);
    }


    const view =
        <ul className="more-menu menu">
            <li onMouseDown={closeSelected}>Close</li>
        </ul>;


    const popup = popupView(app, view);


    return { view: popup.view, showBelow: popup.showBelow };
}