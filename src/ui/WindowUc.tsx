import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, IWindowUc } from "../interfaces";


export default class WindowUc implements IWindowUc {

    constructor(app: IApp, content: HTMLElement) {

        this.view = getControlledView(app, content);
    }

    readonly view: HTMLElement;


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


function getControlledView(app: IApp, content: HTMLElement): HTMLElement {

    const view =
        <div className="window hidden">
            {content}
        </div>;

    return view;
}