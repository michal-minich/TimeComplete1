import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import {
    IApp,
    IToolbarUc,
    IPopupUc,
    INoteListUc,
    ILabelEditUc,
    ILabelsPopupUc,
    ITasksDashItem,
} from "../interfaces";
import TasksDashItem from "../data/dash/TasksDashItem";
import Note from "../data/domain/Note";
import PopupUc from "./PopupUc";
import NoteListUc from "./popup/NoteListUc";
import NoteDashItem from "../data/dash/NoteDashItem";
import { R, getButton } from "../common";
import { AppDataOps } from "../operations/AppDataOps";


export default class ToolbarUc implements IToolbarUc {

    constructor(
        private readonly app: IApp,
        private readonly elv: ILabelEditUc,
        private readonly lpv: ILabelsPopupUc) {

        this.view = this.render();
        this.addMenuUc = new PopupUc(this.app, this.renderAddMenu());
        this.noteListUc = new NoteListUc(this.app);
        this.moreMenuUc = new PopupUc(this.app, this.renderMoreMenu());
        this.taskListsMenuUc = new PopupUc(this.app, this.taskListsMenu);
    }


    private readonly autoCols = R.data(true);
    readonly view: HTMLElement;
    readonly addMenuUc: IPopupUc;
    readonly noteListUc: INoteListUc;
    readonly moreMenuUc: IPopupUc;
    readonly taskListsMenuUc: IPopupUc;


    private renderAddMenu() {
        const view =
            <ul className="add-menu menu">
                <li onClick={this.addTaskList}>Add New Task List</li>
                <li onClick={this.addNote}>Add New Note</li>
            </ul>;
        return view;
    }


    private renderMoreMenu() {
        const view =
            <ul className="more-menu menu">
                <li className="columns-menu">
                    <span>Columns</span>
                    <input type="checkbox" id="auto-columns-count" fn={data(this.autoCols)}/>
                    <label htmlFor="auto-columns-count">Auto</label>
                    <fieldset disabled={this.autoCols()}>
                        <button onMouseDown={
                            () => --this.app.data.dashboard.columnsCount
                        }>-</button>
                        <span className="dash-columns-input">{
                            () => this.app.data.dashboard.columnsCount
                        }</span>
                        <button onMouseDown={
                            () => ++this.app.data.dashboard.columnsCount
                        }>+</button>
                    </fieldset>
                </li>
                <li>
                    <input
                        className="view-filter"
                        type="search"
                        placeholder="Dashboard Filter"
                        fn={data(this.app.data.dashboard.query.text)}/>
                </li>
                <li onMouseDown={() => AppDataOps.exportData(this.app.localStore)}>Export Data</li>
                <li onClick={() => AppDataOps.importData(this.app.localStore)}>Import Data</li>
            </ul>;
        return view;
    }


    private addNote: () => void = () => {
        const n = Note.createNew(this.app, "Note", "");
        this.app.data.noteAdd(n);
        this.addMenuUc.hide();
        this.app.data.dashboard.unshift(new NoteDashItem(this.app, n));
    };


    private addTaskList: () => void = () => {
        const tdi = new TasksDashItem(this.app, "");
        this.app.data.dashboard.unshift(tdi);
        this.addMenuUc.hide();
    };


    private showLabels: (e: MouseEvent) => void = (e) => {
        this.lpv.show(getButton(e.target), undefined, (l, el) => this.elv.begin(l, el));
    };


    private showNoteListView: (e: MouseEvent) => void = (e) => {
        this.noteListUc.showBelow(getButton(e.target));
    };


    private showAddMenu: (e: MouseEvent) => void = (e) => {
        this.addMenuUc.showBelow(getButton(e.target));
    };


    private showMoreMenu: (e: MouseEvent) => void = (e) => {
        this.moreMenuUc.showBelow(getButton(e.target));
    };


    private showTaskListsMenu: (e: MouseEvent) => void = (e) => {
        this.taskListsMenuUc.showBelow(getButton(e.target));
    };


    private selectedTabColor = () => {
        const tab = this.app.data.tabs()[this.app.data.fields.selectedTabIndex];
        if (tab.style)
            return tab.style.backColor.value;
        else
            return "gray";
    };


    private readonly taskListsMenu =
        <ul className="task-lists-menu menu">
            <li onClick={this.addTaskList}>Add New Task List</li>
            {this.app.data.dashboard.items()
                .filter(i => i instanceof TasksDashItem)
                .map(tdi =>
                    <li>{(tdi as ITasksDashItem).query.text}</li>)
            }
        </ul>;


    private render(): HTMLElement {
        const view =
            <div className="toolbar"
                 style={{ borderTopColor: this.selectedTabColor() }}>
                <span className="menu-button button" onMouseDown={this.showLabels}>
                    Labels <span className="drop-down-triangle">&#x25BC;</span>
                </span>
                <span className="menu-button button" onMouseDown={this.showTaskListsMenu}>
                    Task Lists <span className="drop-down-triangle">&#x25BC;</span>
                </span>
                <span className="menu-button button" onMouseDown={this.showNoteListView}>
                    Notes <span className="drop-down-triangle">&#x25BC;</span>
                </span>
                <span className="menu-button button" onMouseDown={this.showAddMenu}>
                    Add <span className="drop-down-triangle">&#x25BC;</span>
                </span>
                <span className="menu-button button" onMouseDown={this.showMoreMenu}>
                    More <span className="drop-down-triangle">&#x25BC;</span>
                </span>
            </div>;
        return view;
    }
}