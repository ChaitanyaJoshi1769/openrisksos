# OpenRiskOS Web Dashboard - Features Documentation

## Overview

This document describes all implemented features in the OpenRiskOS web dashboard as of May 2026.

## Authentication & Security

### ✅ JWT-Based Authentication
- **Login System**: Email and password-based authentication
- **Token Management**: 24-hour expiring JWT tokens
- **Session Persistence**: Tokens stored in localStorage
- **Protected Routes**: Automatic redirection to login for unauthenticated users
- **Multi-tenant Support**: Tenant-aware API gateway routing

**Implementation Details**:
- API endpoints: `POST /api/v1/auth/login`, `POST /api/v1/auth/verify`
- User context provides login/logout methods
- Demo credentials: `user@company.com` / `password123`

---

## Dashboard Features

### 📊 Risk Management

#### List View
- View all risks with filtering by status and severity
- Search risks by title or description
- Display columns: Title, Category, Owner, Status, Severity, Risk Score
- Quick action links to detail pages
- Loading skeletons for smooth UX

#### Detail View (`/dashboard/risks/[id]`)
- **Overview Section**: Title, description, category, owner
- **Risk Assessment**: Probability, impact, inherent score, residual score
- **Mitigation Strategy**: Plan and responsible owner
- **Timeline**: Identified date and target resolution date
- **Status & Severity**: Visual badges with color coding
- **Quick Actions**: Edit, Update Status, Add Update, Add Control

#### Create Risk (`/dashboard/risks/new`)
- Comprehensive form with all risk fields
- Probability and impact sliders (1-10)
- Mitigation strategy planning
- Auto-redirect to detail view on success

#### Edit Risk (`/dashboard/risks/[id]/edit`)
- Pre-populated form with current values
- Full control over all risk fields
- Form validation and error handling
- Save changes with optimistic updates

#### Delete Risk
- Confirmation dialog with warning
- Soft delete with cache invalidation
- Auto-redirect to list page

---

### 🚨 Incident Management

#### List View
- Track all security incidents
- Filter by status (Investigating, Containment, Resolved) and severity
- Search incidents by title or description
- Display detection time and impact summary
- Real-time status indicators

#### Detail View (`/dashboard/incidents/[id]`)
- **Overview**: Title, description, type, assigned investigator
- **Impact Analysis**: Affected records count, systems impacted
- **Investigation Timeline**: Detection and reporting timestamps
- **Status & Severity**: Color-coded badges
- **Quick Stats**: Detection to report time
- **Actions**: Add Note, Add Evidence, Delete Incident

#### Create Incident (`/dashboard/incidents/new`)
- Quick incident reporting form
- Impact tracking with records and systems
- Assignment to team members
- Auto-redirect to incident detail

#### Edit Incident (`/dashboard/incidents/[id]/edit`)
- Update incident details and status
- Modify impact assessment
- Change assignment

#### Delete Incident
- Safe deletion with confirmation
- Cache cleanup and redirect

---

### 📋 Audit Management

#### List View
- Complete audit lifecycle tracking
- Filter by type (Internal, External, Compliance, IT, etc.) and status
- View audit schedule and findings count
- Identify critical findings
- Owner and next review date visibility

#### Detail View (`/dashboard/audits/[id]`)
- **Overview**: Scope, type, owner
- **Findings Summary**: Total findings, critical count, other findings breakdown
- **Audit Timeline**: Scheduled, started, completed dates
- **Status & Risk Level**: Visual indicators
- **Actions**: View Report, Add Comment, Delete Audit

#### Create Audit (`/dashboard/audits/new`)
- Schedule new audits with scope definition
- Select audit type and risk level
- Assign audit owner
- Pre-population for future audit tracking

#### Edit Audit (`/dashboard/audits/[id]/edit`)
- Modify audit scope and details
- Update status and risk level
- Change ownership

#### Delete Audit
- Remove completed audits safely
- Confirmation required

---

### 🏢 Vendor Management

#### List View
- Monitor third-party risk across all vendors
- Filter by classification (Critical, High, Medium, Low)
- View risk scores and assessment status
- Track days until next assessment review
- Recent breaches display

#### Detail View (`/dashboard/vendors/[id]`)
- **Vendor Information**: Name, description, industry, location
- **Risk Assessment**: Risk score, overall risk level, breach count
- **Assessment Information**: Last assessment, assessment type, days until review
- **Classification & Status**: Visual badges
- **Contact Information**: Email, phone, manager name
- **Actions**: View Assessment, View Breaches, Delete Vendor

#### Create Vendor (`/dashboard/vendors/new`)
- Onboard new vendors with comprehensive info
- Set initial classification
- Record contact details
- Auto-link to vendor detail page

#### Edit Vendor (`/dashboard/vendors/[id]/edit`)
- Update vendor information
- Modify risk classification
- Update contact information
- Track assessment details

#### Delete Vendor
- Remove vendor from system
- Safe deletion with confirmation

---

## Technical Features

### 🎨 User Experience

#### Loading States
- **Skeleton Screens**: Smooth placeholder loading for all list pages
- **Skeleton Cards**: Animated placeholders for detail pages
- **Button States**: Loading indicators during async operations
- **Progressive Loading**: Graceful degradation while fetching

#### Error Handling
- **Error Pages**: Detailed error states with recovery options
- **Toast Notifications**: Errors displayed prominently
- **Try Again Buttons**: Manual retry mechanisms
- **Fallback Content**: Graceful fallbacks for failed requests

#### Navigation
- **Breadcrumb-style Back Buttons**: Easy navigation
- **Auto-redirect**: Successful operations redirect appropriately
- **Link-based Navigation**: Next.js Link components for speed
- **Deep Linking**: Direct access to any detail/edit page

### ⚡ Performance

#### Data Caching
- **React Query Integration**: Automatic caching with 5-minute stale time
- **Smart Invalidation**: Caches cleared only on relevant mutations
- **Query Deduplication**: Multiple requests for same data merged
- **Optimistic Caching**: Immediate updates on mutation success

#### Search & Filter
- **Client-side Filtering**: Instant results without API calls
- **Multi-field Search**: Search across multiple fields
- **Multiple Filters**: Combine status, severity, and search
- **Real-time Updates**: Filters apply immediately

### 🔄 State Management

#### React Query Hooks
- `useRisks`, `useRiskDetail`, `useCreateRisk`, `useUpdateRisk`, `useDeleteRisk`
- `useIncidents`, `useIncidentDetail`, `useCreateIncident`, `useUpdateIncident`, `useDeleteIncident`
- `useAudits`, `useAuditDetail`, `useCreateAudit`, `useUpdateAudit`, `useDeleteAudit`
- `useVendors`, `useVendorDetail`, `useCreateVendor`, `useUpdateVendor`, `useDeleteVendor`

#### Context Providers
- **UserContext**: Authentication state and user info
- **ApiClientProvider**: Shared API client instance
- **QueryProvider**: React Query configuration

---

## API Integration

### Authentication Endpoints
- `POST /api/v1/auth/login`: Get JWT token
- `POST /api/v1/auth/verify`: Verify token validity

### Risk Endpoints
- `GET /api/v1/risks`: List all risks
- `GET /api/v1/risks/{id}`: Get risk detail
- `POST /api/v1/risks`: Create new risk
- `PATCH /api/v1/risks/{id}`: Update risk
- `DELETE /api/v1/risks/{id}`: Delete risk

### Incident Endpoints
- `GET /api/v1/incidents`: List all incidents
- `GET /api/v1/incidents/{id}`: Get incident detail
- `POST /api/v1/incidents`: Create new incident
- `PATCH /api/v1/incidents/{id}`: Update incident
- `DELETE /api/v1/incidents/{id}`: Delete incident

### Audit Endpoints
- `GET /api/v1/audits`: List all audits
- `GET /api/v1/audits/{id}`: Get audit detail
- `POST /api/v1/audits`: Create new audit
- `PATCH /api/v1/audits/{id}`: Update audit
- `DELETE /api/v1/audits/{id}`: Delete audit

### Vendor Endpoints
- `GET /api/v1/vendors`: List all vendors
- `GET /api/v1/vendors/{id}`: Get vendor detail
- `POST /api/v1/vendors`: Create new vendor
- `PATCH /api/v1/vendors/{id}`: Update vendor
- `DELETE /api/v1/vendors/{id}`: Delete vendor

---

## CRUD Operations

All four resource types (Risk, Incident, Audit, Vendor) support complete CRUD operations:

### Create (C)
- Dedicated creation pages at `/[resource]/new`
- Comprehensive forms with validation
- Auto-redirect to detail page on success
- Loading states during submission

### Read (R)
- List pages with filtering and search
- Detail pages with comprehensive information
- Loading skeletons for smooth experience
- Error states with recovery options

### Update (U)
- Edit pages at `/[resource]/[id]/edit`
- Pre-populated forms with current values
- Full control over all fields
- Form validation and error handling

### Delete (D)
- Delete buttons on detail pages
- Confirmation dialogs before deletion
- Safe deletion with cache cleanup
- Auto-redirect to list page

---

## Styling & Components

### Tailwind CSS
- Utility-first CSS framework
- Responsive design patterns
- Consistent color scheme
- Accessible color contrasts

### Component Library
- **CardSkeleton**: Loading placeholder for cards
- **TableRowSkeleton**: Loading placeholder for table rows
- **GridSkeleton**: Loading placeholder for grid layouts
- **ListSkeleton**: Loading placeholder for lists
- **Badge Components**: Status and severity indicators

### Design Patterns
- **Card Layouts**: Information grouped in white cards
- **Form Layouts**: Two-column responsive forms
- **Table Layouts**: Scrollable tables with hover states
- **Modal Dialogs**: Confirmation dialogs and modals

---

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design (Mobile, Tablet, Desktop)
- LocalStorage for token persistence
- ES6+ JavaScript features

---

## Future Enhancements

Potential features for future iterations:

1. **Real-time Updates**: WebSocket integration for live data
2. **Comments/Notes**: Add collaborative notes to resources
3. **Activity History**: Track all changes to resources
4. **Bulk Operations**: Select and act on multiple resources
5. **Export Functionality**: Export to CSV/PDF
6. **Advanced Analytics**: More dashboard charts and insights
7. **Role-Based Access**: Different permissions per user role
8. **Notifications**: System alerts and notifications
9. **Mobile App**: Native mobile application
10. **Integrations**: Third-party service integrations

---

## Known Limitations

- Demo data with hardcoded demo user credentials
- No persistence for user-created data across server restarts
- Single-tenant configuration in current implementation
- No real-time updates (polling only)
- No offline support

---

## Getting Started

For development setup, see [FRONTEND_SETUP.md](./FRONTEND_SETUP.md)

For detailed feature walkthrough, see [GETTING_STARTED.md](./GETTING_STARTED.md)

For API integration details, see [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)
