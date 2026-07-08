import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Header } from '../../shared/header/header';
import { MenuLateral } from '../../shared/menu-lateral/menu-lateral';
import { Toolbar } from '../../shared/toolbar/toolbar';
import { GlobalService } from '../../services/global-service';
import { WalletService } from '../../services/wallet-service';
import { WalletClaim, WalletClaimStatus } from '../../models/wallet';

type WalletFilterStatus = WalletClaimStatus | 'all';

@Component({
  selector: 'app-wallet',
  imports: [
    CommonModule,
    FormsModule,
    Header,
    Toolbar,
    MenuLateral,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './wallet.html',
  styleUrl: './wallet.scss',
})
export class Wallet {
  allClaims: WalletClaim[] = [];
  claims: WalletClaim[] = [];
  selectedStatus: WalletFilterStatus = 'pending';
  loading = false;
  updatingId = '';
  error = '';
  rejectionReasons: Record<string, string> = {};

  statusOptions: { label: string; value: WalletFilterStatus }[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Pendientes', value: 'pending' },
    { label: 'Aprobados', value: 'approved' },
    { label: 'Pagados', value: 'paid' },
    { label: 'Rechazados', value: 'rejected' },
  ];

  constructor(
    private walletService: WalletService,
    private global: GlobalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getClaims();
  }

  get totalPending() {
    return this.sumByStatus('pending');
  }

  get totalApproved() {
    return this.sumByStatus('approved');
  }

  get totalPaid() {
    return this.sumByStatus('paid');
  }

  get totalRequested() {
    return this.allClaims.reduce((total, claim) => total + Number(claim.amount || 0), 0);
  }

  getClaims() {
    this.loading = true;
    this.error = '';

    this.walletService.getClaims('all').subscribe({
      next: (claims) => {
        this.allClaims = claims;
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'No se pudieron cargar las solicitudes de cobro';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  applyFilter() {
    this.claims =
      this.selectedStatus === 'all'
        ? this.allClaims
        : this.allClaims.filter((claim) => claim.status === this.selectedStatus);
    this.cdr.detectChanges();
  }

  updateStatus(claim: WalletClaim, status: WalletClaimStatus) {
    if (status === 'rejected') {
      const rejectedReason = this.rejectionReasons[claim._id]?.trim();

      if (!rejectedReason) {
        this.error = 'Ingresá un motivo para rechazar la solicitud';
        return;
      }

      this.sendStatusUpdate(claim, status, rejectedReason);
      return;
    }

    const message =
      status === 'approved'
        ? '¿Aprobar esta solicitud de cobro?'
        : '¿Marcar esta solicitud como pagada?';

    this.global.showAlertWhitFunction('Atención', message, () => {
      this.sendStatusUpdate(claim, status);
    });
  }

  private sendStatusUpdate(claim: WalletClaim, status: WalletClaimStatus, rejectedReason?: string) {
    this.updatingId = claim._id;
    this.error = '';

    this.walletService.updateClaimStatus(claim._id, { status, rejectedReason }).subscribe({
      next: () => {
        this.updatingId = '';
        this.rejectionReasons[claim._id] = '';
        this.cdr.detectChanges();
        this.getClaims();
      },
      error: (err) => {
        this.updatingId = '';
        this.error = err.error?.message || 'No se pudo actualizar la solicitud';
        this.cdr.detectChanges();
      },
    });
  }

  canApprove(claim: WalletClaim) {
    return claim.status === 'pending';
  }

  canPay(claim: WalletClaim) {
    return claim.status === 'pending' || claim.status === 'approved';
  }

  canReject(claim: WalletClaim) {
    return claim.status === 'pending' || claim.status === 'approved';
  }

  statusLabel(status: WalletClaimStatus) {
    const labels: Record<WalletClaimStatus, string> = {
      pending: 'Pendiente',
      approved: 'Aprobado',
      paid: 'Pagado',
      rejected: 'Rechazado',
    };

    return labels[status];
  }

  methodLabel(method: string) {
    const labels: Record<string, string> = {
      bank_transfer: 'Transferencia',
      mercado_pago: 'Mercado Pago',
      paypal: 'PayPal',
      other: 'Otro',
    };

    return labels[method] || method;
  }

  formatMoney(amount?: number, currency = 'USD') {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));
  }

  private sumByStatus(status: WalletClaimStatus) {
    return this.allClaims
      .filter((claim) => claim.status === status)
      .reduce((total, claim) => total + Number(claim.amount || 0), 0);
  }
}
