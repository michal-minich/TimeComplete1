import S, { DataSignal } from "s-js";
import { ILabelsPopupActivity, ILabel, IApp } from "../interfaces";


export default class LabelsPopupActivity implements ILabelsPopupActivity {

    private labelsPopupDiv!: HTMLDivElement;
    private readonly app: IApp;

    keyUp(e: KeyboardEvent): void {
    }


    queryText: DataSignal<string>;


    constructor(app: IApp) {
        this.app = app;
        this.queryText = S.data("");
    }


    init(labelsPopupDiv: HTMLDivElement): void {
        this.labelsPopupDiv = labelsPopupDiv;
    }


    activate(label: ILabel): any {
    }


    show(target: HTMLButtonElement): void {
        this.labelsPopupDiv.classList.remove("hidden");
    }


    hide(): void {
    }
}