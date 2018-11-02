import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
Surplus;
import { SArray as SArrayType } from "s-array";
import data from "surplus-mixin-data";
import * as I from "./interfaces";


export module AppView {
    let resizeStartLeft = -1;
    let labelList: HTMLDivElement;
    export let queryTextBox: HTMLInputElement;
    export let taskEditTextBox: HTMLInputElement;

    let leftTd: HTMLTableCellElement;
    let assignLabelPopup: HTMLDivElement;

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


    function labelInlineStyle(l: I.ILabel) {
        return { "backgroundColor": l.color.value };
    }


    function queryColor(tla: I.ITaskListActivity): string {
        const c = tla.searchTaskListActivity.taskQuery().firstLabelColor;
        return c ? c : "rgb(101, 101, 101)";
    }


    function queryBackground(tla: I.ITaskListActivity) {
        return { backgroundColor: queryColor(tla) };
    }


    function queryBorder(tla: I.ITaskListActivity) {
        return { borderColor: queryColor(tla) };
    }


    const taskListViewBody = (a: I.IApp, stla: I.ISearchTaskListActivity) =>
        stla.resultTasks().map(t => {
            let doneChk: HTMLInputElement | undefined = undefined;
            let titleTd: HTMLTableDataCellElement | undefined = undefined;
            return <tr onMouseDown={() => a.activity.selectTask.select(t)}
                       className={a.activity.selectTask.selectedTask() === t ? "selected-task" : ""}>
                       <td>
                           <input
                               ref={doneChk}
                               type="checkbox"
                               checked={t.completedOn !== undefined}
                               onChange={() => a.activity.changeTaskCompletion.perform(t, doneChk!)}/>
                       </td>
                       <td ref={titleTd}
                           tabIndex={1}
                           onFocus={() => a.activity.editTaskTitle.begin(t, titleTd!)}
                           className={t.completedOn !== undefined
                               ? "completed-task"
                               : ""}>
                           {t.title}
                       </td>
                       <td>
                           {t.associatedLabels.items.map(al =>
                               <span
                                   className="label-tag"
                                   title={al.name}
                                   style={{ backgroundColor: al.color.value }}>
                               </span>)}
                       </td>
                   </tr>;
        });


    export const taskListView = (a: I.IApp, stla: I.ISearchTaskListActivity) =>
        <table className="task-list lined-list">
            <thead></thead>
            <tbody>
            {taskListViewBody(a, stla)}
            </tbody>
        </table>;


    export const taskListActivityView = (a: I.IApp, tla: I.ITaskListActivity) =>
        <div onMouseDown={() => a.activity.selectedTaskList(tla)}
             style={queryBorder(tla)}
             className={"task-list-activity " +
                 (a.activity.selectedTaskList() === tla ? "selected-task-list-activity" : "")}>
            <div className="header" style={queryBackground(tla)}>
                <input
                    spellCheck={false}
                    type="text"
                    ref={queryTextBox}
                    onFocus={() => tla.searchTaskListActivity.begin()}
                    onKeyUp={(e: KeyboardEvent) => tla.searchTaskListActivity.keyUp(e)}
                    fn={data(tla.searchTaskListActivity.taskQueryText)}
                    style={queryBackground(tla)}/>
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
                       fn={data(tla.addTaskActivity.newTitle)}/>
                {taskListView(a, tla.searchTaskListActivity)}
            </div>
        </div>;


    export const view = (a: I.IApp) =>
        <table id="bodyTable">
            <tbody>
            <tr>
                <td ref={leftTd}>
                    {a.activity.selectTask.selectedTask() === undefined
                        ? labelListView(a)
                        : labelAssociateView(a)
                    }
                </td>
                <td className="vertical-resizer"
                    onMouseDown={(e: MouseEvent) => resizeStartLeft = e.clientX}>
                </td>
                <td>
                    <div id="task-list-activities">
                        <input
                            type="text"
                            ref={taskEditTextBox}
                            fn={data(a.activity.editTaskTitle.newName)}
                            onKeyUp={(e: KeyboardEvent) => a.activity.editTaskTitle.keyUp(e)}
                            onBlur={() => a.activity.editTaskTitle.commit()}
                            className="task-text-edit-box selected-task"/>
                        {a.activity.taskLists.map(tla2 => taskListActivityView(a, tla2))()}
                    </div>
                </td>
            </tr>
            </tbody>
        </table>;


    export const newLabelView = (a: I.IApp) =>
        <input type="text"
               placeholder="new label"
               className="new-label-input label"
               fn={data(a.activity.addLabel.newName)}
               onKeyUp={(e: KeyboardEvent) => a.activity.addLabel.keyUp(e)}/>;


    export const labelListView = (a: I.IApp) =>
        <div ref={labelList} className="label-list">
            <div id="label-list-inner">
                {newLabelView(a)}
                {a.data.labels.items.map(l =>
                    <span className={"label" +
                (a.activity.selectedTaskList().searchTaskListActivity.taskQueryText()
                    .indexOf(l.name) ===
                    -1
                    ? ""
                    : " searched-label")}
                          onMouseDown={() => {
                              a.activity.selectedTaskList().searchTaskListActivity
                                  .addOrRemoveLabelFromQuery(l);
                              setTimeout(() => queryTextBox.focus());
                          }}
                          style={labelInlineStyle(l)}>
                        {l.name}
                    </span>)()}
            </div>
        </div>;


    export const labelAssociateView = (a: I.IApp) =>
        !a.activity.selectTask.selectedTask()
        ? ""
        : <div id="assign-label-activity" className="label-list" ref={assignLabelPopup}>
              <div className="smaller-font">Associated</div>
              <div id="associated-labels">
                  {newLabelView(a)}
                  {associateLabelList(a,
                      a.activity.selectTask.selectedTask()!.associatedLabels.items)()}
              </div>
              <div className="smaller-font">Available</div>
              <div id="available-labels">
                  {associateLabelList(a,
                      a.data.labels.items
                      .filter(l => !a.activity.selectTask.selectedTask()!.associatedLabels.items()
                          .some(al => al.name === l.name)))
                  }
              </div>
          </div>;


    export const associateLabelList = (a: I.IApp, labels: SArrayType<I.ILabel>) =>
        labels.map(l =>
            <span className="label"
                  style={labelInlineStyle(l)}
                  onMouseDown={() => a.activity.associateLabelWithTask.changeAssociation(l)}>
                {l.name}
            </span>);
}