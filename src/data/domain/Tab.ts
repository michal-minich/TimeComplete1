import { ITab, ValueSignal, IColorStyle, IApp, TextColorUsage, IDateTime } from "../../interfaces";
import { R } from "../../common";
import ColorStyle from "../value/ColorStyle";
import Color from "../value/Color";
import Dashboard from "../dash/Dashboard";


export default class Tab implements ITab {

    constructor(
        private readonly app: IApp,
        title: string,
        readonly style: IColorStyle,
        id?: number,
        createdOn?: IDateTime) {

        this.titleSignal = R.data(title);
        style.ownerId = id;

        if (id) {
            this.id = id;
            this.createdOn = createdOn!;
        } else {
            this.id = this.app.data.idCounter.getNext();
            this.createdOn = this.app.clock.now();
        }
    }

    readonly type = "tab";
    id: number;
    createdOn: IDateTime;
    private readonly titleSignal: ValueSignal<string>;


    get title(): string { return this.titleSignal(); }

    set title(value: string) {
        if (this.titleSignal() === value)
            return;
        this.titleSignal(value);
        this.app.data.sync.pushField("tab.title", this, value);
    }

    content: any;

};


export function addTab(a: IApp): void {
    const tab = new Tab(a,
        "tab " + (a.data.tabs().length + 1),
        new ColorStyle(
            a,
            new Color("gray"),
            new Color("white"),
            TextColorUsage.BlackOrWhite),
    );
    tab.content = new Dashboard(a, "");
    a.data.tabAdd(tab);
    a.data.settings.selectedTabIndex = a.data.tabs().length - 1;
}