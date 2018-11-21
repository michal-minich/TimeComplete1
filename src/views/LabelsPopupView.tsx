import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import { IApp, ILabel, ArraySignal, ILabelsPopupActivity } from "../interfaces"
import { newLabelView } from "./NewLabelView";
import { labelInlineStyle } from "./MainView";
import { onMouseDown } from "../common";


export const labelsPopupView = (a: IApp, lpa: ILabelsPopupActivity, labels: ArraySignal<ILabel>) => {
    const view =
        <div className="labels-popup-view hidden">
            <input type="search"
                   className="hidden"
                   placeholder="Search"
                   fn={data(lpa.queryText)}
                   onKeyUp={(e: KeyboardEvent) => lpa.keyUp(e)}/>
            <div className="label-list-inner">
                {newLabelView(a)}
                {labels.map(l =>
                    <span
                        className="label"
                        fn={onMouseDown((e) => lpa.activate(l, e.target as HTMLSpanElement))}
                        style={labelInlineStyle(l.style)}>
                        {l.name}
                    </span>
                )()}
            </div>
        </div>;

    lpa.init(view as HTMLDivElement);

    return view;
};