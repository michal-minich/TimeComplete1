import { IApp, ITaskDashItem, ITask, ValueSignal } from "../../interfaces";
import { R } from "../../common";


export default class TaskDashItem implements ITaskDashItem {

    readonly task: ITask;
    readonly width: number;
    readonly height: number;


    private readonly visibleSignal: ValueSignal<boolean>;

    get visible(): boolean { return this.visibleSignal(); }

    set visible(value: boolean) { this.visibleSignal(value); }


    constructor(
        private readonly app: IApp,
        task: ITask,
        width?: number,
        height?: number) {
        this.task = task;
        if (width) {
            this.width = width;
            this.height = height!;
        } else {
            this.width = 300;
            this.height = 200;
        }
        this.visibleSignal = R.data(true);
    }

    get estimatedHeight(): number {
        return 100;
    }
}