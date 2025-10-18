# Dokzly

Dokzly is an intelligent document management and vector storage application that leverages OpenAI's capabilities to provide semantic search and chat functionality with your documents.

## 🚀 Features

- **Vector Storage Management**: Create and manage vector stores for your documents
- **Document Upload**: Upload and process documents into vector embeddings
- **Intelligent Chat**: Chat with your documents using OpenAI's GPT models
- **File Search**: Semantic search through your document collections
- **Real-time Streaming**: Get real-time responses from the AI chat interface
- **Modern UI**: Clean, responsive interface built with Next.js and Material-UI

## 🏗️ Architecture

This application consists of two main components:

- **API (Backend)**: NestJS-based REST API with OpenAI integration
- **Web (Frontend)**: Next.js React application with Material-UI components

## 📋 Prerequisites

Before running this application, make sure you have:

- [Docker](https://www.docker.com/get-started) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed
- OpenAI API key (get one from [OpenAI Platform](https://platform.openai.com/))

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd dokzly
```

### 2. Environment Configuration

Create a `.env` file in the root directory or set your OpenAI API key in the docker-compose.yml:

```bash
# Option 1: Create .env file
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
```

Or edit the `docker-compose.yml` file directly:

```yaml
environment:
  - OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Build and Run with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### 4. Access the Application

Once the containers are running:

- **Web Application**: http://localhost:3001
- **API Documentation**: http://localhost:3000
- **API Health Check**: http://localhost:3000/api/health

## 🐳 Docker Services

The application runs two main services:

### API Service (`api-dev`)
- **Port**: 3000
- **Technology**: NestJS with TypeScript
- **Features**: OpenAI integration, vector storage management, file processing
- **Environment Variables**:
  - `NODE_ENV=development`
  - `OPENAI_API_KEY` (required)
  - `PORT=3000`

### Web Service (`web-dev`)
- **Port**: 3001
- **Technology**: Next.js with React and Material-UI
- **Features**: Document management interface, chat functionality
- **Environment Variables**:
  - `NODE_ENV=development`
  - `NEXT_PUBLIC_API_URL=http://api-dev:3000/api/v1/`
  - `API_URL=http://api-dev:3000/`
  - `PORT=3001`

## 📖 Usage

1. **Create Vector Store**: Navigate to the vector storage page and create a new vector store
2. **Upload Documents**: Upload your documents to the vector store for processing
3. **Chat with Documents**: Use the chat interface to ask questions about your uploaded documents
4. **Search Documents**: Perform semantic searches across your document collections

## 🔧 Development

### Running Individual Services

If you want to run services individually for development:

```bash
# API only
docker-compose up api-dev

# Web only (requires API to be running)
docker-compose up web-dev
```

### Logs

View logs from services:

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs api-dev
docker-compose logs web-dev

# Follow logs in real-time
docker-compose logs -f
```

### Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 🛠️ Technology Stack

### Backend (API)
- **Framework**: NestJS
- **Language**: TypeScript
- **AI Integration**: OpenAI API
- **Architecture**: Modular with controllers, services, and DTOs

### Frontend (Web)
- **Framework**: Next.js 15
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: Zustand
- **HTTP Client**: Axios

## 📁 Project Structure

```
dokzly/
├── api/                          # NestJS Backend API
│   ├── src/
│   │   ├── openai/              # OpenAI integration modules
│   │   │   └── file-vectors/    # Vector storage & chat functionality
│   │   └── main.ts              # Application entry point
│   ├── Dockerfile               # API container configuration
│   └── package.json             # API dependencies
├── web/                         # Next.js Frontend
│   ├── app/                     # Next.js app directory
│   │   ├── vector-storage/      # Vector management pages
│   │   └── api/                 # API route handlers
│   ├── components/              # Reusable React components  
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # API service layer
│   ├── Dockerfile               # Web container configuration
│   └── package.json             # Web dependencies
└── docker-compose.yml           # Multi-container orchestration
```

## 🔒 Security Notes

- Keep your OpenAI API key secure and never commit it to version control
- The application runs in development mode by default
- For production deployment, ensure proper environment variable management and security configurations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the UNLICENSED license.

## 🆘 Troubleshooting

### Common Issues

1. **OpenAI API Key Error**: Ensure your API key is properly set in the environment variables
2. **Port Conflicts**: Make sure ports 3000 and 3001 are available on your system
3. **Container Build Issues**: Try rebuilding with `docker-compose up --build --no-cache`

### Getting Help

If you encounter issues:
1. Check the application logs: `docker-compose logs`
2. Verify your OpenAI API key is valid and has sufficient credits
3. Ensure Docker and Docker Compose are properly installed and running

---

Built with ❤️ using NestJS, Next.js, and OpenAI