import L from "leaflet";
import busStopPng from "../assets/bus-station.png";

export const stopIcon = L.icon({
    iconUrl: busStopPng,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
});
