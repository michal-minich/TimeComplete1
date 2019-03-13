import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, INote } from "../../interfaces";

import PopupView from "../PopupView";
import NoteDashItem from "../../data/dash/NoteDashItem";

export type PopupView = ReturnType<typeof noteListView>


export default function noteListView(app: IApp) {


    const view =
        <div className="note-list">
            {app.data.notes().map(noteView)}
        </div>;


    const popView = new PopupView(app, view);


    function activateNote(n: INote) {
        app.data.dashboard.unshift(new NoteDashItem(app, n));
        popView.hide();
    }

    function noteView(n: INote) {

        const v =
            <div className="note"
                 onClick={() => activateNote(n)}>
                {(n.title + ": " + n.text).substring(0, 100)}
            </div>;

        return v;
    }


    function showBelow(el: HTMLElement): void {
        popView.showBelow(el);
    }


    return { view: popView.view, showBelow };
};