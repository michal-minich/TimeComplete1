// ReSharper disable once WrongExpressionStatement
import * as Surplus from "surplus"; Surplus;
import data from "surplus-mixin-data";

import { TestController } from "./controllers";


// ReSharper disable once InconsistentNaming
export const AppView = (ctrl: TestController) =>
    <div>
        <input 
            type="text" 
            fn={data(ctrl.model.text)} 
            onKeyDown={() => ctrl.updateText()}/>
        <br />

        <span>{ctrl.model.text() + " " + ctrl.model.counter()}</span>
        <br/>

        <button onClick={() => ctrl.incrementCounter()}> + </button>
    </div>;