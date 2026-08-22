import { budgetRepository } from "../repositories/budget.repository";
import { expenseRepository } from "../repositories/expense.repository";
import { authorizationService } from "./authorization.service";

export class BudgetService {
  async getTripBudgetSummary(tripId: string) {
    const budget = await budgetRepository.findByTripId(tripId);
    const expensesList = await expenseRepository.findByTripId(tripId);
    const totalSpent = await expenseRepository.getTotalByTrip(tripId);

    const totalBudget = parseFloat(budget?.totalBudget || "0");
    const remaining = totalBudget - totalSpent;
    const percentageUsed = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;

    // Breakdown by category
    const categoryTotals: Record<string, number> = {};
    expensesList.forEach((exp) => {
      const amt = parseFloat(exp.amount);
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + amt;
    });

    const categoryBreakdown = Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0,
    }));

    return {
      budget,
      totalBudget,
      totalSpent,
      remaining,
      percentageUsed,
      categoryBreakdown,
      expenses: expensesList,
    };
  }

  async updateBudget(userId: string, tripId: string, totalBudget: string, currency: string = "USD", notes?: string) {
    const canEdit = await authorizationService.canEditTrip(userId, tripId);
    if (!canEdit) throw new Error("Unauthorized to edit trip budget");
    return budgetRepository.upsert(tripId, totalBudget, currency, notes);
  }
}

export const budgetService = new BudgetService();
