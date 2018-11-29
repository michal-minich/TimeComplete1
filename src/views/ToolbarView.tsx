import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import { IApp } from "../interfaces";
import TasksDashItem from "../data/TasksDashItem";
import { LabelsPopupView } from "./LabelsPopupView";
import { EditLabelView } from "./EditLabelView";
import Note from "../data/Note";
import popupView from "./PopupView";
import noteListView from "./NoteListView";
import NoteDashItem from "../data/NoteDashItem";


export default function toolbarView(a: IApp, elv: EditLabelView, lpv: LabelsPopupView) {

    const addMenu =
        <ul className="add-menu menu">
            <li onClick={addTaskList}>Add New Task List</li>
            <li onClick={addNote}>Add New Note</li>
        </ul>;


    const amv = popupView(a, addMenu);
    const nlv = noteListView(a);

    function addNote() {
        const n = new Note(a);
        a.data.notes.unshift(n);
        amv.hide();
        a.dashboard.unshift(new NoteDashItem(a, n.id));
    }


    function addTaskList() {
        const tdi = new TasksDashItem(a);
        a.dashboard.unshift(tdi);
        amv.hide();
    }


    function showAddMenu(e: MouseEvent) {
        amv.showBelow(e.target as HTMLButtonElement);
    }


    function showNoteListView(e: MouseEvent) {
        nlv.showBelow(e.target as HTMLButtonElement);
    }


    const view =
        <div className="toolbar">
            {amv.view}
            {nlv.view}
            <button onMouseDown={(e: MouseEvent) => {
                lpv.show(e.target as HTMLElement,
                    (l, el) => elv.begin(l, el));
            }}>
                Labels <span className="drop-down-triangle">&#x25BC;</span>
            </button>
            <button onMouseDown={showNoteListView}>
                Notes <span className="drop-down-triangle">&#x25BC;</span>
            </button>
            <button onMouseDown={showAddMenu}>
                Add <span className="drop-down-triangle">&#x25BC;</span>
            </button>
            <button onMouseDown={() => a.data.generateLocalStorageDownload()}>Export</button>
            <input className="view-filter" type="number" fn={data(a.data.settings
                .dashboardColumnsCount)}/>
            <input className="view-filter" type="search" placeholder="View Filter"/>
            <ul className="more-menu menu">
                <li className="columns-menu">
                    <span>Columns</span>
                    <input type="checkbox" id="auto-columns-count"/>
                    <label htmlFor="auto-columns-count">Auto</label>
                    <button>-</button>

                    <button>+</button>
                </li>
                <li onMouseDown={() => a.data.generateLocalStorageDownload()}>Export Data</li>
            </ul>
        </div>;

    return { view, addMenuView: amv.view, noteListView: nlv.view };
}