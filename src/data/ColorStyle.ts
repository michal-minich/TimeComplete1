import { IColorStyle, IColor, LabelTextColor, ValueSignal } from "../interfaces";
import { R } from "../common";
import Color from "./Color";


export default class LabelStyle implements IColorStyle {

    private readonly backColorSignal: ValueSignal<IColor>;
    private readonly customTextColorSignal: ValueSignal<IColor>;
    private readonly textColorInUseSignal: ValueSignal<LabelTextColor>;

    constructor(
        backColor: IColor,
        customTextColor: IColor,
        textColorInUse: LabelTextColor = LabelTextColor.Custom) {

        this.backColorSignal = R.data(backColor);
        this.customTextColorSignal = R.data(customTextColor);
        this.textColorInUseSignal = R.data(textColorInUse);
    }

    get backColor(): IColor { return this.backColorSignal(); }

    set backColor(value: IColor) { this.backColorSignal(value); }


    get textColor(): IColor {
        switch (this.textColorInUse) {
        case LabelTextColor.BlackOrWhite:
            return new Color("white");
        case LabelTextColor.Inverted:
            return new Color("white");
        case LabelTextColor.Custom:
            return this.customTextColor;
        default:
            throw undefined;
        }
    }


    get customTextColor(): IColor { return this.customTextColorSignal(); }

    set customTextColor(value: IColor) { this.customTextColorSignal(value); }


    get textColorInUse(): LabelTextColor { return this.textColorInUseSignal(); }

    set textColorInUse(value: LabelTextColor) { this.textColorInUseSignal(value); }
}