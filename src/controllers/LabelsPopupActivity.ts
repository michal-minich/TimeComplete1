import { ILabelsPopupActivity, ILabel, IApp, ValueSignal } from "../interfaces";
import { R } from "../common";


export default class LabelsPopupActivity implements ILabelsPopupActivity {

    private action!: (label: ILabel, el: HTMLSpanElement) => void;
    private labelsPopupDiv!: HTMLDivElement;


    keyUp(e: KeyboardEvent): void {
    }


    queryText: ValueSignal<string>;


    constructor(private readonly app: IApp) {
        this.queryText = R.data("");
    }


    init(labelsPopupDiv: HTMLDivElement): void {
        this.labelsPopupDiv = labelsPopupDiv;
    }


    activate(label: ILabel, el: HTMLSpanElement): any {
        this.action(label, el);
    }


    hideMe = () => {
        //this.labelsPopupDiv.classList.add("hidden");
        //document.removeEventListener("mousedown", this.hideMe);
    };


    show(over: HTMLElement, action: (label: ILabel, el: HTMLSpanElement) => void): void {

        const r = over.getBoundingClientRect();
        const divStyle = this.labelsPopupDiv.style;
        divStyle.left = (r.left) + "px";
        divStyle.top = (r.top + r.height + 4) + "px";

        this.action = action;
        const cl = this.labelsPopupDiv.classList;
        if (cl.contains("hidden"))
            cl.remove("hidden");
        else
            cl.add("hidden");

        document.addEventListener("click", this.hideMe);
    }


    hide(): void {
    }
}