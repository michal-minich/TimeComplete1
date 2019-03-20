import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import {
    IApp,
    ITaskDashItem,
    ITaskDashItemUc,
    ITaskNoteMenuUc,
} from "../../interfaces";
import data from "surplus-mixin-data";
import { getButton, queryBorder } from "../../common";


export let queryTextBox: HTMLInputElement;

let originalTitle = "";


export default class TaskDashItemUc implements ITaskDashItemUc {

    constructor(app: IApp, ndi: ITaskDashItem, taskMenu: ITaskNoteMenuUc) {

        this.view = getControlledView(app, ndi, taskMenu);
    }

    readonly view: HTMLElement;
}


function getControlledView(
    app: IApp,
    ndi: ITaskDashItem,
    taskMenu: ITaskNoteMenuUc): HTMLElement {

    function showMenu(e: MouseEvent): void {
        taskMenu.showBelow(getButton(e.target));
    }


    function selectSelf(e: MouseEvent): void {
        app.data.dashboard.selected(ndi);
        e.cancelBubble = true;
    }


    function begin(): void {
        originalTitle = ndi.task.titleSignal();
        app.data.selectedTask = undefined;
    }


    function rollback(): void {
        if (originalTitle === "__NEXT_EMPTY__") {
            originalTitle = ndi.task.titleSignal();
            ndi.task.titleSignal("");

        } else {
            ndi.task.titleSignal(originalTitle);
            originalTitle = "__NEXT_EMPTY__";
        }
    }


    function keyUp(e: KeyboardEvent): void {
        if (e.key === "Escape")
            rollback();
    }


    const view =
        <div
            onMouseDown={selectSelf}
            style={queryBorder(app, ndi)}
            className={"dash-item task-dash " +
                (app.data.dashboard.selected() === ndi
                    ? "selected-dash-item"
                    : "")}>
            <div className="header">
                <input
                    spellCheck={false}
                    type="text"
                    ref={queryTextBox}
                    onFocus={begin}
                    onKeyUp={keyUp}
                    fn={data(ndi.task.titleSignal)}/>
                <span className="burger-button button" onMouseDown={showMenu}>
                    <span className="drop-down-burger">&#x2261;</span>
                </span>
            </div>

            <textarea
                style={{ width: ndi.width + "px", height: ndi.height + "px" }}
                fn={data(ndi.task.textSignal)}>
            </textarea>
        </div>;

    return view;
}