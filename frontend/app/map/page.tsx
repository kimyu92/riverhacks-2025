"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
// lucid start
import { MapPin } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { Search } from "lucide-react";
import { Filter } from "lucide-react";
import { List } from "lucide-react";
import { Accessibility as Wheelchair } from "lucide-react";
import { Map } from "lucide-react";
import { Landmark as Buildings } from "lucide-react";
import { Thermometer } from "lucide-react";
import { Hospital } from "lucide-react";
import { Info } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { Phone } from "lucide-react";
import { Clock } from "lucide-react";
// lucid end
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

export default function MapPage() {
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<Array<{
    id: number;
    name: string;
    type: string;
    address: string;
    distance: number;
    phone: string;
    hours: string;
    accessibility: {
      wheelchair: boolean;
      visualAlerts: boolean;
      audioAlerts: boolean;
      assistiveStaff: boolean;
    };
    status: string;
    capacity: string;
    lastUpdated: string;
  }>>([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  // Dummy data - would be replaced with actual API call to Austin Open Data
  useEffect(() => {
    // Simulate loading data from API
    setTimeout(() => {
      setResources([
        {
          id: 1,
          name: "Downtown Cooling Center",
          type: "cooling",
          address: "500 E 4th St, Austin, TX 78701",
          distance: 0.8,
          phone: "(512) 555-1234",
          hours: "8:00 AM - 8:00 PM",
          accessibility: {
            wheelchair: true,
            visualAlerts: true,
            audioAlerts: true,
            assistiveStaff: true
          },
          status: "open",
          capacity: "62% full",
          lastUpdated: "10 minutes ago"
        },
        {
          id: 2,
          name: "Austin Recreation Emergency Shelter",
          type: "shelter",
          address: "1213 Shoal Creek Blvd, Austin, TX 78701",
          distance: 1.2,
          phone: "(512) 555-2345",
          hours: "24 hours during emergency",
          accessibility: {
            wheelchair: true,
            visualAlerts: false,
            audioAlerts: true,
            assistiveStaff: true
          },
          status: "open",
          capacity: "30% full",
          lastUpdated: "25 minutes ago"
        },
        {
          id: 3,
          name: "St. David's Medical Center",
          type: "hospital",
          address: "919 E 32nd St, Austin, TX 78705",
          distance: 2.1,
          phone: "(512) 555-3456",
          hours: "24 hours",
          accessibility: {
            wheelchair: true,
            visualAlerts: true,
            audioAlerts: true,
            assistiveStaff: true
          },
          status: "open",
          capacity: "85% full",
          lastUpdated: "5 minutes ago"
        },
        {
          id: 4,
          name: "Highland Community Evacuation Center",
          type: "evacuation",
          address: "6909 Burnet Rd, Austin, TX 78757",
          distance: 4.5,
          phone: "(512) 555-4567",
          hours: "24 hours during evacuation events",
          accessibility: {
            wheelchair: true,
            visualAlerts: true,
            audioAlerts: false,
            assistiveStaff: false
          },
          status: "open",
          capacity: "15% full",
          lastUpdated: "40 minutes ago"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // This would be replaced with actual Mapbox integration
  const MapPlaceholder = () => (
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

  // Resource type icon mapping
  const getResourceIcon = (type) => {
    switch(type) {
      case "cooling":
        return <Thermometer className="h-5 w-5 text-blue-500" />;
      case "shelter":
        return <Buildings className="h-5 w-5 text-green-500" />;
      case "hospital":
        return <Hospital className="h-5 w-5 text-red-500" />;
      case "evacuation":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <Info className="h-5 w-5 text-slate-500" />;
    }
  };

  const getResourceTypeLabel = (type) => {
    switch(type) {
      case "cooling":
        return "Cooling Center";
      case "shelter":
        return "Emergency Shelter";
      case "hospital":
        return "Medical Center";
      case "evacuation":
        return "Evacuation Center";
      default:
        return "Resource";
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Search and Filter Bar */}
      <div className="bg-white p-4 shadow-sm">
        <div className="container">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input 
                className="pl-10 pr-4 py-2 w-full" 
                placeholder="Search for resources..."
              />
              <Search className="absolute left-3 top-2 h-5 w-5 text-slate-400" />
            </div>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Filter Resources</DrawerTitle>
                    <DrawerDescription>
                      Find resources that match your specific needs
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 pb-0">
                    <div className="space-y-4">
                      <div>
                        <h4 className="mb-2 font-medium">Resource Type</h4>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Checkbox id="shelter" defaultChecked />
                            <label htmlFor="shelter" className="ml-2">Shelters</label>
                          </div>
                          <div className="flex items-center">
                            <Checkbox id="cooling" defaultChecked />
                            <label htmlFor="cooling" className="ml-2">Cooling Centers</label>
                          </div>
                          <div className="flex items-center">
                            <Checkbox id="hospital" defaultChecked />
                            <label htmlFor="hospital" className="ml-2">Hospitals</label>
                          </div>
                          <div className="flex items-center">
                            <Checkbox id="evacuation" defaultChecked />
                            <label htmlFor="evacuation" className="ml-2">Evacuation Centers</label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-2 font-medium">Accessibility Needs</h4>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Checkbox id="wheelchair" defaultChecked />
                            <label htmlFor="wheelchair" className="ml-2">Wheelchair Access</label>
                          </div>
                          <div className="flex items-center">
                            <Checkbox id="visual" />
                            <label htmlFor="visual" className="ml-2">Visual Alerts</label>
                          </div>
                          <div className="flex items-center">
                            <Checkbox id="audio" />
                            <label htmlFor="audio" className="ml-2">Audio Alerts</label>
                          </div>
                          <div className="flex items-center">
                            <Checkbox id="assistive" />
                            <label htmlFor="assistive" className="ml-2">Assistive Staff</label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-2 font-medium">Distance</h4>
                        <Select defaultValue="5">
                          <SelectTrigger>
                            <SelectValue placeholder="Select distance" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Within 1 mile</SelectItem>
                            <SelectItem value="5">Within 5 miles</SelectItem>
                            <SelectItem value="10">Within 10 miles</SelectItem>
                            <SelectItem value="25">Within 25 miles</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DrawerFooter>
                    <Button>Apply Filters</Button>
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Map Section - Would be replaced with actual Mapbox integration */}
        <div className="flex-1 p-4">
          <div className="h-full">
            <MapPlaceholder />
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
                <h2 className="text-lg font-medium mb-4">Nearby Resources</h2>
                
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
                        className={`cursor-pointer transition hover:shadow ${selectedResource?.id === resource.id ? 'border-blue-500 shadow-md' : ''}`}
                        onClick={() => setSelectedResource(resource)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                              <div className="mt-1">
                                {getResourceIcon(resource.type)}
                              </div>
                              <div>
                                <h3 className="font-medium">{resource.name}</h3>
                                <p className="text-sm text-slate-500">{resource.address}</p>
                                <div className="flex items-center gap-2 mt-2 text-sm">
                                  <Badge variant={resource.status === "open" ? "success" : "destructive"} className="bg-green-100 text-green-800 hover:bg-green-100">
                                    {resource.status === "open" ? "Open" : "Closed"}
                                  </Badge>
                                  <span className="text-slate-500">{resource.distance} mi</span>
                                  <span className="text-slate-500">{resource.capacity}</span>
                                </div>
                                <div className="flex gap-2 mt-2">
                                  {resource.accessibility.wheelchair && 
                                    <Wheelchair className="h-4 w-4 text-blue-600" title="Wheelchair Accessible" />
                                  }
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
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    {getResourceIcon(selectedResource.type)}
                    <h2 className="text-xl font-bold">{selectedResource.name}</h2>
                  </div>

                  <Badge className="mb-4">
                    {getResourceTypeLabel(selectedResource.type)}
                  </Badge>

                  <Card className="mb-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Location & Contact</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-500" />
                          <span>{selectedResource.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-slate-500" />
                          <span>{selectedResource.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-500" />
                          <span>{selectedResource.hours}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="mb-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <Badge variant={selectedResource.status === "open" ? "success" : "destructive"} className="bg-green-100 text-green-800 hover:bg-green-100">
                            {selectedResource.status === "open" ? "Open" : "Closed"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Capacity:</span>
                          <span>{selectedResource.capacity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Updated:</span>
                          <span>{selectedResource.lastUpdated}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Accessibility Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <Checkbox checked={selectedResource.accessibility.wheelchair} disabled />
                            <span>Wheelchair Accessible</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Checkbox checked={selectedResource.accessibility.visualAlerts} disabled />
                            <span>Visual Alerts</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Checkbox checked={selectedResource.accessibility.audioAlerts} disabled />
                            <span>Audio Alerts</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Checkbox checked={selectedResource.accessibility.assistiveStaff} disabled />
                            <span>Assistive Staff Available</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Get Directions</Button>
                    </CardFooter>
                  </Card>
                </div>
              ) : (
                <div className="text-center p-8 text-slate-500">
                  <Info className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-medium mb-2">No Resource Selected</h3>
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