import { ITab, ValueSignal, IColorStyle, IApp, TextColorUsage, IDateTime } from "../../interfaces";
import { R } from "../../common";
import ColorStyle from "../ColorStyle";
import Color from "../value/Color";
import Dashboard from "../dash/Dashboard";


export default class Tab implements ITab {

    constructor(
        private readonly app: IApp, 
        title: string, 
        style: IColorStyle,
        id?: number,
        createdOn?: IDateTime) {

        this.titleSignal = R.data(title);
        this.style = style;  

        if (id) {
            this.id = id;
            this.createdOn = createdOn!;
        } else {
            this.id = this.app.idCounter.getNext();
            this.createdOn = this.app.clock.now();
        }
    }

    readonly type = "tab";
    id: number;
    createdOn: IDateTime;
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