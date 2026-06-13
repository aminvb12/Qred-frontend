export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  personal_number: string;
}

export interface Company {
  id: string;
  name: string;
  org_number: string;
  logo?: string;
}

export interface Card {
  id: string;
  card_number: string;
  issue_date: string;
  exp_date: string;
  max_credit: number;
  current_credit: number;
  status: 'under_review' | 'active' | 'inactive' | 'blocked';
  company_id: string;
}

export interface Invoice {
  id: string;
  ocr_number: string;
  issue_date: string;
  due_date: string;
  amount: number;
  address?: string;
  from: string;
  from_org_number: string;
  type: 'statement' | 'fee';
  status: 'pending' | 'processing' | 'paid';
  company_id: string;
}

export interface Transaction {
  id: string;
  ocr_number: string;
  amount: number;
  date: string;
  paid_date?: string;
}
