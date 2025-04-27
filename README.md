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

# Remove Docker images to force rebuild (useful when dependencies change)
make remove-images

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
# public
curl -X GET http://localhost:8000/api/v1/shelters

# authed protected
curl -X POST http://localhost:8000/api/v1/shelters \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Emergency Relief Center",
    "address": "123 Oak Street, Austin, TX 78701",
    "wheelchair_accessible": true,
    "visual_accommodations": false,
    "audio_accommodations": true
  }'
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
  - **Query Parameters**:
    - `zipcode` (optional): Filter shelters by zipcode area (required for SERP API results)
    - `source` (optional): Data source to query - 'db', 'serp', or 'all' (default is 'all')
    - `wheelchair` (optional): Filter shelters by wheelchair accessibility
    - `visual` (optional): Filter shelters by visual accommodations
    - `audio` (optional): Filter shelters by audio accommodations
  - **Response**: Array of shelter objects
    ```json
    [
      {
        "id": 1,                  // Only present for database resources
        "name": "Downtown Emergency Shelter", // Database/SERP field
        "address": "123 Main St, Austin, TX", // Database field
        "organization_id": 2,     // Database field
        "wheelchair_accessible": true, // Database field
        "visual_accommodations": true, // Database field
        "audio_accommodations": false, // Database field
        "title": "Downtown Emergency Shelter", //  API field
        "phone": "512-555-1234", // SERP API field (optional)
        "website": "https://shelter.org", // SERP API field (optional)
        "description": "Description of services", // SERP API field (optional)
        "place_id": "123456789", // SERP API unique identifier
        "rating": 4.5, // SERP API rating (optional)
        "reviews": 50, // SERP API review count (optional)
        "directions": "https://maps.google.com/...", // SERP API directions (optional)
        "gps_coordinates": { // Optional
          "latitude": 30.2672,
          "longitude": -97.7431
        },
        "source": "database" // Indicates whether from 'database' or 'serp'
      }
    ]
    ```
- `POST /api/v1/shelters` - Add a new shelter (admin/volunteer)
  - **Request Body**:
    ```json
    {
      "name": "Central Emergency Shelter",
      "address": "Austin, TX",
      "organization_id": 1,     // Optional, defaults to user's organization
      "wheelchair_accessible": true, // Optional
      "visual_accommodations": false, // Optional
      "audio_accommodations": true, // Optional
      "title": "Central Emergency Shelter", // Optional
      "phone": "512-555-6789", // Optional
      "website": "https://shelter.org", // Optional
      "description": "Open 24/7 with 50 beds", // Optional
      "place_id": "place123456", // Optional
      "rating": 4.7, // Optional
      "reviews": 32, // Optional
      "directions": "https://maps.google.com/...", // Optional
      "gps_coordinates": { // Optional
        "latitude": 30.2672,
        "longitude": -97.7431
      }
      // Alternatively, can provide latitude and longitude as separate fields
    }
    ```
  - **Response**: Created shelter object with 201 status code
    ```json
    {
      "id": 3,
      "name": "Central Emergency Shelter",
      "address": "Austin, TX",
      "organization_id": 1,
      "wheelchair_accessible": true,
      "visual_accommodations": false,
      "audio_accommodations": true,
      // Additional fields if provided
    }
    ```
- `GET /api/v1/shelters/<id>` - Get details for a specific shelter
  - **Response**: Shelter object with 200 status code (same format as POST response)

- `PUT /api/v1/shelters/<id>` - Update shelter information (admin/volunteer)
  - **Request Body**: Same format as POST but only include fields that need to be updated
  - **Response**: Updated shelter object with 200 status code

- `DELETE /api/v1/shelters/<id>` - Remove a shelter (admin only)
  - **Response**: Confirmation message with 200 status code
    ```json
    {
      "message": "Shelter deleted successfully"
    }
    ```

### Food Resources
- `GET /api/v1/food-resources` - List all food resources
  - **Query Parameters**:
    - `zipcode` (optional): Filter food resources by zipcode area (required for SERP API results)
    - `source` (optional): Data source to query - 'db', 'serp', or 'all' (default is 'all')
  - **Response**: Array of food resource objects
    ```json
    [
      {
        "id": 1,                  // Only present for database resources
        "name": "Food Bank Name", // Database field
        "address": "Austin, TX", // Database or SERP field
        "organization_id": 2,     // Database field
        "title": "Food Bank Name", // SERP API field
        "phone": "512-555-1234", // SERP API field (optional)
        "website": "https://foodbank.org", // SERP API field (optional)
        "description": "Description of services", // SERP API field (optional)
        "place_id": "123456789", // SERP API unique identifier
        "rating": 4.5, // SERP API rating (optional)
        "reviews": 50, // SERP API review count (optional)
        "directions": "https://maps.google.com/...", // SERP API directions (optional)
        "gps_coordinates": { // Optional
          "latitude": 30.2672,
          "longitude": -97.7431
        },
        "source": "database" // Indicates whether from 'database' or 'serp'
      }
    ]
    ```
- `POST /api/v1/food-resources` - Add a new food resource (admin/volunteer)
  - **Request Body**:
    ```json
    {
      "name": "Central Food Pantry",
      "address": "Austin, TX",
      "organization_id": 1,     // Optional, defaults to user's organization
      "title": "Central Food Pantry", // Optional
      "address": "456 Main St, Austin, TX", // Optional
      "phone": "512-555-6789", // Optional
      "website": "https://foodpantry.org", // Optional
      "description": "Free groceries every Tuesday", // Optional
      "place_id": "place123456", // Optional
      "rating": 4.7, // Optional
      "reviews": 32, // Optional
      "directions": "https://maps.google.com/...", // Optional
      "gps_coordinates": { // Optional
        "latitude": 30.2672,
        "longitude": -97.7431
      }
      // Alternatively, can provide latitude and longitude as separate fields
    }
    ```
  - **Response**: Created food resource object with 201 status code
    ```json
    {
      "id": 3,
      "name": "Central Food Pantry",
      "address": "Austin, TX",
      "organization_id": 1,
      // Additional fields if provided
    }
    ```
- `GET /api/v1/food-resources/<id>` - Get details for a specific food resource
  - **Response**: Food resource object with 200 status code (same format as POST response)

- `PUT /api/v1/food-resources/<id>` - Update food resource information (admin/volunteer)
  - **Request Body**: Same format as POST but only include fields that need to be updated
  - **Response**: Updated food resource object with 200 status code

- `DELETE /api/v1/food-resources/<id>` - Remove a food resource (admin only)
  - **Response**: Confirmation message with 200 status code
    ```json
    {
      "message": "Food resource deleted successfully"
    }
    ```

### Cooling Stations
- `GET /api/v1/cooling-stations` - List all cooling stations
  - Query Parameters:
    - `zipcode` (optional): Filter by ZIP code for SERP API results
    - `source` (optional): Data source to query – `db`, `serp`, or `all` (default: `all`)
  - Response: Array of cooling station objects, for example:
    ```json
    [
      {
        "id": 1,
        "name": "Downtown Cooling Center",
        "location": "123 Main St, Austin, TX",
        "organization_id": 2,
        "title": "Downtown Cooling Center",
        "phone": "512-555-1234",
        "website": "https://coolingcenter.org",
        "description": "Provides relief during heat waves",
        "place_id": "place123",
        "rating": 4.2,
        "reviews": 48,
        "directions": "https://maps.google.com/...",
        "gps_coordinates": { "latitude": 30.2672, "longitude": -97.7431 },
        "source": "database"
      }
    ]
    ```
- `POST /api/v1/cooling-stations` – Add a new cooling station (admin/volunteer)
  - **Request Body**:
    ```json
    {
      "name": "Central Cooling Station",
      "location": "456 Elm St, Austin, TX",
      "organization_id": 1,            // Optional, defaults to user's org
      "title": "Central Cooling Station",
      "address": "456 Elm St, Austin, TX",
      "phone": "512-555-6789",
      "website": "https://cooling.org",
      "description": "Open during summer heat",
      "place_id": "place456",
      "rating": 4.7,
      "reviews": 32,
      "directions": "https://maps.google.com/...",
      "gps_coordinates": { "latitude": 30.2672, "longitude": -97.7431 }
      // Or use separate "latitude" and "longitude" fields
    }
    ```
  - **Response**: Created cooling station object (HTTP 201)
- `GET /api/v1/cooling-stations/<id>` – Get details for a specific cooling station
- `PUT /api/v1/cooling-stations/<id>` – Update cooling station (admin/volunteer)
  - **Request Body**: Same as POST, include only fields to change
- `DELETE /api/v1/cooling-stations/<id>` – Remove a cooling station (admin only)
  - **Response**: Confirmation message

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

## Troubleshooting

### Docker Image Reset Scenarios

If you encounter any of these issues, you may need to reset your Docker images using `make remove-images`:

- Backend or frontend dependencies have changed (package.json or requirements.txt updated)
- Docker containers are not reflecting your latest code changes
- You're experiencing unusual errors after pulling new changes
- Docker container builds are failing with cached layer issues

Reset process:

```bash
# Stop all running containers
make down

# Remove Docker images to force a complete rebuild
make remove-images

# Start services again (this will rebuild the images)
make start
```

### Common Issues

#### Database Connection Errors
```
# Reset the database completely
make db-reset
```

#### Frontend Not Loading Correctly
```
# Access frontend container
make frontend-shell

# Install or update dependencies
pnpm install

# Exit shell and restart
exit
make frontend-start
```

#### Backend API Not Working
```
# View backend logs
make logs-service service=backend

# Access backend shell for debugging
make backend-shell
```

#### Docker Container Won't Start
```
# Check running containers
make ps

# Remove containers and volumes
docker compose down -v

# Start clean
make start
```
