import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import { IApp } from "../interfaces";
import TasksDashItem from "../data/dash/TasksDashItem";
import { LabelsPopupView } from "./LabelsPopupView";
import { LabelEditView } from "./LabelEditView";
import Note from "../data/domain/Note";
import popupView from "./PopupView";
import noteListView from "./NoteListView";
import NoteDashItem from "../data/dash/NoteDashItem";
import { R } from "../common";


export default function toolbarView(a: IApp, elv: LabelEditView, lpv: LabelsPopupView) {

    const addMenu =
        <ul className="add-menu menu">
            <li onClick={addTaskList}>Add New Task List</li>
            <li onClick={addNote}>Add New Note</li>
        </ul>;

    const autoCols = R.data(true);

    const moreMenu =
        <ul className="more-menu menu">
            <li className="columns-menu">
                <span>Columns</span>
                <input type="checkbox" id="auto-columns-count" fn={data(autoCols)}/>
                <label htmlFor="auto-columns-count">Auto</label>
                <fieldset disabled={autoCols()}>
                    <button onMouseDown={() => --a.data.settings.dashboardColumnsCount}>-</button>
                    <span className="dash-columns-input">{a.data.settings.dashboardColumnsCount}</span>
                    <button onMouseDown={() => ++a.data.settings.dashboardColumnsCount}>+</button>
                </fieldset>
            </li>
            <li>
                <input className="view-filter" type="search" placeholder="View Filter"/>
            </li>
            <li onMouseDown={() => a.data.generateLocalStorageDownload()}>Export Data</li>
            <li onClick={() => a.data.importLocalStorageDownload()}>Import Data</li>
        </ul>;

    const amv = popupView(a, addMenu);
    const mmv = popupView(a, moreMenu);
    const nlv = noteListView(a);


    function showLabels(e: MouseEvent) {
        lpv.show(e.target as HTMLElement, (l, el) => elv.begin(l, el));
    }


    function addNote() {
        const n = new Note(a);
        a.data.noteAdd(n);
        amv.hide();
        a.dashboard.unshift(new NoteDashItem(a, n));
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


    function showMoreMenu(e: MouseEvent) {
        mmv.showBelow(e.target as HTMLButtonElement);
    }


    const view =
        <div className="toolbar">
            <button onMouseDown={showLabels}>
                Labels <span className="drop-down-triangle">&#x25BC;</span>
            </button>
            <button onMouseDown={showNoteListView}>
                Notes <span className="drop-down-triangle">&#x25BC;</span>
            </button>
            <button onMouseDown={showAddMenu}>
                Add <span className="drop-down-triangle">&#x25BC;</span>
            </button>
            <button onMouseDown={showMoreMenu}>
                More <span className="drop-down-triangle">&#x25BC;</span>
            </button>
        </div>;

    return {
        view,
        addMenuView: amv.view,
        noteListView: nlv.view,
        moreMenuView: mmv.view
    };
}