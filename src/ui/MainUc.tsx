import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, IColorStyle, IMainUc } from "../interfaces";
import LabelsPopupUc from "./popup/LabelsPopupUc";
import { removeTextSelections } from "../common";
import LabelEditUc from "./popup/LabelEditUc";
import TabsUc from "./TabsUc";
import ToolbarUc from "./ToolbarUc";
import DashboardUc from "./dash/DashboardUc";
import TaskMenuUc from "./popup/TaskMenuUc";
import NoteMenuUc from "./popup/NoteMenuUc";


export function colorInlineStyle(ls: IColorStyle | undefined) {
    if (ls)
        return {
            backgroundColor: ls.backColor.value,
            color: ls.textColor.value
        };
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


export default class MainUc implements IMainUc {

    constructor(private readonly app: IApp) {

        const tm = new TaskMenuUc(app);
        const nm = new NoteMenuUc(app);
        const elv = new LabelEditUc(app);
        const lpv = new LabelsPopupUc(app, app.data.labels);
        const toolbar = new ToolbarUc(app, elv, lpv);

        this.view =
            <div>
                {new TabsUc(app).view}
                {toolbar.view}
                {toolbar.addMenuUc.view}
                {toolbar.noteListUc.view}
                {toolbar.moreMenuUc.view}
                {lpv.view}
                {elv.view}
                {tm.view}
                {nm.view}
                {new DashboardUc(app, lpv, tm, nm).view}
            </div>;
    }

    readonly view: HTMLElement;
}