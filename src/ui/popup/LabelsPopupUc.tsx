import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import data from "surplus-mixin-data";
import { IApp, ILabel, ArraySignal, ILabelsPopupUc, IPopupUc } from "../../interfaces"
import LabelAddUc from "./LabelAddUc";
import { colorInlineStyle, R } from "../../common";
import PopupUc from "../PopupUc";


export default class LabelsPopupUc implements ILabelsPopupUc {

    constructor(private readonly app: IApp) {

        this.popup = new PopupUc(this.app, getControlledView(this.app, this));
    }


    act!: (label: ILabel, el: HTMLSpanElement) => void;
    readonly queryText = R.data("");
    readonly lav = new LabelAddUc(this.app, this);
    associated2: ArraySignal<ILabel> | undefined;
    private readonly popup: IPopupUc;
    isForTask!: boolean;
    hideWindow!: () => void;


    get view() {
        return this.popup.view;
    }


    show(
        over: HTMLElement,
        associated: ArraySignal<ILabel> | undefined,
        action: (label: ILabel, el: HTMLSpanElement) => void): void {

        this.associated2 = associated;
        this.act = action;
        this.isForTask = associated !== undefined;
        this.hideWindow = this.popup.hide;
        this.popup.showBelow(over);
    }
}


function getControlledView(app: IApp, owner: LabelsPopupUc) {


    function activate(label: ILabel, el: HTMLSpanElement): void {
        owner.act(label, el);
    }


    function onMouseDown(e: MouseEvent, l: ILabel) {
        activate(l, e.target as HTMLSpanElement);
    }


    function getAppLabels() {
        return app.data.labels().filter(l => l.id <= 1000).map(labelView);
    }


    function getUserLabels() {
        return app.data.labels().filter(l => l.id > 1000).map(labelView);
    }


    function getDashboardLabels() {
        return app.data.labels().filter(() => true).map(labelView);
    }


    function labelStyle(l: ILabel) {
        const s = colorInlineStyle(l.style);
        //console.log(this.associated2);
        //console.log(l.name);
        if (owner.associated2 && owner.associated2().find(a => a.name === l.name) !== undefined) {
            (s as any).textDecoration = "underline";
        }
        return s;
    }


    function labelView(l: ILabel) {
        return (
            <span
                className="label"
                onMouseDown={(e: MouseEvent) => onMouseDown(e, l)}
                style={labelStyle(l)}>
                {l.name}
            </span>);
    }


    const view =
        <div className="labels-popup-view">
            <input type="search"
                   className="hidden"
                   placeholder="Search"
                   fn={data(owner.queryText)}/>
            <div className="label-list-inner">
                {owner.lav.view}
                {getUserLabels()}
                <div className={owner.isForTask ? "hidden" : ""}>
                    <br/>
                    <br/>
                    <div className="smaller-font">App Labels</div>
                    {getAppLabels()}
                </div>
                <div className={owner.isForTask ? "hidden" : ""}>
                    <br/>
                    <br/>
                    <div className="smaller-font">Dashboard Labels</div>
                </div>
                <br/>
            </div>
        </div>;
    return view;
}