import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import { IApp, IToolbarView, IPopupView, INoteListView } from "../interfaces";
import TasksDashItem from "../data/dash/TasksDashItem";
import { LabelsPopupView } from "./popup/LabelsPopupView";
import { LabelEditView } from "./popup/LabelEditView";
import Note from "../data/domain/Note";
import PopupView from "./PopupView";
import NoteListView from "./popup/NoteListView";
import NoteDashItem from "../data/dash/NoteDashItem";
import { R, getButton} from "../common";
import { AppDataOps } from "../operations/AppDataOps";


export default class ToolbarView implements IToolbarView {

    constructor(
        readonly app: IApp,
        readonly elv: LabelEditView,
        readonly lpv: LabelsPopupView) {

        this.view = ToolbarView.render(this);
        this.addMenuView = new PopupView(this.app, ToolbarView.renderAddMenu(this));
        this.noteListView = new NoteListView(this.app);
        this.moreMenuView = new PopupView(this.app, ToolbarView.renderMoreMenu(this));
    }


    private readonly autoCols = R.data(true);
    readonly view: HTMLElement;
    readonly addMenuView: IPopupView;
    readonly noteListView: INoteListView;
    readonly moreMenuView: IPopupView;


    private static renderAddMenu(self: ToolbarView) {
        const view =
            <ul className="add-menu menu">
                <li onClick={self.addTaskList}>Add New Task List</li>
                <li onClick={self.addNote}>Add New Note</li>
            </ul>;
        return view;
    }


    private static renderMoreMenu(self: ToolbarView) {
        const view =
            <ul className="more-menu menu">
                <li className="columns-menu">
                    <span>Columns</span>
                    <input type="checkbox" id="auto-columns-count" fn={data(self.autoCols)}/>
                    <label htmlFor="auto-columns-count">Auto</label>
                    <fieldset disabled={self.autoCols()}>
                        <button onMouseDown=
                                {() => --self.app.data.dashboard.columnsCount}>-</button>
                        <span className="dash-columns-input">{() => self.app.data.dashboard
                            .columnsCount}</span>
                        <button onMouseDown=
                                {() => ++self.app.data.dashboard.columnsCount}>+</button>
                    </fieldset>
                </li>
                <li>
                    <input
                        className="view-filter"
                        type="search"
                        placeholder="View Filter"
                        fn={data(self.app.data.dashboard.query.text)}/>
                </li>
                <li onMouseDown={() => AppDataOps.exportData(self.app.localStore)}>Export Data</li>
                <li onClick={() => AppDataOps.importData(self.app.localStore)}>Import Data</li>
            </ul>;
        return view;
    }


    private addNote() {
        const n = Note.createNew(this.app, "Note", "", 1);
        this.app.data.noteAdd(n);
        this.addMenuView.hide();
        this.app.data.dashboard.unshift(new NoteDashItem(this.app, n));
    }


    private addTaskList() {
        const tdi = new TasksDashItem(this.app, "");
        this.app.data.dashboard.unshift(tdi);
        this.addMenuView.hide();
    }


    private showLabels(e: MouseEvent) {
        this.lpv.show(getButton(e.target), undefined, (l, el) => this.elv.begin(l, el));
    }


    private showNoteListView(e: MouseEvent) {
        this.noteListView.showBelow(getButton(e.target));
    }


    private showAddMenu(e: MouseEvent) {
        this.addMenuView.showBelow(getButton(e.target));
    }


    private showMoreMenu(e: MouseEvent) {
        this.moreMenuView.showBelow(getButton(e.target));
    }


    private selectedTabColor() {
        const tab = this.app.data.tabs()[this.app.data.fields.selectedTabIndex];
        if (tab.style)
            return tab.style.backColor.value;
        else
            return "gray";
    }


    private static render(self: ToolbarView): HTMLElement {
        const view =
            <div className="toolbar"
                 style={{ borderTopColor: self.selectedTabColor() }}>
                <span className="menu-button button" onMouseDown={self.showLabels}>
                    Labels <span className="drop-down-triangle">&#x25BC;</span>
                </span>
                <span className="menu-button button" onMouseDown={self.showNoteListView}>
                    Notes <span className="drop-down-triangle">&#x25BC;</span>
                </span>
                <span className="menu-button button" onMouseDown={self.showAddMenu}>
                    Add <span className="drop-down-triangle">&#x25BC;</span>
                </span>
                <span className="menu-button button" onMouseDown={self.showMoreMenu}>
                    More <span className="drop-down-triangle">&#x25BC;</span>
                </span>
            </div>;
        return view;
    }
}
