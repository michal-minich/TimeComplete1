import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import { IApp, IColorStyle as ILabelStyle } from "../interfaces";
import { labelsPopupView } from "./LabelsPopupView";
import { onMouseDown, indexOfMin, removeTextSelections, R } from "../common";
import editLabelView from "./EditLabelView";
import TasksDashItem from "../data/TasksDashItem";
import { tasksDashItemView } from "./TasksDashItemView";
import editTaskTitleView from "./EditTaskTitleView";


export let taskEditTextBox: HTMLTextAreaElement;
let numColumnsSignal = R.data(3);


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
            <div className="tab-bar hidden">
                <img className="logo" src="favicon.png" alt="Time Complete"/>
                <span className="tab active-tab">Tasks 1</span>
                <span className="tab">Tasks 2</span>
                <span className="tab">Tasks 3</span>
                <span className="tab-plus">
                    <span>+</span>
                </span>
            </div>
            <div className="toolbar">
                <button fn={onMouseDown((e) => lpv.show(e.target as HTMLElement,
                    (l, el) => elv.begin(l, el)))}>
                    Labels <span className="drop-down-triangle">&#x25BC;</span>
                </button>
                <button>
                    Notes <span className="drop-down-triangle">&#x25BC;</span>
                </button>
                <button onClick={() => a.dashboard.unshift(new TasksDashItem(a))}>
                    Add <span className="drop-down-triangle">&#x25BC;</span>
                </button>
                <button onClick={() => a.generateLocalStorageDownload()}>Export</button>
                <input className="view-filter" type="number" fn={data(numColumnsSignal)}/>
                <input className="view-filter" type="search" placeholder="View Filter"/>
                <ul className="add-menu menu">
                    <li onClick={() => a.dashboard.unshift(new TasksDashItem(a))}>
                        Add New Task List
                    </li>
                    <li>Add New Note</li>
                    <li>Add Footer</li>
                </ul>
                <ul className="more-menu menu">
                    <li className="columns-menu">
                        <span>Columns</span>
                        <input type="checkbox" id="auto-columns-count"/><label htmlFor="auto-columns-count">Auto</label>
                        <button>-</button>

                        <button>+</button>
                    </li>
                    <li onClick={() => a.generateLocalStorageDownload()}>Export Data</li>
                </ul>
            </div>
            {lpv.view}
            {elv.view}
            <div className="view-area">
                {ettv.view}
                <table className="task-list-activities">
                    <tr>
                        {() => {
                            const tds: HTMLTableCellElement[] = [];
                            const tdsHeight: number[] = [];
                            const numColumns = numColumnsSignal();
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