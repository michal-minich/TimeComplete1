import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, IPopupView, IWindowView } from "../interfaces";
import WindowView from "./windowView";


export default class PopupView implements IPopupView {

    constructor(
        public readonly app: IApp,
        content: HTMLElement) {

        this.vw = new WindowView(app, content);
    }

    private x = 0;
    private readonly vw: IWindowView;


    get view(): HTMLElement {
        return this.vw.view;
    }


    hide(): void {
        this.vw.hide();
    }


    showBelow(el: HTMLElement): void {
        this.vw.showBelow(el);
        this.x = 0;
        document.addEventListener("mousedown", this.hideMe);
    }


    private hideMe(e: MouseEvent) {
        if (this.hasParent(e.target as HTMLElement, this.vw.view))
            return;
        ++this.x;
        if (this.x <= 1)
            return;
        this.vw.hide();
        document.removeEventListener("mousedown", this.hideMe);
    }


    private hasParent(el: HTMLElement, parent: HTMLElement): boolean {
        let e: HTMLElement | null = el;
        while (true) {
            if (!e)
                return false;
            if (e === parent)
                return true;
            e = e.parentElement;
        }
    }
}