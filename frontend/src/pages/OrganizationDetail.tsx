import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Edit } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

interface Volunteer {
  id: number;
  username: string;
  role: string;
}

interface Organization {
  id: number;
  name: string;
  volunteers: Volunteer[];
}

export default function OrganizationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const { accessToken } = useUserStore();

  useEffect(() => {
    const fetchOrganizationDetail = async () => {
      try {
        setLoading(true);
        // Use the configured axiosInstance that handles token automatically
        const response = await axiosInstance.get(`/api/v1/organizations/${id}`);
        console.log('Organization details response:', response.data);
        setOrganization(response.data);
      } catch (err: any) {
        console.error('Error fetching organization details:', err);
        setError(`Error: ${err.response?.data?.message || err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    if (id && accessToken) {
      fetchOrganizationDetail();
    } else if (!accessToken) {
      setError("Authentication required");
      setLoading(false);
    }
  }, [id, accessToken]);

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    try {
      // Use the configured axiosInstance
      await axiosInstance.delete(`/api/v1/organizations/${id}`);
      navigate('/organizations');
    } catch (err: any) {
      console.error('Error deleting organization:', err);
      setError(`Error: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2">
            <Link to="/organizations" className="text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-bold">Organization Details</h1>
          </div>
          <p className="text-gray-500">View and manage organization information</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-8">
        {loading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-800 rounded-md">
            {error}
          </div>
        ) : organization ? (
          <div className="space-y-6">
            {/* Organization Info Card */}
            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>{organization.name}</CardTitle>
                  <CardDescription>Organization #{organization.id}</CardDescription>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {deleteConfirm ? "Confirm Delete" : "Delete"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Organization Information</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between border-b pb-1">
                        <dt className="text-gray-500">ID</dt>
                        <dd>{organization.id}</dd>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <dt className="text-gray-500">Name</dt>
                        <dd>{organization.name}</dd>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <dt className="text-gray-500">Volunteer Count</dt>
                        <dd>{organization.volunteers?.length || 0}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Volunteers Card */}
            <Card>
              <CardHeader>
                <CardTitle>Volunteers</CardTitle>
                <CardDescription>Users assigned to this organization</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>List of volunteers in this organization</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organization.volunteers?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8">
                          No volunteers assigned to this organization
                        </TableCell>
                      </TableRow>
                    ) : (
                      organization.volunteers?.map((volunteer) => (
                        <TableRow key={volunteer.id}>
                          <TableCell>{volunteer.id}</TableCell>
                          <TableCell className="font-medium">{volunteer.username}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{volunteer.role}</Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md">
            Organization not found
          </div>
        )}
      </div>
    </div>
  );
}
