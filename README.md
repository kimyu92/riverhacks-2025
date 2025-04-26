# ToSafeToBee :two: :green_heart: :two: :bee: - ATX

## 🚀 Description

ToSafeToBee is an innovative mobile-first web application designed to enhance public safety, accessibility, and community engagement in Austin, especially during emergencies. The platform provides real-time information about critical resources, accessible emergency locations, and community-reported safety issues.

Our mission is to ensure that all Austin residents, including those with disabilities, can quickly access vital information during emergencies and contribute to community safety through a collaborative platform.

### Key Features

- **Real-time Resource Locator**: Interactive map displaying emergency locations (shelters, hospitals, cooling stations)
- **Accessibility Filtering**: Find resources filtered by wheelchair accessibility and visual/audio accommodations
- **Smart Local Chatbot**: AI-powered assistance that works offline for emergency preparedness information
- **Community Engagement**: Report safety issues, accessibility barriers, and share available resources
- **Configurable Alerts**: Customizable notifications for local emergencies based on proximity

## 🛠️ Tech Stack

- **Frontend**: React, Next.js and ShadCN
- **Backend**: Python Flask RESTful API
- **Database**: PostgreSQL
- **AI Integration**: Local LLM (Ollama) with webAI
- **Deployment**: Docker containerization

## 🚀 Setup Instructions

### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop/) and [Docker Compose](https://docs.docker.com/compose/)
- Git

### Quick Start

1. Clone the repository:
```bash
git clone git@github.com:kimyu92/riverhacks-2025.gi
cd riverhacks-2025
```

2. Start the application with Docker Compose:
```bash
docker compose up
```

This will start:
- PostgreSQL database on port 5432
- Backend Flask API on port 5000
- Frontend development server (when uncommented in compose.yml)

3. Seed the database with sample data:
```bash
# Option 1: Using Docker (recommended)
docker compose exec backend python -m db.seed

# Option 2: Running directly (if you have local environment set up)
cd backend
python -m db.seed
```

This will populate the database with organizations, users, shelters, hospitals, food resources, and safety reports for testing.

4. Access the application:
- API: http://localhost:5000
- Frontend: http://localhost:5173 (when frontend service is enabled)

### Development Setup

To set up the development environment:

1. Backend setup:
```bash
cd backend
pip install -r requirements.txt
```

2. Frontend setup (when implemented):
```bash
cd app
pnpm install
```

## 📡 API Endpoints

### User Authentication
- `POST /register` - Register a new user
- `POST /login` - Login and receive JWT token

### Organizations
- `GET /organizations` - List all organizations
- `POST /organizations` - Create a new organization (admin only)

### Volunteers
- `POST /volunteers` - Register a new volunteer (admin only)

### Shelters
- `GET /shelters` - List all shelters
- `POST /shelters` - Add a new shelter (admin/volunteer)
- `GET /shelters/<id>` - Get details for a specific shelter
- `PUT /shelters/<id>` - Update shelter information (admin/volunteer)
- `DELETE /shelters/<id>` - Remove a shelter (admin only)

### Food Resources
- `GET /foods` - List all food resources
- `POST /foods` - Add a new food resource (admin/volunteer)
- `GET /foods/<id>` - Get details for a specific food resource
- `PUT /foods/<id>` - Update food resource information (admin/volunteer)
- `DELETE /foods/<id>` - Remove a food resource (admin only)

## 🔮 Future Enhancements

- Heatmaps showing high-frequency accessibility/safety issues
- Crowdsourced verification of resources
- Integration with SerpAPI for real-time news and public safety updates
- Hospital and medical resource mapping
- Offline data synchronization
- Push notifications for emergency alerts

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
