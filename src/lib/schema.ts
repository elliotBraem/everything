import { CoList, CoMap, co } from "jazz-tools";

export class Thing extends CoMap {
    data = co.string;
    type = co.string;
}

export class ListOfThings extends CoList.Of(co.ref(Thing)) { }

export class Inventory extends CoMap {
    name = co.string;
    things = co.ref(ListOfThings);
}