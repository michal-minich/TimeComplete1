import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, INote } from "../interfaces";

import popupView from "./PopupView";
import NoteDashItem from "../data/dash/NoteDashItem";

export type PopupView = ReturnType<typeof noteListView>


export default function noteListView(a: IApp) {


    const view =
        <div className="note-list">
            {a.data.notes().map(noteView)}
        </div>;


    const popView = popupView(a, view);


    function activateNote(n: INote) {
        a.data.dashboard.unshift(new NoteDashItem(a, n));
        popView.hide();
    }

    function noteView(n: INote) {

        const v =
            <div className="note"
                 onClick={() => activateNote(n)}>
                {n.id + " " + n.text.substring(0, 100)}
            </div>;

        return v;
    }


    function showBelow(el: HTMLElement): void {
        popView.showBelow(el);
    }


    return { view: popView.view, showBelow };
};