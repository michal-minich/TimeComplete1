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


export default function toolbarView(a: IApp, elv: EditLabelView, lpv: LabelsPopupView) {

    const addMenu =
        <ul className="add-menu menu">
            <li onClick={addTaskList}>Add New Task List</li>
            <li onClick={addNote}>Add New Note</li>
        </ul>;


    const vw = popupView(a, addMenu);


    function addNote() {
        const n = new Note(a);
        a.data.notes.unshift(n);
        vw.hide();
    }


    function addTaskList() {
        const tdi = new TasksDashItem(a);
        a.dashboard.unshift(tdi);
        vw.hide();
    }


    function showAddMenu(e: MouseEvent) {
        vw.showBelow(e.target as HTMLButtonElement);
    }


    const view =
        <div className="toolbar">
            {vw.view}
            <button onMouseDown={(e: MouseEvent) => {
                lpv.show(e.target as HTMLElement,
                    (l, el) => elv.begin(l, el));
            }}>
                Labels <span className="drop-down-triangle">&#x25BC;</span>
            </button>
            <button>
                Notes <span className="drop-down-triangle">&#x25BC;</span>
            </button>
            <button onClick={showAddMenu}>
                Add <span className="drop-down-triangle">&#x25BC;</span>
            </button>
            <button onClick={() => a.data.generateLocalStorageDownload()}>Export</button>
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
                <li onClick={() => a.data.generateLocalStorageDownload()}>Export Data</li>
            </ul>
        </div>;

    return view;
}