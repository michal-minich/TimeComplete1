import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
Surplus;
import data from "surplus-mixin-data";
import { IApp, ITaskListActivity, ISearchTaskListActivity } from "../interfaces";


export let queryTextBox: HTMLInputElement;


function queryColor(tla: ITaskListActivity): string {
    const c = tla.searchTaskListActivity.taskQuery().firstLabelColor;
    return c ? c : "rgb(101, 101, 101)";
}


function queryBackground(tla: ITaskListActivity) {
    return { backgroundColor: queryColor(tla) };
}


function queryBorder(a: IApp, tla: ITaskListActivity) {
    if (a.activity.selectedTaskList() === tla) {
        return { borderColor: queryColor(tla) };
    } else {
        return { borderColor: "rgb(223, 223, 223)" };
    }
}


export const taskListActivityView = (a: IApp, tla: ITaskListActivity) =>
    <div onMouseDown={() => a.activity.selectedTaskList(tla)}
         style={queryBorder(a, tla)}
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
            <button
                onMouseDown={() => tla.searchTaskListActivity.clear()}>
                Clear
            </button>
            <button
                onMouseDown={() => tla.searchTaskListActivity.addSearch()}>
                +
            </button>
            <button
                onClick={() => a.activity.taskLists.remove(tla)}>
                X
            </button>
        </div>
        <div className="body">
            <input type="text"
                   placeholder="new task"
                   className="new-task-input"
                   onKeyUp={(e: KeyboardEvent) => tla.addTaskActivity.keyUp(e)}
                   fn={data(tla.addTaskActivity.newTitle)}/>
            <table className="task-list lined-list">
                <thead></thead>
                <tbody>
                {taskListViewBody(a, tla.searchTaskListActivity)}
                </tbody>
            </table>
        </div>
    </div>;


const taskListViewBody = (a: IApp, stla: ISearchTaskListActivity) =>
    stla.resultTasks().map(t => {
        let doneChk: HTMLInputElement | undefined = undefined;
        let titleTd: HTMLTableDataCellElement | undefined = undefined;
        return <tr onMouseDown={() => a.activity.selectTask.selectedTask = t}
                   className={a.activity.selectTask.selectedTask === t ? "selected-task" : ""}>
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
                               style={{ backgroundColor: al.style.backColor.value }}>
                           </span>)}
                   </td>
               </tr>;
    });