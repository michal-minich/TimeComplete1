import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import { IApp, ITasksDashItem, IDashItem, ITask, ITaskMenuView } from "../../interfaces";
import { LabelsPopupView } from "./../popup/LabelsPopupView";
import taskListView from "./TaskListView";
import { TaskTitleEditView } from "./TaskTitleEditView";
import taskAddView from "./TaskAddView";
import { getButton, R } from "../../common";
import TasksDashItem from "../../data/dash/TasksDashItem";


export let queryTextBox: HTMLInputElement;


function queryColor(di: IDashItem): string {
    if (di instanceof TasksDashItem) {
        const l = di.query.matcher.firstLabel;
        if (l)
            return l.style.backColor.value;
    }
    return "rgb(101, 101, 101)";
}


export function queryBackground(di: IDashItem) {
    return { backgroundColor: queryColor(di) };
}


export function queryBorder(app: IApp, di: IDashItem) {
    if (app.data.dashboard.selected() === di) {
        return { borderColor: queryColor(di) };
    } else {
        return { borderColor: "rgb(230, 230, 230)" };
    }
}


export function tasksDashItemView(app: IApp,
    tdi: ITasksDashItem,
    lpv: LabelsPopupView,
    ettv: TaskTitleEditView,
    tasksMenu: ITaskMenuView) {

    let originalTitle = "";
    const showFilteredOut = R.data(false);

    function showMenu(e: MouseEvent) {
        tasksMenu.showBelow(getButton(e.target));
    }


    function selectSelf(e: MouseEvent) {
        app.data.dashboard.selected(tdi);
        e.cancelBubble = true;
    }


    function resultTasks() {
        const vt = app.data.dashboard.query.matcher.resultTasks();
        const rt = tdi.query.matcher.resultTasks();
        const inx: ITask[] = [];
        const out: ITask[] = [];
        for (const t of rt) {
            if (vt.indexOf(t) !== -1) {
                inx.push(t);
            } else {
                out.push(t);
            }
        }
        return { inx, out };
    }


    function taskList(tasks: { inx: ITask[], out: ITask[] }): HTMLElement[] {

        if (tasks.out.length === 0)
            return [];

        const done = tasks.out.filter(t => t.completedOn !== undefined).length;
        const filteredOut = tasks.out.length - done;

        let text = "";

        if (done !== 0)
            text = done + " done";

        if (filteredOut !== 0)
            text += (done === 0 ? "" : " and ") + filteredOut + " filtered out";

        const v =
            <table>
                <tr>
                    <td className="show-hide-filtered-out" colSpan={3}
                        onClick={() => showFilteredOut(!showFilteredOut())}>
                        {showFilteredOut() ? "▲ hide " : "▼ show "}
                        {text}
                        {showFilteredOut() ? " ▲" : " ▼"}
                    </td>
                </tr>
                <tbody className={showFilteredOut() ? "" : "hidden"}>
                {taskListView(app, tasks.out, lpv, ettv)}
                </tbody>
            </table>;

        return Array.from(v.childNodes) as HTMLElement[];
    };


    const view =
        <div onMouseDown={(e: MouseEvent) => selectSelf(e)}
             style={queryBorder(app, tdi)}
             className={"dash-item tasks-dash " +
                 (app.data.dashboard.selected() === tdi ? "selected-dash-item" : "")}>
            <div className="header" style={queryBackground(tdi)}>
                <input
                    spellCheck={false}
                    type="text"
                    ref={queryTextBox}
                    onFocus={() => begin()}
                    onKeyUp={(e: KeyboardEvent) => keyUp(e)}
                    fn={data(tdi.query.text)}
                    style={queryBackground(tdi)}/>
                <span className="burger-button button" onMouseDown={showMenu}>
                    <span className="drop-down-burger">&#x2261;</span>
                </span>
            </div>
            <div className="body">
                {taskAddView(app, tdi)}
                <table className="task-list lined-list">
                    <thead></thead>
                    <tbody>
                    {taskListView(app, resultTasks().inx, lpv, ettv)}
                    </tbody>
                    {taskList(resultTasks())}
                </table>
            </div>
        </div>;


    function begin(): void {
        originalTitle = tdi.query.text();
        app.data.selectedTask = undefined;
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

    
    return view;
}