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
import Note from "../../data/domain/Note";


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

    function duplicate(): void {
        hide();
        const n = app.data.dashboard.selected()! as INoteDashItem;
        const n2 = Note.createNew(app, n.note.title, n.note.text);
        app.data.noteAdd(n2);
        app.data.dashboard.unshift(new NoteDashItem(app, n2));
    };


    function close(): void {
        hide();
        const n = app.data.dashboard.selected()!;
        app.data.dashboard.remove(n);
    };


    function del(): void {
        hide();
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
    };


    const view =
        <ul className="more-menu menu">
            <li onMouseDown={duplicate}>Duplicate</li>
            <li onMouseDown={close}>Close</li>
            <li onMouseDown={del}>Delete</li>
        </ul>;
    return view;

}