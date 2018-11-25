import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, IColorStyle as ILabelStyle } from "../interfaces";
import { labelsPopupView } from "./LabelsPopupView";
import { indexOfMin, removeTextSelections } from "../common";
import editLabelView from "./EditLabelView";
import TasksDashItem from "../data/TasksDashItem";
import { tasksDashItemView } from "./TasksDashItemView";
import tabsView from "./TabsView";
import editTaskTitleView from "./EditTaskTitleView";
import toolbarView from "./ToolbarView";


export let taskEditTextBox: HTMLTextAreaElement;


export function labelInlineStyle(ls: ILabelStyle) {
    return { backgroundColor: ls.backColor.value, color: ls.textColor.value };
}


window.addEventListener("mouseup",
    () => {
        window.setTimeout(() => {
                document.body.classList.remove("users-elect-none");
                removeTextSelections();
            },
            0);
    },
    false);


export default function mainView(a: IApp) {

    const elv = editLabelView(a);
    const lpv = labelsPopupView(a, a.data.labels);
    const ettv = editTaskTitleView(a);

    const view =
        <div>
            {tabsView(a)}
            {toolbarView(a)}
            {lpv.view}
            {elv.view}
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
            </div>
        </div>;

    return view;
}