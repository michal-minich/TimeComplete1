import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import { IApp, ILabel, ArraySignal } from "../../interfaces"
import labelAddView, { labelAddViewState } from "./LabelAddView";
import { colorInlineStyle } from "../MainView";
import { onMouseDown } from "../../common";
import { R } from "../../common";
import PopupView from "../PopupView";


// export type LabelsPopupView = ReturnType<typeof labelsPopupView>
// ReSharper disable once InconsistentNaming
export interface LabelsPopupView {
    readonly view: HTMLDivElement;
    readonly show: (
        over: HTMLElement,
        associated: ArraySignal<ILabel> | undefined,
        action: (label: ILabel, el: HTMLSpanElement) => void) => void;
}

export default function labelsPopupView(
    app: IApp,
    labels: ArraySignal<ILabel>,): LabelsPopupView {

    let act: (label: ILabel, el: HTMLSpanElement) => void;
    const queryText = R.data("");
    const lav = labelAddView(app);
    let associated2: ArraySignal<ILabel> | undefined;

    function labelStyle(l : ILabel) {
        const s = colorInlineStyle(l.style);
        console.log(associated2);
        console.log(l.name);
        if (associated2 && associated2().find(a => a.name === l.name) !== undefined) {
            (s as any).textDecoration = "underline";
        }
        return s;
    }

    const content =
        <div className="labels-popup-view">
            <input type="search"
                   className="hidden"
                   placeholder="Search"
                   fn={data(queryText)}
                   onKeyUp={(e: KeyboardEvent) => keyUp(e)}/>
            <div className="label-list-inner">
                {lav.view}
                {labels.map(l =>
                    <span
                        className="label"
                        fn={onMouseDown((e) => activate(l, e.target as HTMLSpanElement))}
                        style={labelStyle(l)}>
                        {l.name}
                    </span>
                )()}
            </div>
        </div>;


    const view = new PopupView(app, content);


    function keyUp(e: KeyboardEvent): void {
    }


    function activate(label: ILabel, el: HTMLSpanElement): any {
        act(label, el);
    }

    function show(
        over: HTMLElement,
        associated: ArraySignal<ILabel> | undefined,
        action: (label: ILabel, el: HTMLSpanElement) => void): void {

        associated2 = associated;
        act = action;
        labelAddViewState.isForTask = associated !== undefined;
        labelAddViewState.hideWindow = view.hide;
        view.showBelow(over);
    }


    return { view: view.view as HTMLDivElement, show };
};