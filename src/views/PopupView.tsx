import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, IPopupView, IWindowView } from "../interfaces";
import WindowView from "./windowView";
import { parentDistance } from "../common";


export default class PopupView implements IPopupView {

    constructor(
        private readonly app: IApp,
        content: HTMLElement) {

        this.vw = new WindowView(app, content);
    }

    private counter = 0;
    private readonly vw: IWindowView;


    get view(): HTMLElement {
        return this.vw.view;
    }


    hide(): void {
        this.vw.hide();
    }


    showBelow(el: HTMLElement): void {
        this.vw.showBelow(el);
        this.counter = 0;
        document.addEventListener("mousedown", this.hideMe);
    }


    private hideMe(e: MouseEvent) {
        if (parentDistance(e.target as HTMLElement, this.vw.view) !== -1)
            return;
        ++this.counter;
        if (this.counter <= 1)
            return;
        this.vw.hide();
        document.removeEventListener("mousedown", this.hideMe);
    }
}