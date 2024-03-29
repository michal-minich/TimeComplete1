﻿import {
    IApp,
    IDashboard,
    WritableArraySignal,
    IDashItem,
    ValueSignal,
    IQuery,
} from "../../interfaces";
import { R } from "../../common";
import Query from "../Query";


export default class Dashboard implements IDashboard {

    items: WritableArraySignal<IDashItem>;
    readonly selected: ValueSignal<IDashItem | undefined>;
    private columnsCountSignal = R.data(3);
    readonly query: IQuery;


    constructor(private readonly app: IApp, query: string) {
        this.items = R.array([]);
        this.selected = R.data(undefined);
        this.query = new Query(app, query);
    }


    unshift(di: IDashItem): void {
        this.items.unshift(di);
    }


    remove(di: IDashItem): void {
        this.items.remove(di);
    }


    get columnsCount(): number { return this.columnsCountSignal(); }

    set columnsCount(value: number) { this.columnsCountSignal(value); }
}