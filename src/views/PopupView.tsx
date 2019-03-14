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

        this.window = new WindowView(app, content);
    }

    private counter = 0;
    private readonly window: IWindowView;


    get view(): HTMLElement {
        return this.window.view;
    }


    hide :()=> void = () => {
        this.window.hide();
    }


    showBelow(el: HTMLElement): void {
        this.window.showBelow(el);
        this.counter = 0;
        document.addEventListener("mousedown", this.hideMe);
    }


    private hideMe: (e: MouseEvent) => void = (e) => {
        if (parentDistance(e.target as HTMLElement, this.window.view) !== -1)
            return;
        ++this.counter;
        if (this.counter <= 1)
            return;
        this.window.hide();
        document.removeEventListener("mousedown", this.hideMe);
    }
}