export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  is_provider?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  provider_id: number;
  category_id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  duration?: number;
  is_active: boolean;
  provider?: User;
  category?: Category;
  created_at: string;
  updated_at: string;
}

export interface ServiceAvailability {
  id: number;
  service_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceUnavailability {
  id: number;
  service_id: number;
  start_date: string;
  end_date: string;
  reason?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  user_id: number;
  service_id: number;
  provider_id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_price: number;
  currency: string;
  notes?: string;
  user?: User;
  service?: Service;
  provider?: User;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: number;
  user_id: number;
  provider_id: number;
  booking_id?: number;
  last_message?: ChatMessage;
  unread_count?: number;
  user?: User;
  provider?: User;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: number;
  conversation_id: number;
  sender_id: number;
  message: string;
  read_at?: string;
  sender?: User;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: number;
  booking_id: number;
  invoice_number: string;
  amount: number;
  currency: string;
  status: 'draft' | 'issued' | 'paid' | 'cancelled';
  due_date?: string;
  issued_at?: string;
  paid_at?: string;
  booking?: Booking;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  invoice_id: number;
  amount: number;
  currency: string;
  payment_method: string;
  payment_intent_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  invoice?: Invoice;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  data?: any;
  read_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  booking_id: number;
  service_id: number;
  user_id: number;
  rating: number;
  comment?: string;
  booking?: Booking;
  service?: Service;
  user?: User;
  created_at: string;
  updated_at: string;
}

export interface TransactionLog {
  id: number;
  user_id: number;
  type: 'payment' | 'refund' | 'payout' | 'fee';
  amount: number;
  currency: string;
  description: string;
  reference_type?: string;
  reference_id?: number;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  user_id: number;
  subject: string;
  body: string;
  read_at?: string;
  user?: User;
  created_at: string;
  updated_at: string;
}

export type Currency = 'CHF' | 'USD' | 'EUR';

export interface CurrencyRate {
  from: Currency;
  to: Currency;
  rate: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links?: {
    first?: string;
    last?: string;
    prev?: string;
    next?: string;
  };
}
