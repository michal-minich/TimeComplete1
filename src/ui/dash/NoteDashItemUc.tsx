import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, INoteDashItem, INoteMenuUc, INoteDashItemUc } from "../../interfaces";
import data from "surplus-mixin-data";
import { getButton } from "../../common";
import { queryBorder } from "./TasksDashItemUc";


export let queryTextBox: HTMLInputElement;

let originalTitle = "";


export default class NoteDashItemUc implements INoteDashItemUc {

    constructor(app: IApp, ndi: INoteDashItem, noteMenu: INoteMenuUc) {

        this.view = getControlledView(app, ndi, noteMenu);
    }

    readonly view: HTMLElement;
}


function getControlledView(app: IApp, ndi: INoteDashItem, noteMenu: INoteMenuUc) {

    function showMenu(e: MouseEvent): void {
        noteMenu.showBelow(getButton(e.target));
    }


    function selectSelf(e: MouseEvent): void {
        app.data.dashboard.selected(ndi);
        e.cancelBubble = true;
    }


    function begin(): void {
        originalTitle = ndi.note.titleSignal();
        app.data.selectedTask = undefined;
    }


    function rollback(): void {
        if (originalTitle === "__NEXT_EMPTY__") {
            originalTitle = ndi.note.titleSignal();
            ndi.note.titleSignal("");

        } else {
            ndi.note.titleSignal(originalTitle);
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
            className={"dash-item note-dash " +
                (app.data.dashboard.selected() === ndi ? "selected-dash-item" : "")}>
            <div className="header">
                <input
                    spellCheck={false}
                    type="text"
                    ref={queryTextBox}
                    onFocus={begin}
                    onKeyUp={keyUp}
                    fn={data(ndi.note.titleSignal)}/>
                <span className="burger-button button" onMouseDown={showMenu}>
                    <span className="drop-down-burger">&#x2261;</span>
                </span>
            </div>

            <textarea
                style={{ width: ndi.width + "px", height: ndi.height + "px" }}
                fn={data(ndi.note.textSignal)}>
            </textarea>
        </div>;

    return view;
}