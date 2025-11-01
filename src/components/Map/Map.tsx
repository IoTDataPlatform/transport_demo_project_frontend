import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import L, { type LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import type { Vehicle } from "./Map.types";
import DynamicStopsLayer from "../../modules/DynamicStopsLayer";

const getVehicleIcon = (status: Vehicle["status"]) => {
    const colorMap = {
        onTime: "bg-blue",
        delayed: "bg-orange",
        critical: "bg-red",
    };
    const colorClass = colorMap[status];

    return L.divIcon({
        className: `vehicle-icon ${colorClass}`,
        html: `🚌`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};

const Map: React.FC = () => {
    const mapCenter: LatLngExpression = [59.3326, 18.0649]; // Центр Стокгольма

    return (
        <MapContainer
            center={mapCenter}
            zoom={14}
            style={{ height: "80vh", width: "80vw" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <DynamicStopsLayer />
        </MapContainer>
    );
};

export default Map;
