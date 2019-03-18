import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, INote, INoteListUc, IPopupUc } from "../../interfaces";

import PopupUc from "../PopupUc";
import NoteDashItem from "../../data/dash/NoteDashItem";
import Note from "../../data/domain/Note";


export default class NoteListUc implements INoteListUc {

    constructor(app: IApp) {

        const v = getControlledView(app, this.hide);
        this.popup = new PopupUc(app, v);
    }


    readonly popup: IPopupUc;


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

    function activateNote(n: INote): void {
        app.data.dashboard.unshift(new NoteDashItem(app, n));
        hide();
    }


    function noteView(n: INote): HTMLElement {
        const v =
            <div className="note"
                 onClick={() => activateNote(n)}>
                {(n.title + ": " + n.text).substring(0, 100)}
            </div>;
        return v;
    }


    function addNote(): void {
        const n = Note.createNew(app, "Note", "");
        app.data.noteAdd(n);
        app.data.dashboard.unshift(new NoteDashItem(app, n));
    }


    const view =
        <ul className="note-menu menu">
            <li onClick={addNote}>Add New Note</li>
            <div className="note-list">
                {app.data.notes().map(noteView)}
            </div>
        </ul>;

    return view;
}