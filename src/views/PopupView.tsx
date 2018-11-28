import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp } from "../interfaces";


export type PopupView = ReturnType<typeof popupView>


export default function popupView(a: IApp, content: HTMLElement) {


    const view =
        <div className="window">
            {content}
        </div>;


    function showBelow(el: HTMLElement): void {
        const r = el.getBoundingClientRect();
        const divStyle = view.style;
        divStyle.left = (r.left) + "px";
        divStyle.top = (r.top + r.height + 4) + "px";

        const cl = view.classList;
        if (cl.contains("hidden"))
            cl.remove("hidden");
        else
            cl.add("hidden");
    }


    return { view, showBelow };
}