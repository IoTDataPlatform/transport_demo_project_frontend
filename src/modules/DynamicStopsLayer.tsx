import React, { useState, useEffect, useCallback } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { getStopsInRect } from "../api/map/map.requests";
import type { StopsInRectOutput, StopsInRectInput } from "../api/map/map.types";

const MIN_ZOOM_TO_SHOW_STOPS = 16;

const DynamicStopsLayer: React.FC = () => {
    const [stops, setStops] = useState<StopsInRectOutput[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [showZoomMessage, setShowZoomMessage] = useState<boolean>(false);

    const map = useMapEvents({
        moveend: () => {
            fetchStopsInView();
        },
    });

    const fetchStopsInView = useCallback(async () => {
        const currentZoom = map.getZoom();
        if (currentZoom < MIN_ZOOM_TO_SHOW_STOPS) {
            setStops([]);
            setShowZoomMessage(true);
            return;
        }

        setShowZoomMessage(false);
        setLoading(true);

        try {
            const bounds = map.getBounds();
            const northEast = bounds.getNorthEast();
            const southWest = bounds.getSouthWest();

            const params: StopsInRectInput = {
                topLeftLat: northEast.lat,
                topLeftLon: southWest.lng,
                bottomRightLat: southWest.lat,
                bottomRightLon: northEast.lng,
            };

            const fetchedStops = await getStopsInRect(params);
            setStops(fetchedStops);
        } catch (error) {
            console.error("Failed to fetch stops:", error);
            alert("Failed to fetch stops:" + error);
        } finally {
            setLoading(false);
        }
    }, [map]);

    useEffect(() => {
        if (map.getZoom() < MIN_ZOOM_TO_SHOW_STOPS) {
            setShowZoomMessage(true);
        }
        fetchStopsInView();
    }, [fetchStopsInView, map]);

    return (
        <>
            {loading && (
                <div className="map-overlay-message">
                    <div className="spinner"></div>
                    <span>Загрузка остановок...</span>
                </div>
            )}

            {showZoomMessage && !loading && (
                <div className="map-overlay-message">
                    <span>Приблизьте карту, чтобы увидеть остановки</span>
                </div>
            )}

            {stops.map((stop) => (
                <Marker key={stop.id} position={[stop.lat, stop.lon]}>
                    <Popup>
                        <b>Остановка:</b> {stop.name}
                    </Popup>
                </Marker>
            ))}
        </>
    );
};

export default DynamicStopsLayer;
