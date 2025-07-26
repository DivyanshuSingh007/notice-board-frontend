# Notice Board Frontend

A modern React-based frontend for the Notice Board application with user authentication and notice management.

## Features

- 🔐 User authentication (login/register)
- 📝 Create, read, update, and delete notices
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design
- 🔄 Real-time updates
- 🖼️ Image slider with custom titles

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Backend**: FastAPI (deployed on Railway)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=https://web-production-9bb32.up.railway.app
```

## Deployment

This project is configured for deployment on Vercel, Netlify, and other platforms.

### Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Manual Deployment

1. Build the project: `npm run build`
2. Upload `dist` folder to your hosting provider

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── AddNoticeForm.jsx
│   ├── ImageSlider.jsx
│   ├── LoginForm.jsx
│   ├── NoticeCard.jsx
│   └── RegisterForm.jsx
├── pages/              # Page components
│   ├── Login.jsx
│   ├── Notices.jsx
│   └── Register.jsx
├── api.js              # API configuration
├── App.jsx             # Main app component
└── main.jsx            # Entry point
```

## API Endpoints

The frontend connects to a FastAPI backend with the following endpoints:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /notices` - Get all notices
- `POST /notices` - Create new notice
- `PUT /notices/{id}` - Update notice
- `DELETE /notices/{id}` - Delete notice

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.
