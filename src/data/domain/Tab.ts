import { ITab, ValueSignal, IColorStyle, IApp, TextColorUsage, IDateTime } from "../../interfaces";
import { R } from "../../common";
import ColorStyle from "../value/ColorStyle";
import Color from "../value/Color";
import Dashboard from "../dash/Dashboard";


export default class Tab implements ITab {

    constructor(
        private readonly app: IApp,
        title: string,
        readonly customStyle: IColorStyle | undefined,
        public version: number,
        id?: number,
        createdOn?: IDateTime) {

        this.titleSignal = R.data(title);
        if (customStyle)
            customStyle.owner = this;

        if (id) {
            this.id = id;
            this.createdOn = createdOn!;
        } else {
            this.id = this.app.data.getNextId();
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


    get style(): IColorStyle | undefined {
        if (this.content instanceof Dashboard) {
            const l = this.content.query.matcher.firstLabel;
            if (l)
                return l.style;
        }
        return this.customStyle;
    }
};


export function addTab(a: IApp): void {
    const tab = new Tab(a,
        "tab " + (a.data.tabs().length + 1),
        new ColorStyle(
            a,
            new Color("gray"),
            new Color("white"),
            TextColorUsage.BlackOrWhite),
        1
    );
    tab.content = new Dashboard(a, "");
    a.data.tabAdd(tab);
    a.data.fields.selectedTabIndex = a.data.tabs().length - 1;
}