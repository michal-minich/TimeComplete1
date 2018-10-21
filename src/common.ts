import { Clock } from "./io/Clock";
import { IncrementCounter } from "./operations/IncrementCounter";
import { IClock, IIdProvider } from "./interfaces";

export const clock: IClock = new Clock();

export const idCounter: IIdProvider<number> = new IncrementCounter();