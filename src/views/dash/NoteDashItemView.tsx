import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, INoteDashItem, INoteMenuView } from "../../interfaces";
import data from "surplus-mixin-data";
import { getButton } from "../../common";
import { queryBorder } from "./TasksDashItemView";


export let queryTextBox: HTMLInputElement;

let originalTitle = "";


export function noteDashItemView(
    app: IApp,
    ndi: INoteDashItem,
    noteMenu: INoteMenuView) {


    function showMenu(e: MouseEvent) {
        noteMenu.showBelow(getButton(e.target));
    }


    function selectSelf(e: MouseEvent) {
        app.data.dashboard.selected(ndi);
        e.cancelBubble = true;
    }


    const view =
        <div
            onMouseDown={(e: MouseEvent) => selectSelf(e)}
            style={queryBorder(app, ndi)}
            className={"dash-item note-dash " +
                (app.data.dashboard.selected() === ndi ? "selected-dash-item" : "")}>
            <div className="header">
                <input
                    spellCheck={false}
                    type="text"
                    ref={queryTextBox}
                    onFocus={() => begin()}
                    onKeyUp={(e: KeyboardEvent) => keyUp(e)}
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

    return view;
}