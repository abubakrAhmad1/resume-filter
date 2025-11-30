# Resume Filter Application

A professional React application for filtering resumes based on job descriptions. Upload multiple PDF resumes and match them against job requirements using AI-powered filtering.

## 🚀 Features

- **Multiple File Upload**: Upload and manage multiple PDF resumes simultaneously
- **PDF Validation**: Automatic validation to ensure only PDF files are accepted
- **Job Description Input**: Enter detailed job descriptions for filtering
- **Real-time Filtering**: Send resumes and job descriptions to backend API for processing
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Visual feedback during API operations
- **Responsive Design**: Modern, elegant UI with black, gold, and silver theme
- **Smooth Animations**: Professional slide animations between sections

## 🛠️ Tech Stack

- **React 19** - Latest React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Hot Toast** - Toast notifications
- **Vitest** - Testing framework
- **React Testing Library** - Component testing utilities

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd resume-filter/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Button/          # Reusable button component
│   │   ├── ErrorBoundary/   # Error boundary component
│   │   ├── FileItem/        # File item display
│   │   ├── FileList/        # File list component
│   │   ├── JobDescription/  # Job description input
│   │   ├── ResumeUpload/    # File upload component
│   │   └── ResumeUploadSection/ # Upload section wrapper
│   ├── config/              # Configuration files
│   │   ├── api.js          # API configuration
│   │   └── env.js          # Environment validation
│   ├── constants/           # Application constants
│   │   └── index.js        # Error messages, configs
│   ├── hooks/              # Custom React hooks
│   │   └── useFileUpload.js # File upload hook
│   ├── services/           # API services
│   │   └── api.js          # API calls
│   ├── test/               # Test setup
│   │   └── setup.js        # Test configuration
│   ├── utils/              # Utility functions
│   │   ├── fileValidation.js # PDF validation
│   │   └── logger.js       # Logging utility
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── public/                 # Static assets
├── package.json
└── README.md
```

## 🧪 Testing

The project uses Vitest and React Testing Library for testing.

Run tests:
```bash
npm run test
```

Run tests with UI:
```bash
npm run test:ui
```

Generate coverage report:
```bash
npm run test:coverage
```

## 🎨 Design

The application features a professional black, gold, and silver color scheme:
- **Black**: Primary background and dark elements
- **Gold**: Primary actions, highlights, and accents
- **Silver**: Secondary elements, borders, and text

## 🔒 Error Handling

- **Error Boundary**: Catches React component errors
- **API Error Handling**: Comprehensive error handling for API calls
- **Validation**: Client-side validation for file types and inputs
- **User Feedback**: Toast notifications for errors and success messages

## 📦 Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

University Graduate Portfolio Project

---

**Note**: This is a professional portfolio project demonstrating modern React development practices, including component architecture, error handling, testing, and production-ready code structure.
