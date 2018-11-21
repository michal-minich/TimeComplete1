import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
Surplus;
import data from "surplus-mixin-data";
import { IApp, ITaskListActivity, ISearchTaskListActivity, ITask, ILabel } from "../interfaces";
import { onMouseDown } from "../common";
import { LabelsPopupView } from "./LabelsPopupView";
import DateTime from "../data/DateTime";


export let queryTextBox: HTMLInputElement;


function queryColor(tla: ITaskListActivity): string {
    const c = tla.searchTaskListActivity.query.firstLabelColor;
    return c ? c : "rgb(101, 101, 101)";
}


export function queryBackground(tla: ITaskListActivity) {
    return { backgroundColor: queryColor(tla) };
}


function queryBorder(a: IApp, tla: ITaskListActivity) {
    if (a.activity.selectedTaskList() === tla) {
        return { borderColor: queryColor(tla) };
    } else {
        return { borderColor: "rgb(223, 223, 223)" };
    }
}


export const taskListActivityView = (a: IApp, tla: ITaskListActivity, lpv: LabelsPopupView) =>
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
                fn={data(tla.searchTaskListActivity.query.text)}
                style={queryBackground(tla)}/>
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
                {taskListViewBody(a, tla.searchTaskListActivity, lpv)}
                </tbody>
            </table>
        </div>
    </div>;


const taskListViewBody = (a: IApp, stla: ISearchTaskListActivity, lpv: LabelsPopupView) => {


    function perform(task: ITask, isDone: HTMLInputElement): any {
        if (isDone.checked) {
            task.completedOn = new DateTime("2019");
        } else {
            task.completedOn = undefined;
        }
    }


    function changeAssociation(label: ILabel): void {
        const t = a.activity.selectTask.selectedTask!;
        if (t.associatedLabels().some(al => al.name === label.name)) {
            t.associatedLabels.remove(label);
        } else {
            t.associatedLabels.push(label);
        }
    }


    const view = stla.query.resultTasks().map(t => {
        let doneChk: HTMLInputElement | undefined = undefined;
        let titleTd: HTMLTableDataCellElement | undefined = undefined;
        const view2 =
            <tr onMouseDown={() => a.activity.selectTask.selectedTask = t}
                className={a.activity.selectTask.selectedTask === t ? "selected-task" : ""}>
                <td>
                    <input
                        ref={doneChk}
                        type="checkbox"
                        checked={t.completedOn !== undefined}
                        onChange={() => perform(t, doneChk!)}/>
                </td>
                <td ref={titleTd}
                    tabIndex={1}
                    onFocus={() => a.activity.editTaskTitle.begin(t, titleTd!)}
                    className={t.completedOn !== undefined
                        ? "completed-task"
                        : ""}>
                    {t.title}
                </td>
                <td className="label-tag-container"
                    fn={(onMouseDown((e) => lpv.show(e.target as HTMLElement,
                        (l, el) => changeAssociation(l)
                    )))}>
                    {t.associatedLabels.orderBy(al => al.id).map(al =>
                        <span
                            className="label-tag"
                            title={al.name}
                            style={{ backgroundColor: al.style.backColor.value }}>
                        </span>)}
                </td>
            </tr>;

        return view2;

    });

    return view;
};