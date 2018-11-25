import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import { IApp } from "../interfaces";
import { labelsPopupView } from "./LabelsPopupView";
import { onMouseDown } from "../common";
import editLabelView from "./EditLabelView";
import TasksDashItem from "../data/TasksDashItem";


export default function toolbarView(a: IApp) {

    const elv = editLabelView(a);
    const lpv = labelsPopupView(a, a.data.labels);


    function addTaskList() {
        const tdi = new TasksDashItem(a);
        a.dashboard.unshift(tdi);
    }


    const view =
        <div className="toolbar">
            <button fn={onMouseDown((e) => lpv.show(e.target as HTMLElement,
                (l, el) => elv.begin(l, el)))}>
                Labels <span className="drop-down-triangle">&#x25BC;</span>
            </button>
            <button>
                Notes <span className="drop-down-triangle">&#x25BC;</span>
            </button>
            <button onClick={addTaskList}>
                Add <span className="drop-down-triangle">&#x25BC;</span>
            </button>
            <button onClick={() => a.data.generateLocalStorageDownload()}>Export</button>
            <input className="view-filter" type="number" fn={data(a.data.settings
                .dashboardColumnsCount)}/>
            <input className="view-filter" type="search" placeholder="View Filter"/>
            <ul className="add-menu menu">
                <li onClick={addTaskList}>
                    Add New Task List
                </li>
                <li>Add New Note</li>
                <li>Add Footer</li>
            </ul>
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