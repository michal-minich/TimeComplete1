import S, { DataSignal } from "s-js";
import { ILabelStyle, IColor, LabelTextColor } from "../interfaces";

export default class LabelStyle implements ILabelStyle {

    private readonly backColorSignal: DataSignal<IColor>;
    private readonly textColorSignal: DataSignal<IColor>;
    private readonly textColorInUseSignal: DataSignal<LabelTextColor>;

    constructor(backColor: IColor, textColor: IColor, textColorInUse: LabelTextColor = LabelTextColor.Custom) {
        this.backColorSignal = S.data(backColor);
        this.textColorSignal = S.data(textColor);
        this.textColorInUseSignal = S.data(textColorInUse);
    }

    get backColor(): IColor { return this.backColorSignal(); }

    set backColor(value: IColor) { this.backColorSignal(value); }


    get textColor(): IColor { return this.textColorSignal(); }

    set textColor(value: IColor) { this.textColorSignal(value); }


    get textColorInUse(): LabelTextColor { return this.textColorInUseSignal(); }

    set textColorInUse(value: LabelTextColor) { this.textColorInUseSignal(value); }
}