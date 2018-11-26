﻿import { ITab, ValueSignal, IColorStyle, IApp, TextColorUsage } from "../interfaces";
import { R } from "../common";
import ColorStyle from "./ColorStyle";
import Color from "./Color";
import Dashboard from "./Dashboard";


export default class Tab implements ITab {

    constructor(private readonly app: IApp, title: string, style: IColorStyle) {
        this.titleSignal = R.data(title);
        this.style = style;
    }


    private readonly titleSignal: ValueSignal<string>;


    get title(): string { return this.titleSignal(); }

    set title(value: string) { this.titleSignal(value); }

    style: IColorStyle;

    content: any;

};


export function addTab(a: IApp): void {
    const tab = new Tab(a,
        "tab " + (a.data.tabs().length + 1),
        new ColorStyle(
            new Color("gray"),
            new Color("white"),
            TextColorUsage.BlackOrWhite));
    tab.content = new Dashboard(a);
    a.data.tabs.push(tab);
    a.data.settings.selectedTabIndex(a.data.tabs().length - 1);
}