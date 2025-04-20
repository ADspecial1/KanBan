import React from "react";
import { Card } from "antd";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS for proper map rendering

const MapComponent: React.FC = () => {
  const position = [51.505, -0.09]; // Example coordinates for a marker

  return (
    <Card
      title="Map"
      style={{
        height: "600px",  // Increase the height of the map
        width: "100%",    // Full width to ensure it takes up available space
        borderRadius: "12px",
        marginBottom: "20px",
      }}
    >
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true} // Allow scroll zoom
        style={{
          width: "100%",  // Ensure the map takes the full width of the container
          height: "100%", // Ensure the map takes the full height of the container
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A marker at coordinates {position[0]}, {position[1]}.
          </Popup>
        </Marker>
      </MapContainer>
    </Card>
  );
};

export default MapComponent;
