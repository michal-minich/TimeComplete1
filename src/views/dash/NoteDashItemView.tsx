import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, INoteDashItem } from "../../interfaces";
import data from "surplus-mixin-data";


export function noteDashItemView(a: IApp, ndi: INoteDashItem) {

    const view =
        <div className="note-dash">
            <div className="header">
                {ndi.note.id}
                <button onClick={() => a.dashboard.remove(ndi)}>
                    X
                </button>
            </div>
            <textarea 
             style={{ width: ndi.width + "px", height: ndi.height + "px" }}
                fn={data(ndi.note.textSignal)}>
            </textarea>
        </div>;


    return view;
}