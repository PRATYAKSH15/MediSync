# 📖 MediSync – Intelligent Medical Symptom Assistant

MediSync is a **full-stack healthcare assistant** that helps users:
* 🧠 **Analyze symptoms** using PubMed medical research
* 👨‍⚕️ **Map symptoms to doctors** via AI triage
* 🏥 **Find nearby hospitals/doctors** using Google Maps
* 📊 **Provide summarized treatment/prevention info**

Built with **React, TailwindCSS, ShadCN UI, Express, MongoDB, LangChain, and OpenAI**.

## 🚀 Features

* ✅ Symptom input with location detection (frontend)
* ✅ PubMed API integration to fetch research papers
* ✅ AI-powered summary of **causes, prevention, and treatments**
* ✅ Automatic doctor specialty recommendation (AI triage)
* ✅ Google Maps API for nearby hospitals/doctors
* ✅ MongoDB Atlas Vector Search for semantic search
* ✅ Clean, modern frontend with **React + Tailwind + ShadCN**

## 📂 Project Structure

```
MediSync/
├── client/               # React Frontend
│   ├── src/
│   │   ├── pages/        # SymptomInput, ResultsPage, etc.
│   │   ├── components/   # UI components
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/               # Express Backend
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes (mappingRoutes, symptomRoutes)
│   ├── utils/            # PubMed + MongoDB helpers
│   ├── index.js          # Main server
│   └── package.json
│
├── README.md
└── .env.example
```

## ⚙️ Setup & Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/medisync.git
cd medisync
```

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create `.env` file inside **server/** directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Run the server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3️⃣ Frontend Setup

```bash
cd ../client
npm install
```

Run the frontend:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🌍 Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `OPENAI_API_KEY` | OpenAI API key for GPT-4o-mini |
| `GOOGLE_MAPS_API_KEY` | Google Maps Places API key |
| `PORT` | Server port (default: 5000) |

## 🛠️ Tech Stack

### Frontend
* **React** - UI framework
* **TailwindCSS** - Utility-first CSS framework
* **ShadCN UI** - Modern component library
* **Framer Motion** - Animation library
* **Axios** - HTTP client

### Backend
* **Node.js** - Runtime environment
* **Express** - Web framework
* **MongoDB** - Database
* **Mongoose** - ODM for MongoDB
* **LangChain** - AI framework
* **OpenAI GPT-4o-mini** - Language model

### APIs & Services
* **PubMed API** - Medical research papers
* **Google Maps Places API** - Location services
* **MongoDB Atlas Vector Search** - Semantic search

## 🔧 API Endpoints

### Symptom Analysis
```http
POST /api/symptoms/analyze
Content-Type: application/json

{
  "symptoms": "headache, fever, nausea",
  "location": "New York, NY"
}
```

### Doctor Mapping
```http
POST /api/mapping/doctor
Content-Type: application/json

{
  "symptoms": "chest pain, shortness of breath"
}
```

### Nearby Hospitals
```http
GET /api/hospitals/nearby?lat=40.7128&lng=-74.0060&radius=5000
```

## 📱 Usage Example

1. **Enter Symptoms**: User inputs symptoms like "headache, fever, fatigue"
2. **AI Analysis**: System fetches relevant PubMed research and analyzes with AI
3. **Doctor Recommendation**: AI suggests appropriate medical specialties
4. **Location Services**: Find nearby hospitals and doctors
5. **Results Display**: Comprehensive summary with causes, treatments, and locations

## 🚧 Development

### Running Tests
```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

### Building for Production
```bash
# Build frontend
cd client
npm run build

# Start production server
cd server
npm start
```

<!-- ## 🌟 Screenshots

### Symptom Input Page
Modern UI with location detection and symptom input

### Results Page
Comprehensive analysis with AI-generated summaries and nearby medical facilities -->

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy to Vercel
```

### Backend (Render/Railway)
```bash
cd server
# Deploy to your preferred platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<!-- ## 📋 Roadmap

- [ ] **User Authentication** (Clerk/Auth0)
- [ ] **Search History** for registered users
- [ ] **Multiple Doctor Specialties** recommendation
- [ ] **Symptom Severity Assessment**
- [ ] **Appointment Booking Integration**
- [ ] **Multi-language Support**
- [ ] **Mobile App** (React Native) -->

## 🐛 Known Issues

- Rate limiting on PubMed API calls
- Google Maps API quota limitations
- MongoDB Atlas connection timeouts

## 📞 Support

If you encounter any issues:
1. Check the [Issues](https://github.com/your-username/medisync/issues) page
2. Create a new issue with detailed description
3. Contact: your-email@example.com

## ⚠️ Disclaimer

**MediSync is for informational purposes only and should not replace professional medical advice. Always consult with qualified healthcare professionals for medical concerns.**

## 🙏 Acknowledgments

- [PubMed API](https://www.ncbi.nlm.nih.gov/books/NBK25497/) for medical research data
- [OpenAI](https://openai.com/) for AI capabilities
- [Google Maps](https://developers.google.com/maps) for location services
- [ShadCN UI](https://ui.shadcn.com/) for beautiful components

---

**Made with ❤️ for better healthcare accessibility**