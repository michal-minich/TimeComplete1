// ReSharper disable once WrongExpressionStatement
import * as Surplus from "surplus";
Surplus;
import data from "surplus-mixin-data";

import * as M from "./model";


export module AppView {
    let resizeStartLeft = -1;
    let labelList: HTMLDivElement;
    export let queryTextBox: HTMLInputElement;
    export let taskEditTextBox: HTMLInputElement;

    let assignLabelPopup: HTMLTableElement;

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


    const taskListView = (a: M.IApp) =>
        a.searchTaskListActivity.resultTasks().map(t => {
            let doneChk: HTMLInputElement | undefined = undefined;
            let titleTd: HTMLTableDataCellElement | undefined = undefined;
            return <tr>
                       <td>
                           <input
                               ref={doneChk}
                               type="checkbox"
                               checked={t.completedOn() !== undefined}
                               onChange={() => a.changeTaskCompletionActivity.perform(t, doneChk!)}/>
                       </td>
                       <td ref={titleTd}
                           onMouseDown={() => a.editTaskTitleActivity.begin(t, titleTd!)}
                           className={t.completedOn() !== undefined
                               ? "completed-task"
                               : ""}>
                           {t.title()}
                       </td>
                       <td onClick={() => a.assignLabelToTaskActivity.startAssigningLabels(t,
                           titleTd!,
                           assignLabelPopup)}>
                           {
                               t.assignedLabels.map(
                                   al =>
                                   <span
                                       className="label-tag"
                                       title={al.name()}
                                       style={{ backgroundColor: al.color().value }}>
                                   </span>)}
                       </td>
                   </tr>;
        });

    export const view = (a: M.IApp) =>
        <table id="bodyTable">
            <tbody>
            <tr>
                <td>
                    <div ref={labelList} className="label-list">
                        <input type="text"
                               placeholder="new label"
                               className="new-label-input label"
                               fn={data(a.addLabelActivity.newName)}
                               onKeyUp={(e: KeyboardEvent) => a.addLabelActivity.keyUp(e)}/>
                        {a.labelStore.labels.map(l =>
                            <span
                                className={"label" +
                                    (a.searchTaskListActivity.taskQuery().indexOf(l.name()) === -1
                                        ? ""
                                        : " searched-label")}
                                onMouseDown={() => {
                                    a.searchTaskListActivity.addOrRemoveLabelFromQuery(l);
                                    setTimeout(() => queryTextBox.focus());
                                }}
                                style={{ "backgroundColor": l.color().value }}>{l.name()}</span>)()}
                    </div>
                </td>
                <td className="vertical-resizer"
                    onMouseDown={(e: MouseEvent) => resizeStartLeft = e.clientX}>
                </td>
                <td>
                    <input
                        type="text"
                        ref={queryTextBox}
                        fn={data(a.searchTaskListActivity.taskQuery)}/>
                    <input
                        type="button"
                        onMouseDown={() => a.searchTaskListActivity.taskQuery("")}
                        value="Clear"/>
                    <input
                        type="button"
                        onMouseDown={() => a.searchTaskListActivity.addSearch()}
                        value="+"/>

                    <br/>

                    <input type="text"
                           placeholder="new task"
                           className="new-task-input"
                           onKeyUp={(e: KeyboardEvent) => a.addTaskActivity.keyUp(e)}
                           fn={data(a.addTaskActivity.newName)}/>
                    <table className="task-list">
                        <thead></thead>
                        <tbody>
                        {taskListView(a)}
                        </tbody>
                    </table>
                    <input
                        type="text"
                        ref={taskEditTextBox}
                        fn={data(a.editTaskTitleActivity.newTitle)}
                        onKeyUp={(e: KeyboardEvent) => a.editTaskTitleActivity.keyUp(e)}
                        onBlur={() => a.editTaskTitleActivity.commit()}
                        className="task-text-edit-box"/>
                </td>
            </tr>
            </tbody>
        </table>;

    export const labelAssignView = (a: M.IApp) =>
        <table ref={assignLabelPopup}>
            <tbody>
            {
                !a.selectTaskActivity.selectedTask()
                    ? ""
                    : a.selectTaskActivity.selectedTask()!.assignedLabels.map(al =>
                        <tr>
                            <td>{al.name()}</td>
                        </tr>)
            }
            </tbody>
        </table>;
}