// app/chat/page.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    AlertCircle,
    Menu,
    Send,
    Wifi,
    WifiOff,
    User,
    Bot,
    MessageCircle,
    HelpCircle,
    BookOpen,
    Info,
    MapPin,
    Map as MapIcon
} from "lucide-react";

export default function EmergencyAssistantPage() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: "system",
            content: "Hello! I'm your Emergency Assistant. I can help with information about shelters, evacuation routes, and safety procedures. How can I assist you today?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState("");
    const [isOffline, setIsOffline] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Pre-defined emergency questions for quick access
    const quickQuestions = [
        "Where is the nearest shelter?",
        "Is there flooding in my area?",
        "What should I bring to an evacuation center?",
        "How do I prepare for a power outage?",
        "Are there cooling centers near me?",
        "What accessibility features are available at emergency shelters?"
    ];

    // Emergency guides/information
    const emergencyGuides = [
        {
            id: "flooding",
            title: "Flood Safety",
            content: "• Move to higher ground immediately if flooding occurs\n• Never walk or drive through flood waters\n• Stay away from power lines and electrical wires\n• Prepare an emergency kit with essential items\n• Listen to local alerts and warnings"
        },
        {
            id: "heatwave",
            title: "Heat Emergency",
            content: "• Stay in air-conditioned buildings when possible\n• Drink plenty of fluids, even if you don't feel thirsty\n• Wear lightweight, light-colored clothing\n• Take cool showers or baths\n• Check on vulnerable friends, family and neighbors"
        },
        {
            id: "evacuation",
            title: "Evacuation Guidelines",
            content: "• Follow recommended evacuation routes\n• Take emergency supply kit with you\n• Secure your home before leaving\n• Take pets with you if possible\n• Check in with family and emergency contact"
        },
        {
            id: "poweroutage",
            title: "Power Outage",
            content: "• Keep refrigerator and freezer doors closed\n• Use flashlights instead of candles\n• Turn off/disconnect appliances and electronics\n• Keep phone charged and limit use\n• Have battery-powered radio available"
        }
    ];

    // Scroll to bottom of chat when new messages are added
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Handle sending a new message
    const handleSendMessage = async (e) => {
        e?.preventDefault();

        if (!input.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            role: "user",
            content: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse = generateResponse(input);
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                role: "system",
                content: aiResponse,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            setIsTyping(false);
        }, 1000);
    };

    // Handle clicking a quick question
    const handleQuickQuestion = (question) => {
        setInput(question);
        handleSendMessage();
    };

    // Simple response generation (would be replaced with actual webAI implementation)
    const generateResponse = (question) => {
        const lowerQuestion = question.toLowerCase();

        if (lowerQuestion.includes("nearest shelter") || lowerQuestion.includes("closest shelter")) {
            return "Based on your current location, the nearest shelter is Austin Recreation Emergency Shelter (1.2 miles away) at 1213 Shoal Creek Blvd. It has wheelchair access and is currently at 30% capacity.";
        }
        else if (lowerQuestion.includes("flooding")) {
            return "There are currently no flooding alerts in central Austin. However, areas near Shoal Creek and Waller Creek are under observation. Check our map for real-time updates or sign up for emergency alerts.";
        }
        else if (lowerQuestion.includes("bring") && lowerQuestion.includes("evacuation")) {
            return "When evacuating to a shelter, bring: ID and important documents, medications, phone and charger, change of clothes, personal hygiene items, comfort items (especially for children), and any special needs items. Don't forget masks and hand sanitizer.";
        }
        else if (lowerQuestion.includes("power outage")) {
            return "To prepare for a power outage: charge all devices, keep portable chargers ready, have flashlights and batteries available, stock non-perishable food and water, and make sure you have any necessary medical supplies. Consider downloading offline maps and emergency guides.";
        }
        else if (lowerQuestion.includes("cooling") || lowerQuestion.includes("heat")) {
            return "There are 3 cooling centers within 5 miles of your location. The closest is Downtown Cooling Center (0.8 miles away) at 500 E 4th St. It's open until 8:00 PM today and has full accessibility features.";
        }
        else if (lowerQuestion.includes("accessibility") || lowerQuestion.includes("wheelchair")) {
            return "All city-designated emergency shelters have wheelchair accessibility. Many also have assistive listening devices, visual alerts, and trained staff. The Austin Recreation Emergency Shelter and Downtown Cooling Center have the most comprehensive accessibility features.";
        }
        else {
            return "I can help you find information about emergency shelters, evacuation routes, safety procedures, and local resources. Please ask a specific question, or check our emergency guides for detailed information.";
        }
    };

    return (
        <div className="flex flex-col h-screen">
            {/* Main Content */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Chat Section */}
                <div className="flex-1 flex flex-col">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
                        <div className="max-w-3xl mx-auto">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex mb-4 ${
                                        message.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                                >
                                    {message.role === "system" && (
                                        <div className="flex-shrink-0 mr-2">
                                            <div className="bg-blue-500 rounded-full p-2 flex items-center justify-center">
                                                <Bot className="h-5 w-5 text-white" />
                                            </div>
                                        </div>
                                    )}
                                    <div
                                        className={`rounded-lg px-4 py-2 max-w-[80%] break-words relative ${
                                            message.role === "user"
                                                ? "bg-blue-600 text-white"
                                                : "bg-white text-slate-800 shadow-sm"
                                        }`}
                                    >
                                        <div className="mb-1">{message.content}</div>
                                        <div
                                            className={`text-xs ${
                                                message.role === "user" ? "text-blue-200" : "text-slate-400"
                                            } text-right`}
                                        >
                                            {message.timestamp}
                                        </div>
                                    </div>
                                    {message.role === "user" && (
                                        <div className="flex-shrink-0 ml-2">
                                            <div className="bg-slate-700 rounded-full p-2 flex items-center justify-center">
                                                <User className="h-5 w-5 text-white" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex mb-4 justify-start">
                                    <div className="flex-shrink-0 mr-2">
                                        <div className="bg-blue-500 rounded-full p-2 flex items-center justify-center">
                                            <Bot className="h-5 w-5 text-white" />
                                        </div>
                                    </div>
                                    <div className="rounded-lg px-4 py-3 max-w-[80%] bg-white text-slate-800 shadow-sm">
                                        <div className="flex space-x-1">
                                            <div className="h-2 w-2 bg-slate-300 rounded-full animate-bounce"></div>
                                            <div className="h-2 w-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="h-2 w-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Quick Questions */}
                    <div className="bg-white border-t border-slate-200 p-4">
                        <div className="max-w-3xl mx-auto">
                            <div className="mb-2">
                                <h3 className="text-sm font-medium text-slate-500">Ask a quick question:</h3>
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {quickQuestions.map((question, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        className="whitespace-nowrap text-sm"
                                        onClick={() => handleQuickQuestion(question)}
                                    >
                                        {question}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Chat Input */}
                    <div className="bg-white border-t border-slate-200 p-4">
                        <div className="max-w-3xl mx-auto">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <Input
                                    placeholder={isOffline ? "Ask anything (Offline Mode)" : "Ask about emergency resources and safety..."}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="submit" disabled={!input.trim()}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                            <div className="text-xs text-slate-500 mt-2">
                                {isOffline ? (
                                    <div className="flex items-center gap-1">
                                        <WifiOff className="h-3 w-3" />
                                        <span>Using local AI model - No internet required</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1">
                                        <Wifi className="h-3 w-3" />
                                        <span>Using real-time city data and emergency information</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Panel (Hidden on Mobile) */}
                <div className="hidden md:block w-80 border-l border-slate-200 bg-white overflow-y-auto">
                    <Tabs defaultValue="guides">
                        <div className="border-b">
                            <div className="p-4">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="guides">
                                        <BookOpen className="h-4 w-4 mr-2" />
                                        Guides
                                    </TabsTrigger>
                                    <TabsTrigger value="help">
                                        <HelpCircle className="h-4 w-4 mr-2" />
                                        Help
                                    </TabsTrigger>
                                </TabsList>
                            </div>
                        </div>

                        <TabsContent value="guides" className="p-4 space-y-4">
                            <h3 className="font-medium text-lg">Emergency Guides</h3>
                            <p className="text-sm text-slate-500 mb-4">
                                Quick reference guides available offline
                            </p>

                            {emergencyGuides.map((guide) => (
                                <Card key={guide.id} className="mb-4">
                                    <CardContent className="p-4">
                                        <h4 className="font-medium mb-2">{guide.title}</h4>
                                        <div className="text-sm whitespace-pre-line">
                                            {guide.content}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>

                        <TabsContent value="help" className="p-4 space-y-4">
                            <h3 className="font-medium text-lg">Using the Assistant</h3>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <h4 className="font-medium mb-1">What can this assistant do?</h4>
                                    <p className="text-slate-600">
                                        The Emergency Assistant can provide information about shelter locations,
                                        accessibility features, evacuation routes, and safety procedures.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-1">Offline Mode</h4>
                                    <p className="text-slate-600">
                                        When offline, the assistant uses a local AI model to provide emergency information
                                        without requiring internet connectivity. Toggle offline mode from the menu.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-1">Emergency Contacts</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Emergency:</span>
                                            <span className="font-medium">911</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Austin Non-Emergency:</span>
                                            <span className="font-medium">311</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Flood Reporting:</span>
                                            <span className="font-medium">(512) 974-2000</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Power Outage:</span>
                                            <span className="font-medium">(512) 322-9100</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Button variant="outline" className="w-full">
                                        <Link href="/map" className="flex items-center justify-center gap-2">
                                            <MapIcon className="h-4 w-4" />
                                            <span>View Emergency Map</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}