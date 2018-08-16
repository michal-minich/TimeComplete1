import S from "s-js";


export interface ITestController {
    updateText(text: string): void;
    incrementCounter(): void;
}


export class TestController implements ITestController
{
    model = {
        text: S.data("Abc"),
        counter: S.data(0)
    };
   
    updateText(): void {
        //S(() => this.model.text(text));
    }

    incrementCounter(): void {
        S.root(() => {
            const c = this.model.counter();
            S(() => this.model.counter(c + 1));
        });
    }
}