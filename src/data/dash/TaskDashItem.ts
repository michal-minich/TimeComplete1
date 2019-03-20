import { IApp, ITaskDashItem, ITask } from "../../interfaces";


export default class TaskDashItem implements ITaskDashItem {

    readonly task: ITask;
    readonly width: number;
    readonly height: number;


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
    }

    get estimatedHeight(): number {
        return 100;
    }
}