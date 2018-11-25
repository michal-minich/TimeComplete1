import { IIdProvider, IApp } from "../interfaces";


export default class IncrementCounter implements IIdProvider<number> {

    private value = 0;


    constructor(private readonly a: IApp) {
        this.value = a.data.settings.lastId;
    }


    getNext(): number {
        const v = ++this.value;
        this.a.data.settings.lastId = v;
        return v;
    }


    get current(): number {
        return this.value;
    }
}