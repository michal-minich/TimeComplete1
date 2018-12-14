import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import { IApp } from "../interfaces";
import TasksDashItem from "../data/dash/TasksDashItem";
import { LabelsPopupView } from "./popup/LabelsPopupView";
import { LabelEditView } from "./popup/LabelEditView";
import Note from "../data/domain/Note";
import popupView from "./PopupView";
import noteListView from "./popup/NoteListView";
import NoteDashItem from "../data/dash/NoteDashItem";
import { R, getButton } from "../common";


export default function toolbarView(app: IApp, elv: LabelEditView, lpv: LabelsPopupView) {

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
                    <button onMouseDown={() => --app.data.dashboard.dashboardColumnsCount}>-</button>
                    <span className="dash-columns-input">{() => app.data.dashboard.dashboardColumnsCount}</span>
                    <button onMouseDown={() => ++app.data.dashboard.dashboardColumnsCount}>+</button>
                </fieldset>
            </li>
            <li>
                <input
                    className="view-filter"
                    type="search"
                    placeholder="View Filter"
                    fn={data(app.data.dashboard.query.text)}/>
            </li>
            <li onMouseDown={() => app.data.generateLocalStorageDownload()}>Export Data</li>
            <li onClick={() => app.data.importLocalStorageDownload()}>Import Data</li>
        </ul>;

    const amv = popupView(app, addMenu);
    const mmv = popupView(app, moreMenu);
    const nlv = noteListView(app);


    function addNote() {
        const n = new Note(app, "Note", "");
        app.data.noteAdd(n);
        amv.hide();
        app.data.dashboard.unshift(new NoteDashItem(app, n));
    }


    function addTaskList() {
        const tdi = new TasksDashItem(app, "");
        app.data.dashboard.unshift(tdi);
        amv.hide();
    }


    function showLabels(e: MouseEvent) {
        lpv.show(getButton(e.target), false, (l, el) => elv.begin(l, el));
    }


    function showNoteListView(e: MouseEvent) {
        nlv.showBelow(getButton(e.target));
    }


    function showAddMenu(e: MouseEvent) {
        amv.showBelow(getButton(e.target));
    }


    function showMoreMenu(e: MouseEvent) {
        mmv.showBelow(getButton(e.target));
    }


    function selectedTabColor() {
        const tab = app.data.tabs()[app.data.settings.selectedTabIndex];
        return tab.style.backColor.value;
    }


    const view =
        <div className="toolbar"
             style={{ borderTopColor: selectedTabColor() }}>
            <span className="menu-button button" onMouseDown={showLabels}>
                Labels <span className="drop-down-triangle">&#x25BC;</span>
            </span>
            <span className="menu-button button" onMouseDown={showNoteListView}>
                Notes <span className="drop-down-triangle">&#x25BC;</span>
            </span>
            <span className="menu-button button" onMouseDown={showAddMenu}>
                Add <span className="drop-down-triangle">&#x25BC;</span>
            </span>
            <span className="menu-button button" onMouseDown={showMoreMenu}>
                More <span className="drop-down-triangle">&#x25BC;</span>
            </span>
        </div>;


    return {
        view,
        addMenuView: amv.view,
        noteListView: nlv.view,
        moreMenuView: mmv.view
    };
}