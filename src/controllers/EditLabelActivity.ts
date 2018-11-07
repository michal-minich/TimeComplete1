import S, { DataSignal } from "s-js";
import { IEditLabelActivity, ILabel } from "../interfaces";


export default class EditLabelActivity implements IEditLabelActivity {

    constructor(app: any) {
        this.editLabelName = S.data("");
        this.nextModeNameSignal = S.data("Edit");
        this.labelSignal = S.data(undefined);
    }


    readonly editLabelName: DataSignal<string>;
    private readonly nextModeNameSignal :DataSignal<string>;
    private readonly labelSignal: DataSignal<ILabel | undefined>;


    begin(label: ILabel): void {
        this.editLabelName(label.name);
        this.labelSignal(label);
    }


    save(): void {
        this.labelSignal()!.name = this.editLabelName();
        this.labelSignal(undefined);
        this.switchMode();
    }


    cancel(): void {
        this.editLabelName("");
        this.labelSignal(undefined);
        this.switchMode();
    }


    keyUp(e: KeyboardEvent): void {
    }


    switchMode(): void {
        this.nextModeNameSignal(this.nextModeNameSignal() === "Edit" ? "Cancel" : "Edit");
    }


    get nextModeName(): string {
        return this.nextModeNameSignal();
    }


    get label(): ILabel | undefined {
        return this.labelSignal();
    }
}