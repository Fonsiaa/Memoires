import React, { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import "../styles/main.scss";

export default function MapApp() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [locationData, setLocationData] = useState(null);

    useEffect(() => {
        if (map.current) return; 

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://tiles.openfreemap.org/styles/liberty',
            center: [0, 20],
            zoom: 2,
            renderWorldCopies: false,
        });

        const resizer = new ResizeObserver(() => {
            if (map.current) {
                map.current.resize();
            }
        });

        resizer.observe(mapContainer.current);

        map.current.on('click', async (e) => {
            if (map.current.isMoving()) return;

            const { lng, lat } = e.lngLat;

            try {
                // Get the Country Name
                const countryRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
                const countryData = await countryRes.json();
                const countryName = countryData.address?.country || "Unknown Location";

                const overpassQuery = `
                    [out:json][timeout:25];
                    node["tourism"](around:50000, ${lat}, ${lng});
                    out body 5;
                `;
                const destinationsRes = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
                const destinationsData = await destinationsRes.json();

                const realDestinations = await Promise.all(
                    destinationsData.elements.map(async (el) => {
                        if (el.tags["name:en"]) return el.tags["name:en"];
                    
                        try {
                            const translateRes = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${el.lat}&lon=${el.lon}&accept-language=en`
                            );
                            const translateData = await translateRes.json();
                            return translateData.name || el.tags.name;
                        } catch (e) {
                            return el.tags.name;
                        }
                    })
                );

                const finalDestinations = realDestinations.length > 0 
                    ? realDestinations 
                    : ["Local Landmark", "Scenic Viewpoint", "Park"];

                setLocationData({
                    country: countryName,
                    destinations: finalDestinations.slice(0, 5)
                });

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        });

        // CLEANUP
        return () => {
            if (map.current) map.current.remove();
        };
    }, []); 

    return (
        <div className="app-layout">
            <div className="sidebar">
                {locationData ? (
                    <div className="content">
                        <h2>{locationData.country}</h2>
                        <p>Top 5 Destinations:</p>
                        <ul>
                            {locationData.destinations.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="hint">Click the Map!</p>
                )}
            </div>
            <div ref={mapContainer} className="map-view" />
        </div>
    );
}