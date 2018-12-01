import { IApp, INoteDashItem } from "../interfaces";


export default class NoteDashItem implements INoteDashItem {

    readonly noteId: number;
    readonly width: number;
    readonly height: number;


    constructor(
        private readonly app: IApp,
        noteId: number,
        width?: number,
        height?: number) {
        this.noteId = noteId;
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