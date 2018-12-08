import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, ITab, ArraySignal } from "../interfaces";
import { addTab } from "../data/domain/Tab";
import { colorInlineStyle } from "./MainView";


export default function tabsView(a: IApp) {


    function add() { addTab(a) }


    function activate(e: MouseEvent, index: number): void {
        if ((e.target as HTMLElement).classList.contains("close"))
            return;
        a.data.settings.selectedTabIndex = index;
    }


    function close(index: number): void {
        const selIx = a.data.settings.selectedTabIndex;
        if (selIx > index || selIx === (a.data.tabs().length - 1))
            a.data.settings.selectedTabIndex = selIx - 1;
	    const t = a.data.tabs()[index];
        a.data.tabDelete(t);
    }


    function tabs(): ArraySignal<HTMLSpanElement> {
        return a.data.tabs.map((tab, el, i) => tabView(tab, i));
    }


    function tabView(tab: ITab, index: number): HTMLSpanElement {
        const isSel = index === a.data.settings.selectedTabIndex;
        const v =
            <span className={"tab" + (isSel ? " active-tab" : "")}
                  style={isSel ? colorInlineStyle(tab.style) : {}}
                  onMouseDown={(e: MouseEvent) => activate(e, index)}>
                {tab.title}
                <span className="close"
                      onClick={() => close(index)}>
                    &#10006;
                </span>
            </span>;
        return v;
    }


    const view =
        <div className="tab-bar">
            <img className="logo" src="favicon.png" alt="Time Complete"/>
            {tabs()()}
            <span onMouseDown={add} className="tab-plus">
                <span>+</span>
            </span>
        </div>;

    return view;
}