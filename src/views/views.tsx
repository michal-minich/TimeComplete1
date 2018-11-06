import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
Surplus;
import data from "surplus-mixin-data";
import { IApp } from "../interfaces";
import { taskListActivityView } from "./TaskListActivityView";
import { labelListView } from "./LabelListView";
import { labelAssociateView } from "./LabelAssociateView";
import { editLabelView } from "./EditLabelView";


let resizeStartLeft = -1;
let labelList: HTMLDivElement;
export let taskEditTextBox: HTMLInputElement;
let leftTd: HTMLTableCellElement;


window.addEventListener("mousemove",
    (e: MouseEvent) => {
        if (resizeStartLeft !== -1) {
            document.body.classList.add("user-select-none");
            labelList.style.width = (e.clientX - labelList.offsetLeft - 10) + "px";
            leftTd.style.width = (e.clientX - leftTd.offsetLeft - 10) + "px";
        }
    },
    false);


window.addEventListener("mouseup",
    (e: MouseEvent) => {
        resizeStartLeft = -1;
        window.setTimeout(() => document.body.classList.remove("user-select-none"), 0);
    },
    false);


export const view = (a: IApp) =>
    <table id="bodyTable">
        <tbody>
        <tr>
            <td ref={leftTd}>
                <div className="toolbar">
                    <button onClick={() => a.activity.editLabel.switchMode()}>
                        {() => a.activity.editLabel.nextModeName}
                    </button>
                </div>
                {a.activity.selectTask.selectedTask === undefined
                    ? labelListView(a)
                    : labelAssociateView(a) }
                {editLabelView(a)}
            </td>
            <td className="vertical-resizer"
                onMouseDown={(e: MouseEvent) => resizeStartLeft = e.clientX}>
            </td>
            <td>
                <div className="toolbar">
                    <input type="text"></input>
                </div>
                <div id="task-list-activities">
                    <input
                        type="text"
                        ref={taskEditTextBox}
                        fn={data(a.activity.editTaskTitle.newName)}
                        onKeyUp={(e: KeyboardEvent) => a.activity.editTaskTitle.keyUp(e)}
                        onBlur={() => a.activity.editTaskTitle.commit()}
                        className="task-text-edit-box selected-task"/>
                    {a.activity.taskLists.items.map(tla2 => taskListActivityView(a, tla2))()}
                </div>
                <button onClick={() => a.activity.taskLists.addNew()}>+</button>
                <button onClick={() => a.generateLocalStorageDownload()}>Download</button>
            </td>
        </tr>
        </tbody>
    </table>;