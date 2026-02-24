import { PilotsModel } from "./pilots";
import { TracksModel } from "./tracks";

export interface RaceModel {
    _id:string

    name: string,
    circuit: TracksModel,
    date: Date,
    pilots: PilotsModel[],
    cutoff: Date,
    status: string,
    result: [],

}
