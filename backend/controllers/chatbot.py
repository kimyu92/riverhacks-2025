from flask import Blueprint, jsonify, request
import json
import os
import re
from pathlib import Path

chatbot_bp = Blueprint("chatbot", __name__)

# This simulates a simple local AI that doesn't require internet access
# In a real implementation, you would use a lightweight pre-trained model
# that can run locally on the device

# Load safety FAQ data from a JSON file
def load_faq_data():
    # In production, this would load from a file
    # For now, hardcode some sample FAQs
    return {
        "faqs": [
            {
                "question": "What should I do in case of a flood?",
                "answer": "Stay on higher ground. Avoid walking or driving through flood waters. If told to evacuate, do so immediately."
            },
            {
                "question": "How do I prepare for a hurricane?",
                "answer": "Create an emergency kit with food, water, medicine. Board up windows, secure outdoor items, and follow evacuation orders."
            },
            {
                "question": "What are signs of heat stroke?",
                "answer": "High body temperature, altered mental state, nausea, flushed skin, rapid breathing, and headache. Seek medical help immediately."
            },
            {
                "question": "Where can I find wheelchair accessible shelters?",
                "answer": "Use the app's shelter search feature and enable the 'wheelchair accessible' filter to find appropriate shelters near you."
            },
            {
                "question": "How can I report a safety hazard?",
                "answer": "Use the app's 'Report Hazard' feature. Provide the location, description, and photos if possible."
            },
            {
                "question": "What should be in my emergency kit?",
                "answer": "Include water (1 gallon per person per day), non-perishable food, medications, first aid supplies, flashlight, radio, batteries, and important documents."
            }
        ]
    }

# Simple keyword matching function
def get_answer_for_question(question, faq_data):
    question = question.lower()
    best_match = None
    highest_score = 0

    for faq in faq_data["faqs"]:
        # Calculate a simple matching score based on keywords
        faq_text = faq["question"].lower()
        score = 0

        # Split into words and check for matches
        words = re.findall(r'\b\w+\b', question)
        for word in words:
            if len(word) > 3 and word in faq_text:  # Ignore short words
                score += 1

        # Check for key phrases
        key_phrases = ["what should", "how do", "where can", "when to", "is it"]
        for phrase in key_phrases:
            if phrase in question and phrase in faq_text:
                score += 2

        if score > highest_score:
            highest_score = score
            best_match = faq

    # If no good match found or score too low
    if not best_match or highest_score < 2:
        return {
            "answer": "I don't have enough information about that. Please try asking about flood safety, hurricane preparation, heat stroke, wheelchair accessibility, or emergency kits."
        }

    return {
        "answer": best_match["answer"]
    }

@chatbot_bp.route("/chatbot", methods=["POST"])
def chat():
    """Endpoint for the local AI chatbot to answer safety questions"""
    data = request.get_json()
    question = data.get("question", "")

    if not question:
        return jsonify({"error": "No question provided"}), 400

    faq_data = load_faq_data()
    response = get_answer_for_question(question, faq_data)

    return jsonify(response), 200

@chatbot_bp.route("/chatbot/topics", methods=["GET"])
def get_topics():
    """Get available topics that the chatbot can answer questions about"""
    faq_data = load_faq_data()

    # Extract topics from the questions
    topics = []
    for faq in faq_data["faqs"]:
        # Extract main topic from question
        question = faq["question"].lower()
        if "flood" in question:
            topics.append("Flood Safety")
        elif "hurricane" in question:
            topics.append("Hurricane Preparation")
        elif "heat" in question:
            topics.append("Heat-Related Emergencies")
        elif "wheelchair" in question or "accessible" in question:
            topics.append("Accessibility")
        elif "emergency kit" in question:
            topics.append("Emergency Preparation")
        elif "report" in question or "hazard" in question:
            topics.append("Hazard Reporting")

    # Remove duplicates
    topics = list(set(topics))

    return jsonify({"topics": topics}), 200
