'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  MapPin,
  Search,
  Filter,
  List,
  Accessibility as Wheelchair,
  Map,
  Info,
  ChevronRight,
  Phone,
  Clock,
  Thermometer,
  Landmark as Buildings,
  ShoppingBag
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import MapPlaceholder from "../map/components/MapPlaceholder";
import ResourceDetails from "../map/components/ResourceDetails";

interface FoodResource {
  id: number;
  location: string;
  name: string;
  organization_id: number;
  source: string;
  type?: string;
  distance?: number;
  phone?: string;
  hours?: string;
  accessibility?: {
    wheelchair: boolean;
    visualAlerts: boolean;
    audioAlerts: boolean;
    assistiveStaff: boolean;
  };
  status?: string;
  capacity?: string;
  lastUpdated?: string;
  latitude?: number;
  longitude?: number;
}

interface ShelterResource {
  id: number;
  location: string;
  name: string;
  organization_id: number;
  source: string;
  audio_accommodations: boolean;
  visual_accommodations: boolean;
  wheelchair_accessible: boolean;
  description?: string;              // added optional description
  type?: string;
  distance?: number;
  phone?: string;
  hours?: string;
  accessibility?: {
    wheelchair: boolean;
    visualAlerts: boolean;
    audioAlerts: boolean;
    assistiveStaff: boolean;
  };
  status?: string;
  capacity?: string;
  lastUpdated?: string;
  latitude?: number;
  longitude?: number;
}

export default function Results() {
  const searchParams = useSearchParams();
  const resourceType = searchParams.get('resourceType');
  const zipCode = searchParams.get('zipCode');

  const [resources, setResources] = useState<FoodResource[] | ShelterResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<FoodResource | ShelterResource | null>(null);

  console.log('Resource Type:', resourceType, resources);
  // Get appropriate resource icon based on type
  const getResourceIcon = (type: string) => {
    switch(type) {
      case "Cooling Centers":
        return <Thermometer className="h-5 w-5 text-blue-500" />;
      case "Shelters":
        return <Buildings className="h-5 w-5 text-green-500" />;
      case "Food Banks":
        return <ShoppingBag className="h-5 w-5 text-amber-500" />;
      default:
        return <Info className="h-5 w-5 text-slate-500" />;
    }
  };

  // Get label for resource type
  const getResourceTypeLabel = (type: string) => {
    return type || "Resource";
  };

  useEffect(() => {
    // Fetch data based on resource type
    const fetchResources = async () => {
      try {
        let url = '';
        if (resourceType === 'Food Banks') {
          url = `http://localhost:8000/api/v1/food-resources?zipcode=${zipCode}`;
        } else if (resourceType === 'Shelters') {
          url = `http://localhost:8000/api/v1/shelters?zipcode=${zipCode}`;
        } else if (resourceType === 'Cooling Centers') {
          url = `http://localhost:8000/api/v1/cooling-centers?zipcode=${zipCode}`; // This endpoint might need to be created
        }

        if (url) {
          const response = await fetch(url);
          const data = await response.json();

          // Enhance the data with additional fields needed for the UI
          const enhancedData = data.map((item: any) => ({
            ...item,
            // ensure location uses address when available
            location: item.address || item.location,
            // description fallback
            description: item.description ?? "No description available",
            type: resourceType,
            distance: Math.random() * 5,
            phone: "(512) 555-" + Math.floor(1000 + Math.random() * 9000),
            hours: "9:00 AM - 5:00 PM",
            status: Math.random() > 0.2 ? "open" : "closed",
            capacity: Math.floor(Math.random() * 100) + "% full",
            lastUpdated: Math.floor(Math.random() * 60) + " minutes ago",
            accessibility: {
              wheelchair: item.wheelchair_accessible || Math.random() > 0.3,
              visualAlerts: item.visual_accommodations || Math.random() > 0.5,
              audioAlerts: item.audio_accommodations || Math.random() > 0.5,
              assistiveStaff: Math.random() > 0.4
            },
            latitude: item.gps_coordinates?.latitude,
            longitude: item.gps_coordinates?.longitude,
          }));

          setResources(enhancedData);
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [resourceType]);

  return (
    <div className="flex flex-col h-screen">
      {/* Search Bar */}
      <div className="bg-white p-4 shadow-sm">
        <div className="container">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                className="pl-10 pr-4 py-2 w-full"
                placeholder={`Search for ${resourceType || "resources"}...`}
              />
              <Search className="absolute left-3 top-2 h-5 w-5 text-slate-400" />
            </div>
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Map Section */}
        <div className="flex-1 p-4">
          <div className="h-full">
            <MapPlaceholder loading={loading} resources={resources} />
          </div>
        </div>

        {/* List View */}
        <div className="w-full md:w-96 border-t md:border-t-0 md:border-l border-slate-200 bg-white">
          <Tabs defaultValue="list" className="h-full flex flex-col">
            <div className="border-b">
              <div className="p-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="list">
                    <List className="h-4 w-4 mr-2" />
                    List
                  </TabsTrigger>
                  <TabsTrigger value="details">
                    <Info className="h-4 w-4 mr-2" />
                    Details
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent value="list" className="flex-1 overflow-auto">
              <div className="p-4">
                <h2 className="text-lg font-medium mb-4">
                  {`${resourceType || "Resources"} in ZIP Code ${zipCode}`}
                </h2>

                {loading ? (
                  <div className="flex flex-col gap-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-4">
                          <div className="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
                          <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                          <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {resources.map((resource) => (
                      <Card
                        key={resource.id}
                        className={`cursor-pointer transition hover:shadow ${
                          selectedResource?.id === resource.id
                            ? "border-blue-500 shadow-md"
                            : ""
                        }`}
                        onClick={() => setSelectedResource(resource)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                              <div className="mt-1">
                                {getResourceIcon(resource.type)}
                              </div>
                              <div>
                                <h3 className="font-medium">
                                  {resource.name || "Unamed"}
                                </h3>
                                <p className="text-sm text-slate-500">
                                  {resource.location}
                                </p>
                                <p className="text-sm text-slate-500">
                                  lat: {resource.latitude}, long: {resource.longitude}
                                </p>
                                <div className="flex items-center gap-2 mt-2 text-sm">
                                  {resource.status && (
                                    <Badge
                                      variant={
                                        resource.status === "open"
                                          ? "default"
                                          : "destructive"
                                      }
                                      className="bg-green-100 text-green-800 hover:bg-green-100"
                                    >
                                      {resource.status === "open"
                                        ? "Open"
                                        : "Closed"}
                                    </Badge>
                                  )}
                                  {resource.distance && (
                                    <span className="text-slate-500">
                                      {resource.distance.toFixed(1)} mi
                                    </span>
                                  )}
                                  {resource.capacity && (
                                    <span className="text-slate-500">
                                      {resource.capacity}
                                    </span>
                                  )}
                                </div>
                                <div className="flex gap-2 mt-2">
                                  {resource.accessibility?.wheelchair && (
                                    <Wheelchair
                                      className="h-4 w-4 text-blue-600"
                                      aria-label="Wheelchair Accessible"
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-slate-400" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="details" className="overflow-auto p-4">
              {selectedResource ? (
                <ResourceDetails
                  resource={selectedResource}
                  getResourceIcon={getResourceIcon}
                  getResourceTypeLabel={getResourceTypeLabel}
                />
              ) : (
                <div className="text-center p-8 text-slate-500">
                  <Info className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-medium mb-2">
                    No Resource Selected
                  </h3>
                  <p>Select a resource from the list to view details</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
