import {
    ITab,
    ValueSignal,
    IColorStyle,
    IApp,
    IDateTime
} from "../../interfaces";
import { R } from "../../common";
import Dashboard from "../dash/Dashboard";


export default class Tab implements ITab {

    constructor(
        private readonly app: IApp,
        title: string,
        readonly customStyle: IColorStyle | undefined,
        public version: number,
        id: number,
        createdOn: IDateTime) {

        this.titleSignal = R.data(title);
        if (customStyle)
            customStyle.owner = this;
        this.id = id;
        this.createdOn = createdOn;
    }


    static createNew(
        app: IApp,
        title: string,
        customStyle: IColorStyle | undefined): ITab {

        const n = new Tab(
            app,
            title,
            customStyle,
            1,
            app.data.getNextId(),
            app.clock.now());
        return n;
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
        this.app.sync.pushField("tab.title", this, value);
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
}