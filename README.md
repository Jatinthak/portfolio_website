# Portfolio Website
## Description
A professional online portfolio to showcase skills and projects, built with a React frontend and utilizing Supabase for authentication.

## Tech Stack
* Frontend: React
* Backend: None (API endpoints handled by Supabase)
* Database: None (handled by Supabase)
* Auth: Supabase
* Payments: None
* Realtime: False

## Architecture Overview
```
                      +---------------+
                      |  React Frontend  |
                      +---------------+
                             |
                             |
                             v
                      +---------------+
                      |  Supabase API  |
                      |  (Authentication)|
                      +---------------+
                             |
                             |
                             v
                      +---------------+
                      |  Supabase Database|
                      +---------------+
```

## API Endpoints
The following API endpoints are available:
### GET /api/projects
Retrieve a list of projects
* Request Body: None
* Response: `{ projects: [{ id: string, name: string, description: string }] }`

### GET /api/projects/:id
Retrieve a single project by id
* Request Body: None
* Response: `{ project: { id: string, name: string, description: string } }`

### POST /api/auth/login
Login to the application
* Request Body: `{ email: string, password: string }`
* Response: `{ token: string }`

### POST /api/auth/signup
Signup for the application
* Request Body: `{ email: string, password: string }`
* Response: `{ token: string }`

## ENV Variables
The following environment variables are required:
* `SUPABASE_URL`: The URL of the Supabase instance
* `SUPABASE_KEY`: The key for the Supabase instance
* `JWT_SECRET`: The secret key for JSON Web Tokens

## Local Setup Instructions
To set up the project locally, follow these steps:
1. Clone the repository
2. Create a `.env` file in the root directory with the required environment variables
3. Run `docker-compose up` to start the containers
4. Access the frontend at `http://localhost:3000`

## Deploy Instructions
To deploy the project, follow these steps:
1. Create a Supabase instance and obtain the URL and key
2. Create a JSON Web Token secret key
3. Set the environment variables in the deployment environment
4. Deploy the frontend to a hosting platform (e.g. Vercel, Netlify)
5. Configure the deployment environment to use the Supabase instance and JSON Web Token secret key

## File Structure
The project is organized into the following directories:
* `src/backend`: Backend code (not used in this project)
* `src/frontend`: Frontend code (React application)
* `src/tests`: Test code (backend and frontend tests)
* `migrations`: Database migration scripts (not used in this project)
* `docker`: Docker configuration files
* `github`: GitHub workflow configuration files
* `README.md`: This file
* `package.json`: Project dependencies and scripts
* `.gitignore`: Files to be ignored by version control
* `.env.example`: Example environment variables file