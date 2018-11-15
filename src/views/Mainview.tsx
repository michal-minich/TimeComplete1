import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
Surplus;
import data from "surplus-mixin-data";
import { IApp, ILabelStyle } from "../interfaces";
import { taskListActivityView } from "./TaskListActivityView";
import { labelsPopupView } from "./LabelsPopupView";
import { onMouseDown } from "../common";


export let taskEditTextBox: HTMLInputElement;


export function labelInlineStyle(ls: ILabelStyle) {
    return { backgroundColor: ls.backColor.value, color: ls.textColor.value };
}


export const mainView = (a: IApp) =>
    <table id="bodyTable">
        <tbody>
        <tr>
            <img className="logo" src="favicon.png" alt="Time Complete" />
            <div className="tab-bar">
                <span className="tab active-tab">Tasks 1</span>
                <span className="tab">Tasks 2</span>
                <span className="tab">Tasks 3</span>
                <span className="tab-plus"><span>+</span></span>
            </div>
            <div className="toolbar">
                <button fn={onMouseDown((e) =>
                    a.activity.labelsPopup.show(e.target as HTMLButtonElement))}>
                    Labels
                </button>
                <button>Tasks</button>
                <button onClick={() => a.activity.taskLists.addNew()}>Add</button>
                <button onClick={() => a.generateLocalStorageDownload()}>Export</button>
                <input className="main-search-input" type="search" placeholder="Search" />
                <input className="view-filter" type="search" placeholder="View Filter" />
            </div>
            {labelsPopupView(a, a.activity.labelsPopup, a.data.labels.items)}
        </tr>
        <tr>
            <td className="view-area">
                <div className="task-list-activities">
                    <input
                        type="text"
                        ref={taskEditTextBox}
                        fn={data(a.activity.editTaskTitle.newName)}
                        onKeyUp={(e: KeyboardEvent) => a.activity.editTaskTitle.keyUp(e)}
                        onBlur={() => a.activity.editTaskTitle.commit()}
                        className="task-text-edit-box selected-task"/>
                    {a.activity.taskLists.items.map(tla2 => taskListActivityView(a, tla2))()}
                    <div className="task-list-activities-footer">
                        123 task and labels 12 are not listed
                    </div>
                </div>
            </td>
        </tr>
        </tbody>
    </table>;