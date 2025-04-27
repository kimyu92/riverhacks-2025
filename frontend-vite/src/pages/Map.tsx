import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

// Sample emergency resource locations
const emergencyResources = [
  { id: 1, name: "Central Austin Shelter", type: "Shelter", lat: 30.2672, lng: -97.7431, address: "123 Main St, Austin, TX", accessibility: ["Wheelchair access", "Sign language"] },
  { id: 2, name: "North Austin Food Bank", type: "Food Bank", lat: 30.3072, lng: -97.7531, address: "456 Oak St, Austin, TX", accessibility: ["Wheelchair access"] },
  { id: 3, name: "East Austin Cooling Station", type: "Cooling Station", lat: 30.2572, lng: -97.7231, address: "789 Pine St, Austin, TX", accessibility: ["Wheelchair access", "Visual aids"] },
  { id: 4, name: "South Austin Shelter", type: "Shelter", lat: 30.2372, lng: -97.7631, address: "101 Cedar St, Austin, TX", accessibility: ["Wheelchair access", "Service animals allowed"] },
];

export default function Map() {
  useEffect(() => {
    // Fix for Leaflet icon issue in bundled environments
    // This is already handled by the leaflet-defaulticon-compatibility package
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Map header */}
      <header className="bg-white p-4 shadow-sm z-10">
        <h1 className="text-xl font-bold">Emergency Resources Map</h1>
        <div className="text-sm text-gray-500">
          Showing shelters, food banks, and cooling stations in Austin, TX
        </div>
      </header>

      {/* Map container */}
      <div className="flex-1">
        <MapContainer
          center={[30.2672, -97.7431]} // Austin, TX coordinates
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {emergencyResources.map((resource) => (
            <Marker
              key={resource.id}
              position={[resource.lat, resource.lng]}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold">{resource.name}</h3>
                  <p className="text-sm text-blue-600">{resource.type}</p>
                  <p className="text-sm mt-1">{resource.address}</p>
                  <div className="mt-2">
                    <span className="text-xs font-semibold">Accessibility:</span>
                    <ul className="list-disc list-inside text-xs">
                      {resource.accessibility.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Map legend */}
      <footer className="bg-white p-3 shadow-inner border-t">
        <div className="flex justify-around text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
            <span>Shelters</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
            <span>Food Banks</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            <span>Cooling Stations</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
