import { IDataFields as IDataFields } from "../interfaces";
import { R } from "../common";


export default class DataFields implements IDataFields {


    private labelPrefixSignal = R.data("#");
    private negationOperatorSignal = R.data("-");
    private selectedTabIndexSignal = R.data(0);
    private selectedDashItemIndexSignal = R.data(0);
    private selectedTaskIdSignal = R.data(0);
    private lastIdSignal = R.data(1000);
    private specialLabelAllIdSignal = R.data(0);
    private specialLabelTodoIdSignal = R.data(0);
    private specialLabelDoneIdSignal = R.data(0);


    get labelPrefix(): string { return this.labelPrefixSignal(); }

    set labelPrefix(value: string) { this.labelPrefixSignal(value); }


    get negationOperator(): string { return this.negationOperatorSignal(); }

    set negationOperator(value: string) { this.negationOperatorSignal(value); }


    get selectedTabIndex(): number { return this.selectedTabIndexSignal(); }

    set selectedTabIndex(value: number) { this.selectedTabIndexSignal(value); }


    get selectedDashItemIndex(): number { return this.selectedDashItemIndexSignal(); }

    set selectedDashItemIndex(value: number) { this.selectedDashItemIndexSignal(value); }


    get selectedTaskId(): number { return this.selectedTaskIdSignal(); }

    set selectedTaskId(value: number) { this.selectedTaskIdSignal(value); }


    get lastId(): number { return this.lastIdSignal(); }

    set lastId(value: number) { this.lastIdSignal(value); }


    get specialLabelAllId(): number { return this.specialLabelAllIdSignal(); }

    set specialLabelAllId(value: number) { this.specialLabelAllIdSignal(value); }


    get specialLabelTodoId(): number { return this.specialLabelTodoIdSignal(); }

    set specialLabelTodoId(value: number) { this.specialLabelTodoIdSignal(value); }


    get specialLabelDoneId(): number { return this.specialLabelDoneIdSignal(); }

    set specialLabelDoneId(value: number) { this.specialLabelDoneIdSignal(value); }
}