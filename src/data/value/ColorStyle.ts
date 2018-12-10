import { IColorStyle, IColor, TextColorUsage, ValueSignal, IApp } from "../../interfaces";
import { R } from "../../common";
import Color from "./Color";


export default class ColorStyle implements IColorStyle {

    private readonly backColorSignal: ValueSignal<IColor>;
    private readonly customTextColorSignal: ValueSignal<IColor>;
    private readonly textColorInUseSignal: ValueSignal<TextColorUsage>;

    constructor(
        private readonly app: IApp,
        backColor: IColor,
        customTextColor: IColor,
        textColorInUse: TextColorUsage = TextColorUsage.Custom,
        ownerId?: number | undefined) {

        this.backColorSignal = R.data(backColor);
        this.customTextColorSignal = R.data(customTextColor);
        this.textColorInUseSignal = R.data(textColorInUse);
        this.ownerId = ownerId;
    }


    ownerId: number | undefined;


    get backColor(): IColor { return this.backColorSignal(); }

    set backColor(value: IColor) {
        if (this.backColorSignal().value === value.value)
            return;
        this.backColorSignal(value);
        this.app.data.sync.pushField2("style.backColor", this.ownerId!, value.value);
    }


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

    set customTextColor(value: IColor) {
        if (this.customTextColorSignal().value === value.value)
            return;
        this.customTextColorSignal(value);
        this.app.data.sync.pushField2("style.customTextColor", this.ownerId!, value.value);
    }


    get textColorInUse(): TextColorUsage { return this.textColorInUseSignal(); }

    set textColorInUse(value: TextColorUsage) {
        if (this.textColorInUseSignal() === value)
            return;
        this.textColorInUseSignal(value);
        this.app.data.sync.pushField2("style.textColorInUse", this.ownerId!, value);
    }
}