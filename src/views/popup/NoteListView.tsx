import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, INote, INoteListView, IPopupView } from "../../interfaces";

import PopupView from "../PopupView";
import NoteDashItem from "../../data/dash/NoteDashItem";


export default class NoteListView implements INoteListView {

    constructor(private readonly app: IApp) {

        const v = this.render();
        this.popView = new PopupView(app, v);
    }


    private popView: IPopupView;


    private render() {
        const view =
            <div className="note-list">
                {this.app.data.notes().map(this.noteView)}
            </div>;
        return view;
    }


    get view(): HTMLElement {
        return this.popView.view;
    }


    hide(): void {
        this.popView.hide();
    }


    private activateNote: (n: INote) => void = (n) => {
        this.app.data.dashboard.unshift(new NoteDashItem(this.app, n));
        this.popView.hide();
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
        this.popView.showBelow(el);
    }
}