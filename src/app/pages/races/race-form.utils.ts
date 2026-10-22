import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ExtraKey, RaceModel, RacePayload, RacePosition } from '../../models/race';

export const RACE_EXTRAS: { key: ExtraKey; label: string; description: string; points: number }[] = [
  { key: 'pole', label: 'Pole position', description: 'Ganador de la clasificación.', points: 2 },
  { key: 'duel', label: 'Duelo de pilotos', description: 'Quién termina mejor clasificado entre dos pilotos.', points: 1 },
  { key: 'safetyCar', label: 'Safety Car', description: 'Si habrá Safety Car durante la carrera. No incluye VSC.', points: 1 },
];

export function rulesLocked(race?: RaceModel): boolean {
  return !!race && (!!race.rulesLockedAt || race.status !== 'proximamente');
}

export function localDate(value?: string | Date): string {
  if (!value) return '';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) +
    'T' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
}

export function validateRaceRules(control: AbstractControl): ValidationErrors | null {
  // Disabled rules belong to an already opened race; only name/circuit are sent.
  if (control.get('date')?.disabled) return null;
  const value = control.value;
  const date = new Date(value.date).getTime();
  if (!Number.isFinite(date)) return { rules: 'Ingresá una fecha de carrera válida.' };
  if (value.cutoff && !Number.isFinite(new Date(value.cutoff).getTime())) {
    return { rules: 'Ingresá un cierre de posiciones válido.' };
  }
  const enabled = RACE_EXTRAS.filter(extra => value.extras?.[extra.key]?.enabled);
  for (const extra of enabled) {
    const config = value.extras[extra.key];
    if (!Number.isInteger(config.points) || config.points < 1) {
      return { rules: extra.label + ': los puntos deben ser un entero positivo.' };
    }
    const cutoff = config.cutoff ? new Date(config.cutoff).getTime() : NaN;
    if (!Number.isFinite(cutoff) || cutoff > date) {
      return { rules: extra.label + ': elegí un cierre igual o anterior a la carrera.' };
    }
    if (extra.key === 'duel' &&
      (config.pilots.length !== 2 || new Set(config.pilots).size !== 2 ||
        config.pilots.some((id: string) => !value.pilots.includes(id)))) {
      return { rules: 'El duelo necesita dos pilotos distintos seleccionados para esta carrera.' };
    }
  }
  return value.confidenceEnabled && !enabled.length
    ? { rules: 'Activá al menos un extra para habilitar el comodín de confianza.' } : null;
}

export function createRaceForm(fb: FormBuilder, race?: RaceModel): FormGroup {
  const extras: Record<string, FormGroup> = {};
  for (const extra of RACE_EXTRAS) {
    const config = race?.extras?.[extra.key];
    extras[extra.key] = fb.group({
      enabled: [config?.enabled ?? false],
      points: [config?.points ?? extra.points],
      cutoff: [localDate(config?.cutoff)],
      pilots: [config?.pilots || []],
    });
  }
  const form = fb.group({
    name: [race?.name || '', Validators.required],
    circuit: [race?.circuit?._id || '', Validators.required],
    date: [localDate(race?.date), Validators.required],
    cutoff: [localDate(race?.cutoff)],
    pilots: [race?.pilots?.map(pilot => pilot._id) || [], Validators.required],
    extras: fb.group(extras),
    confidenceEnabled: [race?.confidenceEnabled ?? false],
  }, { validators: validateRaceRules });
  if (rulesLocked(race)) {
    for (const key of ['date', 'cutoff', 'pilots', 'extras', 'confidenceEnabled']) {
      form.get(key)?.disable({ emitEvent: false });
    }
  }
  return form;
}

export function racePayload(form: FormGroup, locked: boolean): Partial<RacePayload> {
  const value = form.getRawValue();
  if (locked) return { name: value.name, circuit: value.circuit };
  const extras = {};
  for (const extra of RACE_EXTRAS) {
    const config = value.extras[extra.key];
    // Disabled extras do not send stale dates or invalid points.
    extras[extra.key] = config.enabled
      ? { enabled: true, points: config.points, cutoff: new Date(config.cutoff).toISOString(),
          ...(extra.key === 'duel' ? { pilots: config.pilots } : {}) }
      : { enabled: false, points: extra.points };
  }
  return {
    name: value.name, circuit: value.circuit, date: new Date(value.date).toISOString(),
    cutoff: value.cutoff ? new Date(value.cutoff).toISOString() : null,
    pilots: value.pilots, extras, confidenceEnabled: value.confidenceEnabled,
  };
}

export function pendingExtraResults(race: RaceModel): boolean {
  return RACE_EXTRAS.some(extra => race.extras?.[extra.key]?.enabled &&
    !['resolved', 'void'].includes(race.extraResults?.[extra.key]?.status || 'pending'));
}

export function closeRaceReason(race: RaceModel): string {
  if (race.status !== 'lista') return 'La carrera no está abierta para cerrar.';
  if (Date.now() < new Date(race.date).getTime() ||
    (race.cutoff && Date.now() < new Date(race.cutoff).getTime())) {
    return 'Esperá al inicio de la carrera y al cierre de posiciones.';
  }
  if (RACE_EXTRAS.some(extra => race.extras?.[extra.key]?.enabled &&
    Date.now() < new Date(race.extras[extra.key].cutoff).getTime())) {
    return 'Todavía hay extras abiertos para pronosticar.';
  }
  return pendingExtraResults(race) ? 'Resolvé o anulá todos los extras en «Resultados extra» antes de cerrar.' : '';
}

export function classificationError(result: RacePosition[], pilots: string[]): string {
  if (!result.length || result.length !== pilots.length ||
    new Set(result.map(row => row.pilot)).size !== pilots.length ||
    result.some(row => !pilots.includes(row.pilot))) {
    return 'Incluí todos los pilotos de la carrera una sola vez.';
  }
  if (result.some(row => !Number.isInteger(row.position) || row.position < 1 || row.position > 22) ||
    new Set(result.map(row => row.position)).size !== result.length) {
    return 'Las posiciones deben ser enteras de 1 a 22, sin repetirse.';
  }
  return '';
}
