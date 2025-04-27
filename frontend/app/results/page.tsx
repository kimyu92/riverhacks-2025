'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface FoodResource {
  id: number;
  location: string;
  name: string;
  organization_id: number;
  source: string;
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
}

export default function Results() {
  const searchParams = useSearchParams();
  const resourceType = searchParams.get('resourceType');
  const zipCode = searchParams.get('zipCode');

  const [resources, setResources] = useState<FoodResource[] | ShelterResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data based on resource type
    const fetchResources = async () => {
      try {
        let url = '';
        if (resourceType === 'Food Banks') {
          url = `http://localhost:8000/api/v1/food-resources`;
        } else if (resourceType === 'Shelters') {
          url = `http://localhost:8000/api/v1/shelters`;
        }
        console.log
        if (url) {
          const response = await fetch(url);
          const data = await response.json();
          setResources(data);
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
    <div className="min-h-screen bg-slate-50">
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold mb-4">
            {`Results for ${resourceType} in ZIP Code ${zipCode}`}
          </h2>
          <p className="mb-8">
            Below is a list of {resourceType?.toLowerCase()} available in the area.
          </p>

          {loading ? (
            <p>Loading resources...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <div key={resource.id} className="p-4 border rounded-lg shadow">
                  <h3 className="font-bold">{resource.name}</h3>
                  <p>Address: {resource.location}</p>
                  <p>Source: {resource.source}</p>
                  {resourceType === 'Shelters' && (
                    <>
                      <p>Wheelchair Accessible: {resource.wheelchair_accessible ? 'Yes' : 'No'}</p>
                      <p>Audio Accommodations: {resource.audio_accommodations ? 'Yes' : 'No'}</p>
                      <p>Visual Accommodations: {resource.visual_accommodations ? 'Yes' : 'No'}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}