import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp } from "../interfaces";
import windowView from "./windowView";


export type PopupView = ReturnType<typeof popupView>


export default function popupView(app: IApp, content: HTMLElement) {

    let x = 0;
    const vw = windowView(app, content);


    function hideMe(e: MouseEvent) {
        if (hasParent(e.target as HTMLElement, vw.view))
            return;
        ++x;
        if (x <= 1)
            return;
        vw.view.classList.add("hidden");
        document.removeEventListener("mousedown", hideMe);
    }


    function hasParent(el: HTMLElement, parent: HTMLElement): boolean {
        let e: HTMLElement | null = el;
        while (true) {
            if (!e)
                return false;
            if (e === parent)
                return true;
            e = e.parentElement;
        }
    }


    function showBelow(el: HTMLElement): void {
        vw.showBelow(el);
        x = 0;
        document.addEventListener("mousedown", hideMe);
    }


    return { view: vw.view, showBelow, hide: vw.hide };
};