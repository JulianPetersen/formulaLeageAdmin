import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ExtraKey, RaceModel } from '../../../../models/race';
import { RACE_EXTRAS } from '../../race-form.utils';

@Component({
  selector: 'app-race-extras-summary',
  imports: [CommonModule],
  templateUrl: './race-extras-summary.html',
  styleUrl: './race-extras-summary.scss',
})
export class RaceExtrasSummary {
  @Input() race!: RaceModel;
  readonly extras = RACE_EXTRAS;
  get hasExtras() { return this.extras.some(extra => this.race.extras?.[extra.key]?.enabled); }

  resultLabel(key: ExtraKey) {
    const result = this.race.extraResults?.[key];
    if (!result || result.status === 'pending') return 'Resultado pendiente';
    if (result.status === 'void') return 'Anulado · 0 puntos';
    if (key === 'safetyCar') return result.value === true ? 'Sí hubo Safety Car' : 'No hubo Safety Car';
    return this.race.pilots.find(pilot => pilot._id === result.value)?.name || 'Piloto no disponible';
  }
}
