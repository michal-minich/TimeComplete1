import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp } from "../interfaces";
import { indexOfMin } from "../common";
import TasksDashItem from "../data/TasksDashItem";
import { LabelsPopupView } from "./LabelsPopupView";
import { tasksDashItemView } from "./TasksDashItemView";
import editTaskTitleView from "./EditTaskTitleView";


export default function dashboardView(a: IApp, lpv: LabelsPopupView) {

    const ettv = editTaskTitleView(a);

    const view =
        <div className="view-area">
            {ettv.view}
            <table className="task-list-activities">
                <tr>
                    {() => {
                        const tds: HTMLTableCellElement[] = [];
                        const tdsHeight: number[] = [];
                        const numColumns = a.data.settings.dashboardColumnsCount();
                        for (let i = 0; i < numColumns; i++) {
                            tds.push(document.createElement("td"));
                            tdsHeight.push(0);
                        }
                        for (const di of a.dashboard.items()) {
                            if (!(di instanceof TasksDashItem))
                                continue;
                            const col = indexOfMin(tdsHeight);
                            const v = tasksDashItemView(a, di, lpv, ettv);
                            tds[col].appendChild(v);
                            tdsHeight[col] += di.estimatedHeight;
                        }
                        return tds;
                    }}
                </tr>
            </table>
        </div>;

    return view;
}