// ReSharper disable once WrongExpressionStatement
import * as Surplus from "surplus"; Surplus;
import data from "surplus-mixin-data";

import { TaskController } from "./controllers";
import * as M from "./model";


export module AppView {
    let resizeStartLeft = -1;
    let labelList: HTMLDivElement;
    export let queryTextBox: HTMLInputElement;
    export let taskEditTextBox: HTMLInputElement;


    window.addEventListener("mousemove",
        (e: MouseEvent) => {
            if (resizeStartLeft !== -1) {
                document.body.classList.add("user-select-none");
                labelList.style.width = (e.clientX - labelList.offsetLeft - 10) + "px";
            }
        },
        false);


    window.addEventListener("mouseup",
        (e: MouseEvent) => {
            resizeStartLeft = -1;
            document.body.classList.remove("user-select-none");
        },
        false);

    
    const taskListView = (c : TaskController) =>
        c.searchedTasks().map(t => {
            let doneChk: HTMLInputElement | undefined = undefined;
            let titleTd: HTMLTableDataCellElement | undefined = undefined;
            return <tr>
                       <td>
                           <input
                               ref={doneChk}
                               type="checkbox"
                               checked={t.completedOn() !== undefined}
                               onChange={() => c.changeTaskCompletion(t, doneChk!)}/>
                       </td>
                       <td ref={titleTd}
                           onMouseDown={() => c.startEditTask(t, titleTd!)}
                           className={t.completedOn() !== undefined
                               ? "completed-task"
                               : ""}>{t.title()}</td>
                       <td>{t.assignedLabels.map(al =>
                           <span
                               className="label-tag"
                               title={al.name()}
                               style={{ backgroundColor: al.color().value }}></span>)}
                       </td>
                   </tr>;
        });

    export const view = (c: TaskController) =>
        <table id="bodyTable">
            <tbody>
            <tr>
                <td>
                    <div ref={labelList} className="label-list">
                        <input type="text"
                               placeholder="new label"
                               className="new-label-input label"
                               fn={data(c.model.newLabelName)}
                               onKeyUp={(e: KeyboardEvent) => c.addLabel(e)}/>
                        {c.model.labelStore.labels.map(l =>
                            <span
                                className={"label" +
                                    (c.model.taskQuery().indexOf(l.name()) === -1 ? "" : " searched-label")}
                                onMouseDown={() => {
                                    c.addOrRemoveLabelFromQuery(l);
                                    setTimeout(() => queryTextBox.focus());
                                }}
                                style={{ "backgroundColor": l.color().value }}>{l.name()}</span>)()}
                    </div>
                </td>
                <td className="vertical-resizer"
                    onMouseDown={(e: MouseEvent) => resizeStartLeft = e.clientX}></td>
                <td>
                    <input
                        type="text"
                        ref={queryTextBox}
                        fn={data(c.model.taskQuery)}/>
                    <input
                        type="button"
                        onMouseDown={() => c.model.taskQuery("")}
                        value="Clear"/>
                    <input
                        type="button"
                        onMouseDown={() => c.addSearch()}
                        value="+"/>

                    <br/>

                    <input type="text"
                           placeholder="new task"
                           className="new-task-input"
                           onKeyUp={(e: KeyboardEvent) => c.addTask(e)}
                           fn={data(c.model.newTaskName)}/>
                    <table className="task-list">
                        <thead></thead>
                        <tbody>{taskListView(c)}
                        </tbody>
                    </table>
                    <input
                        type="text"
                        ref={taskEditTextBox}
                        fn={data(c.model.editTaskTitle)}
                        onKeyUp={(e: KeyboardEvent) => c.setTaskTitle(e)}
                        onBlur={() => c.finishEditingTask()}
                        className="task-text-edit-box"/>
                </td>
            </tr>
            </tbody>
        </table>;

    export const labelAssignView = (c : TaskController) =>
        <div>
            <span>{c.model.selectedTask() ? c.model.selectedTask()!.title : ""}</span>
        </div>;
}