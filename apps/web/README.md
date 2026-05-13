# OpenRiskOS Web Dashboard

Enterprise-grade GRC platform web dashboard built with Next.js 15, React 19, and TailwindCSS.

## Features

### Authentication
- **Login Page** (`src/app/login/page.tsx`)
  - Multi-tenant support with Tenant ID field
  - Email and password authentication
  - Form validation with error messages
  - Demo credentials: `tenant-123` / `user@company.com` / `password123`
  - localStorage-based token management
  - Responsive gradient UI

### Dashboard Pages

#### 1. Dashboard Home (`src/app/dashboard/page.tsx`)
- **Key Metrics**: 5 metric cards showing:
  - Total Risks (47)
  - Compliance Score (79%)
  - Open Incidents (5)
  - Overdue Actions (2)
  - Last Updated timestamp with refresh button
- **Risk Heatmap**: 5×5 probability-impact matrix visualization
- **Recent Incidents**: 3 latest incidents with severity badges
- **Responsive Grid**: Adapts from 1 column on mobile to 5 columns on desktop

#### 2. Risk Register (`src/app/dashboard/risks/page.tsx`)
- **Filtering**: Status, Severity, and Search filters
- **Risk Table** with columns:
  - Risk ID and Title
  - Owner
  - Probability (1-5 scale)
  - Impact (1-5 scale)
  - Inherent Score (color-coded severity)
  - Residual Score
  - Status (Active/Mitigated/Closed)
  - View action button
- **Summary Stats**:
  - Critical Risks count
  - High Risks count
  - Active Risks count
  - Average Residual Score

#### 3. Compliance Dashboard (`src/app/dashboard/compliance/page.tsx`)
- **Overall Compliance Score**: 84% with circular SVG progress indicator
- **Framework Cards** (2-column grid):
  - ISO 27001 (83% - 95/114 controls)
  - GDPR (93% - 39/42 controls)
  - HIPAA (78% - 68/87 controls)
  - PCI-DSS (77% - 78/101 controls)
  - Each card shows: compliance percentage, progress bar, control counts, detail button
- **Non-Compliant Controls Section**:
  - Shows 4 controls across frameworks
  - Status tracking: In Progress / Planned
  - Framework attribution

#### 4. Incident Management (`src/app/dashboard/incidents/page.tsx`)
- **Incident Stats**:
  - Open Incidents (4)
  - Critical count (1)
  - Average Resolution Time (4.2 hrs)
  - This Month count (12)
- **Incidents Table** with columns:
  - ID and Title
  - Severity (Critical/High/Medium) with color badges
  - Status (Investigating/Containment/Resolved)
  - Detected time (relative)
  - Assigned To (team/person)
  - Affected Records count (highlighted in red if > 0)
  - View action button
- **Incident Workflow Visualization**:
  - 4-step process: Detection → Investigation → Containment → Resolution
  - Progress indicator showing current stage
  - Connected by progress lines

#### 5. Audit Management (`src/app/dashboard/audits/page.tsx`)
- **Audit Stats**:
  - Total Audits (4)
  - In Progress (1)
  - Open Findings (1)
  - Average Closure Time (45 days)
- **Audits Table** with columns:
  - ID and Title
  - Type (Internal/External/Compliance/IT) with color badges
  - Status (Planned/Scheduled/In Progress/Draft Report/Report Issued/Closed)
  - Scheduled Date
  - Findings count with critical indicator (C badge)
  - Owner
  - View action button
- **Open Findings Section**:
  - Shows findings requiring attention
  - Displays severity (Critical/Major/Minor/Observation)
  - Status tracking (Open/In Remediation)
  - Due dates
- **Audit Lifecycle Visualization**:
  - 4-step process: Planning → Execution → Reporting → Closure
  - Progress indicator

#### 6. Vendor Management (`src/app/dashboard/vendors/page.tsx`)
- **Vendor Stats**:
  - Total Vendors (4)
  - Critical Risk count (1)
  - Under Review count (1)
  - Recent Breaches (2)
- **Vendors Table** with columns:
  - ID and Name
  - Classification (Critical/High/Medium/Low) with color badges
  - Status (Active/Inactive/Under Review/Suspended/Terminated)
  - Risk Score (0-50 scale with color coding)
  - Last Assessment date and type
  - Days Until Review (highlighted in red if ≤30)
  - View action button
- **Recent Breaches Section**:
  - Vendor name with severity badge
  - Impact (number of records exposed)
  - Report date
  - Status (Reported/Investigating/Contained/Resolved)
- **Risk Distribution & Assessment Status**:
  - Horizontal bar charts showing vendor distribution
  - Assessment expiry tracking
  - Next review timeline

### Design System

#### Color Coding
- **Severity Levels**:
  - Critical: Red (#DC2626)
  - High: Orange (#EA580C)
  - Medium: Yellow (#EAB308)
  - Low: Green (#22C55E)
  
- **Status Indicators**:
  - Investigating: Blue
  - Containment: Orange
  - Resolved/Closed: Green
  - Open: Red

#### Layout Components
- **Sidebar Navigation**: Dark gray (bg-gray-900) with links to all 5 modules
- **Header**: White with date and user avatar
- **Metric Cards**: White background with shadow, 4px radius
- **Data Tables**: Full-width with hover effects, clean borders
- **Buttons**: Primary (Blue-600) with hover state (Blue-700)
- **Badges**: Inline status/severity indicators with matching color schemes

## Technology Stack

- **Framework**: Next.js 15.0.0
- **Runtime**: React 19.0.0
- **Styling**: TailwindCSS 3.4.0
- **UI Components**: 
  - @headlessui/react 1.7.0
  - @heroicons/react 2.0.0
- **State Management**: Zustand 4.4.0
- **Data Tables**: @tanstack/react-table 8.13.0
- **Animations**: framer-motion 10.16.0
- **HTTP Client**: axios 1.6.0
- **GraphQL**: graphql-request 6.0.0
- **Language**: TypeScript 5.3.3

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser to http://localhost:3000
```

### Login
1. Use demo credentials:
   - Tenant ID: `tenant-123`
   - Email: `user@company.com`
   - Password: `password123`
2. Click "Sign In"

### Building

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Code Quality

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests
npm run test

# Watch mode tests
npm run test:watch
```

## Project Structure

```
apps/web/
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx           # Login page
│   │   ├── dashboard/
│   │   │   ├── layout.tsx         # Dashboard layout with sidebar
│   │   │   ├── page.tsx           # Dashboard home
│   │   │   ├── risks/
│   │   │   │   └── page.tsx       # Risk Register
│   │   │   ├── compliance/
│   │   │   │   └── page.tsx       # Compliance Dashboard
│   │   │   ├── incidents/
│   │   │   │   └── page.tsx       # Incident Management
│   │   │   ├── audits/
│   │   │   │   └── page.tsx       # Audit Management
│   │   │   └── vendors/
│   │   │       └── page.tsx       # Vendor Management
│   │   └── globals.css            # Global styles
│   └── ...
├── public/                        # Static assets
├── package.json
├── tsconfig.json
├── next.config.js
└── tailwind.config.js
```

## State Management

Pages use React hooks for local state:
- `useState`: Manages component state (data arrays, filters, loading states)
- `useRouter`: Navigation (authentication redirects)
- `useEffect`: Side effects (would be used for API calls in production)

## Mock Data

All pages include sample data for demonstration:
- **Risks**: 4 sample risks with varying scores
- **Compliance**: 4 frameworks with different compliance percentages
- **Incidents**: 4 incidents with different severities and statuses
- **Audits**: 4 audits with findings and statuses
- **Vendors**: 4 vendors with risk profiles and breach records

## API Integration (Ready)

Pages are structured to integrate with backend APIs:
- Replace `useState` calls with API data fetching
- Update event handlers to call API endpoints
- Use provided axios/graphql-request clients
- Headers: Include `X-Tenant-ID` and `Authorization: Bearer {token}`

## Production Deployment

For deploying to production:

1. **Environment Setup**
   ```bash
   # .env.production
   NEXT_PUBLIC_API_URL=https://api.example.com
   NEXT_PUBLIC_GRAPHQL_URL=https://api.example.com/graphql
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Deploy to Vercel/AWS/GCP**
   - Vercel: `vercel deploy`
   - Docker: See root `Dockerfile`
   - Manual: `npm run build && npm start`

## Next Steps

- [ ] Connect dashboard pages to backend API endpoints
- [ ] Implement real authentication with JWT tokens
- [ ] Add data table pagination and sorting
- [ ] Implement advanced filtering
- [ ] Add data export functionality
- [ ] Create modal dialogs for detailed views
- [ ] Add real-time notifications
- [ ] Implement dark mode
- [ ] Add dashboard customization
- [ ] Setup monitoring and analytics

## Contributing

Follow the existing code patterns:
- Use `'use client'` directive for client components
- Leverage TailwindCSS utility classes
- Maintain consistent color coding
- Use semantic HTML
- Follow TypeScript strict mode

## License

Part of OpenRiskOS - Enterprise GRC Platform
