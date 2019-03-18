import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import {
    IApp,
    INoteMenuUc,
    ITaskMenuUc,
    ILabelsPopupUc,
    IDashboardUc
} from "../../interfaces";
import { indexOfMin } from "../../common";
import TasksDashItem from "../../data/dash/TasksDashItem";
import TasksDashItemUc from "./TasksDashItemUc";
import TaskTitleEditUc from "./TaskTitleEditUc";
import NoteDashItem from "../../data/dash/NoteDashItem";
import NoteDashItemUc from "./NoteDashItemUc";


export default class DashboardUc implements IDashboardUc {

    constructor(
        app: IApp,
        lpv: ILabelsPopupUc,
        tasksMenu: ITaskMenuUc,
        noteMenu: INoteMenuUc) {

        this.view = getControlledView(app, lpv, tasksMenu, noteMenu);
    }

    readonly view: HTMLElement;
}


function getControlledView(
    app: IApp,
    lpv: ILabelsPopupUc,
    tasksMenu: ITaskMenuUc,
    noteMenu: INoteMenuUc): HTMLElement {

    const titleEditUc = new TaskTitleEditUc(app);


    function items() {

        const tds: HTMLTableCellElement[] = [];
        const tdsHeight: number[] = [];
        const numColumns = app.data.dashboard.columnsCount;

        for (let i = 0; i < numColumns; i++) {
            tds.push(document.createElement("td"));
            tdsHeight.push(0);
        }

        for (const di of app.data.dashboard.items()) {

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

            } else if (di instanceof NoteDashItem) {
                const col = indexOfMin(tdsHeight);
                const ndi = new NoteDashItemUc(app, di, noteMenu);
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