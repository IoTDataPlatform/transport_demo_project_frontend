import { useEffect, useMemo, useRef, type FC } from "react";
import { Polyline, Marker, Popup, useMap } from "react-leaflet";
import L, { type LatLngExpression } from "leaflet";
import "leaflet-polylinedecorator";
import type { TripShapeOutput, TripStopsOutput } from "../../api/map/map.types";
import { stopIcon } from "../../utils/mapIcons";

type Props = {
    shape: TripShapeOutput | null;
    stops: TripStopsOutput | null;
};

const TripLayer: FC<Props> = ({ shape, stops }) => {
    const map = useMap();
    const arrowsLayerRef = useRef<L.Layer | null>(null);

    const polyline: LatLngExpression[] = useMemo(() => {
        if (!shape) return [];
        return [...shape.points]
            .sort((a, b) => a.sequence - b.sequence)
            .map((p) => [p.lat, p.lon] as LatLngExpression);
    }, [shape]);

    const sortedStops = useMemo(() => {
        if (!stops?.stops) return [];
        return [...stops.stops].sort((a, b) => a.sequence - b.sequence);
    }, [stops]);

    useEffect(() => {
        if (!shape || !shape.points.length) return;
        const bounds = L.latLngBounds(
            shape.points.map((p) => [p.lat, p.lon] as [number, number])
        );
        map.fitBounds(bounds.pad(0.1));
    }, [shape, map]);

    useEffect(() => {
        if (arrowsLayerRef.current) {
            map.removeLayer(arrowsLayerRef.current);
            arrowsLayerRef.current = null;
        }

        if (!polyline.length) return;

        const baseLine = L.polyline(polyline);

        const decorator = L.polylineDecorator(baseLine, {
            patterns: [
                {
                    offset: "5%",
                    repeat: "10%",
                    symbol: L.Symbol.arrowHead({
                        pixelSize: 8,
                        polygon: false,
                        pathOptions: {
                            weight: 3,
                            color: "#3388ff",
                            fillColor: "#3388ff",
                            fillOpacity: 1,
                        },
                    }),
                },
            ],
        });

        decorator.addTo(map);
        arrowsLayerRef.current = decorator;

        return () => {
            if (arrowsLayerRef.current) {
                map.removeLayer(arrowsLayerRef.current);
                arrowsLayerRef.current = null;
            }
        };
    }, [polyline, map]);

    if (!shape) return null;

    return (
        <>
            <Polyline positions={polyline} />

            {sortedStops.map((st) => (
                <Marker
                    key={st.stopId}
                    position={[st.lat, st.lon]}
                    icon={stopIcon}
                >
                    <Popup>
                        <b>{st.stopName}</b>
                        <div style={{ fontSize: 12, opacity: 0.8 }}>
                            {st.stopId}
                        </div>
                        <div style={{ fontSize: 12, marginTop: 4 }}>
                            {st.arrivalTime === st.departureTime ? (
                                <>Время: {st.arrivalTime}</>
                            ) : (
                                <>
                                    Прибытие: {st.arrivalTime}
                                    <br />
                                    Отправление: {st.departureTime}
                                </>
                            )}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );
};

export default TripLayer;
