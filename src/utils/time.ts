import type { TripSummary } from "../api/map/map.types";

export const getTodayDateString = (): string => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

export const getActiveTrips = (trips: TripSummary[]): TripSummary[] => {
    const nowMs = Date.now();
    const BUFFER_MS = 15 * 60 * 1000;

    return trips.filter((trip) => {
        const startStr = `${trip.startDate}T${trip.startTime}`;
        const endStr = `${trip.endDate}T${trip.endTime}`;

        const startMs = new Date(startStr).getTime() - BUFFER_MS;
        const endMs = new Date(endStr).getTime() + BUFFER_MS;

        return nowMs >= startMs && nowMs <= endMs;
    });
};
