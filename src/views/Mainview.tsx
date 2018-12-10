import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, IColorStyle } from "../interfaces";
import labelsPopupView from "./LabelsPopupView";
import { removeTextSelections } from "../common";
import labelEditView from "./LabelEditView";
import tabsView from "./TabsView";
import toolbarView from "./ToolbarView";
import dashboardView from "./dash/DashboardView";


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

    const elv = labelEditView(app);
    const lpv = labelsPopupView(app, app.data.labels);
    const toolbar = toolbarView(app, elv, lpv);

    const view =
        <div>
            {tabsView(app)}
            {toolbar.view}
            {toolbar.addMenuView}
            {toolbar.noteListView}
            {toolbar.moreMenuView}
            {lpv.view}
            {elv.view}
            {dashboardView(app, lpv)}
        </div>;

    return view;
}