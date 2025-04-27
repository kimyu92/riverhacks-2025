import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle, User, Eye } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import axiosInstance from "../lib/axios";

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
  const { accessToken, isAuthenticated, getToken } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated || !accessToken) {
      navigate('/login');
      return;
    }
    
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Debug: log the token being used for the request
        console.log('Fetching organizations with token:', getToken());
        
        // Use the configured axiosInstance that handles token automatically
        const response = await axiosInstance.get('/api/v1/organizations');
        console.log('Organizations response:', response.data);
        setOrganizations(response.data);
      } catch (err: any) {
        console.error('Error fetching organizations:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
        const errorDetails = JSON.stringify(err.response?.data || {});
        
        setError(`Error: ${errorMessage} (${errorDetails})`);
        
        // Handle specific error cases
        if (err.response?.status === 401) {
          setError(`Authentication failed (401): ${errorMessage}. Please log in again.`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, [accessToken, isAuthenticated, navigate, getToken]);

  if (!isAuthenticated || !accessToken) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Authentication Required</h2>
          <p className="mt-2">Please log in to access this page</p>
          <Button 
            onClick={() => navigate('/login')}
            className="mt-4"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

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
            {/* Debug information */}
            <div className="bg-gray-100 p-2 mb-4 text-xs overflow-hidden">
              <p>Token Available: {accessToken ? 'Yes' : 'No'}</p>
              <p>Auth State: {isAuthenticated ? 'Authenticated' : 'Not authenticated'}</p>
            </div>
            
            {loading ? (
              <div className="flex justify-center my-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 text-red-800 rounded-md">
                <p className="font-semibold">Error loading organizations:</p>
                <p className="mt-1">{error}</p>
                <div className="mt-4 flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setError(null);
                      setLoading(true);
                      axiosInstance.get('/api/v1/organizations')
                        .then(response => {
                          setOrganizations(response.data);
                          setLoading(false);
                        })
                        .catch(err => {
                          setError(`Error: ${err.response?.data?.message || err.message}`);
                          setLoading(false);
                        });
                    }}
                  >
                    Retry
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigate('/login');
                    }}
                  >
                    Go to Login
                  </Button>
                </div>
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
