import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import { IApp, ILabel, ArraySignal, ILabelsPopupUc } from "../../interfaces"
import LabelAddUc, { labelAddUcState } from "./LabelAddUc";
import { colorInlineStyle, R } from "../../common";
import PopupUc from "../PopupUc";


export default class LabelsPopupUc implements ILabelsPopupUc {

    constructor(
        private readonly app: IApp,
        readonly labels: ArraySignal<ILabel>) {
    }


    labelStyle = (l: ILabel) => {
        const s = colorInlineStyle(l.style);
        //console.log(this.associated2);
        //console.log(l.name);
        if (this.associated2 && this.associated2().find(a => a.name === l.name) !== undefined) {
            (s as any).textDecoration = "underline";
        }
        return s;
    };


    act!: (label: ILabel, el: HTMLSpanElement) => void;
    readonly queryText = R.data("");
    readonly lav = new LabelAddUc(this.app);
    private associated2: ArraySignal<ILabel> | undefined;
    private readonly popup = new PopupUc(this.app, getControlledView(this.app, this));


    get view() {
        return this.popup.view;
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


function getControlledView(app: IApp, owner: LabelsPopupUc) {


    function activate(label: ILabel, el: HTMLSpanElement): void {
        owner.act(label, el);
    };


    const view =
        <div className="labels-popup-view">
            <input type="search"
                   className="hidden"
                   placeholder="Search"
                   fn={data(owner.queryText)}/>
            <div className="label-list-inner">
                {owner.lav.view}
                {owner.labels().map(l =>
                    <span
                        className="label"
                        onMouseDown={(e: MouseEvent) => activate(l, e.target as HTMLSpanElement)}
                        style={owner.labelStyle(l)}>
                        {l.name}
                    </span>
                )}
            </div>
        </div>;
    return view;
}