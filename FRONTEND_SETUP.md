# OpenRiskOS Frontend Setup Guide

## Overview

The OpenRiskOS web dashboard is a Next.js 15 application built with React 19 and TypeScript, providing a modern UI for managing enterprise risk and compliance.

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
cd apps/web
npm install --legacy-peer-deps

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Demo Credentials

For testing without a backend:
- **Tenant ID:** `tenant-123`
- **Email:** `user@company.com`
- **Password:** `password123`

## Architecture

### Project Structure

```
apps/web/
├── src/
│   ├── app/
│   │   ├── dashboard/          # Dashboard pages and layout
│   │   │   ├── page.tsx        # Dashboard home
│   │   │   ├── risks/          # Risk Register page
│   │   │   ├── compliance/     # Compliance Management page
│   │   │   ├── incidents/      # Incident Management page
│   │   │   ├── audits/         # Audit Management page
│   │   │   ├── vendors/        # Vendor Management page
│   │   │   └── layout.tsx      # Dashboard layout with sidebar
│   │   ├── login/              # Login page
│   │   ├── page.tsx            # Home page (landing)
│   │   ├── layout.tsx          # Root layout with providers
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   └── Navbar.tsx          # Top navigation component
│   ├── context/
│   │   ├── ApiClientProvider.tsx   # API client initialization
│   │   └── UserContext.tsx         # User/auth state management
│   └── hooks/
│       ├── useApiClient.ts     # Hook for accessing API client
│       ├── useRisks.ts         # Hook for fetching risks
│       ├── useCompliance.ts    # Hook for fetching compliance data
│       ├── useIncidents.ts     # Hook for fetching incidents
│       ├── useAudits.ts        # Hook for fetching audits
│       ├── useVendors.ts       # Hook for fetching vendors
│       └── index.ts            # Exports all hooks
```

## Key Features

### Authentication System

**UserContext** (`src/context/UserContext.tsx`):
- Manages user login/logout state
- Persists user data in localStorage
- Provides `useUser()` hook for accessing auth state
- Automatically redirects unauthenticated users to login

**Login Flow**:
1. User enters email, password, and tenant ID on login page
2. Credentials are validated on the client
3. Auth token and tenant ID are stored in localStorage
4. User is redirected to dashboard
5. Dashboard layout checks authentication and redirects unauthenticated users

### API Client Integration

**ApiClientProvider** (`src/context/ApiClientProvider.tsx`):
- Initializes OpenRiskOSClient from API client library
- Retrieves credentials from localStorage
- Provides client instance to all hooks via context

**Data Fetching Hooks**:
- `useRisks()`: Fetches risks with optional filtering
- `useCompliance()`: Fetches compliance frameworks and overall score
- `useIncidents()`: Fetches security incidents
- `useAudits()`: Fetches audit records and findings
- `useVendors()`: Fetches vendor information and breaches

Each hook returns:
```typescript
{
  data: T[],              // Array of items
  loading: boolean,       // Loading state
  error: string | null,   // Error message if any
  refetch: () => Promise<void>  // Function to re-fetch data
}
```

### Dashboard Pages

All dashboard pages follow a consistent pattern:

1. **Import Hooks**
   ```typescript
   import { useRisks } from '@/hooks';
   ```

2. **Fetch Data**
   ```typescript
   const { data: risks, loading, error } = useRisks();
   ```

3. **Handle States**
   - Show loading spinner while fetching
   - Show error message on API failure
   - Show empty state when no data exists

4. **Display Data**
   - Use real data from API instead of mock data
   - Implement filtering and searching where applicable
   - Add interactive features (view details, edit, delete)

### User Experience

**Navbar** (`src/components/Navbar.tsx`):
- Shows current user email and tenant ID
- Provides logout functionality
- Only visible on authenticated pages

**Dashboard Layout** (`src/app/dashboard/layout.tsx`):
- Sidebar with navigation to all sections
- Protected - redirects unauthenticated users to login
- Displays user info in header

**Loading States**:
- Spinning loader shown while data fetches
- Prevents interaction during load
- Clear "no data" messages

**Error Handling**:
- User-friendly error messages
- Retry option for failed requests
- Graceful degradation

## Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

This should point to your API Gateway service.

## Development

### Building

```bash
npm run build
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Testing

```bash
npm test
npm run test:watch
```

## Integration with Backend

### Setting the API URL

The application connects to the API Gateway at the endpoint specified in `NEXT_PUBLIC_API_URL`. The Gateway routes requests to individual microservices:

- **Risk Service**: `/risks/*`
- **Compliance Service**: `/compliance/*`
- **Incident Service**: `/incidents/*`
- **Audit Service**: `/audits/*`
- **Vendor Service**: `/vendors/*`

### Authentication Header

All API requests include the `X-Tenant-ID` header and Bearer token in the Authorization header (via the API client).

### Multi-Tenancy

The application supports multi-tenant deployments:
- Tenant ID is set during login and stored in localStorage
- All API requests are scoped to the current tenant
- Users can only see data for their tenant

## Next Steps

1. **Real Authentication**: Replace mock authentication with actual API calls
2. **Error Boundaries**: Implement React error boundaries for better error handling
3. **Loading Skeletons**: Add skeleton screens for faster perceived performance
4. **Caching**: Implement React Query or SWR for response caching
5. **Detail Views**: Create dedicated pages for viewing/editing individual records
6. **Real-time Updates**: Add WebSocket integration for live updates
7. **Optimistic Updates**: Implement optimistic UI updates for create/update/delete
8. **Permission System**: Add role-based access control

## Deployment

### Production Build

```bash
npm run build
npm run start
```

### Docker

```bash
docker build -t openriskos-web .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://api-gateway:3001 openriskos-web
```

## Troubleshooting

### "No tenant ID found" Error

**Solution**: Ensure you're logged in with a valid tenant ID. Check localStorage to verify `tenantId` is set.

### API Connection Errors

**Solution**: Verify `NEXT_PUBLIC_API_URL` points to a running API Gateway instance.

### 401 Unauthorized Errors

**Solution**: Check that `authToken` is set in localStorage. Log out and log back in to refresh the token.

### Loading Spinner Never Disappears

**Solution**: Check browser console for API errors. Verify the backend service is running.

## Additional Resources

- [API Integration Guide](./API_INTEGRATION_GUIDE.md)
- [API Client Library Docs](./packages/api-client/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
