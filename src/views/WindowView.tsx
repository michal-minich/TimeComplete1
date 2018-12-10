import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp } from "../interfaces";


export type WindowView = ReturnType<typeof windowView>


export default function windowView(app: IApp, content: HTMLElement) {


    const view =
        <div className="window hidden">
            {content}
        </div>;


    function showBelow(el: HTMLElement): void {
        const r = el.getBoundingClientRect();
        view.style.left = (r.left) + "px";
        view.style.top = (r.top + r.height + 0) + "px";
        view.classList.toggle("hidden");
    }


    function hide() {
        view.classList.add("hidden");
    }


    return { view, showBelow, hide };
}