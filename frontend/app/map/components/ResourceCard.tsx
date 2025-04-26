import { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

interface Resource {
    id: number;
    name: string;
    address: string;
    status: "open" | "closed";
    capacity: string;
    distance: string;
    type: string;
}

interface ResourceCardProps {
    resource: Resource;
    selectedResource: Resource | null;
    onSelect: (resource: Resource) => void;
    getResourceIcon: (type: string) => JSX.Element;
}

const ResourceCard: FC<ResourceCardProps> = ({ resource, selectedResource, onSelect, getResourceIcon }) => (
    <Card
        className={`cursor-pointer transition hover:shadow ${
            selectedResource?.id === resource.id ? "border-blue-500 shadow-md" : ""
        }`}
        onClick={() => onSelect(resource)}
    >
        <CardContent className="p-4">
            <div className="flex justify-between items-start">
                <div className="flex gap-3">
                    <div className="mt-1">{getResourceIcon(resource.type)}</div>
                    <div>
                        <h3 className="font-medium">{resource.name}</h3>
                        <p className="text-sm text-slate-500">{resource.address}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm">
                            <Badge
                                variant={resource.status === "open" ? "success" : "destructive"}
                                className="bg-green-100 text-green-800 hover:bg-green-100"
                            >
                                {resource.status === "open" ? "Open" : "Closed"}
                            </Badge>
                            <span className="text-slate-500">{resource.distance} mi</span>
                            <span className="text-slate-500">{resource.capacity}</span>
                        </div>
                    </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
            </div>
        </CardContent>
    </Card>
);

export default ResourceCard;