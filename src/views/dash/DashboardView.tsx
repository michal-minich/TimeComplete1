import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp } from "../../interfaces";
import { indexOfMin } from "../../common";
import TasksDashItem from "../../data/dash/TasksDashItem";
import { LabelsPopupView } from "../LabelsPopupView";
import { tasksDashItemView } from "./TasksDashItemView";
import taskTitleEditView from "./TaskTitleEditView";
import NoteDashItem from "../../data/dash/NoteDashItem";
import { noteDashItemView } from "./NoteDashItemView";


export default function dashboardView(app: IApp, lpv: LabelsPopupView) {

    const ettv = taskTitleEditView(app);

    const view =
        <div className="view-area">
            {ettv.view}
            <table className="task-list-activities">
                <tr>
                    {() => {
                        const tds: HTMLTableCellElement[] = [];
                        const tdsHeight: number[] = [];
                        const numColumns = app.data.settings.dashboardColumnsCount;
                        for (let i = 0; i < numColumns; i++) {
                            tds.push(document.createElement("td"));
                            tdsHeight.push(0);
                        }
                        for (const di of app.data.dashboard.items()) {
                            if (di instanceof TasksDashItem) {
                                const col = indexOfMin(tdsHeight);
                                const v = tasksDashItemView(app, di, lpv, ettv);
                                tds[col].appendChild(v);
                                tdsHeight[col] += di.estimatedHeight;
                            } else if (di instanceof NoteDashItem) {
                                const col = indexOfMin(tdsHeight);
                                const v = noteDashItemView(app, di);
                                tds[col].appendChild(v);
                                tdsHeight[col] += di.estimatedHeight;
                            } else {
                                throw undefined;
                            }
                        }
                        return tds;
                    }}
                </tr>
            </table>
        </div>;

    return view;
}