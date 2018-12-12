import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import { IApp, ITasksDashItem, ILabel, IDashItem } from "../../interfaces";
import { LabelsPopupView } from "../LabelsPopupView";
import taskListView from "./TaskListView";
import { TaskTitleEditView } from "./TaskTitleEditView";
import taskAddView from "./TaskAddView";
import { getButton } from "../../common";
import { PopupView } from "../PopupView";
import TasksDashItem from "../../data/dash/TasksDashItem";


export let queryTextBox: HTMLInputElement;


function queryColor(di: IDashItem): string {
    let c: string | undefined = undefined;
    if (di instanceof TasksDashItem)
        c = di.query.matcher.firstLabelColor;
    return c || "rgb(101, 101, 101)";
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
    tasksMenu: PopupView) {

    let originalTitle = "";


    function showMenu(e: MouseEvent) {
        tasksMenu.showBelow(getButton(e.target));
    }


    function selectSelf(e: MouseEvent) {
        app.data.dashboard.selected(tdi);
        e.cancelBubble = true;
    }


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
                    {taskListView(app, tdi.query.matcher.resultTasks(), lpv, ettv)}
                    </tbody>
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