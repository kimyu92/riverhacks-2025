# ToSafeToBee :two: :green_heart: :two: :bee: - ATX

## 🚀 Description
ToSafeToBee is a unified platform designed to connect people in need — especially the homeless — with NGOs, shelters, food banks, healthcare services, and local support organizations around them.


### Key Features

- **User Contributions**: Anyone can add shelters, food offerings, or services they know about.
- **Zipcode-based Discovery**: Enter your area and see resources mapped close to you.
- **Scalable Platform**: Easily extendable to new cities and states.
- **NGO Partnership Portal (Coming Soon)**: NGOs can register and manage their resources directly.
- **Future AI Integration**: Use WebAI to match people with personalized help (planned).

## 🛠️ Tech Stack

- **Frontend**: React, Next.js and ShadCN
- **Backend**: Python Flask RESTful API
- **Database**: PostgreSQL
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

### Authentication Example

Most endpoints require authentication. First, obtain a JWT token:

```bash
curl -X POST http://localhost:8000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

**Response:**
```json
{
  "access_token": "<access_token>",
  "user": {
    "id": 1,
    "organization_id": null,
    "role": "admin",
    "username": "admin"
  }
}
```

Then use the token in subsequent requests:

```bash
curl -X GET http://localhost:8000/api/v1/shelters \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### User Authentication
- `POST /api/v1/register` - Register a new user
- `POST /api/v1/login` - Login and receive JWT token

### Organizations
- `GET /api/v1/organizations` - List all organizations
- `POST /api/v1/organizations` - Create a new organization (admin only)

### Volunteers
- `POST /api/v1/volunteers` - Register a new volunteer (admin only)

### Shelters
- `GET /api/v1/shelters` - List all shelters
- `POST /api/v1/shelters` - Add a new shelter (admin/volunteer)
- `GET /api/v1/shelters/<id>` - Get details for a specific shelter
- `PUT /api/v1/shelters/<id>` - Update shelter information (admin/volunteer)
- `DELETE /api/v1/shelters/<id>` - Remove a shelter (admin only)

### Food Resources
- `GET /api/v1/food-resources` - List all food resources
- `POST /api/v1/food-resources` - Add a new food resource (admin/volunteer)
- `GET /api/v1/food-resources/<id>` - Get details for a specific food resource
- `PUT /api/v1/food-resources/<id>` - Update food resource information (admin/volunteer)
- `DELETE /api/v1/food-resources/<id>` - Remove a food resource (admin only)

### Safety Reports
- `GET /api/v1/safety-reports` - List all safety reports with optional filters
- `POST /api/v1/safety-reports` - Submit a new safety report (authentication optional)
- `GET /api/v1/safety-reports/<id>` - Get details for a specific safety report
- `PUT /api/v1/safety-reports/<id>` - Update a safety report (admin or original reporter)
- `DELETE /api/v1/safety-reports/<id>` - Remove a safety report (admin only)

### Hospitals
- `GET /api/v1/hospitals` - List all hospitals with optional filters
- `POST /api/v1/hospitals` - Add a new hospital (admin only)
- `GET /api/v1/hospitals/<id>` - Get details for a specific hospital
- `PUT /api/v1/hospitals/<id>` - Update hospital information (admin only)
- `DELETE /api/v1/hospitals/<id>` - Remove a hospital (admin only)

### Chatbot
- `POST /api/v1/chatbot` - Get answers to safety questions from the local AI chatbot
- `GET /api/v1/chatbot/topics` - Get available topics that the chatbot can answer

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
