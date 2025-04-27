import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { MapPin, Info, Calendar, Bell, LogOut, Building, Users } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  // Fix: Access each store value with individual selectors to prevent infinite loops
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const logout = useUserStore((state) => state.logout);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
    }

    // Remove the auto-redirect for admin users
    // Let them stay on the dashboard and provide links instead
  }, [isAuthenticated, navigate]);

  // Show loading state while checking authentication
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Manage your emergency resources and preferences</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-bold">Hi, {user?.username}</h2>
                <Badge className="mt-2">{user?.role}</Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b">
                  <span className="text-sm text-gray-500">User ID</span>
                  <span>{user?.id}</span>
                </div>
                {user?.organization_id && (
                  <div className="flex items-center justify-between pb-2 border-b">
                    <span className="text-sm text-gray-500">Organization</span>
                    <span>ID: {user.organization_id}</span>
                  </div>
                )}
              </div>

              <Button onClick={handleLogout} className="mt-6 w-full flex justify-center items-center" variant="outline">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </CardContent>
          </Card>

          {/* Main Dashboard Area */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            {/* Welcome Card */}
            <Card>
              <CardHeader>
                <CardTitle>Welcome to SafeAccessATX</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Your access to emergency resources in Austin, TX.</p>
                {user?.role === 'admin' && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-700">Admin Access</h3>
                    <p className="text-sm text-blue-600">You have admin privileges to manage resources and users.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Admin Management Section */}
            {user?.role === 'admin' && (
              <Card>
                <CardHeader>
                  <CardTitle>Administration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link to="/organizations" className="w-full">
                      <Button
                        variant="outline"
                        className="h-24 flex flex-col w-full"
                      >
                        <Building className="h-6 w-6 mb-2" />
                        <span>Manage Organizations</span>
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col"
                    >
                      <Users className="h-6 w-6 mb-2" />
                      <span>Manage Users</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-24 flex flex-col">
                <MapPin className="h-6 w-6 mb-2" />
                <span>Find Resources</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col">
                <Info className="h-6 w-6 mb-2" />
                <span>My Reports</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col">
                <Calendar className="h-6 w-6 mb-2" />
                <span>Events</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col">
                <Bell className="h-6 w-6 mb-2" />
                <span>Alerts</span>
              </Button>
            </div>

            {/* Favorites/Recent Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <p>Your recently viewed resources will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
