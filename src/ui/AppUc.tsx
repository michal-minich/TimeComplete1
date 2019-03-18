import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, IAppUc } from "../interfaces";
import LabelsPopupUc from "./popup/LabelsPopupUc";
import { removeTextSelections } from "../common";
import LabelEditUc from "./popup/LabelEditUc";
import TabsUc from "./TabsUc";
import ToolbarUc from "./ToolbarUc";
import DashboardUc from "./dash/DashboardUc";
import TaskMenuUc from "./popup/TaskMenuUc";
import NoteMenuUc from "./popup/NoteMenuUc";


window.addEventListener("mouseup",
    () => {
        window.setTimeout(() => {
                //document.body.classList.remove("users-elect-none");
                removeTextSelections();
            },
            0);
    },
    false);


export default class AppUc implements IAppUc {

    constructor(app: IApp) {

        this.view = getControlledView(app);
    }

    readonly view: HTMLElement;
}


function getControlledView(app: IApp): HTMLElement {

    const tm = new TaskMenuUc(app);
    const nm = new NoteMenuUc(app);
    const elv = new LabelEditUc(app);
    const lpv = new LabelsPopupUc(app, app.data.labels);
    const toolbar = new ToolbarUc(app, elv, lpv);

    const view =
        <div>
            {new TabsUc(app).view}
            {toolbar.view}
            {toolbar.addMenuUc.view}
            {toolbar.noteListUc.view}
            {toolbar.moreMenuUc.view}
            {toolbar.taskListsMenuUc.view}
            {lpv.view}
            {elv.view}
            {tm.view}
            {nm.view}
            {new DashboardUc(app, lpv, tm, nm).view}
        </div>;

    return view;
}