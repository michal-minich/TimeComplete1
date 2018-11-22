import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
Surplus;
import data from "surplus-mixin-data";
import { IApp, ITasksDashItem, ILabel } from "../interfaces";
import { LabelsPopupView } from "./LabelsPopupView";
import { taskListView } from "./TaskListView";
import { EditTaskTitleView } from "./EditTaskTitleView";
import addTaskView from "./AddTaskView";


export let queryTextBox: HTMLInputElement;


function queryColor(tdi: ITasksDashItem): string {
    const c = tdi.query.firstLabelColor;
    return c ? c : "rgb(101, 101, 101)";
}


export function queryBackground(tdi: ITasksDashItem) {
    return { backgroundColor: queryColor(tdi) };
}


function queryBorder(a: IApp, tdi: ITasksDashItem) {
    if (a.dashboard.selected() === tdi) {
        return { borderColor: queryColor(tdi) };
    } else {
        return { borderColor: "rgb(223, 223, 223)" };
    }
}


export function tasksDashItemView(a: IApp, tdi: ITasksDashItem, lpv: LabelsPopupView, ettv: EditTaskTitleView) {

    let originalTitle = "";

    const view =
        <div onMouseDown={() => a.dashboard.selected(tdi)}
             style={queryBorder(a, tdi)}
             className={"task-list-activity " +
                 (a.dashboard.selected() === tdi ? "selected-task-list-activity" : "")}>
            <div className="header" style={queryBackground(tdi)}>
                <input
                    spellCheck={false}
                    type="text"
                    ref={queryTextBox}
                    onFocus={() => begin()}
                    onKeyUp={(e: KeyboardEvent) => keyUp(e)}
                    fn={data(tdi.query.text)}
                    style={queryBackground(tdi)}/>
                <button
                    onClick={() => a.dashboard.remove(tdi)}>
                    X
                </button>
            </div>
            <div className="body">
                {addTaskView(a, tdi)}
                <table className="task-list lined-list">
                    <thead></thead>
                    <tbody>
                    {taskListView(a, tdi.query.resultTasks(), lpv, ettv)}
                    </tbody>
                </table>
            </div>
        </div>;


    function begin(): void {
        originalTitle = tdi.query.text();
        a.data.selectedTask = undefined;
    }


    function rollback(): void {
        if (originalTitle === "__NEXT_EMPTY__") {
            originalTitle = tdi.query.text();
            tdi.query.text("");

        } else {
            tdi.query.text(originalTitle);
            originalTitle = "__NEXT_EMPTY__";
        }
    }


    function keyUp(e: KeyboardEvent): void {
        if (e.key === "Escape")
            rollback();
    }


    function addOrRemoveLabelFromQuery(l: ILabel): void {
        const ln = l.name;
        const q = tdi.query.text().trim().replace("  ", " ");
        if (q.indexOf(ln) === -1) {
            tdi.query.text(q + " #" + ln);
        } else {
            tdi.query.text(q.replace("#" + ln, "").replace("  ", " "));
        }
    }

    return view;
}