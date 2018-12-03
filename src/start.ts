import App from "./components/App";
import { IApp } from "./interfaces";
import { R } from "./common";

import S from"s-js";
import SArray from "s-array";


document.addEventListener("DOMContentLoaded",
    () => {
        R.root(() => {
            //const arr = SArray([1, 2, 3]);
            //const x = S.value("x");
           // R.onAdd(arr, (a)=> console.log("a: " + a));
            //R.onRemove(arr, (r)=> console.log("r: " + r));
            /*S(() => {
                arr.map(
                    (a) => {
                        console.log("a: " + a);
                    },
                    (x) => {
                        console.log("x: " + x);
                    },
                    (m) => {
                        console.log("m: " + m);
                    });
            });*/
           /* S.on<undefined>(
                x,
                () => {
                    console.log(x());
                    return undefined;
                },
                undefined,
                true);*/
           /* arr.push(4);
            arr.push(5);
            arr.remove(3);
            arr.unshift(0);
            arr.splice(3, 2);*/
            //x("abc");
            //x("abc");
            //x("y");
            //console.log(arr.length);
            //console.log(arr().length);

            //  R.freeze(() => {
            const app: IApp = new App(document.body);
            //   });
        });
    });