import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import {
    IApp,
    ITasksDashItem,
    ITask,
    ITaskMenuUc,
    ILabelsPopupUc,
    ITaskTitleEditUc,
    ITasksDashItemUc
} from "../../interfaces";
import TaskListUc from "./TaskListUc";
import TaskAddUc from "./TaskAddUc";
import { getButton, queryBackground, queryBorder, R } from "../../common";


export let queryTextBox: HTMLInputElement;


export default class TasksDashItemUc implements ITasksDashItemUc {

    constructor(
        private readonly app: IApp,
        private readonly tdi: ITasksDashItem,
        lpv: ILabelsPopupUc,
        ettv: ITaskTitleEditUc,
        tasksMenu: ITaskMenuUc) {

        this.view = getControlledView(app, tdi, lpv, ettv, tasksMenu, this);
    }


    readonly view: HTMLElement;


    get tasks(): ITask[] {
        return this.resultTasks().inx;
    }


    resultTasks() {
        const vt = this.app.data.dashboard.query.matcher.resultTasks();
        const rt = this.tdi.query.matcher.resultTasks();
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
}


function getControlledView(app: IApp,
    tdi: ITasksDashItem,
    lpv: ILabelsPopupUc,
    ettv: ITaskTitleEditUc,
    tasksMenu: ITaskMenuUc,
    ownwer: TasksDashItemUc): HTMLElement {

    let originalTitle = "";
    const showFilteredOut = R.data(false);

    function showMenu(e: MouseEvent) {
        tasksMenu.showBelow(getButton(e.target), ownwer.resultTasks().inx);
    }


    function selectSelf(e: MouseEvent) {
        app.data.dashboard.selected(tdi);
        e.cancelBubble = true;
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
                {new TaskListUc(app, tasks.out, lpv, ettv).view}
                </tbody>
            </table>;

        return Array.from(v.childNodes) as HTMLElement[];
    }


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


    const view =
        <div onMouseDown={selectSelf}
             style={queryBorder(app, tdi)}
             className={"dash-item tasks-dash " +
                 (app.data.dashboard.selected() === tdi ? "selected-dash-item" : "")}>
            <div className="header" style={queryBackground(tdi)}>
                <input
                    spellCheck={false}
                    type="text"
                    ref={queryTextBox}
                    onFocus={begin}
                    onKeyUp={keyUp}
                    fn={data(tdi.query.text)}
                    style={queryBackground(tdi)}/>
                <span className="burger-button button" onMouseDown={showMenu}>
                    <span className="drop-down-burger">&#x2261;</span>
                </span>
            </div>
            <div className="body">
                {new TaskAddUc(app, tdi).view}
                <table className="task-list lined-list">
                    <thead></thead>
                    <tbody>
                    {new TaskListUc(app, ownwer.resultTasks().inx, lpv, ettv).view}
                    </tbody>
                    {taskList(ownwer.resultTasks())}
                </table>
            </div>
        </div>;


    return view;
}