export type RaffleStatus = 'draft' | 'active' | 'closed' | 'cancelled' | 'drawn' | 'delivered';
export type RaffleClaimStatus = 'unclaimed' | 'claimed' | 'delivered';

export interface RaffleUser {
  _id: string;
  username?: string;
  email?: string;
}

export interface RaffleTicket {
  _id: string;
  ticketNumber: number;
}

export interface RaffleModel {
  _id: string;
  title: string;
  prizeName: string;
  description?: string;
  image?: string;
  costPerTicket: number;
  status: RaffleStatus;
  featured: boolean;
  ticketsSold: number;
  startsAt: string;
  endsAt: string;
  winner?: RaffleUser;
  winningTicket?: RaffleTicket;
  claimStatus?: RaffleClaimStatus;
  claimedAt?: string;
  drawnAt?: string;
  deliveredAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RafflePayload {
  title: string;
  prizeName: string;
  description?: string;
  image?: string;
  costPerTicket: number;
  status: RaffleStatus;
  featured: boolean;
  startsAt: string;
  endsAt: string;
}

export interface RaffleDrawResponse {
  raffle: RaffleModel;
  winningTicket: RaffleTicket & {
    user?: RaffleUser;
  };
}

export interface RaffleParticipant {
  user: RaffleUser;
  ticketCount: number;
  tickets: number[];
  firstTicketAt?: string;
  lastTicketAt?: string;
}

export interface RaffleParticipantsResponse {
  raffle: Pick<RaffleModel, '_id' | 'title' | 'prizeName' | 'ticketsSold'>;
  totalParticipants: number;
  totalTickets: number;
  participants: RaffleParticipant[];
}
