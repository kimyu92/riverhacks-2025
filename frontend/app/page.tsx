// pages/index.js
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, AlertCircle, MessageSquare, Bell, Menu, Search, Accessibility, Server } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      test
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-600 to-blue-800 text-white py-12 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Find Safe & Accessible Emergency Resources</h2>
          <p className="text-lg mb-8">
            Quickly locate wheelchair accessible evacuation centers, cooling stations, and more around Austin
          </p>

          <div className="relative mb-8">
            <Input
              className="pl-10 pr-4 py-6 rounded-full text-slate-800 shadow-lg"
              placeholder="Search for resources near you..."
            />
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Badge className="bg-white text-blue-800 hover:bg-blue-50 px-3 py-1">Shelters</Badge>
            <Badge className="bg-white text-blue-800 hover:bg-blue-50 px-3 py-1">Cooling Centers</Badge>
            <Badge className="bg-white text-blue-800 hover:bg-blue-50 px-3 py-1">Hospitals</Badge>
            <Badge className="bg-white text-blue-800 hover:bg-blue-50 px-3 py-1">Evacuation Routes</Badge>
          </div>

          <Button className="bg-red-500 hover:bg-red-600 text-white font-bold py-6 px-8 rounded-full shadow-lg">
            Find Nearby Resources
          </Button>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-center mb-8">Emergency Preparedness at Your Fingertips</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="bg-blue-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Accessibility className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Accessibility Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Find facilities with wheelchair access, audio/visual alerts, and other accessibility features.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-green-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Smart Chatbot</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Get answers about public safety resources even without internet using our local AI assistant.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-amber-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Bell className="h-6 w-6 text-amber-600" />
                </div>
                <CardTitle>Emergency Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Receive push notifications about emergency events and updates in your area.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="bg-slate-100 py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold mb-4">Community-Powered Safety</h2>
          <p className="mb-8">Help make Austin safer by flagging accessibility issues or reporting unsafe conditions.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-slate-800 hover:bg-slate-900">
              <MapPin className="mr-2 h-4 w-4" />
              Report an Issue
            </Button>
            <Button variant="outline">
              View Community Reports
            </Button>
          </div>
        </div>
      </section>

      {/* Offline Access */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              <div className="bg-blue-50 p-6 rounded-xl mb-4">
                <Server className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Works Offline</h3>
                <p className="text-slate-700">
                  Access critical information even without internet connection. Our app uses local AI to provide
                  emergency guidance when you need it most.
                </p>
              </div>
              <Button className="w-full">
                Enable Offline Mode
              </Button>
            </div>

            <div className="w-full md:w-1/2 p-4 border border-slate-200 rounded-xl bg-slate-50">
              <h3 className="font-bold mb-2">Ask SafeAccessATX:</h3>
              <div className="mb-4 p-3 bg-white rounded-lg shadow-sm">
                "Where's the nearest wheelchair accessible shelter?"
              </div>
              <div className="p-3 bg-blue-100 rounded-lg text-slate-800">
                <p className="text-sm">
                  I found 3 wheelchair accessible shelters within 2 miles of your location.
                  The closest is Austin Recreation Center (0.8 miles) with ramp access and accessible restrooms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-red-500 to-red-600 text-white py-12 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold mb-4">Be Prepared Before Emergencies Strike</h2>
          <p className="mb-8">
            Download SafeAccessATX today to ensure you have access to critical resources
            when you need them most.
          </p>
          <Button className="bg-white text-red-600 hover:bg-slate-100 font-bold py-6 px-8 rounded-full shadow-lg">
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <h2 className="text-xl font-bold">SafeAccessATX</h2>
              </div>
              <p className="text-slate-400 max-w-md">
                Helping Austin residents find accessible, safe, and emergency-ready locations
                using real-time city data and local AI.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-slate-400 hover:text-white">Emergency Map</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white">Accessibility Guide</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white">Offline Resources</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white">Community Reports</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-4">About</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-slate-400 hover:text-white">Our Mission</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white">Contact Us</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white">City Partnership</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-500">
            <p>&copy; 2025 SafeAccessATX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}