import { PilotsModel } from "./pilots";

export interface RaceModel {
    _id:string

    name: string,
    circuit: string,
    date: Date,
    pilots: PilotsModel[],
    cutoff: Date,
    status: string,
    result: [],

}
