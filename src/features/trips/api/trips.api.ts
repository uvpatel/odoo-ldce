import { TripFormData } from "../schemas/trip.schema";

export async function fetchTripsApi() {
  const res = await fetch("/api/trips");
  if (!res.ok) throw new Error("Failed to fetch trips");
  return res.json();
}

export async function fetchTripApi(tripId: string) {
  const res = await fetch(`/api/trips/${tripId}`);
  if (!res.ok) throw new Error("Failed to fetch trip details");
  return res.json();
}

export async function createTripApi(data: TripFormData) {
  const res = await fetch("/api/trips", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create trip");
  return res.json();
}

export async function updateTripApi(tripId: string, data: Partial<TripFormData>) {
  const res = await fetch(`/api/trips/${tripId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update trip");
  return res.json();
}

export async function deleteTripApi(tripId: string) {
  const res = await fetch(`/api/trips/${tripId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete trip");
  return res.json();
}
