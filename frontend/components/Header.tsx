'use client';

import Link from "next/link";
import Image from "next/image";
import { Menu, MapPin, Map, Info, LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/stores/useUserStore";

interface HeaderProps {
  isOffline: boolean;
  setIsOffline: (value: boolean) => void;
}

export default function Header({ isOffline, setIsOffline }: HeaderProps) {
  const { isAuthenticated, logout } = useUserStore();

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="container flex items-center justify-between p-4">
        <Link href="/">
          <div className="flex items-center gap-2">
            <div className="h-10 flex items-center">
              <Image
                src="/logo_with_text.png"
                alt="ToSafeToBee Logo"
                width={180}
                height={80}
                style={{ height: "80px", width: "auto" }}
              />
            </div>
          </div>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                ToSafeToBee Emergency Resources
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="offline-mode"
                  checked={isOffline}
                  onCheckedChange={setIsOffline}
                />
                <Label htmlFor="offline-mode">
                  Offline Mode {isOffline ? "(Enabled)" : ""}
                </Label>
              </div>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md"
                  >
                    <MapPin className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/map"
                    className="flex items-center gap-2 p-2 bg-blue-50 text-blue-700 rounded-md"
                  >
                    <Map className="h-5 w-5" />
                    <span>Map View</span>
                  </Link>
                </li>
                {isAuthenticated && (
                  <li>
                    <Link
                      href="/chat"
                      className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md"
                    >
                      <MapPin className="h-5 w-5" />
                      <span>Emergency Assistant</span>
                    </Link>
                  </li>
                )}
                {isAuthenticated ? (
                  <li>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md"
                    >
                      <User className="h-5 w-5" />
                      <span>Profile & Settings</span>
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link
                      href="/login"
                      className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md"
                    >
                      <LogIn className="h-5 w-5" />
                      <span>Login</span>
                    </Link>
                  </li>
                )}
                {isAuthenticated && (
                  <li>
                    <button
                      onClick={logout}
                      className="w-full text-left flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md text-red-600"
                    >
                      <LogIn className="h-5 w-5 rotate-180" />
                      <span>Logout</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
