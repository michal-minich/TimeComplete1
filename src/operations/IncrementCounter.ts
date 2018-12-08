import { IIdProvider, IApp } from "../interfaces";


export default class IncrementCounter implements IIdProvider<number> {

    private value = 0;

    constructor(private readonly app: IApp) {
        this.value = app.data.settings.lastId;
    }


    getNext(): number {
        const v = ++this.value;
        this.app.data.settings.lastId = v;
        return v;
    }


    get current(): number {
        return this.value;
    }
}