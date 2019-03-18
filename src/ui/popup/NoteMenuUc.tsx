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

    constructor(app: IApp) {

        const v = getControlledView(app, this.hide);
        this.popup = new PopupUc(app, v);
    }


    private readonly popup: IPopupUc;


    get view() {
        return this.popup.view;
    }


    readonly hide: () => void = () => {
        this.popup.hide();
    };


    showBelow(el: HTMLElement): void {
        this.popup.showBelow(el);
    }
}


function getControlledView(app: IApp, hide: () => void) {

    function closeSelected(): void {
        const n = app.data.dashboard.selected()!;
        app.data.dashboard.remove(n);
        // ReSharper disable VariableUsedInInnerScopeBeforeDeclared
        hide();
        // ReSharper restore VariableUsedInInnerScopeBeforeDeclared
    };


    function deleteNote(): void {
        const ndi = app.data.dashboard.selected()! as INoteDashItem;
        const n = ndi.note;
        for (const tab of app.data.tabs()) {
            const d = tab.content as IDashboard;
            const ndiToRemove = d.items()
                .filter(ndi2 => ndi2 instanceof NoteDashItem && ndi2.note === n);
            for (const r of ndiToRemove)
                d.remove(r);
        }
        app.data.noteDelete(ndi.note);
        // ReSharper disable once VariableUsedInInnerScopeBeforeDeclared
        hide();
    };


    const view =
        <ul className="more-menu menu">
            <li onMouseDown={closeSelected}>Close</li>
            <li onMouseDown={deleteNote}>Delete</li>
        </ul>;
    return view;

}