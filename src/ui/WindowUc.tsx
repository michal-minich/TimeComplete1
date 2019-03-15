import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, IWindowUc } from "../interfaces";


export default class WindowUc implements IWindowUc {

    constructor(
        private readonly app: IApp,
        content: HTMLElement) {

        this.view = this.render(content);
    }


    readonly view: HTMLElement;


    private render(content: HTMLElement): HTMLElement {
        const view =
            <div className="window hidden">
                {content}
            </div>;
        return view;
    }


    showBelow(el: HTMLElement): void {
        const r = el.getBoundingClientRect();
        this.view.style.left = (r.left) + "px";
        this.view.style.top = (r.top + r.height + 0) + "px";
        this.view.classList.toggle("hidden");
    }


    hide() {
        this.view.classList.add("hidden");
    }
}