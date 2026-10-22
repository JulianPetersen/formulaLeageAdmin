import { PilotsModel } from './pilots';
import { TracksModel } from './tracks';

export type ExtraKey = 'pole' | 'duel' | 'safetyCar';
export interface ExtraConfiguration {
  enabled: boolean;
  points: number;
  cutoff?: string | Date;
  pilots?: string[];
}
export interface ExtraResult {
  status: 'pending' | 'resolved' | 'void';
  value?: string | boolean;
}
export type RaceExtras = Partial<Record<ExtraKey, ExtraConfiguration>>;
export type ExtraResults = Partial<Record<ExtraKey, ExtraResult>>;
export interface RacePosition { pilot: string; position: number; }

export interface RaceModel {
  _id: string;
  name: string;
  circuit: TracksModel;
  date: string | Date;
  pilots: PilotsModel[];
  cutoff?: string | Date;
  status: string;
  result: RacePosition[];
  extras?: RaceExtras;
  extraResults?: ExtraResults;
  confidenceEnabled?: boolean;
  rulesLockedAt?: string | Date;
}

export interface RacePayload {
  name: string;
  circuit: string;
  date: string;
  cutoff: string | null;
  pilots: string[];
  extras: RaceExtras;
  confidenceEnabled: boolean;
}
