import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import { IApp, ILabel, ArraySignal, ILabelsPopupUc } from "../../interfaces"
import labelAddUc, { labelAddUcState } from "./LabelAddUc";
import { colorInlineStyle } from "../MainUc";
import { R } from "../../common";
import PopupUc from "../PopupUc";


// export type LabelsPopupUc = ReturnType<typeof labelsPopupView>
// ReSharper disable once InconsistentNaming


export default class LabelsPopupUc implements ILabelsPopupUc {

    constructor(
        private readonly app: IApp,
        private readonly labels: ArraySignal<ILabel>) {
    }


    private labelStyle = (l: ILabel) => {
        const s = colorInlineStyle(l.style);
        //console.log(this.associated2);
        //console.log(l.name);
        if (this.associated2 && this.associated2().find(a => a.name === l.name) !== undefined) {
            (s as any).textDecoration = "underline";
        }
        return s;
    }


    private act!: (label: ILabel, el: HTMLSpanElement) => void;
    private readonly queryText = R.data("");
    private readonly lav = labelAddUc(this.app);
    private associated2: ArraySignal<ILabel> | undefined;
    private readonly popup = new PopupUc(this.app, this.render());

    get view() {
        return this.popup.view;
    }



    private render() {
        const v =
            <div className="labels-popup-view">
                <input type="search"
                       className="hidden"
                       placeholder="Search"
                       fn={data(()=> this.queryText)}
                       onKeyUp={(e: KeyboardEvent) => this.keyUp(e)}/>
                <div className="label-list-inner">
                    {this.lav.view}
                    {this.labels().map(l =>
                        <span
                            className="label"
                            onMouseDown={(e: MouseEvent) => this.activate(l, e.target as HTMLSpanElement)}
                            style={this.labelStyle(l)}>
                            {l.name}
                        </span>
                    )}
                </div>
            </div>;
        return v;
    }


    private keyUp: (e: KeyboardEvent) => void = (e) => {
    }


    private activate: (label: ILabel, el: HTMLSpanElement) => any = (label, el) => {
        this.act(label, el);
    }


    show(
        over: HTMLElement,
        associated: ArraySignal<ILabel> | undefined,
        action: (label: ILabel, el: HTMLSpanElement) => void): void {

        this.associated2 = associated;
        this.act = action;
        labelAddUcState.isForTask = associated !== undefined;
        labelAddUcState.hideWindow = this.popup.hide;
        this.popup.showBelow(over);
    }
}