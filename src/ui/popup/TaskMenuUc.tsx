import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, ITaskMenuUc, IPopupUc, ITasksDashItem } from "../../interfaces";
import PopupUc from "../PopupUc";
import TasksDashItem from "../../data/dash/TasksDashItem";


export default class TaskMenuUc implements ITaskMenuUc {

    constructor(private readonly app: IApp) {

        this.popup = new PopupUc(app, this.render());
    }


    private readonly popup: IPopupUc;


    get view() {
        return this.popup.view;
    }


    hide(): void {
        this.popup.hide();
    }


    showBelow(el: HTMLElement): void {
        this.popup.showBelow(el);
    }


    private close: () => void = () => {
        this.hide();
        const n = this.app.data.dashboard.selected()!;
        this.app.data.dashboard.remove(n);
    };


    private duplicate: () => void = () => {
        this.hide();
        const tl = this.app.data.dashboard.selected()! as ITasksDashItem;
        const tl2 = new TasksDashItem(this.app, tl.query.text());
        this.app.data.dashboard.unshift(tl2);
    };


    private render() {
        const view =
            <ul className="more-menu menu">
                <li onMouseDown={this.duplicate}>Duplicate</li>
                <li onMouseDown={this.close}>Close</li>
            </ul>;
        return view;
    }
}