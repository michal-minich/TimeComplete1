import { IApp, INoteDashItem, INote } from "../../interfaces";


export default class NoteDashItem implements INoteDashItem {

    readonly note: INote;
    readonly width: number;
    readonly height: number;


    constructor(
        private readonly app: IApp,
        note: INote,
        width?: number,
        height?: number) {
        this.note = note;
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