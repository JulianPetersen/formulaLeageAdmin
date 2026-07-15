import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Header } from '../../shared/header/header';
import { MenuLateral } from '../../shared/menu-lateral/menu-lateral';
import { Toolbar } from '../../shared/toolbar/toolbar';
import { RaffleModel, RaffleStatus } from '../../models/raffle';
import { GlobalService } from '../../services/global-service';
import { RafflesService } from '../../services/raffles-service';

type RaffleFilterStatus = RaffleStatus | 'all';

@Component({
  selector: 'app-raffles',
  imports: [
    CommonModule,
    FormsModule,
    Header,
    Toolbar,
    MenuLateral,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './raffles.html',
  styleUrl: './raffles.scss',
})
export class Raffles {
  allRaffles: RaffleModel[] = [];
  raffles: RaffleModel[] = [];
  selectedStatus: RaffleFilterStatus = 'all';
  loading = false;
  saving = false;
  updatingId = '';
  error = '';
  editingRaffleId = '';
  selectedImage: File | null = null;
  imagePreview = '';

  form = this.getEmptyForm();

  statusOptions: { label: string; value: RaffleFilterStatus }[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Borrador', value: 'draft' },
    { label: 'Activo', value: 'active' },
    { label: 'Cerrado', value: 'closed' },
    { label: 'Cancelado', value: 'cancelled' },
    { label: 'Sorteado', value: 'drawn' },
    { label: 'Entregado', value: 'delivered' },
  ];

  formStatusOptions: { label: string; value: RaffleStatus }[] = [
    { label: 'Borrador', value: 'draft' },
    { label: 'Activo', value: 'active' },
    { label: 'Cerrado', value: 'closed' },
    { label: 'Cancelado', value: 'cancelled' },
  ];

  constructor(
    private rafflesService: RafflesService,
    private global: GlobalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getRaffles();
  }

  get activeCount() {
    return this.allRaffles.filter((raffle) => raffle.status === 'active').length;
  }

  get draftCount() {
    return this.allRaffles.filter((raffle) => raffle.status === 'draft').length;
  }

  get ticketsSold() {
    return this.allRaffles.reduce((total, raffle) => total + Number(raffle.ticketsSold || 0), 0);
  }

  get claimedCount() {
    return this.allRaffles.filter((raffle) => this.getClaimStatus(raffle) === 'claimed').length;
  }

  getRaffles() {
    this.loading = true;
    this.error = '';

    this.rafflesService.getAllRaffles().subscribe({
      next: (raffles) => {
        this.allRaffles = raffles;
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'No se pudieron cargar los sorteos';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  applyFilter() {
    this.raffles =
      this.selectedStatus === 'all'
        ? this.allRaffles
        : this.allRaffles.filter((raffle) => raffle.status === this.selectedStatus);
    this.cdr.detectChanges();
  }

  saveRaffle() {
    if (!this.form.title.trim() || !this.form.prizeName.trim() || !this.form.startsAt || !this.form.endsAt) {
      this.error = 'Completa titulo, premio, fecha de inicio y fecha de cierre';
      return;
    }

    if (Number(this.form.costPerTicket || 0) < 1) {
      this.error = 'El costo por ticket debe ser mayor a 0';
      return;
    }

    this.saving = true;
    this.error = '';

    const payload = this.getFormData();
    const request = this.editingRaffleId
      ? this.rafflesService.updateRaffle(this.editingRaffleId, payload)
      : this.rafflesService.createRaffle(payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.cancelEdit();
        this.getRaffles();
      },
      error: (err) => {
        this.saving = false;
        this.error = err.error?.message || 'No se pudo guardar el sorteo';
        this.cdr.detectChanges();
      },
    });
  }

  editRaffle(raffle: RaffleModel) {
    this.editingRaffleId = raffle._id;
    this.form = {
      title: raffle.title || '',
      prizeName: raffle.prizeName || '',
      description: raffle.description || '',
      image: raffle.image || '',
      costPerTicket: Number(raffle.costPerTicket || 25),
      status: raffle.status === 'drawn' || raffle.status === 'delivered' ? 'closed' : raffle.status,
      featured: Boolean(raffle.featured),
      startsAt: this.toDateTimeLocal(raffle.startsAt),
      endsAt: this.toDateTimeLocal(raffle.endsAt),
    };
    this.selectedImage = null;
    this.imagePreview = raffle.image || '';
    this.cdr.detectChanges();
  }

  cancelEdit() {
    this.editingRaffleId = '';
    this.form = this.getEmptyForm();
    this.selectedImage = null;
    this.imagePreview = '';
    this.cdr.detectChanges();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.selectedImage = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  updateStatus(raffle: RaffleModel, status: RaffleStatus) {
    this.global.showAlertWhitFunction('Atencion', `Cambiar el sorteo a ${this.statusLabel(status)}?`, () => {
      this.updatingId = raffle._id;
      this.error = '';

      this.rafflesService.updateStatus(raffle._id, status).subscribe({
        next: () => {
          this.updatingId = '';
          this.getRaffles();
        },
        error: (err) => {
          this.updatingId = '';
          this.error = err.error?.message || 'No se pudo cambiar el estado';
          this.cdr.detectChanges();
        },
      });
    });
  }

  drawRaffle(raffle: RaffleModel) {
    this.global.showAlertWhitFunction('Atencion', 'Realizar el sorteo ahora?', () => {
      this.updatingId = raffle._id;
      this.error = '';

      this.rafflesService.drawRaffle(raffle._id).subscribe({
        next: (response) => {
          this.updatingId = '';
          const winner = response.winningTicket?.user?.username || response.winningTicket?.user?.email || 'ganador';
          this.global.showAlertWhitFunction('Sorteo realizado', `Ticket ganador: #${response.winningTicket.ticketNumber} - ${winner}`);
          this.getRaffles();
        },
        error: (err) => {
          this.updatingId = '';
          this.error = err.error?.message || 'No se pudo realizar el sorteo';
          this.cdr.detectChanges();
        },
      });
    });
  }

  canClose(raffle: RaffleModel) {
    return raffle.status === 'active';
  }

  canActivate(raffle: RaffleModel) {
    return raffle.status === 'draft' || raffle.status === 'closed';
  }

  canCancel(raffle: RaffleModel) {
    return raffle.status === 'draft' || raffle.status === 'active' || raffle.status === 'closed';
  }

  canDraw(raffle: RaffleModel) {
    return (raffle.status === 'closed' || this.isEndedActive(raffle)) && Number(raffle.ticketsSold || 0) > 0;
  }

  drawDisabledReason(raffle: RaffleModel) {
    if (raffle.status === 'drawn') return 'Ya fue sorteado';
    if (raffle.status === 'delivered') return 'Ya fue entregado';
    if (raffle.status === 'cancelled') return 'Sorteo cancelado';
    if (Number(raffle.ticketsSold || 0) < 1) return 'Sin tickets';
    if (raffle.status !== 'closed' && !this.isEndedActive(raffle)) return 'Debe estar cerrado';
    return '';
  }

  canDeliver(raffle: RaffleModel) {
    return raffle.status === 'drawn';
  }

  getClaimStatus(raffle: RaffleModel) {
    if (raffle.claimStatus) return raffle.claimStatus;
    if (raffle.status === 'delivered') return 'delivered';
    return 'unclaimed';
  }

  claimLabel(raffle: RaffleModel) {
    const labels = {
      unclaimed: 'Sin reclamar',
      claimed: 'Reclamado',
      delivered: 'Entregado',
    };

    return labels[this.getClaimStatus(raffle)];
  }

  claimDetail(raffle: RaffleModel) {
    const claimStatus = this.getClaimStatus(raffle);

    if (claimStatus === 'claimed') return 'El usuario ya solicito coordinar la entrega.';
    if (claimStatus === 'delivered') return 'Premio marcado como entregado.';
    return 'El ganador todavia no reclamo este premio.';
  }

  statusLabel(status: RaffleStatus) {
    const labels: Record<RaffleStatus, string> = {
      draft: 'Borrador',
      active: 'Activo',
      closed: 'Cerrado',
      cancelled: 'Cancelado',
      drawn: 'Sorteado',
      delivered: 'Entregado',
    };

    return labels[status];
  }

  private isEndedActive(raffle: RaffleModel) {
    return raffle.status === 'active' && new Date(raffle.endsAt).getTime() <= Date.now();
  }

  private getFormData() {
    const formData = new FormData();

    formData.append('title', this.form.title.trim());
    formData.append('prizeName', this.form.prizeName.trim());
    formData.append('description', this.form.description.trim());
    formData.append('costPerTicket', String(Number(this.form.costPerTicket || 0)));
    formData.append('status', this.form.status);
    formData.append('featured', String(this.form.featured));
    formData.append('startsAt', new Date(this.form.startsAt).toISOString());
    formData.append('endsAt', new Date(this.form.endsAt).toISOString());

    if (this.selectedImage) {
      formData.append('img', this.selectedImage);
    }

    return formData;
  }

  private getEmptyForm() {
    return {
      title: '',
      prizeName: '',
      description: '',
      image: '',
      costPerTicket: 25,
      status: 'draft' as RaffleStatus,
      featured: false,
      startsAt: '',
      endsAt: '',
    };
  }

  private toDateTimeLocal(value?: string) {
    if (!value) return '';
    const date = new Date(value);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  }
}
