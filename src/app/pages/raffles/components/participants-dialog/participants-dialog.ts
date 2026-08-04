import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RaffleParticipant, RaffleParticipantsResponse } from '../../../../models/raffle';
import { RafflesService } from '../../../../services/raffles-service';

interface ParticipantsDialogData {
  raffleId: string;
  title: string;
}

@Component({
  selector: 'app-participants-dialog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './participants-dialog.html',
  styleUrl: './participants-dialog.scss',
})
export class ParticipantsDialog {
  loading = false;
  error = '';
  response?: RaffleParticipantsResponse;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ParticipantsDialogData,
    private rafflesService: RafflesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getParticipants();
  }

  getParticipants() {
    this.loading = true;
    this.error = '';

    this.rafflesService.getParticipants(this.data.raffleId).subscribe({
      next: (response) => {
        this.response = response;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'No se pudieron cargar los participantes';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get participants(): RaffleParticipant[] {
    return this.response?.participants || [];
  }

  userName(participant: RaffleParticipant) {
    return participant.user.username || participant.user.email || 'Usuario sin nombre';
  }

  ticketsLabel(participant: RaffleParticipant) {
    return participant.tickets.map((ticket) => `#${ticket}`).join(', ');
  }
}
