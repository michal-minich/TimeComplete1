import { IColorStyle, IColor, TextColorUsage, ValueSignal } from "../interfaces";
import { R } from "../common";
import Color from "./Color";


export default class ColorStyle implements IColorStyle {

    private readonly backColorSignal: ValueSignal<IColor>;
    private readonly customTextColorSignal: ValueSignal<IColor>;
    private readonly textColorInUseSignal: ValueSignal<TextColorUsage>;

    constructor(
        backColor: IColor,
        customTextColor: IColor,
        textColorInUse: TextColorUsage = TextColorUsage.Custom) {

        this.backColorSignal = R.data(backColor);
        this.customTextColorSignal = R.data(customTextColor);
        this.textColorInUseSignal = R.data(textColorInUse);
    }

    get backColor(): IColor { return this.backColorSignal(); }

    set backColor(value: IColor) { this.backColorSignal(value); }


    get textColor(): IColor {
        switch (this.textColorInUse) {
        case TextColorUsage.BlackOrWhite:
            return new Color("white");
        case TextColorUsage.Inverted:
            return new Color("white");
        case TextColorUsage.Custom:
            return this.customTextColor;
        default:
            throw undefined;
        }
    }


    get customTextColor(): IColor { return this.customTextColorSignal(); }

    set customTextColor(value: IColor) { this.customTextColorSignal(value); }


    get textColorInUse(): TextColorUsage { return this.textColorInUseSignal(); }

    set textColorInUse(value: TextColorUsage) { this.textColorInUseSignal(value); }
}