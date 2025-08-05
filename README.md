# Intelligent Tutor API

A Node.js/Express API that powers an intelligent tutoring system using OpenAI's GPT-4o model. This API provides chat functionality, user management, and test administration for educational purposes.

## 🚀 Features

- **AI-Powered Chat**: Integration with OpenAI GPT-4o for intelligent tutoring conversations
- **User Management**: User registration, authentication, and session management
- **Test Administration**: Pre-test and post-test functionality for educational assessment
- **SQLite Database**: Lightweight database for storing chat history and user data
- **CORS Support**: Cross-origin resource sharing enabled for frontend integration
- **Environment Configuration**: Secure configuration management with dotenv

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chatbot-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3000
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:3000` with hot reload enabled.

### Production Mode
```bash
npm start
```

## 📚 API Endpoints

### Chat Endpoints
- `POST /chat` - Send a message to the AI tutor
- `GET /chat/:userId` - Get chat history for a user

### User Endpoints
- `POST /user` - Create a new user
- `GET /user/:id` - Get user information

### Test Endpoints
- `POST /test` - Submit test answers
- `GET /test/:userId` - Get test results for a user

## 🗄️ Database

The application uses SQLite for data persistence. The database file is automatically created on first run and stored in the project root.

### Database Schema
- **Users**: User information and authentication data
- **Chat History**: Conversation logs between users and the AI tutor
- **Test Results**: Pre-test and post-test scores and responses

## 🐳 Docker Deployment

### Using Docker Compose
```bash
docker-compose up -d
```

### Manual Docker Build
```bash
docker build -t chatbot-api .
docker run -p 3000:3000 -e OPENAI_API_KEY=your_key chatbot-api
```

## 🔧 Configuration

### Environment Variables
- `OPENAI_API_KEY` (required): Your OpenAI API key
- `PORT` (optional): Server port (default: 3000)
- `GUARD_MESSAGE_FILENAME` (optional): System message file name

### CORS Configuration
The API is configured to accept requests from any origin. In production, you should restrict this to your frontend domain.

## 📁 Project Structure

```
src/
├── config/
│   └── env.ts              # Environment configuration
├── controllers/
│   ├── chat.controller.ts  # Chat logic
│   ├── test.controller.ts  # Test management
│   └── user.controller.ts  # User management
├── models/                 # Data models
├── routes/
│   ├── chat.route.ts       # Chat endpoints
│   ├── test.route.ts       # Test endpoints
│   └── user.route.ts       # User endpoints
├── services/
│   ├── history.service.ts  # Chat history management
│   ├── openai.service.ts   # OpenAI integration
│   ├── test.service.ts     # Test processing
│   └── user.service.ts     # User operations
├── types/
│   ├── chat.types.ts       # Chat-related types
│   └── database.types.ts   # Database types
├── utils/
│   ├── db.ts              # Database utilities
│   └── validator.ts       # Input validation
└── index.ts               # Application entry point
```

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 📝 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the TypeScript project
- `npm start` - Start production server
- `npm test` - Run test suite

## 🔒 Security Considerations

- Store your OpenAI API key securely in environment variables
- Implement proper authentication and authorization in production
- Validate all user inputs
- Consider rate limiting for API endpoints
- Use HTTPS in production environments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team. 