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
git clone git@github.com:kimyu92/riverhacks-2025.git
cd riverhacks-2025
```

2. Start the application with Docker Compose:
```bash
# Start all services in detached mode
make start

# Alternative: Start with logs visible
make start-logs
```

3. Set up the database:
```bash
# Reset and seed the database (recommended for first-time setup)
make db-reset

# Or just seed the database if it's already set up
make db-seed
```

This will populate the database with organizations, users, shelters, hospitals, food resources, and safety reports for testing.

4. Access the application:
- API: http://localhost:8000
- Frontend: http://localhost:3000

### Common Command Scenarios

```bash
# View logs from all running services
make logs

# View logs for a specific service
make logs-service service=backend

# Access the PostgreSQL database CLI
make db

# Reset database completely (useful when schema changes)
make db-reset

# Stop all services without removing containers
make stop

# Stop and remove all containers
make down

# Access backend container shell (for debugging)
make backend-shell

# Access frontend container shell
make frontend-shell

# Install frontend dependencies
make frontend-install

# Run frontend development server separately
make frontend-dev
```

### Development Setup

To set up the development environment:

1. Backend setup:
```bash
cd backend
pip install -r requirements.txt
```

2. Frontend setup:
```bash
cd frontend
pnpm install
pnpm run dev
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
