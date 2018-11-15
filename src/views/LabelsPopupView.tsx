import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
Surplus;
import data from "surplus-mixin-data";
import { IApp, ILabel, RArray, ILabelsPopupActivity } from "../interfaces"
import { newLabelView } from "./NewLabelView";
import { labelInlineStyle } from "./MainView";


export const labelsPopupView = (a: IApp, lpa: ILabelsPopupActivity, labels: RArray<ILabel>) => {
    const view =
        <div className="labels-popup-view hidden">
            <input type="search"
                   fn={data(lpa.queryText)}
                   onKeyUp={(e: KeyboardEvent) => lpa.keyUp(e)}/>
            <div className="label-list-inner">
                {newLabelView(a.activity.addLabel)}
                {labels.map(l =>
                    <span
                        className="label"
                        onMouseDown={() => lpa.activate(l)}
                        style={labelInlineStyle(l.style)}>
                        {l.name}
                    </span>
                )()}
            </div>
        </div>;

    lpa.init(view as HTMLDivElement);

    return view;
};