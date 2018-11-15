import S, { DataSignal } from "s-js";
import { ILabelsPopupActivity, ILabel, IApp } from "../interfaces";


export default class LabelsPopupActivity implements ILabelsPopupActivity {
    
    private readonly app: IApp;

    keyUp(e: KeyboardEvent): void {
    }


    queryText: DataSignal<string>;


    constructor(app : IApp) {
        this.app = app;
        this.queryText = S.data("");
    }


    init(labelsPopupDiv: HTMLDivElement): void {
    }


    activate(label: ILabel): any {
    }


    show(target: HTMLButtonElement): void {
    }


    hide(): void {
    }
}