import { IDataFields as IDataFields } from "../interfaces";
import { R } from "../common";


export default class DataFields implements IDataFields {


    private labelPrefixSignal = R.data("#");
    private negationOperatorSignal = R.data("!");
    private selectedTabIndexSignal = R.data(0);
    private lastIdSignal = R.data(0);


    get labelPrefix(): string { return this.labelPrefixSignal(); }

    set labelPrefix(value: string) { this.labelPrefixSignal(value); }


    get negationOperator(): string { return this.negationOperatorSignal(); }

    set negationOperator(value: string) { this.negationOperatorSignal(value); }


    get selectedTabIndex(): number { return this.selectedTabIndexSignal(); }

    set selectedTabIndex(value: number) { this.selectedTabIndexSignal(value); }


    get lastId(): number { return this.lastIdSignal(); }

    set lastId(value: number) { this.lastIdSignal(value); }
}