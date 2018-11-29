import { IApp, INoteDashItem } from "../interfaces";


export default class NoteDashItem implements INoteDashItem {

    readonly noteId: number;


    constructor(private readonly app: IApp, noteId: number) {
        this.noteId = noteId;
    }

    get estimatedHeight(): number {
        return 100;
    }
}