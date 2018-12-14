import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, INoteDashItem, IDashboard } from "../../interfaces";
import popupView from "../PopupView";
import NoteDashItem from "../../data/dash/NoteDashItem";


export type NoteMenuView = ReturnType<typeof noteMenuView>

export default function noteMenuView(app: IApp) {


    function closeSelected() {
        const n = app.data.dashboard.selected()!;
        app.data.dashboard.remove(n);
        // ReSharper disable VariableUsedInInnerScopeBeforeDeclared
        popup.hide();
        // ReSharper restore VariableUsedInInnerScopeBeforeDeclared
    }


    function deleteNote() {
        const ndi = app.data.dashboard.selected()! as INoteDashItem;
        const n = ndi.note;
        for (const tab of app.data.tabs()) {
            const d = tab.content as IDashboard;
            const ndiToRemove = d.items()
                .filter(ndi2 => ndi2 instanceof NoteDashItem && ndi2.note === n);
            for (const r of ndiToRemove)
                d.remove(r);
        }
        app.data.noteDelete(ndi.note);
        // ReSharper disable once VariableUsedInInnerScopeBeforeDeclared
        popup.hide();
    }


    const view =
        <ul className="more-menu menu">
            <li onMouseDown={closeSelected}>Close</li>
            <li onMouseDown={deleteNote}>Delete</li>
        </ul>;


    const popup = popupView(app, view);


    return { view: popup.view, showBelow: popup.showBelow };
}