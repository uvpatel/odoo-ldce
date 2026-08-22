import { cityRepository } from "../repositories/city.repository";
import { activityRepository } from "../repositories/activity.repository";
import { NewCityTable } from "@/db/schema/catalog/cities";

export class CityService {
  async getCityWithActivities(idOrSlug: string) {
    let city = await cityRepository.findById(idOrSlug);
    if (!city) {
      city = await cityRepository.findBySlug(idOrSlug);
    }
    if (!city) return null;

    const activities = await activityRepository.findByCity(city.id);
    return {
      ...city,
      activities,
    };
  }

  async searchCities(query?: string, limit?: number, offset?: number) {
    return cityRepository.search(query, limit, offset);
  }

  async createCity(data: Omit<NewCityTable, "id">) {
    const id = `cty_${Date.now()}`;
    return cityRepository.create({ ...data, id });
  }

  async updateCity(id: string, data: Partial<NewCityTable>) {
    return cityRepository.update(id, data);
  }

  async deleteCity(id: string) {
    return cityRepository.delete(id);
  }
}

export const cityService = new CityService();
