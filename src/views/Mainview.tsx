import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, IColorStyle } from "../interfaces";
import labelsPopupView from "./LabelsPopupView";
import { removeTextSelections } from "../common";
import editLabelView from "./EditLabelView";
import tabsView from "./TabsView";
import toolbarView from "./ToolbarView";
import dashboardView from "./DashboardView";


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


export default function mainView(a: IApp) {

    const elv = editLabelView(a);
    const lpv = labelsPopupView(a, a.data.labels);

    const view =
        <div>
            {tabsView(a)}
            {toolbarView(a, elv, lpv)}
            {lpv.view}
            {elv.view}
            {dashboardView(a, lpv)}
        </div>;

    return view;
}