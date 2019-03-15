import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import {
    IApp,
    INoteMenuView,
    ITaskMenuView,
    ILabelsPopupView,
    IDashboardView
} from "../../interfaces";
import { indexOfMin } from "../../common";
import TasksDashItem from "../../data/dash/TasksDashItem";
import { tasksDashItemView } from "./TasksDashItemView";
import TaskTitleEditView from "./TaskTitleEditView";
import NoteDashItem from "../../data/dash/NoteDashItem";
import { noteDashItemView } from "./NoteDashItemView";


export default class DashboardView implements IDashboardView {

    constructor(
        private readonly app: IApp,
        private readonly lpv: ILabelsPopupView,
        private readonly tasksMenu: ITaskMenuView,
        private readonly noteMenu: INoteMenuView) {
    }

    private titleEditView = new TaskTitleEditView(this.app);


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
                const v = tasksDashItemView(
                    this.app, di, this.lpv, this.titleEditView, this.tasksMenu);
                tds[col].appendChild(v);
                tdsHeight[col] += di.estimatedHeight;

            } else if (di instanceof NoteDashItem) {
                const col = indexOfMin(tdsHeight);
                const v = noteDashItemView(this.app, di, this.noteMenu);
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
            {this.titleEditView.view}
            <table className="task-list-activities">
                <tr>{this.items}</tr>
            </table>
        </div>;
}