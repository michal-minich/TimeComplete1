import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, INote, INoteListView, IPopupView } from "../../interfaces";

import PopupView from "../PopupView";
import NoteDashItem from "../../data/dash/NoteDashItem";


export default class NoteListView implements INoteListView {

    constructor(readonly app: IApp) {
        const v = NoteListView.render(this);
        this.popView = new PopupView(app, v);
    }


    private popView: IPopupView;


    private static render(self: NoteListView) {
        const view =
            <div className="note-list">
                {self.app.data.notes().map(self.noteView)}
            </div>;
        return view;
    }


    get view(): HTMLElement {
        return this.popView.view;
    }


    hide(): void {
        this.popView.hide();
    }


    activateNote(n: INote) {
        this.app.data.dashboard.unshift(new NoteDashItem(this.app, n));
        this.popView.hide();
    }


    noteView(n: INote) {

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