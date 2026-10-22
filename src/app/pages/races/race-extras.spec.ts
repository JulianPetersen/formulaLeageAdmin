import { RaceForm } from './components/race-form/race-form';
import { PilotsServices } from '../../services/pilots-services';
import { TrackService } from '../../services/track-service';
import { FormBuilder } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { RaceModel } from '../../models/race';
import { RacesService } from '../../services/races-service';
import { GlobalService } from '../../services/global-service';
import { RaceExtraResults } from './components/race-extra-results/race-extra-results';
import { CloseRace } from './components/close-race/close-race';
import { classificationError, closeRaceReason, createRaceForm, localDate, racePayload } from './race-form.utils';

const fb = new FormBuilder();
function race(overrides: Partial<RaceModel> = {}): RaceModel {
  return {
    _id: 'race', name: 'Monza', circuit: { _id: 'track', name: 'Monza' } as any,
    date: '2026-09-10T15:00:00Z', cutoff: '2026-09-10T14:00:00Z',
    pilots: [{ _id: 'a', name: 'A' }, { _id: 'b', name: 'B' }] as any,
    status: 'proximamente', result: [],
    extras: {
      pole: { enabled: true, points: 2, cutoff: '2026-09-09T14:00:00Z' },
      duel: { enabled: true, points: 1, cutoff: '2026-09-10T14:00:00Z', pilots: ['a', 'b'] },
      safetyCar: { enabled: true, points: 1, cutoff: '2026-09-10T14:00:00Z' },
    },
    confidenceEnabled: true,
    ...overrides,
  };
}

describe('Race extras: configuration contract', () => {
  it('supports historical races without extras or cutoff', () => {
    const form = createRaceForm(fb, race({ extras: undefined, confidenceEnabled: undefined, cutoff: undefined }));
    expect(form.valid).toBe(true);
    const payload = racePayload(form, false);
    expect(payload.cutoff).toBeNull();
    expect(payload.extras.pole.enabled).toBe(false);
    expect(payload.confidenceEnabled).toBe(false);
  });

  it('serializes all configuration and local dates as ISO instants', () => {
    const form = createRaceForm(fb, race());
    expect(form.valid).toBe(true);
    const payload = racePayload(form, false);
    expect(payload.date).toBe('2026-09-10T15:00:00.000Z');
    expect(payload.extras.pole.points).toBe(2);
    expect(payload.extras.duel.pilots).toEqual(['a', 'b']);
    expect(payload.extras.pole.cutoff).toBe('2026-09-09T14:00:00.000Z');
    expect(localDate(undefined)).toBe('');
  });

  it('rejects a cutoff later than race time and fractional/zero points', () => {
    const form = createRaceForm(fb, race());
    form.get('extras.pole.cutoff').setValue(localDate('2026-09-11T00:00:00Z'));
    expect(form.invalid).toBe(true);
    form.get('extras.pole.cutoff').setValue(localDate('2026-09-09T14:00:00Z'));
    for (const points of [0, -1, 1.5, null]) {
      form.get('extras.pole.points').setValue(points);
      expect(form.invalid).toBe(true);
    }
  });

  it('rejects missing cutoff and duels with one, repeated or nonparticipating pilots', () => {
    const form = createRaceForm(fb, race());
    form.get('extras.pole.cutoff').setValue('');
    expect(form.invalid).toBe(true);
    form.get('extras.pole.cutoff').setValue(localDate('2026-09-09T14:00:00Z'));
    for (const pilots of [['a'], ['a', 'a'], ['a', 'c']]) {
      form.get('extras.duel.pilots').setValue(pilots);
      expect(form.invalid).toBe(true);
    }
  });

  it('revalidates a duel when a pilot is removed from the race', () => {
    const form = createRaceForm(fb, race());
    form.get('pilots').setValue(['a']);
    expect(form.errors?.['rules']).toContain('dos pilotos');
  });

  it('requires an enabled extra for confidence and ignores disabled extra drafts', () => {
    const form = createRaceForm(fb, race());
    for (const key of ['pole', 'duel', 'safetyCar']) form.get('extras.' + key + '.enabled').setValue(false);
    expect(form.invalid).toBe(true);
    form.get('confidenceEnabled').setValue(false);
    form.get('extras.pole.points').setValue(null);
    form.get('extras.pole.cutoff').setValue('invalid');
    expect(form.valid).toBe(true);
    expect(racePayload(form, false).extras.pole).toEqual({ enabled: false, points: 2 });
  });

  it('sends only name and circuit for an opened or historically locked race', () => {
    for (const data of [race({ status: 'lista' }), race({ rulesLockedAt: '2026-09-01T00:00:00Z' })]) {
      const form = createRaceForm(fb, data);
      expect(form.get('extras').disabled).toBe(true);
      expect(form.get('pilots').disabled).toBe(true);
      form.get('name').setValue('Nuevo nombre');
      expect(racePayload(form, true)).toEqual({ name: 'Nuevo nombre', circuit: 'track' });
    }
  });
});

describe('Race extras: result dialog', () => {
  let service: any;
  let dialog: any;
  let component: RaceExtraResults;
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-10T16:00:00Z'));
    service = { updateExtraResults: vi.fn().mockReturnValue(of(race({ extraResults: {} }))) };
    dialog = { close: vi.fn(), disableClose: false };
    component = new RaceExtraResults(race({ status: 'lista' }), fb, service, dialog, { detectChanges() {} } as any);
  });
  afterEach(() => vi.useRealTimers());

  it('saves Safety Car false as a boolean, not an empty answer', () => {
    component.form.get('safetyCar').patchValue({ status: 'resolved', value: false });
    component.save('safetyCar');
    expect(service.updateExtraResults).toHaveBeenCalledWith('race',
      { safetyCar: { status: 'resolved', value: false } });
  });

  it('omits stale value when voiding and saves only the selected extra', () => {
    component.form.get('pole').patchValue({ status: 'void', value: 'a' });
    component.save('pole');
    expect(service.updateExtraResults).toHaveBeenCalledWith('race', { pole: { status: 'void' } });
  });

  it('blocks saving before the extra cutoff, but accepts the exact cutoff', () => {
    component.form.get('pole').patchValue({ status: 'resolved', value: 'a' });
    vi.setSystemTime(new Date('2026-09-09T13:59:59Z'));
    component.save('pole');
    expect(service.updateExtraResults).not.toHaveBeenCalled();
    vi.setSystemTime(new Date('2026-09-09T14:00:00Z'));
    component.save('pole');
    expect(service.updateExtraResults).toHaveBeenCalledTimes(1);
  });

  it('rejects pending, missing values and a winner outside the configured duel', () => {
    component.save('pole');
    component.form.get('pole').patchValue({ status: 'resolved', value: null });
    component.save('pole');
    component.form.get('duel').patchValue({ status: 'resolved', value: 'c' });
    component.save('duel');
    expect(service.updateExtraResults).not.toHaveBeenCalled();
  });

  it('does not save results of a processed race', () => {
    component.data.status = 'procesada';
    component.form.get('pole').patchValue({ status: 'void' });
    component.save('pole');
    expect(service.updateExtraResults).not.toHaveBeenCalled();
  });

  it('blocks a repeated submission after a network error', () => {
    service.updateExtraResults.mockReturnValue(throwError(() => ({ status: 0 })));
    component.form.get('pole').patchValue({ status: 'void' });
    component.save('pole');
    component.save('pole');
    expect(service.updateExtraResults).toHaveBeenCalledTimes(1);
    expect(component.blocked).toBe(true);
  });
});

describe('Race settlement checks', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-10T16:00:00Z'));
  });
  afterEach(() => vi.useRealTimers());

  it('requires all enabled results, accepts void, and supports races without extras', () => {
    const data = race({ status: 'lista' });
    expect(closeRaceReason(data)).toContain('Resolvé');
    data.extraResults = {
      pole: { status: 'resolved', value: 'a' }, duel: { status: 'void' },
      safetyCar: { status: 'resolved', value: false },
    };
    expect(closeRaceReason(data)).toBe('');
    expect(closeRaceReason(race({ status: 'lista', extras: undefined }))).toBe('');
  });

  it('blocks closing before the race starts or after it was already closed', () => {
    expect(closeRaceReason(race({ status: 'lista', date: '2026-09-11T16:00:00Z' }))).toContain('Esperá');
    expect(closeRaceReason(race({ status: 'procesada' }))).not.toBe('');
  });

  it('requires full unique classification with integer, distinct positions', () => {
    expect(classificationError([{ pilot: 'a', position: 1 }], ['a', 'b'])).not.toBe('');
    expect(classificationError([{ pilot: 'a', position: 1 }, { pilot: 'a', position: 2 }], ['a', 'b'])).not.toBe('');
    for (const position of [1, 1.5, 0, 23]) {
      expect(classificationError([{ pilot: 'a', position: 1 }, { pilot: 'b', position }], ['a', 'b'])).not.toBe('');
    }
    expect(classificationError([{ pilot: 'b', position: 1 }, { pilot: 'a', position: 2 }], ['a', 'b'])).toBe('');
  });

  it('requires acknowledgement and prevents retry after an ambiguous close failure', () => {
    const service = { closeRace: vi.fn().mockReturnValue(throwError(() => ({ status: 500 }))) };
    const component = new CloseRace(race({ status: 'lista', extras: undefined }), fb, service as any,
      { close: vi.fn(), disableClose: false } as any, { detectChanges() {} } as any);
    component.submit();
    expect(service.closeRace).not.toHaveBeenCalled();
    component.form.get('confirmed').setValue(true);
    component.submit();
    component.submit();
    expect(service.closeRace).toHaveBeenCalledTimes(1);
    expect(component.blocked).toBe(true);
  });
});

describe('Race extras HTTP contract', () => {
  let service: RacesService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      provideHttpClient(), provideHttpClientTesting(),
      { provide: GlobalService, useValue: { api: 'https://api.test' } },
    ] });
    service = TestBed.inject(RacesService);
    http = TestBed.inject(HttpTestingController);
    localStorage.setItem('token', 'test-token');
  });
  afterEach(() => { http.verify(); localStorage.removeItem('token'); });

  it('uses the dedicated PUT results endpoint with authorization and false preserved', () => {
    service.updateExtraResults('race', { safetyCar: { status: 'resolved', value: false } }).subscribe();
    const request = http.expectOne('https://api.test/api/race/race/extras/results');
    expect(request.request.method).toBe('PUT');
    expect(request.request.headers.get('authorization')).toBe('Bearer test-token');
    expect(request.request.body).toEqual({ extraResults: { safetyCar: { status: 'resolved', value: false } } });
    request.flush(race());
  });

  it('preserves the normal close endpoint and sends only classification', () => {
    service.closeRace('race', [{ pilot: 'a', position: 1 }]).subscribe();
    const request = http.expectOne('https://api.test/api/race/race/close');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ result: [{ pilot: 'a', position: 1 }] });
    request.flush({ predictionsProcessed: 1 });
  });
});

describe('Shared race form rendering', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RaceForm],
    providers: [
      { provide: PilotsServices, useValue: { getAllPilots: () => of(race().pilots) } },
      { provide: TrackService, useValue: { getAllTracks: () => of([race().circuit]) } },
    ],
  }));

  it('renders all extra controls and submits the complete create payload', async () => {
    const fixture = TestBed.createComponent(RaceForm);
    fixture.detectChanges();
    await fixture.whenStable();
    const component = fixture.componentInstance;
    component.form.patchValue(createRaceForm(fb, race()).getRawValue());
    fixture.detectChanges();
    const save = vi.spyOn(component.saveRace, 'emit');
    component.submit();
    expect(fixture.nativeElement.textContent).toContain('Pole position');
    expect(fixture.nativeElement.textContent).toContain('Comodín de confianza');
    expect(save).toHaveBeenCalledWith(expect.objectContaining({
      confidenceEnabled: true,
      extras: expect.objectContaining({ duel: expect.objectContaining({ pilots: ['a', 'b'] }) }),
    }));
  });

  it('disables rule controls and submits only editable metadata after opening', async () => {
    const fixture = TestBed.createComponent(RaceForm);
    fixture.componentRef.setInput('race', race({ status: 'lista' }));
    fixture.detectChanges();
    await fixture.whenStable();
    const component = fixture.componentInstance;
    const save = vi.spyOn(component.saveRace, 'emit');
    component.submit();
    expect(fixture.nativeElement.querySelector('input[formControlName="date"]').disabled).toBe(true);
    expect(save).toHaveBeenCalledWith({ name: 'Monza', circuit: 'track' });
  });
});
