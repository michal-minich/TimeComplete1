import S from "s-js";
import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
Surplus;
import data from "surplus-mixin-data";
import { IApp, ILabelStyle } from "../interfaces";
import { taskListActivityView } from "./TaskListActivityView";
import { labelsPopupView } from "./LabelsPopupView";
import { onMouseDown, indexOfMin } from "../common";


export let taskEditTextBox: HTMLTextAreaElement;
let numColumnsSignal = S.data(3);

export function labelInlineStyle(ls: ILabelStyle) {
    return { backgroundColor: ls.backColor.value, color: ls.textColor.value };
}


export const mainView = (a: IApp) =>
    <div>
        <div className="tab-bar">
            <img className="logo" src="favicon.png" alt="Time Complete"/>
            <span className="tab active-tab">Tasks 1</span>
            <span className="tab">Tasks 2</span>
            <span className="tab">Tasks 3</span>
            <span className="tab-plus">
                <span>+</span>
            </span>
        </div>
        <div className="toolbar">
            <button fn={onMouseDown((e) =>
                a.activity.labelsPopup.show(e.target as HTMLButtonElement))}>
                Labels
            </button>
            <button>Tasks</button>
            <button onClick={() => a.activity.taskLists.addNew()}>Add</button>
            <button onClick={() => a.generateLocalStorageDownload()}>Export</button>
            <input className="main-search-input" type="search" placeholder="Search"/>
            <input className="view-filter" type="search" placeholder="View Filter"/>
            <input className="view-filter" type="number" fn={data(numColumnsSignal)}/>
        </div>
        {labelsPopupView(a, a.activity.labelsPopup, a.data.labels.items)}

        <div className="view-area">
            <textarea
                ref={taskEditTextBox}
                fn={data(a.activity.editTaskTitle.newName)}
                onKeyUp={(e: KeyboardEvent) => a.activity.editTaskTitle.keyUp(e)}
                onBlur={() => a.activity.editTaskTitle.commit()}
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
                            const v = taskListActivityView(a, tla2);
                            tds[col].appendChild(v);
                            tdsHeight[col] += tla2.estimatedHeight;
                            console.log(tla2.estimatedHeight);
                            console.log(tdsHeight);
                        }
                        return tds;
                    }}
                </tr>
            </table>
        </div>
    </div>;