import { expenseRepository } from "../repositories/expense.repository";
import { authorizationService } from "./authorization.service";
import { NewExpenseTable } from "@/db/schema/budget/expenses";

export class ExpenseService {
  async getTripExpenses(tripId: string) {
    return expenseRepository.findByTripId(tripId);
  }

  async addExpense(userId: string, tripId: string, data: Omit<NewExpenseTable, "id" | "tripId">) {
    const canEdit = await authorizationService.canEditTrip(userId, tripId);
    if (!canEdit) throw new Error("Unauthorized to add expense");

    const id = `exp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    return expenseRepository.create({
      ...data,
      id,
      tripId,
      paidById: data.paidById || userId,
    });
  }

  async updateExpense(userId: string, tripId: string, expenseId: string, data: Partial<NewExpenseTable>) {
    const canEdit = await authorizationService.canEditTrip(userId, tripId);
    if (!canEdit) throw new Error("Unauthorized to edit expense");
    return expenseRepository.update(expenseId, data);
  }

  async removeExpense(userId: string, tripId: string, expenseId: string) {
    const canEdit = await authorizationService.canEditTrip(userId, tripId);
    if (!canEdit) throw new Error("Unauthorized to delete expense");
    return expenseRepository.delete(expenseId);
  }
}

export const expenseService = new ExpenseService();
