import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, INoteDashItem } from "../interfaces";
import data from "surplus-mixin-data";
import { findById } from "../common";


export function noteDashItemView(a: IApp, ndi: INoteDashItem) {

    const n = findById(a.data.notes, ndi.noteId);

    const view =
        <div className="note-dash">
            <div className="header">
                {n.id}
                <button onClick={() => a.dashboard.remove(ndi)}>
                    X
                </button>
            </div>
            <textarea 
             style={{ width: ndi.width + "px", height: ndi.height + "px" }}
                fn={data(n.textSignal)}>
            </textarea>
        </div>;


    return view;
}