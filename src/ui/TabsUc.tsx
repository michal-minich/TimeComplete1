import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { ArraySignal, IApp, ITab, ITabsUc } from "../interfaces";
import { colorInlineStyle } from "../common";
import { AppDataOps } from "../operations/AppDataOps";


export default class TabsUc implements ITabsUc {

    constructor(app: IApp) {

        this.view = getControlledView(app);
    }

    readonly view: HTMLElement;
}


function getControlledView(app: IApp) {


    function add(): void {
        AppDataOps.addTab(app);
    }


    function activate(e: MouseEvent, index: number): void {
        if ((e.target as HTMLElement).classList.contains("close"))
            return;
        app.data.fields.selectedTabIndex = index;
    }


    function close(index: number): void {
        // moved to dash
    }


    function tabs(): ArraySignal<HTMLSpanElement> {
        return app.data.tabs.map((tab, el, i) => getTabView(tab, i));
    }


    function getTabView(tab: ITab, index: number): HTMLSpanElement {
        const isSel = index === app.data.fields.selectedTabIndex;
        const v =
            <span className={"tab" + (isSel ? " active-tab" : "")}
                  style={isSel ? colorInlineStyle(tab.style) : {}}
                  onMouseDown={(e: MouseEvent) => activate(e, index)}>
                {tab.title}
                <span className="hidden close"
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
                <span title="Add New Dashboard">+</span>
            </span>
        </div>;

    return view;
}