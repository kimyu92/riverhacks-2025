'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button";

const ResourceDetails = ({ resource, getResourceIcon, getResourceTypeLabel }) => (
    <div>
        <div className="flex items-center gap-2 mb-4">
            {getResourceIcon(resource.type)}
            <h2 className="text-xl font-bold">{resource.name}</h2>
        </div>

        <Badge className="mb-4">{getResourceTypeLabel(resource.type)}</Badge>

        <Card className="mb-4">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Location & Contact</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-sm space-y-2">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        <span>{resource.address}</span>
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
                            variant={resource.status === "open" ? "success" : "destructive"}
                            className="bg-green-100 text-green-800 hover:bg-green-100"
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
                            <Checkbox checked={resource.accessibility.wheelchair} disabled />
                            <span>Wheelchair Accessible</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Checkbox checked={resource.accessibility.visualAlerts} disabled />
                            <span>Visual Alerts</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Checkbox checked={resource.accessibility.audioAlerts} disabled />
                            <span>Audio Alerts</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Checkbox checked={resource.accessibility.assistiveStaff} disabled />
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

export default ResourceDetails;