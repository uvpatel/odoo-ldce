import { activityRepository } from "../repositories/activity.repository";
import { NewActivityTable } from "@/db/schema/catalog/activities";

export class ActivityService {
  async getActivity(id: string) {
    return activityRepository.findById(id);
  }

  async searchActivities(query?: string, cityId?: string, limit?: number, offset?: number) {
    return activityRepository.search(query, cityId, limit, offset);
  }

  async createActivity(data: Omit<NewActivityTable, "id">) {
    const id = `act_${Date.now()}`;
    return activityRepository.create({ ...data, id });
  }

  async updateActivity(id: string, data: Partial<NewActivityTable>) {
    return activityRepository.update(id, data);
  }

  async deleteActivity(id: string) {
    return activityRepository.delete(id);
  }
}

export const activityService = new ActivityService();
