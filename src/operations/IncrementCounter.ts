import { IIdProvider, ValueSignal } from "../interfaces";


export default class IncrementCounter implements IIdProvider<number> {

    private value = 0;
    private readonly lastId: ValueSignal<number>;

    constructor(lastId: ValueSignal<number>) {
        this.lastId = lastId;
        this.value = lastId();
    }


    getNext(): number {
        const v = ++this.value;
        this.lastId(v);
        return v;
    }


    get current(): number {
        return this.value;
    }
}