import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import axiosInstance from "../lib/axios"; // Import our configured axios instance

import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";

export default function OrganizationNew() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { accessToken } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Organization name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Use the configured axiosInstance that handles token automatically
      const response = await axiosInstance.post('/api/v1/organizations', { name });
      console.log('Organization creation response:', response.data);
      navigate(`/organizations/${response.data.organization.id}`);
    } catch (err: any) {
      console.error('Error creating organization:', err);
      setError(`Error: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
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
            <h1 className="text-2xl font-bold">New Organization</h1>
          </div>
          <p className="text-gray-500">Create a new organization in the system</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
            <CardDescription>Enter information about the new organization</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 text-red-800 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  Organization Name *
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter organization name"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/organizations")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !name.trim()}
                >
                  {isSubmitting ? "Creating..." : "Create Organization"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
