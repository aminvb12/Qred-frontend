import client from './client';
import { Company, Card, Invoice, Transaction, User } from '../types';

export const getUsers = () =>
  client.get<User[]>('/users').then(r => r.data);

export const getCompanies = (userId: string) =>
  client.get<Company[]>(`/users/${userId}/companies`).then(r => r.data);

export const getCards = (companyId: string) =>
  client.get<Card[]>(`/companies/${companyId}/cards`).then(r => r.data);

export const getInvoices = (companyId: string) =>
  client.get<Invoice[]>(`/companies/${companyId}/invoices`).then(r => r.data);

export const getTransactions = (companyId: string, cardId: string) =>
  client.get<Transaction[]>(`/companies/${companyId}/transactions?cardId=${cardId}`).then(r => r.data);

export const activateCard = (companyId: string, cardId: string) =>
  client.post<Card>(`/companies/${companyId}/cards/${cardId}/activations`).then(r => r.data);
