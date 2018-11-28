import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import { IApp, ILabel, ArraySignal } from "../interfaces"
import { newLabelView } from "./NewLabelView";
import { colorInlineStyle } from "./MainView";
import { onMouseDown } from "../common";
import { R } from "../common";
import popupView from "./PopupView";


export type LabelsPopupView = ReturnType<typeof labelsPopupView>


export default function labelsPopupView(a: IApp, labels: ArraySignal<ILabel>) {

    let act: (label: ILabel, el: HTMLSpanElement) => void;
    const queryText = R.data("");

    const content =
        <div className="labels-popup-view">
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
                        style={colorInlineStyle(l.style)}>
                        {l.name}
                    </span>
                )()}
            </div>
        </div>;


    const view = popupView(a, content);


    function keyUp(e: KeyboardEvent): void {
    }


    function activate(label: ILabel, el: HTMLSpanElement): any {
        act(label, el);
    }


    const hideMe =
        () => {
            //this.labelsPopupDiv.classList.add("hidden");
            //document.removeEventListener("mousedown",hideMe);
        };


    function show(over: HTMLElement, action: (label: ILabel, el: HTMLSpanElement) => void): void {
        act = action;
        view.showBelow(over);

        document.addEventListener("click", hideMe);
    }


    function hide(): void {
    }


    return { view: view.view, show };
};