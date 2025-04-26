// components/MapPlaceholder.jsx
import { Map } from "lucide-react";

const MapPlaceholder = ({ loading, resources }) => (
    <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center">
        <div className="text-center p-4">
            <Map className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">
                {loading ? "Loading map..." : "Map would render here with Mapbox API"}
            </p>
            <p className="text-xs text-slate-400 mt-2">
                Showing {resources.length} emergency resources
            </p>
        </div>
    </div>
);

export default MapPlaceholder;