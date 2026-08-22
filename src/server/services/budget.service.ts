import { BudgetRepository } from "../repositories/budget.repository";
import { AuthorizationService } from "./authorization.service";
import type {
  UpsertTripBudgetInput,
  CreateExpenseInput,
  UpdateExpenseInput,
  ExpenseFilterInput,
} from "@/lib/validation";

export class BudgetService {
  static async setTripBudget(userId: string, input: UpsertTripBudgetInput, userRole?: string) {
    const canManage = await AuthorizationService.canManageBudget(userId, input.tripId, userRole);
    if (!canManage) {
      throw new Error("Unauthorized: Cannot manage budget for this trip.");
    }
    return BudgetRepository.upsertTripBudget(input);
  }

  static async getBudgetSummary(
    tripId: string,
    accessCtx: { userId?: string | null; userRole?: string | null; shareToken?: string | null }
  ) {
    const canView = await AuthorizationService.canViewTrip({
      tripId,
      userId: accessCtx.userId,
      userRole: accessCtx.userRole,
      shareToken: accessCtx.shareToken,
    });

    if (!canView) {
      throw new Error("Unauthorized: Cannot view budget.");
    }

    return BudgetRepository.calculateBudgetSummary(tripId);
  }

  static async getExpenses(userId: string, filters: ExpenseFilterInput, userRole?: string) {
    const canView = await AuthorizationService.canViewTrip({
      tripId: filters.tripId,
      userId,
      userRole,
    });

    if (!canView) {
      throw new Error("Unauthorized: Cannot view expenses.");
    }

    return BudgetRepository.findExpenses(filters);
  }

  static async addExpense(userId: string, input: CreateExpenseInput, userRole?: string) {
    const canManage = await AuthorizationService.canManageBudget(userId, input.tripId, userRole);
    if (!canManage) {
      throw new Error("Unauthorized: Cannot add expenses to this trip.");
    }
    return BudgetRepository.createExpense(input);
  }

  static async updateExpense(
    userId: string,
    tripId: string,
    expenseId: string,
    input: UpdateExpenseInput,
    userRole?: string
  ) {
    const canManage = await AuthorizationService.canManageBudget(userId, tripId, userRole);
    if (!canManage) {
      throw new Error("Unauthorized: Cannot edit expenses for this trip.");
    }
    return BudgetRepository.updateExpense(expenseId, input);
  }

  static async deleteExpense(
    userId: string,
    tripId: string,
    expenseId: string,
    userRole?: string
  ) {
    const canManage = await AuthorizationService.canManageBudget(userId, tripId, userRole);
    if (!canManage) {
      throw new Error("Unauthorized: Cannot delete expense.");
    }
    return BudgetRepository.deleteExpense(expenseId);
  }
}
