import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { MapPin, Phone, Clock } from "lucide-react";
import { Button } from "../../components/ui/button";

// Define types for the component props
interface Accessibility {
  wheelchair: boolean;
  visualAlerts: boolean;
  audioAlerts: boolean;
  assistiveStaff: boolean;
}

interface Resource {
  id: number;
  name: string;
  location?: string;
  address?: string;
  type?: string;
  phone?: string;
  hours?: string;
  status?: string;
  capacity?: string;
  lastUpdated?: string;
  accessibility?: Accessibility;
}

interface ResourceDetailsProps {
  resource: Resource;
  getResourceIcon: (type: string) => React.ReactNode;
  getResourceTypeLabel: (type: string) => string;
}

export default function ResourceDetails({ resource, getResourceIcon, getResourceTypeLabel }: ResourceDetailsProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {getResourceIcon(resource.type || '')}
        <h2 className="text-xl font-bold">{resource.name}</h2>
      </div>

      <Badge className="mb-4">{getResourceTypeLabel(resource.type || '')}</Badge>

      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Location & Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-500" />
              <span>{resource.location || resource.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-500" />
              <span>{resource.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-500" />
              <span>{resource.hours}</span>
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
              <Badge
                variant={resource.status === "open" ? "default" : "destructive"}
                className={resource.status === "open" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
              >
                {resource.status === "open" ? "Open" : "Closed"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Capacity:</span>
              <span>{resource.capacity}</span>
            </div>
            <div className="flex justify-between">
              <span>Last Updated:</span>
              <span>{resource.lastUpdated}</span>
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
                <input
                  type="checkbox"
                  checked={resource.accessibility?.wheelchair}
                  readOnly
                  className="h-4 w-4"
                />
                <span>Wheelchair Accessible</span>
              </li>
              <li className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={resource.accessibility?.visualAlerts}
                  readOnly
                  className="h-4 w-4"
                />
                <span>Visual Alerts</span>
              </li>
              <li className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={resource.accessibility?.audioAlerts}
                  readOnly
                  className="h-4 w-4"
                />
                <span>Audio Alerts</span>
              </li>
              <li className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={resource.accessibility?.assistiveStaff}
                  readOnly
                  className="h-4 w-4"
                />
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
  );
}
