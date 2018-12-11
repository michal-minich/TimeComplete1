import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import { IApp, ITasksDashItem, ILabel } from "../../interfaces";
import { LabelsPopupView } from "../LabelsPopupView";
import taskListView from "./TaskListView";
import { TaskTitleEditView } from "./TaskTitleEditView";
import taskAddView from "./TaskAddView";
import { getButton } from "../../common";
import popupView from "../PopupView";

export let queryTextBox: HTMLInputElement;


function queryColor(tdi: ITasksDashItem): string {
    const c = tdi.query.matcher.firstLabelColor;
    return c ? c : "rgb(101, 101, 101)";
}


export function queryBackground(tdi: ITasksDashItem) {
    return { backgroundColor: queryColor(tdi) };
}


function queryBorder(app: IApp, tdi: ITasksDashItem) {
    if (app.data.dashboard.selected() === tdi) {
        return { borderColor: queryColor(tdi) };
    } else {
        return { borderColor: "rgb(223, 223, 223)" };
    }
}


export function tasksDashItemView(app: IApp,
    tdi: ITasksDashItem,
    lpv: LabelsPopupView,
    ettv: TaskTitleEditView) {

    let originalTitle = "";

    const menu =
        <ul className="more-menu menu">
            <li onMouseDown={close}>Close</li>
        </ul>;


    function close() {
        app.data.dashboard.remove(tdi);
    }


    const mv = popupView(app, menu);


    function showMenu(e: MouseEvent) {
        mv.showBelow(getButton(e.target));
    }


    const view =
        <div onMouseDown={() => app.data.dashboard.selected(tdi)}
             style={queryBorder(app, tdi)}
             className={"task-list-activity " +
                 (app.data.dashboard.selected() === tdi ? "selected-task-list-activity" : "")}>
            <div className="header" style={queryBackground(tdi)}>
                <input
                    spellCheck={false}
                    type="text"
                    ref={queryTextBox}
                    onFocus={() => begin()}
                    onKeyUp={(e: KeyboardEvent) => keyUp(e)}
                    fn={data(tdi.query.text)}
                    style={queryBackground(tdi)}/>
                <span className="button" onMouseDown={showMenu}>
                    <span className="drop-down-triangle">&#x25BC;</span>
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