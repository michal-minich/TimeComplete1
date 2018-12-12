import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, IColorStyle, INoteDashItem, IDashboard } from "../interfaces";
import labelsPopupView from "./LabelsPopupView";
import { removeTextSelections } from "../common";
import labelEditView from "./LabelEditView";
import tabsView from "./TabsView";
import toolbarView from "./ToolbarView";
import dashboardView from "./dash/DashboardView";
import popupView from "./PopupView";
import NoteDashItem from "../data/dash/NoteDashItem";


export function colorInlineStyle(ls: IColorStyle) {
    return { backgroundColor: ls.backColor.value, color: ls.textColor.value };
}


window.addEventListener("mouseup",
    () => {
        window.setTimeout(() => {
                //document.body.classList.remove("users-elect-none");
                removeTextSelections();
            },
            0);
    },
    false);


export default function mainView(app: IApp) {


    function closeSelected() {
        const n = app.data.dashboard.selected()!;
        app.data.dashboard.remove(n);
        // ReSharper disable VariableUsedInInnerScopeBeforeDeclared
        tm.hide();
        nm.hide();
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
        nm.hide();
    }


    const taskMenu =
        <ul className="more-menu menu">
            <li onMouseDown={closeSelected}>Close</li>
        </ul>;


    const noteMenu =
        <ul className="more-menu menu">
            <li onMouseDown={closeSelected}>Close</li>
            <li onMouseDown={deleteNote}>Delete</li>
        </ul>;


    const tm = popupView(app, taskMenu);
    const nm = popupView(app, noteMenu);
    const elv = labelEditView(app);
    const lpv = labelsPopupView(app, app.data.labels);
    const toolbar = toolbarView(app, elv, lpv);


    function hideMenus() {
        tm.hide();
        nm.hide();
    }


    const view =
        <div onMouseDown={hideMenus}>
            {tabsView(app)}
            {toolbar.view}
            {toolbar.addMenuView}
            {toolbar.noteListView}
            {toolbar.moreMenuView}
            {lpv.view}
            {elv.view}
            {tm.view}
            {nm.view}
            {dashboardView(app, lpv, tm, nm)}
        </div>;

    return view;
}