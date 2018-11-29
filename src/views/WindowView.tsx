import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp } from "../interfaces";


export type WindowView = ReturnType<typeof windowView>


export default function windowView(a: IApp, content: HTMLElement) {


    const view =
        <div className="window hidden">
            {content}
        </div>;


    function showBelow(el: HTMLElement): void {
        const r = el.getBoundingClientRect();
        const divStyle = view.style;
        divStyle.left = (r.left) + "px";
        divStyle.top = (r.top + r.height + 2) + "px";

        const cl = view.classList;
        if (cl.contains("hidden"))
            cl.remove("hidden");
        else
            cl.add("hidden");
    }


    function hide() {
        view.classList.add
            ("hidden");
    }


    return { view, showBelow, hide };
}