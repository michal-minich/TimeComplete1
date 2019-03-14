import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import { IApp, IToolbarView, IPopupView, INoteListView, ILabelEditView } from "../interfaces";
import TasksDashItem from "../data/dash/TasksDashItem";
import { LabelsPopupView } from "./popup/LabelsPopupView";
import Note from "../data/domain/Note";
import PopupView from "./PopupView";
import NoteListView from "./popup/NoteListView";
import NoteDashItem from "../data/dash/NoteDashItem";
import { R, getButton} from "../common";
import { AppDataOps } from "../operations/AppDataOps";


export default class ToolbarView implements IToolbarView {

    constructor(
        private readonly app: IApp,
        private readonly elv: ILabelEditView,
        private readonly lpv: LabelsPopupView) {

        this.view = this.render();
        this.addMenuView = new PopupView(this.app, this.renderAddMenu());
        this.noteListView = new NoteListView(this.app);
        this.moreMenuView = new PopupView(this.app, this.renderMoreMenu());
    }


    private readonly autoCols = R.data(true);
    readonly view: HTMLElement;
    readonly addMenuView: IPopupView;
    readonly noteListView: INoteListView;
    readonly moreMenuView: IPopupView;


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
                        <button onMouseDown=
                                {() => --this.app.data.dashboard.columnsCount}>-</button>
                        <span className="dash-columns-input">{() => this.app.data.dashboard
                            .columnsCount}</span>
                        <button onMouseDown=
                                {() => ++this.app.data.dashboard.columnsCount}>+</button>
                    </fieldset>
                </li>
                <li>
                    <input
                        className="view-filter"
                        type="search"
                        placeholder="View Filter"
                        fn={data(this.app.data.dashboard.query.text)}/>
                </li>
                <li onMouseDown={() => AppDataOps.exportData(this.app.localStore)}>Export Data</li>
                <li onClick={() => AppDataOps.importData(this.app.localStore)}>Import Data</li>
            </ul>;
        return view;
    }


    private addNote: () => void = () => {
        const n = Note.createNew(this.app, "Note", "", 1);
        this.app.data.noteAdd(n);
        this.addMenuView.hide();
        this.app.data.dashboard.unshift(new NoteDashItem(this.app, n));
    }


    private addTaskList: () => void = () => {
        const tdi = new TasksDashItem(this.app, "");
        this.app.data.dashboard.unshift(tdi);
        this.addMenuView.hide();
    }


    private showLabels: (e: MouseEvent) => void = (e) => {
        this.lpv.show(getButton(e.target), undefined, (l, el) => this.elv.begin(l, el));
    }


    private showNoteListView: (e: MouseEvent) => void = (e) => {
        this.noteListView.showBelow(getButton(e.target));
    }


    private showAddMenu: (e: MouseEvent) => void = (e) => {
        this.addMenuView.showBelow(getButton(e.target));
    }


    private showMoreMenu: (e: MouseEvent) => void = (e) => {
        this.moreMenuView.showBelow(getButton(e.target));
    }


    private selectedTabColor = () => {
        const tab = this.app.data.tabs()[this.app.data.fields.selectedTabIndex];
        if (tab.style)
            return tab.style.backColor.value;
        else
            return "gray";
    }


    private render(): HTMLElement {
        const view =
            <div className="toolbar"
                 style={{ borderTopColor: this.selectedTabColor() }}>
                <span className="menu-button button" onMouseDown={this.showLabels}>
                    Labels <span className="drop-down-triangle">&#x25BC;</span>
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