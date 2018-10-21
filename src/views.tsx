import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
Surplus;
import data from "surplus-mixin-data";
import { SArray as SArrayType } from "s-array";

import * as I from "./interfaces";


export module AppView {
    let resizeStartLeft = -1;
    let labelList: HTMLDivElement;
    export let queryTextBox: HTMLInputElement;
    export let taskEditTextBox: HTMLInputElement;

    let assignLabelPopup: HTMLDivElement;

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


    const taskListView = (a: I.IApp, tla: I.ITaskListActivity) =>
        tla.searchTaskListActivity.resultTasks().map(t => {
            let doneChk: HTMLInputElement | undefined = undefined;
            let titleTd: HTMLTableDataCellElement | undefined = undefined;
            return <tr onMouseDown={() => a.selectTaskActivity.select(t)}
                       className={a.selectTaskActivity.selectedTask() === t ? "selected-task" : ""}>
                       <td>
                           <input
                               ref={doneChk}
                               type="checkbox"
                               checked={t.completedOn() !== undefined}
                               onChange={() => a.changeTaskCompletionActivity.perform(t, doneChk!)}/>
                       </td>
                       <td ref={titleTd}
                           tabIndex={1}
                           onFocus={() => a.editTaskTitleActivity.begin(t, titleTd!, tla)}
                           className={t.completedOn() !== undefined
                               ? "completed-task"
                               : ""}>
                           {t.title()}
                       </td>
                       <td>{t.assignedLabels.map(al =>
                           <span
                               className="label-tag"
                               title={al.name()}
                               style={{ backgroundColor: al.color().value }}>
                           </span>)}
                       </td>
                   </tr>;
        });

    export const taskListActivityView = (a: I.IApp, tla: I.ITaskListActivity) =>
        <div onMouseDown={() => a.selectedTaskListActivity(tla)}
             className={"task-list-activity " +
                 (a.selectedTaskListActivity() === tla ? "selected-task-list-activity" : "")}>
            <div className="header">
                <input
                    spellCheck={false}
                    type="text"
                    ref={queryTextBox}
                    onFocus={() => tla.searchTaskListActivity.begin()}
                    onKeyUp={(e: KeyboardEvent) => tla.searchTaskListActivity.keyUp(e)}
                    fn={data(tla.searchTaskListActivity.taskQuery)}/>
                <input
                    type="button"
                    onMouseDown={() => tla.searchTaskListActivity.clear()}
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


    function labelInlineStyle(l: I.ILabel) {
        return { "backgroundColor": l.color().value };
    };


    export const view = (a: I.IApp) =>
        <table id="bodyTable">
            <tbody>
            <tr>
                <td>
                    {a.selectTaskActivity.selectedTask() === undefined
                        ? labelListView(a)
                        : labelAssociateView(a)
                    }
                </td>
                <td className="vertical-resizer"
                    onMouseDown={(e: MouseEvent) => resizeStartLeft = e.clientX}>
                </td>
                <td>
                    <div id="task-list-activities">
                        {a.taskListsActivities.map(tla2 => taskListActivityView(a, tla2))}
                    </div>
                    <input
                        type="text"
                        ref={taskEditTextBox}
                        fn={data(a.editTaskTitleActivity.newTitle)}
                        onKeyUp={(e: KeyboardEvent) => a.editTaskTitleActivity.keyUp(e)}
                        onBlur={() => a.editTaskTitleActivity.commit()}
                        className="task-text-edit-box selected-task"/>
                </td>
            </tr>
            </tbody>
        </table>;


    export const newLabelView = (a: I.IApp) =>
        <input type="text"
               placeholder="new label"
               className="new-label-input label"
               fn={data(a.addLabelActivity.newName)}
               onKeyUp={(e: KeyboardEvent) => a.addLabelActivity.keyUp(e)}/>;


    export const labelListView = (a: I.IApp) =>
        <div ref={labelList} className="label-list"><div id="label-list-inner">
            {newLabelView(a)}
            {a.labelStore.labels.map(l =>
                <span className={"label" +
                (a.selectedTaskListActivity().searchTaskListActivity.taskQuery()
                    .indexOf(l.name()) ===
                    -1
                    ? ""
                    : " searched-label")}
                      onMouseDown={() => {
                          a.selectedTaskListActivity().searchTaskListActivity.addOrRemoveLabelFromQuery(l);
                          setTimeout(() => queryTextBox.focus());
                      }}
                      style={labelInlineStyle(l)}>
                    {l.name()}
                </span>)()}
        </div></div>;


    export const labelAssociateView = (a: I.IApp) =>
        !a.selectTaskActivity.selectedTask()
        ? ""
        : <div id="assign-label-activity" className="label-list" ref={assignLabelPopup}>
              <div className="smaller-font">Associated</div>
              <div id="associated-labels">
                  {newLabelView(a)}
                  {associateLabelList(a, a.selectTaskActivity.selectedTask()!.assignedLabels)()}
              </div>
              <div className="smaller-font">Available</div>
              <div id="available-labels">
                  {associateLabelList(a,
                      a.labelStore.labels
                      .filter(l => !a.selectTaskActivity.selectedTask()!.assignedLabels()
                          .some(al => al.name() === l.name())))
                  }
              </div>
          </div>;


    export const associateLabelList = (a: I.IApp, labels: SArrayType<I.ILabel>) =>
        labels.map(l =>
            <span className="label"
                  style={labelInlineStyle(l)}
                  onMouseDown={() => a.associateLabelWithTaskActivity.changeAssociation(l)}>
                {l.name()}
            </span>);
}