import {
    IApp,
    IDashboard,
    WritableArraySignal,
    IDashItem,
    ValueSignal
} from "../interfaces";
import { R } from "../common";


export default class Dashboard implements IDashboard {

    items: WritableArraySignal<IDashItem>;
    readonly selected: ValueSignal<IDashItem | undefined>;


    constructor(private readonly app: IApp, items: IDashItem[]) {
        this.items = R.array(items);
        this.selected = R.data(undefined);
    }


    unshift(di: IDashItem): void {
        this.items.unshift(di);
    }


    remove(di: IDashItem): void {
        this.items.remove(di);
    }
}