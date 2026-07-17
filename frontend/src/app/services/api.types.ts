export interface LoginResponse {
  message: string;
  token: string;
  user: ApiUser;
}

export interface SignupResponse {
  message: string;
  user: ApiUser;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ApiUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface DashboardResponse {
  user: ApiUser;
  kpis: KpiData[];
  revenue: RevenueData;
  traffic: TrafficData[];
  transactions: TransactionData[];
  goal: GoalData;
}

export interface KpiData {
  label: string;
  value: string;
  delta: number;
  positive: boolean;
  icon: string;
  spark: number[];
}

export interface RevenueData {
  this_year: number[];
  last_year: number[];
  months: string[];
}

export interface TrafficData {
  label: string;
  percent: number;
  color: string;
}

export interface TransactionData {
  name: string;
  email: string;
  initials: string;
  color: string;
  plan: string;
  date: string;
  status: string;
  amount: string;
}

export interface GoalData {
  percent: number;
  current: string;
  target: string;
  progress: { label: string; percent: number }[];
}

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}

export interface Property {
  id: number;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  property_type: string;
  status: string;
  featured: boolean;
  image_url: string;
  agent_name: string;
  agent_email: string;
  agent_phone: string;
  created_at: string;
  updated_at: string;
}

export interface PropertiesResponse {
  properties: Property[];
  total: number;
  page: number;
  pages: number;
}

export interface SettingsResponse {
  first_name: string;
  last_name: string;
  email: string;
  notifications_enabled: boolean;
}

export interface RevenueApiResponse {
  monthly_recurring: number;
  annual_recurring: number;
  churn_rate: number;
  lifetime_value: number;
  monthly_trend: { month: string; mrr: number; revenue: number }[];
  plan_breakdown: { plan: string; revenue: number; subscribers: number }[];
  revenue_over_time?: {
    this_year: number[];
    last_year: number[];
    months: string[];
  };
}

export interface Customer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  created_at: string;
  plan?: string;
  status?: string;
  joined?: string;
  revenue?: string;
}

export interface CustomersResponse {
  customers: Customer[];
  total: number;
  page: number;
  pages: number;
  summary?: {
    total: number;
    active: number;
    new_this_month: number;
    churned_this_month: number;
  };
}

export interface Invoice {
  id: string;
  customer: string;
  amount: string;
  status: string;
  issued: string;
  due_date: string;
}

export interface InvoicesResponse {
  invoices: Invoice[];
  total: number;
  page: number;
  pages: number;
  summary?: {
    total_outstanding: string;
    paid_this_month: string;
    overdue: string;
    pending: string;
  };
}

export interface HelpArticle {
  category: string;
  title: string;
  content: string;
  views: number;
}

export interface HelpResponse {
  categories: { name: string; articles: { title: string; views: number; content?: string }[] }[];
  support?: { email: string; response_time: string; status: string };
}

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending';
}

export interface TeamResponse {
  members: TeamMember[];
}

export interface CreateTeamMemberRequest {
  name: string;
  email: string;
  role: string;
}

export interface CreateTeamMemberResponse {
  message: string;
  member: TeamMember;
}

export interface DeleteTeamMemberResponse {
  message: string;
}

export type ActivityStatus = 'completed' | 'processing' | 'pending' | 'failed';

export interface ActivityEvent {
  id: number;
  actor: string;
  actor_email?: string;
  initials: string;
  color: string;
  action: string;
  target: string;
  status: ActivityStatus;
  amount?: string;
  date: string;
}

export interface ActivityResponse {
  events: ActivityEvent[];
  total: number;
  page: number;
  pages: number;
}
