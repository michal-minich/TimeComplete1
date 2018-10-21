import { IIdProvider } from "../interfaces";


export class IncrementCounter implements IIdProvider<number> {

    private value = 0;


    getNext(): number {
        return ++this.value;
    }


    get current(): number {
        return this.value;
    }
}