import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import {
    IApp,
    INoteDashItem,
    IDashboard,
    INoteMenuUc,
    IPopupUc
} from "../../interfaces";
import PopupUc from "../PopupUc";
import NoteDashItem from "../../data/dash/NoteDashItem";


export default class NoteMenuUc implements INoteMenuUc {

    constructor(private readonly app: IApp) {

        const v = this.render();
        this.popup = new PopupUc(this.app, v);
    }


    private readonly popup: IPopupUc;


    get view() {
        return this.popup.view;
    }


    hide(): void {
        this.popup.hide();
    }


    showBelow(el: HTMLElement): void {
        this.popup.showBelow(el);
    }


    private closeSelected: () => void = () => {
        const n = this.app.data.dashboard.selected()!;
        this.app.data.dashboard.remove(n);
        // ReSharper disable VariableUsedInInnerScopeBeforeDeclared
        this.popup.hide();
        // ReSharper restore VariableUsedInInnerScopeBeforeDeclared
    }


    private deleteNote: () => void = () => {
        const ndi = this.app.data.dashboard.selected()! as INoteDashItem;
        const n = ndi.note;
        for (const tab of this.app.data.tabs()) {
            const d = tab.content as IDashboard;
            const ndiToRemove = d.items()
                .filter(ndi2 => ndi2 instanceof NoteDashItem && ndi2.note === n);
            for (const r of ndiToRemove)
                d.remove(r);
        }
        this.app.data.noteDelete(ndi.note);
        // ReSharper disable once VariableUsedInInnerScopeBeforeDeclared
        this.popup.hide();
    }


    private render() {
        const view =
            <ul className="more-menu menu">
                <li onMouseDown={this.closeSelected}>Close</li>
                <li onMouseDown={this.deleteNote}>Delete</li>
            </ul>;
        return view;
    }
}