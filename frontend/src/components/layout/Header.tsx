import { Link } from "react-router-dom";
import { Menu, MapPin, Map, Info, LogIn, User, Building } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { useUserStore } from "../../stores/useUserStore";

interface HeaderProps {
  isOffline: boolean;
  setIsOffline: (value: boolean) => void;
}

export default function Header({ isOffline, setIsOffline }: HeaderProps) {
  const { user, isAuthenticated, logout } = useUserStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdmin = isAuthenticated && user?.role === "admin";

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm w-full">
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/">
          <div className="flex items-center gap-2">
            <div className="h-10 flex items-center">
              <img
                src="/logo_with_text.png"
                alt="ToSafeToBee Logo"
                style={{ height: "80px", width: "auto" }}
              />
            </div>
          </div>
        </Link>
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-4 z-20">
              <div className="mb-4">
                <h3 className="text-lg font-medium">Menu</h3>
                <p className="text-sm text-gray-500">ToSafeToBee Emergency Resources</p>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="offline-mode"
                    checked={isOffline}
                    onChange={(e) => setIsOffline(e.target.checked)}
                    className="rounded text-blue-500"
                  />
                  <label htmlFor="offline-mode" className="text-sm">
                    Offline Mode {isOffline ? "(Enabled)" : ""}
                  </label>
                </div>

                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/"
                      className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <MapPin className="h-5 w-5" />
                      <span>Home</span>
                    </Link>
                  </li>

                  {isAuthenticated && (
                    <li>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="h-5 w-5" />
                        <span>Dashboard</span>
                      </Link>
                    </li>
                  )}

                  {isAdmin && (
                    <li>
                      <Link
                        to="/organizations"
                        className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Building className="h-5 w-5" />
                        <span>Organizations</span>
                      </Link>
                    </li>
                  )}

                  {isAuthenticated && (
                    <li>
                      <Link
                        to="/chat"
                        className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <MapPin className="h-5 w-5" />
                        <span>Emergency Assistant</span>
                      </Link>
                    </li>
                  )}

                  {isAuthenticated ? (
                    <li>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="h-5 w-5" />
                        <span>Profile & Settings</span>
                      </Link>
                    </li>
                  ) : (
                    <li>
                      <Link
                        to="/login"
                        className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <LogIn className="h-5 w-5" />
                        <span>Login</span>
                      </Link>
                    </li>
                  )}

                  {isAuthenticated && (
                    <li>
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md text-red-600"
                      >
                        <LogIn className="h-5 w-5 rotate-180" />
                        <span>Logout</span>
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
