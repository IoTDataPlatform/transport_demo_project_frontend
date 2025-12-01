import { useState, useEffect, useCallback, type FC } from "react";
import { useMapEvents } from "react-leaflet";
import { getStopsInRect } from "../../api/map/map.requests";
import type {
    StopsInRectOutput,
    StopsInRectInput,
} from "../../api/map/map.types";
import StopMarker from "./StopMarker";

const MIN_ZOOM_TO_SHOW_STOPS = 16;

type Props = {
    onRouteClick: (routeId: string) => void;
};

const DynamicStopsLayer: FC<Props> = ({ onRouteClick }) => {
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
            const params: StopsInRectInput = {
                topLeftLat: bounds.getNorthEast().lat,
                topLeftLon: bounds.getSouthWest().lng,
                bottomRightLat: bounds.getSouthWest().lat,
                bottomRightLon: bounds.getNorthEast().lng,
            };

            const fetchedStops = await getStopsInRect(params);
            setStops(fetchedStops);
        } catch (error) {
            console.error("Failed to fetch stops:", error);
        } finally {
            setLoading(false);
        }
    }, [map]);

    useEffect(() => {
        if (map.getZoom() < MIN_ZOOM_TO_SHOW_STOPS) {
            setShowZoomMessage(true);
        } else {
            fetchStopsInView();
        }
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
                <StopMarker
                    key={stop.id}
                    stop={stop}
                    onRouteClick={onRouteClick}
                />
            ))}
        </>
    );
};

export default DynamicStopsLayer;
