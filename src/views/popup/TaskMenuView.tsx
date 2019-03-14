import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, ITaskMenuView, IPopupView } from "../../interfaces";
import PopupView from "../PopupView";


export default class TaskMenuView implements ITaskMenuView {

    constructor(private readonly app: IApp) {

        this.popup = new PopupView(app, this.render());
    }


    private readonly popup: IPopupView;


    get view() {
        return this.popup.view;
    }


    hide(): void {
        this.popup.hide();
    }


    showBelow(el: HTMLElement): void {
        this.popup.showBelow(el);
    }


    closeSelected: () => void = () => {
        const n = this.app.data.dashboard.selected()!;
        this.app.data.dashboard.remove(n);
    }


    private render() {
        const view =
            <ul className="more-menu menu">
                <li onMouseDown={this.closeSelected}>Close</li>
            </ul>;
        return view;
    }
}