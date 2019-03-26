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
import TaskNoteMenuUc from "./popup/TaskNoteMenuUc";
import DashboardMenuUc from "./popup/DashboardMenuUc";


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

    const tabs = new TabsUc(app);
    const dm = new DashboardMenuUc(app);
    const nm = new TaskNoteMenuUc(app);
    const elv = new LabelEditUc(app);
    const lpv = new LabelsPopupUc(app, app.data.labels);
    const toolbar = new ToolbarUc(app, elv, lpv, dm);
    const tm = new TaskMenuUc(app);
    const dash = new DashboardUc(app, lpv, tm, nm);

    return (
        <div>
            {tabs.view}
            {toolbar.view}
            {toolbar.taskMenuUc.view}
            {dm.view}
            {toolbar.moreMenuUc.view}
            {lpv.view}
            {elv.view}
            {elv.editView}
            {tm.view}
            {nm.view}
            {dash.view}
        </div>);
}