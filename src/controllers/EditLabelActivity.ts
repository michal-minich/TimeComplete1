import S, { DataSignal } from "s-js";
import { IEditLabelActivity, ILabel } from "../interfaces";


export default class EditLabelActivity implements IEditLabelActivity {

    constructor(app: any) {
        this.editLabelName = S.data("");
    }


    readonly editLabelName: DataSignal<string>;


    begin(l: ILabel): void {
    }


    save(): void {
    }


    cancel(): void {
    }


    keyUp(e: KeyboardEvent): void {
    }


    switchMode(): void {
    }


    nextModeName(): string {
        return "Edit";
    }
}