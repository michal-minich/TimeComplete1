import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, INote, INoteListUc, IPopupUc } from "../../interfaces";

import PopupUc from "../PopupUc";
import NoteDashItem from "../../data/dash/NoteDashItem";


export default class NoteListUc implements INoteListUc {

    constructor(private readonly app: IApp) {

        const v = this.render();
        this.popup = new PopupUc(app, v);
    }


    private popup: IPopupUc;


    private render() {
        const view =
            <div className="note-list">
                {this.app.data.notes().map(this.noteView)}
            </div>;
        return view;
    }


    get view(): HTMLElement {
        return this.popup.view;
    }


    hide(): void {
        this.popup.hide();
    }


    private activateNote: (n: INote) => void = (n) => {
        this.app.data.dashboard.unshift(new NoteDashItem(this.app, n));
        this.popup.hide();
    }


    private noteView: (n: INote) => HTMLElement = (n) => {
        const v =
            <div className="note"
                 onClick={() => this.activateNote(n)}>
                {(n.title + ": " + n.text).substring(0, 100)}
            </div>;
        return v;
    }


    showBelow(el: HTMLElement): void {
        this.popup.showBelow(el);
    }
}