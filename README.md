# KMRL AI-Driven Train Scheduling System

A modern, bilingual web application for Kochi Metro Rail Limited (KMRL) operations management with AI-powered train scheduling capabilities.

## 🚀 Features

### Core Functionality
- **Fleet Dashboard**: Real-time monitoring of 25 trainsets with status tracking
- **AI Scheduling Engine**: Multi-objective optimization for train assignments
- **Analytics Dashboard**: Performance metrics and KPI tracking
- **Fitness Certificates**: Comprehensive certificate management system
- **Maintenance Hub**: Comprehensive maintenance management interface
- **Staff Management**: Resource allocation and scheduling
- **Chatbot Assistant**: Interactive help and support system

### User Experience
- **Bilingual Support**: English and Malayalam language toggle
- **Dark/Light Mode**: Adaptive theme switching
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion powered transitions
- **Loading States**: Professional splash screen and loading indicators

## 🛠️ Tech Stack

### Frontend Framework
- **React 18.3.1** - Modern UI library with hooks and functional components
- **TypeScript 5.5.3** - Type-safe development with enhanced IDE support
- **Vite 5.4.2** - Fast build tool and development server

### Styling & UI
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **PostCSS 8.4.35** - CSS processing and optimization
- **Autoprefixer 10.4.18** - Automatic vendor prefixing
- **Lucide React 0.344.0** - Beautiful, customizable icons

### Animation & Interactions
- **Framer Motion 12.23.16** - Production-ready motion library
- **React Context API** - State management for theme and language

### Development Tools
- **ESLint 9.9.1** - Code linting and quality assurance
- **TypeScript ESLint 8.3.0** - TypeScript-specific linting rules
- **React Hooks ESLint Plugin** - Hooks-specific linting rules

### Database & Backend (Ready for Integration)
- **Supabase 2.57.4** - Backend-as-a-Service for real-time data

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Analytics.tsx    # Performance analytics dashboard
│   ├── Chatbot.tsx      # Interactive chatbot interface
│   ├── FleetDashboard.tsx # Main fleet monitoring dashboard
│   ├── FitnessCertificatePanel.tsx # Fitness certificate display component
│   ├── FitnessCertificatesSection.tsx # Dedicated fitness certificates section
│   ├── Layout.tsx       # Application layout and navigation
│   └── SchedulingEngine.tsx # AI scheduling interface
├── contexts/            # React Context providers
│   ├── DarkModeContext.tsx # Theme management
│   ├── LanguageContext.tsx # Internationalization
│   └── OptimizationContext.tsx # AI optimization state management
├── data/               # Mock data and constants
│   └── mockData.ts     # Sample trainset data with fitness certificates
├── types/              # TypeScript type definitions
│   └── index.ts        # Core data models including FitnessCertificate
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/veebbruh/kmrl.git
   cd kmrl
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🎨 Key Components

### Fleet Dashboard
- Real-time status monitoring of all 25 trainsets
- Interactive train cards with detailed information
- Status-based color coding (service, standby, maintenance, cleaning, inspection)
- Modal popups with comprehensive train details
- Fitness certificate status indicators
- Navigation to dedicated fitness certificates section

### AI Scheduling Engine
- Multi-objective optimization algorithm
- Constraint-based scheduling with explainable AI
- Performance metrics and confidence scoring
- Individual train metrics calculation (service readiness, overall score)
- Conflict detection and resolution suggestions
- Reset functionality for optimization

### Fitness Certificates System
- Comprehensive certificate management for Rolling Stock, Signalling, and Telecom departments
- Real-time status tracking (valid, expiring soon, expired, suspended)
- Search, filter, and sort capabilities
- Detailed certificate information with conditions and inspection dates
- Priority-based categorization (critical, high, medium, low)
- Compact and detailed view modes

### Analytics Dashboard
- KPI tracking with trend indicators
- Fleet utilization metrics
- Cost savings analysis
- AI performance monitoring

### Language Support
- Complete English/Malayalam translation system
- Context-based language switching
- Persistent language preference storage
- Localized date/time formatting

## 🔧 Configuration

### Environment Variables
Create a `.env` file for configuration:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Tailwind Configuration
Customizable in `tailwind.config.js`:
- Dark mode support
- Custom color schemes
- Responsive breakpoints

## 📊 Data Models

### Trainset Interface
```typescript
interface Trainset {
  id: string;
  number: string;
  status: 'service' | 'standby' | 'maintenance' | 'cleaning' | 'inspection';
  location: string;
  mileage: number;
  currentIssues: Issue[];
  fitnessCertificates: FitnessCertificate[];
  metroLine?: MetroLineInfo;
}
```

### Fitness Certificate Interface
```typescript
interface FitnessCertificate {
  id: string;
  trainsetId: string;
  department: 'rolling_stock' | 'signalling' | 'telecom';
  issuedDate: string;
  expiryDate: string;
  validityDays: number;
  status: 'valid' | 'expiring_soon' | 'expired' | 'suspended';
  issuedBy: string;
  certificateNumber: string;
  conditions: string[];
  lastInspection: string;
  nextInspection: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}
```

### Optimization Result
```typescript
interface OptimizationResult {
  schedule: ScheduleItem[];
  metrics: PerformanceMetrics;
  conflicts: Conflict[];
  timestamp: string;
}
```

## 🎯 Performance Features

- **Lazy Loading**: Components load on demand
- **Memoization**: Optimized re-rendering with React.memo
- **Code Splitting**: Automatic bundle optimization with Vite
- **Tree Shaking**: Unused code elimination
- **Hot Module Replacement**: Instant development updates

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Adaptive layouts for medium screens
- **Desktop Enhanced**: Full feature set on large screens
- **Touch Friendly**: Gesture support and touch interactions

## 🔒 Security Features

- **Type Safety**: Full TypeScript coverage
- **Input Validation**: Client-side validation
- **XSS Protection**: React's built-in security
- **HTTPS Ready**: Production-ready security headers

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Sahir** - Full Stack Developer
- **KMRL** - Project Sponsor

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation wiki

---

**Built with ❤️ for Kochi Metro Rail Limited**
