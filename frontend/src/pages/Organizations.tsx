import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, User, Eye } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import axiosInstance from "../lib/axios"; // Import our configured axios instance

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

interface Organization {
  id: number;
  name: string;
  volunteers?: any[];
}

export default function Organizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useUserStore();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        // Use the configured axiosInstance that handles token automatically
        const response = await axiosInstance.get('/api/v1/organizations');
        console.log('Organizations response:', response.data);
        setOrganizations(response.data);
      } catch (err: any) {
        console.error('Error fetching organizations:', err);
        setError(`Error: ${err.response?.data?.message || err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchOrganizations();
    } else {
      setError("Authentication required");
      setLoading(false);
    }
  }, [accessToken]);

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">Organizations Management</h1>
          <p className="text-gray-500">Manage organizations and their volunteers</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Organizations</CardTitle>
            <Link to="/organizations/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Organization
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center my-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 text-red-800 rounded-md">
                {error}
              </div>
            ) : (
              <Table>
                <TableCaption>List of all organizations in the system</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Volunteers</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organizations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        No organizations found. Create your first organization!
                      </TableCell>
                    </TableRow>
                  ) : (
                    organizations.map((org) => (
                      <TableRow key={org.id}>
                        <TableCell>{org.id}</TableCell>
                        <TableCell className="font-medium">{org.name}</TableCell>
                        <TableCell>
                          {org.volunteers ? (
                            <span className="inline-flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {org.volunteers.length}
                            </span>
                          ) : (
                            "Loading..."
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Link to={`/organizations/${org.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
