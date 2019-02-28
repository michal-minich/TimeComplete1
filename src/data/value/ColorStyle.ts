import { IColorStyle, IColor, TextColorUsage, ValueSignal, IApp, IDomainObject } from "../../interfaces";
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
        textColorInUse: TextColorUsage = TextColorUsage.Custom) {

        this.backColorSignal = R.data(backColor);
        this.customTextColorSignal = R.data(customTextColor);
        this.textColorInUseSignal = R.data(textColorInUse);
    }


    owner!: IDomainObject;


    get backColor(): IColor { return this.backColorSignal(); }

    set backColor(value: IColor) {
        if (this.backColorSignal().value === value.value)
            return;
        this.backColorSignal(value);
        this.app.sync.pushField("style.backColor", this.owner, value.value);
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
        this.app.sync.pushField("style.customTextColor", this.owner, value.value);
    }


    get textColorInUse(): TextColorUsage { return this.textColorInUseSignal(); }

    set textColorInUse(value: TextColorUsage) {
        if (this.textColorInUseSignal() === value)
            return;
        this.textColorInUseSignal(value);
        this.app.sync.pushField("style.textColorInUse", this.owner, value);
    }
}