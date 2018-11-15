import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
Surplus;
import data from "surplus-mixin-data";
import { IApp, ILabelStyle } from "../interfaces";
import { taskListActivityView } from "./TaskListActivityView";
import { labelsPopupView } from "./LabelsPopupView";
import { onMouseDown } from "../common";


export let taskEditTextBox: HTMLTextAreaElement;


export function labelInlineStyle(ls: ILabelStyle) {
    return { backgroundColor: ls.backColor.value, color: ls.textColor.value };
}


export const mainView = (a: IApp) =>
    <div className="main-view">
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
        </div>
        {labelsPopupView(a, a.activity.labelsPopup, a.data.labels.items)}

        <div className="view-area">
            <textarea
                ref={taskEditTextBox}
                fn={data(a.activity.editTaskTitle.newName)}
                onKeyUp={(e: KeyboardEvent) => a.activity.editTaskTitle.keyUp(e)}
                onBlur={() => a.activity.editTaskTitle.commit()}
                className="task-text-edit-box selected-task"></textarea>
            <div className="task-list-activities">
                {a.activity.taskLists.items.map(tla2 => taskListActivityView(a, tla2))()}
                <div className="task-list-activities-footer">
                    123 task and labels 12 are not listed
                </div>
            </div>
        </div>
    </div>;