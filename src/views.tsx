// ReSharper disable once WrongExpressionStatement
import * as Surplus from "surplus"; Surplus;
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


    const taskListView = (a: M.IApp, tla: M.ITaskListActivity) =>
        tla.searchTaskListActivity.resultTasks().map(t => {
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
                           tabIndex={1}
                           onFocus={() => a.editTaskTitleActivity.begin(t, titleTd!)}
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

    export const taskListActivityView = (a: M.IApp, tla: M.ITaskListActivity) =>
        <div className="task-list-activity">
            <div className="header">
                <input
                    type="text"
                    ref={queryTextBox}
                    onFocus={() => tla.searchTaskListActivity.begin()}
                    onKeyUp={(e: KeyboardEvent) => tla.searchTaskListActivity.keyUp(e)}
                    fn={data(tla.searchTaskListActivity.taskQuery)}/>
                <input
                    type="button"
                    onMouseDown={() => tla.searchTaskListActivity.rollback()}
                    value="Clear"/>
                <input
                    type="button"
                    onMouseDown={() => tla.searchTaskListActivity.addSearch()}
                    value="+"/>
            </div>
            <div className="body">
                <input type="text"
                       placeholder="new task"
                       className="new-task-input"
                       onKeyUp={(e: KeyboardEvent) => tla.addTaskActivity.keyUp(e)}
                       fn={data(tla.addTaskActivity.newName)}/>
                <table className="task-list lined-list">
                    <thead></thead>
                    <tbody>
                    {taskListView(a, tla)}
                    </tbody>
                </table>
            </div>
        </div>;

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
                                    (a.selectedTaskListActivity().searchTaskListActivity.taskQuery()
                                        .indexOf(l.name()) ===
                                        -1
                                        ? ""
                                        : " searched-label")}
                                onMouseDown={() => {
                                    a.selectedTaskListActivity().searchTaskListActivity.addOrRemoveLabelFromQuery(l);
                                    setTimeout(() => queryTextBox.focus());
                                }}
                                style={{ "backgroundColor": l.color().value }}>{l.name()}</span>)()}
                    </div>
                </td>
                <td className="vertical-resizer"
                    onMouseDown={(e: MouseEvent) => resizeStartLeft = e.clientX}>
                </td>
                <td>
                    <div>{a.taskListsActivities.map(tla2 => taskListActivityView(a, tla2))}</div>
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
        <table id="assign-label-activity" className="lined-list" ref={assignLabelPopup}>
            <tbody>
            <tr>
                <td>
                    <input
                        type="text"
                        onFocus={() => a.assignLabelToTaskActivity.begin()}
                        onKeyUp={(e: KeyboardEvent) => a.assignLabelToTaskActivity.keyUp(e)}
                        fn={data(a.assignLabelToTaskActivity.labelQuery)}/>
                </td></tr>
            </tbody>
            <tbody>
            {
                !a.selectTaskActivity.selectedTask()
                    ? ""
                    : a.selectTaskActivity.selectedTask()!.assignedLabels.map(al =>
                        <tr>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={true}
                                    onChange={() => a.assignLabelToTaskActivity.changeAssociation(al)}/>
                            </td>
                            <td>{al.name()}</td>
                        </tr>)
            }
            </tbody>
        </table>;
}