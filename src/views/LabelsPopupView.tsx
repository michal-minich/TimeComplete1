import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import { IApp, ILabel, ArraySignal } from "../interfaces"
import { newLabelView } from "./NewLabelView";
import { labelInlineStyle } from "./MainView";
import { onMouseDown } from "../common";
import { R } from "../common";


export type LabelsPopupView = {
    view: Element;
    show(over: HTMLElement, action: (label: ILabel, el: HTMLSpanElement) => void): void;
};


export const labelsPopupView = (a: IApp, labels: ArraySignal<ILabel>) => {

    let _action: (label: ILabel, el: HTMLSpanElement) => void;
    const queryText = R.data("");

    const view =
        <div className="labels-popup-view hidden">
            <input type="search"
                   className="hidden"
                   placeholder="Search"
                   fn={data(queryText)}
                   onKeyUp={(e: KeyboardEvent) => keyUp(e)}/>
            <div className="label-list-inner">
                {newLabelView(a)}
                {labels.map(l =>
                    <span
                        className="label"
                        fn={onMouseDown((e) => activate(l, e.target as HTMLSpanElement))}
                        style={labelInlineStyle(l.style)}>
                        {l.name}
                    </span>
                )()}
            </div>
        </div>;


    function keyUp(e: KeyboardEvent): void {
    }


    function activate(label: ILabel, el: HTMLSpanElement): any {
        _action(label, el);
    }


    const hideMe =
        () => {
            //this.labelsPopupDiv.classList.add("hidden");
            //document.removeEventListener("mousedown",hideMe);
        };


    function show(over: HTMLElement, action: (label: ILabel, el: HTMLSpanElement) => void): void {

        const r = over.getBoundingClientRect();
        const divStyle = view.style;
        divStyle.left = (r.left) + "px";
        divStyle.top = (r.top + r.height + 4) + "px";

        _action = action;
        const cl = view.classList;
        if (cl.contains("hidden"))
            cl.remove("hidden");
        else
            cl.add("hidden");

        document.addEventListener("click", hideMe);
    }


    function hide(): void {
    }


    return { view, show };
};