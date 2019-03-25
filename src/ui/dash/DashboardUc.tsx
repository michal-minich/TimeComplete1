import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import {
    IApp,
    ITaskMenuUc,
    ILabelsPopupUc,
    IDashboardUc,
    ITaskNoteMenuUc
} from "../../interfaces";
import { indexOfMin } from "../../common";
import TasksDashItem from "../../data/dash/TasksDashItem";
import TasksDashItemUc from "./TasksDashItemUc";
import TaskTitleEditUc from "./TaskTitleEditUc";
import TaskDashItem from "../../data/dash/TaskDashItem";
import TaskDashItemUc from "./TaskDashItemUc";


export default class DashboardUc implements IDashboardUc {

    constructor(
        app: IApp,
        lpv: ILabelsPopupUc,
        tasksMenu: ITaskMenuUc,
        taskMenu: ITaskNoteMenuUc) {

        this.view = getControlledView(app, lpv, tasksMenu, taskMenu);
    }

    readonly view: HTMLElement;
}


function getControlledView(
    app: IApp,
    lpv: ILabelsPopupUc,
    tasksMenu: ITaskMenuUc,
    taskMenu: ITaskNoteMenuUc): HTMLElement {

    const titleEditUc = new TaskTitleEditUc(app);


    function items() {

        const tds: HTMLTableCellElement[] = [];
        const tdsHeight: number[] = [];
        const numColumns = app.data.dashboard.columnsCount;

        for (let i = 0; i < numColumns; i++) {
            tds.push(document.createElement("td"));
            tdsHeight.push(0);
        }

        const dashItems = app.data.dashboard.items();
        for (const di of dashItems) {
            if (!di.visible)
                continue;
            if (di instanceof TasksDashItem) {
                const col = indexOfMin(tdsHeight);
                const tdi = new TasksDashItemUc(
                    app,
                    di,
                    lpv,
                    titleEditUc,
                    tasksMenu);
                tds[col].appendChild(tdi.view);
                tdsHeight[col] += di.estimatedHeight;

            } else if (di instanceof TaskDashItem) {
                const col = indexOfMin(tdsHeight);
                const ndi = new TaskDashItemUc(app, di, taskMenu);
                tds[col].appendChild(ndi.view);
                tdsHeight[col] += di.estimatedHeight;

            } else {
                throw undefined;
            }
        }
        return tds;
    }


    function deselect() {
        app.data.dashboard.selected(undefined);
    }


    const view =
        <div className="view-area" onMouseDown={deselect}>
            {titleEditUc.view}
            <table className="task-list-activities">
                <tr>{items}</tr>
            </table>
        </div>;

    return view;
}