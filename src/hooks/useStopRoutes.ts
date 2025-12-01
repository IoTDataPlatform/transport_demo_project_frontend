import { useState, useCallback } from "react";
import {
    getRoutesThroughStop,
    getTripsByRoute,
    getVehiclePosition,
} from "../api/map/map.requests";
import type { RoutesThroughStopOutput } from "../api/map/map.types";

export const useStopRoutes = (stopId: string) => {
    const [routes, setRoutes] = useState<RoutesThroughStopOutput[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [activeRoutes, setActiveRoutes] = useState<string[]>([]);
    const [checkingActive, setCheckingActive] = useState(false);

    const loadRoutes = useCallback(async () => {
        if (routes.length > 0) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getRoutesThroughStop(stopId);
            setRoutes(data);
        } catch (e: unknown) {
            console.error(e);
            setError("Не удалось загрузить маршруты");
        } finally {
            setLoading(false);
        }
    }, [stopId, routes.length]);

    const checkActiveRoutes = useCallback(async () => {
        if (routes.length === 0) return;
        setCheckingActive(true);

        try {
            const results = await Promise.all(
                routes.map(async (route) => {
                    try {
                        const trips = await getTripsByRoute(route.routeId);
                        if (!trips.length) return null;

                        for (const trip of trips) {
                            try {
                                const pos = await getVehiclePosition(
                                    trip.tripId,
                                    3600
                                );
                                if (pos && pos.lat != null && pos.lon != null) {
                                    return route.routeId;
                                }
                            } catch {
                                /* empty */
                            }
                        }
                        return null;
                    } catch {
                        return null;
                    }
                })
            );

            const activeIds = results.filter((id): id is string => id !== null);
            setActiveRoutes(activeIds);
        } finally {
            setCheckingActive(false);
        }
    }, [routes]);

    return {
        routes,
        loading,
        error,
        activeRoutes,
        checkingActive,
        loadRoutes,
        checkActiveRoutes,
    };
};
