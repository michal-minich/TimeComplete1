import * as Surplus from "surplus";
// ReSharper disable once WrongExpressionStatement
// noinspection BadExpressionStatementJS
Surplus;
import { IApp, ITab, ArraySignal, ITabsView } from "../interfaces";
import { addTab } from "../data/domain/Tab";
import { colorInlineStyle } from "./MainView";


export default class TabsView implements ITabsView {

    constructor(private readonly app: IApp) {
    }


    private add: () => void = () => {
        addTab(this.app);
    }


    private activate(e: MouseEvent, index: number): void {
        if ((e.target as HTMLElement).classList.contains("close"))
            return;
        this.app.data.fields.selectedTabIndex = index;
    }


    private close: (index: number) => void = (index) => {
        const selIx = this.app.data.fields.selectedTabIndex;
        if (selIx > index || selIx === (this.app.data.tabs().length - 1))
            this.app.data.fields.selectedTabIndex = selIx - 1;
        const t = this.app.data.tabs()[index];
        if (!confirm("Close tab '" + t.title + "'?")) {
            return;
        }
        this.app.data.tabDelete(t);
    }


    private tabs: () => ArraySignal<HTMLSpanElement> = () => {
        return this.app.data.tabs.map((tab, el, i) => this.tabView(tab, i));
    }


    private tabView(tab: ITab, index: number): HTMLSpanElement {
        const isSel = index === this.app.data.fields.selectedTabIndex;
        const v =
            <span className={"tab" + (isSel ? " active-tab" : "")}
                  style={isSel ? colorInlineStyle(tab.style) : {}}
                  onMouseDown={(e: MouseEvent) => this.activate(e, index)}>
                {tab.title}
                <span className="close"
                      onClick={() => this.close(index)}>
                    &#10006;
                </span>
            </span>;
        return v;
    }


    readonly view =
        <div className="tab-bar">
            <img className="logo" src="favicon.png" alt="Time Complete"/>
            {this.tabs()()}
            <span onMouseDown={this.add} className="tab-plus">
                <span>+</span>
            </span>
        </div>;
}