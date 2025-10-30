export type StopsInRectInput = {
    topLeftLat: number;
    topLeftLon: number;
    bottomRightLat: number;
    bottomRightLon: number;
}

export type StopsInRectOutput = {
    id: string;
    name: string;
    lat: number;
    lon: number;
}

export type RoutesThroughStopOutput = {
    routeId: string;
    shortName: string;
    longName: string | null;
    routeType: number;
}

export type RouteScheduleAtStopOutput = {
    stopId: string;
    routeId: string;
    date: string; // YYYY-MM-DD
    shortName: string;
    longName: string | null;
    routeType: number;
    times: string[];
}

type Stop = {
    id: string;
    name: string;
    lat: number;
    lon: number;
}

type Shape = {
    shapeId: string;
    points: Array<{"lat": number, "lon": number}>;
}

export type RouteGeometryOutput = {
    routeId: string;
    stops: Stop[];
    shapes: Shape[];
}

