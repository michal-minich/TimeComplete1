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
import { tasksDashItemUc } from "./TasksDashItemUc";
import TaskTitleEditUc from "./TaskTitleEditUc";
import NoteDashItem from "../../data/dash/NoteDashItem";
import NoteDashItemUc from "./NoteDashItemUc";


export default class DashboardUc implements IDashboardUc{

    constructor(
        private readonly app: IApp,
        private readonly lpv: ILabelsPopupUc,
        private readonly tasksMenu: ITaskMenuUc,
        private readonly noteMenu: INoteMenuUc) {
    }

    private titleEditUc = new TaskTitleEditUc(this.app);


    private items = () => {

        const tds: HTMLTableCellElement[] = [];
        const tdsHeight: number[] = [];
        const numColumns = this.app.data.dashboard.columnsCount;

        for (let i = 0; i < numColumns; i++) {
            tds.push(document.createElement("td"));
            tdsHeight.push(0);
        }

        for (const di of this.app.data.dashboard.items()) {

            if (di instanceof TasksDashItem) {
                const col = indexOfMin(tdsHeight);
                const v = tasksDashItemUc(
                    this.app, di, this.lpv, this.titleEditUc, this.tasksMenu);
                tds[col].appendChild(v);
                tdsHeight[col] += di.estimatedHeight;

            } else if (di instanceof NoteDashItem) {
                const col = indexOfMin(tdsHeight);
                const v = new NoteDashItemUc(this.app, di, this.noteMenu).view;
                tds[col].appendChild(v);
                tdsHeight[col] += di.estimatedHeight;

            } else {
                throw undefined;
            }
        }
        return tds;
    }


    private deselect = () => {
        this.app.data.dashboard.selected(undefined);
    }


    public view =
        <div className="view-area"
             onMouseDown={this.deselect}>
            {this.titleEditUc.view}
            <table className="task-list-activities">
                <tr>{this.items}</tr>
            </table>
        </div>;
}