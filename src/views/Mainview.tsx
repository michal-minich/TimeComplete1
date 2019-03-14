import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, IColorStyle } from "../interfaces";
import labelsPopupView from "./popup/LabelsPopupView";
import { removeTextSelections } from "../common";
import labelEditView from "./popup/LabelEditView";
import tabsView from "./TabsView";
import ToolbarView from "./ToolbarView";
import dashboardView from "./dash/DashboardView";
import taskMenuView from "./popup/TaskMenuView";
import NoteMenuView from "./popup/NoteMenuView";


export function colorInlineStyle(ls: IColorStyle | undefined) {
    if (ls)
        return { backgroundColor: ls.backColor.value, color: ls.textColor.value };
    else
        return { backgroundColor: "gray", color: "white" };
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


    const tm = taskMenuView(app);
    const nm = new NoteMenuView(app);
    const elv = labelEditView(app);
    const lpv = labelsPopupView(app, app.data.labels);
    const toolbar = new ToolbarView(app, elv, lpv);


    const view =
        <div>
            {tabsView(app)}
            {toolbar.view}
            {toolbar.addMenuView.view}
            {toolbar.noteListView.view}
            {toolbar.moreMenuView.view}
            {lpv.view}
            {elv.view}
            {tm.view}
            {nm.view}
            {dashboardView(app, lpv, tm, nm)}
        </div>;

    return view;
}