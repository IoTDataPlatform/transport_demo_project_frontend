import type { FC } from "react";
import { Marker, Popup } from "react-leaflet";
import { useStopRoutes } from "../../hooks/useStopRoutes";
import type { StopsInRectOutput } from "../../api/map/map.types";
import { stopIcon } from "../../utils/mapIcons";

interface StopMarkerProps {
    stop: StopsInRectOutput;
    onRouteClick: (routeId: string) => void;
}

const StopMarker: FC<StopMarkerProps> = ({ stop, onRouteClick }) => {
    const {
        routes,
        loading,
        error,
        activeRoutes,
        checkingActive,
        loadRoutes,
        checkActiveRoutes,
    } = useStopRoutes(stop.id);

    return (
        <Marker
            position={[stop.lat, stop.lon]}
            icon={stopIcon}
            eventHandlers={{
                click: loadRoutes,
            }}
        >
            <Popup minWidth={280}>
                <div style={{ display: "grid", gap: 8 }}>
                    <div>
                        <b>Остановка:</b> {stop.name}
                        <div style={{ fontSize: 12, opacity: 0.8 }}>
                            {stop.id}
                        </div>
                    </div>

                    {loading && <div>Загрузка маршрутов...</div>}
                    {error && <div style={{ color: "crimson" }}>{error}</div>}

                    {!loading && !error && routes.length > 0 && (
                        <>
                            {/* Блок активных маршрутов */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: 8,
                                    alignItems: "center",
                                }}
                            >
                                <button
                                    onClick={checkActiveRoutes}
                                    disabled={checkingActive}
                                    style={{
                                        padding: "4px 8px",
                                        borderRadius: 6,
                                        border: "1px solid #ddd",
                                        cursor: "pointer",
                                    }}
                                >
                                    {checkingActive
                                        ? "Проверяю..."
                                        : "Найти активные"}
                                </button>
                            </div>

                            {activeRoutes.length > 0 && (
                                <div
                                    style={{
                                        background: "#f0fff4",
                                        padding: 4,
                                        borderRadius: 4,
                                    }}
                                >
                                    <strong>Сейчас едут:</strong>
                                    <ul
                                        style={{
                                            margin: "4px 0 0 16px",
                                            padding: 0,
                                        }}
                                    >
                                        {routes
                                            .filter((route) =>
                                                activeRoutes.includes(
                                                    route.routeId
                                                )
                                            )
                                            .map((route) => (
                                                <li
                                                    key={route.routeId}
                                                    style={{
                                                        listStyle: "none",
                                                    }}
                                                >
                                                    <a
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            onRouteClick(
                                                                route.routeId
                                                            );
                                                        }}
                                                    >
                                                        🚌{" "}
                                                        {route.shortName ||
                                                            route.routeId}
                                                    </a>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            )}

                            {/* Список всех маршрутов */}
                            <div>
                                <strong>Все маршруты:</strong>
                                <ul
                                    style={{
                                        maxHeight: 150,
                                        overflow: "auto",
                                        margin: 0,
                                        paddingLeft: 16,
                                    }}
                                >
                                    {routes.map((route) => (
                                        <li key={route.routeId}>
                                            <button
                                                onClick={() =>
                                                    onRouteClick(route.routeId)
                                                }
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    color: "blue",
                                                    textDecoration: "underline",
                                                    cursor: "pointer",
                                                    padding: 0,
                                                    textAlign: "left",
                                                }}
                                            >
                                                {route.shortName ?? "—"}{" "}
                                                <small>({route.routeId})</small>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            </Popup>
        </Marker>
    );
};

export default StopMarker;
