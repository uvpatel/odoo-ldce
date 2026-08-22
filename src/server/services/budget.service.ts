import { BudgetRepository } from "../repositories/budget.repository";
import { ItineraryRepository } from "../repositories/itinerary.repository";
import { AuthorizationService } from "./authorization.service";
import type {
  UpsertTripBudgetInput,
  CreateExpenseInput,
  UpdateExpenseInput,
  ExpenseFilterInput,
} from "@/lib/validation";

export class BudgetService {
  private static async validateExpenseParents(
    tripId: string,
    input: Pick<CreateExpenseInput, "tripDayId" | "itineraryItemId">
  ) {
    if (
      input.tripDayId &&
      !(await ItineraryRepository.findTripDayById(tripId, input.tripDayId))
    ) {
      throw new Error("Invalid trip day: The day does not belong to this trip.");
    }

    if (input.itineraryItemId) {
      const item = await ItineraryRepository.findItineraryItemById(
        tripId,
        input.itineraryItemId
      );
      if (!item) {
        throw new Error("Invalid itinerary item: The item does not belong to this trip.");
      }
      if (input.tripDayId && item.tripDayId !== input.tripDayId) {
        throw new Error("Invalid itinerary item: The item is not scheduled on the selected day.");
      }
    }
  }

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
    await this.validateExpenseParents(input.tripId, input);
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
    await this.validateExpenseParents(tripId, input);
    return BudgetRepository.updateExpense(tripId, expenseId, input);
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
    return BudgetRepository.deleteExpense(tripId, expenseId);
  }
}
