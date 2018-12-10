import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, INoteDashItem } from "../../interfaces";
import data from "surplus-mixin-data";


export function noteDashItemView(app: IApp, ndi: INoteDashItem) {

    const view =
        <div className="note-dash">
            <div className="header">
                {ndi.note.id}
                <button onClick={() => app.data.dashboard.remove(ndi)}>
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