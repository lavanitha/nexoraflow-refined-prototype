# API Integration Layer

This directory contains the API integration layer for the NexoraFlow Dashboard, providing comprehensive API services, error handling, loading states, and user feedback.

## Files Overview

- `api.ts` - Main API service with axios configuration and service functions
- `README.md` - This documentation file

## Key Features

### 1. Axios Configuration with Interceptors
- Request interceptors for authentication and loading states
- Response interceptors for error handling and loading state management
- Enhanced error objects with user-friendly messages
- Request timeout and retry logic

### 2. Comprehensive API Services
- Dashboard API services
- Gemini AI advice services
- Side hustle discovery services
- AI resilience coaching services
- Achievement gamification services
- Adaptive learning services
- Community nexus services

### 3. Error Handling
- Centralized error handling with user-friendly messages
- Different error types (network, validation, authentication, etc.)
- Automatic error logging and debugging information
- Graceful fallback for failed requests

### 4. Loading States and User Feedback
- Global loading state management
- Custom events for loading state changes
- Toast notifications for success/error feedback
- Loading spinners and status indicators

### 5. Future Gemini AI Integration
- Placeholder functions for direct Gemini API integration
- Conversation history tracking (planned)
- Context-aware responses (planned)
- Structured integration points for easy migration

## Usage Examples

See the implementation in `IntelligentDashboardHomepage.tsx` for complete examples.