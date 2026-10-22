import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatChip } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, catchError, Observable, of, Subscription, switchMap } from 'rxjs';
import { RacesService } from '../../../../services/races-service';
import { GlobalService } from '../../../../services/global-service';
import { RaceModel } from '../../../../models/race';
import { CloseRace } from '../close-race/close-race';
import { EditRaceComponent } from '../edit-race/edit-race';
import { RaceExtraResults } from '../race-extra-results/race-extra-results';
import { RaceExtrasSummary } from '../race-extras-summary/race-extras-summary';
import { RACE_EXTRAS } from '../../race-form.utils';

@Component({
  selector: 'app-list-races-component',
  imports: [CommonModule, MatCard, MatButtonModule, MatChip, MatIcon, RaceExtrasSummary],
  templateUrl: './list-races-component.html',
  styleUrl: './list-races-component.scss',
})
export class ListRacesComponent implements OnInit, OnDestroy {
  private refresh$ = new BehaviorSubject<void>(undefined);
  private subscription?: Subscription;
  error = '';
  updatingId = '';
  races$: Observable<RaceModel[]> = this.refresh$.pipe(
    switchMap(() => this.racesService.getAllRaces().pipe(
      catchError(() => {
        this.error = 'No se pudieron cargar las carreras. Intentá actualizar el listado.';
        return of([]);
      }),
    )),
  );

  constructor(private racesService: RacesService, public dialog: MatDialog,
    private global: GlobalService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.subscription = this.racesService.racesAdded$.subscribe(() => this.refresh());
  }
  ngOnDestroy() { this.subscription?.unsubscribe(); }
  hasExtras(race: RaceModel) { return RACE_EXTRAS.some(extra => race.extras?.[extra.key]?.enabled); }

  changeStatusToLista(race: RaceModel) {
    if (this.updatingId) return;
    this.global.showAlertWhitFunction('Abrir pronósticos',
      'Al abrir ' + race.name + ' quedarán bloqueados pilotos, fechas, puntos, extras y confianza. ¿Continuar?',
      () => {
        if (this.updatingId) return;
        this.updatingId = race._id;
        this.error = '';
        this.racesService.updateRaceStatus(race._id, 'lista').subscribe({
          next: () => { this.updatingId = ''; this.refresh(); this.cdr.detectChanges(); },
          error: err => {
            this.updatingId = '';
            this.refresh$.next();
            this.error = err.error?.message || 'No se pudo abrir la carrera.';
            this.cdr.detectChanges();
          },
        });
      });
  }

  closeRace(race: RaceModel) {
    this.dialog.open(CloseRace, { width: '760px', maxWidth: '96vw', data: race })
      .afterClosed().subscribe(() => this.refresh());
  }

  editRace(race: RaceModel) {
    this.dialog.open(EditRaceComponent, { width: '760px', maxWidth: '96vw', data: race })
      .afterClosed().subscribe(() => this.refresh());
  }

  extraResults(race: RaceModel) {
    this.dialog.open(RaceExtraResults, { width: '700px', maxWidth: '96vw', data: race })
      .afterClosed().subscribe(() => this.refresh());
  }

  refresh() { this.error = ''; this.refresh$.next(); }
}
