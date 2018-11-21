import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import { IApp, ILabelStyle } from "../interfaces";
import { taskListActivityView } from "./TaskListActivityView";
import { labelsPopupView } from "./LabelsPopupView";
import { onMouseDown, indexOfMin, removeTextSelections, R } from "../common";
import editLabelView from "./EditLabelView";


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
                <button onClick={() => a.activity.taskLists.addNew()}>
                    Add <span className="drop-down-triangle">&#x25BC;</span>
                </button>
                <button onClick={() => a.generateLocalStorageDownload()}>Export</button>
                <input className="view-filter" type="number" fn={data(numColumnsSignal)}/>
                <input className="view-filter" type="search" placeholder="View Filter"/>
                <ul className="add-menu menu">
                    <li onClick={() => a.activity.taskLists.addNew()}>Add New Task List</li>
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
                <textarea
                ref={taskEditTextBox}
                fn={data(a.activity.editTaskTitle.newName)}
                onKeyUp={(e: KeyboardEvent) => a.activity.editTaskTitle.keyUp(e)}
                onBlur={() => a.activity.editTaskTitle.confirm()}
                className="task-text-edit-box selected-task"></textarea>
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
                            const items = a.activity.taskLists.items();
                            for (let tla2 of items) {
                                const col = indexOfMin(tdsHeight);
                                const v = taskListActivityView(a, tla2, lpv);
                                tds[col].appendChild(v);
                                tdsHeight[col] += tla2.estimatedHeight;
                            }
                            return tds;
                        }}
                    </tr>
                </table>
            </div>
        </div>;

    return view;
}