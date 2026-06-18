# Restaurant Order App

An Android-first restaurant order management app for waiters and chefs, built with React Native. The role system is designed to support a customer role later.

## Product scope

### Roles

- **Admin:** manages tables, menu items, staff accounts, and all orders.
- **Waiter:** manages tables, creates orders, and adds dishes to active orders.
- **Chef:** manages tables and menu items, receives orders, and updates preparation status.
- **Customer:** searches the table list, selects a table, submits an order, and tracks its status.

The first release uses hardcoded credentials while keeping authorization enforced by the API:

- Admin: `admin / admin123`
- Chef: `chef / chef123`
- Waiter: `waiter / waiter123`
- Customer: `customer / customer123`

### Table workflow

- Waiters and chefs see a shared, live table grid.
- Both roles can add, rename, reorder, disable, and re-enable tables.
- Disabled tables cannot receive new orders.
- Each table shows one clear operational state:
  - Available
  - Pending
  - Preparing
  - Added later
  - Completed
- Color, icons, and text labels are used together so state does not depend on color alone.

### Waiter workflow

1. Select a table.
2. Browse menu categories or search dishes.
3. Add quantities and optional item notes.
4. Review and submit the order.
5. Edit or remove dishes until the chef starts them.
6. Add more dishes after preparation starts.

Once a dish is marked as started, the waiter cannot edit or remove it. New dishes are submitted as a separate, visibly labelled **Added later** batch under the same table order.

### Customer workflow

1. Sign in with the customer account.
2. Search and select a table from the table card list.
3. Browse or search the menu.
4. Submit dishes for the selected table.
5. Track pending, preparing, ready, and completed statuses.

Customers cannot edit or cancel dishes after submission.

### Chef workflow

1. Receive an in-app update and push notification for a new order.
2. Open the table or order from the kitchen queue.
3. Mark individual dishes as started, ready, or completed.
4. Receive a separate notification when dishes are added later.
5. Complete the table order after all dishes are completed.

The chef can create, edit, categorize, price, image, disable, and re-enable menu items. Disabling an item preserves it in historical orders but prevents new ordering.

### Admin workflow

- View all tables and orders.
- Add, rename, reorder, disable, and re-enable tables.
- Create, edit, categorize, price, image, disable, and re-enable menu items.
- View the four initial role accounts and prepare for database-backed staff accounts later.

## Interface direction

The interface uses a warm, modern food-app visual language:

- Dish photography and clear category chips
- Prominent search and large touch targets
- Warm neutral surfaces with red, orange, blue, and green operational accents
- Bottom navigation tailored to the selected role
- Phone layouts for waiters and responsive tablet layouts for kitchen use
- Loading, empty, offline, validation, and retry states on all networked screens

The table grid is the operational home screen for both roles. The chef also has a queue view optimized for pending and preparing orders.

## Architecture

### Mobile app

- React Native with Expo and TypeScript
- Expo Router for navigation
- TanStack Query for server state and cache synchronization
- Zustand for small local UI and role state
- React Hook Form with Zod validation
- Expo Notifications for background and closed-app push notifications

### Backend

- Node.js with Express and TypeScript
- REST API for commands and initial data loading
- WebSocket events for live table, menu, and order updates
- Drizzle ORM with Neon PostgreSQL
- Firebase/Expo push delivery through a server-side notification service

All screens load operational data from the API. Sample data is limited to database seeding and never drives production flows.

The APK never connects directly to Neon. Database credentials and notification credentials exist only on the backend.

## Data model

- `users`: future-ready identity and role records
- `devices`: role-associated push tokens
- `tables`: name, position, enabled state, and timestamps
- `menu_categories`: name, position, and enabled state
- `menu_items`: category, name, description, price, image URL, availability, and timestamps
- `orders`: table, lifecycle status, creator, and timestamps
- `order_batches`: order, sequence, original/added-later type, creator, and submitted time
- `order_items`: batch, menu snapshot, quantity, note, item status, and timestamps
- `order_events`: append-only audit events for submissions and status changes

Menu name and price are copied into each order item so historical orders remain accurate after menu edits.

## Status and editing rules

- Order item statuses: `pending`, `started`, `ready`, `completed`, `cancelled`
- Order statuses: `pending`, `preparing`, `ready`, `completed`, `cancelled`
- A waiter may edit or cancel only pending items.
- Started, ready, and completed items are immutable to the waiter.
- New items added after any item starts are placed in a new added-later batch.
- A table remains visibly active until its current order is completed or cancelled.
- Server-side transactions enforce status transitions and prevent conflicting edits.

## Notifications and live updates

- WebSockets update open apps immediately.
- Push notifications alert chefs when the app is backgrounded or closed.
- New-order and added-later events use distinct titles and payload types.
- Tapping a notification opens the relevant table order.
- Device tokens are refreshed and deactivated when delivery reports them invalid.
- Notification failure does not roll back a successfully stored order; failed delivery is logged and retried.

## Reliability and security

- Every mutation is validated and authorized by role on the server.
- Login credentials are hardcoded only for the initial release; the API returns a signed session token and never trusts a role supplied directly by the client.
- Order submission uses an idempotency key to prevent duplicate orders on retry.
- Database transactions protect order and status changes.
- Money is stored as integer minor units, never floating-point values.
- The app shows cached data while offline but disables unsafe mutations until connectivity returns.
- Image uploads use a dedicated object-storage provider; Neon stores only image URLs.
- Audit events retain who changed an order and when, ready for future authenticated accounts.

## Testing

- Unit tests cover permissions, status transitions, totals, and added-later batching.
- API integration tests use an isolated PostgreSQL test database.
- Mobile component tests cover role-specific controls and order editing locks.
- End-to-end tests cover waiter submission, chef start, waiter added-later submission, notification routing, and completion.

## Initial delivery boundary

The first release includes admin, waiter, chef, and customer roles; hardcoded authentication; API-backed table and menu management; live order handling; customer ordering and tracking; added-later batches; and push notifications. Payments, billing, inventory, analytics, reservations, and editable database-backed staff accounts are intentionally deferred.

## Development setup

Prerequisites: Node.js 22+, Android Studio or an Android device with Expo Go, a Neon PostgreSQL project, and an Expo account for push notifications.

```powershell
npm install
Copy-Item .env.example .env
npm run dev --workspace @restaurant/api
npm run start --workspace @restaurant/mobile
```

Set `DATABASE_URL` to the pooled Neon connection string. Set `EXPO_PUBLIC_API_URL` and `EXPO_PUBLIC_SOCKET_URL` to the API address reachable from the Android device. For a physical phone, do not use `localhost`; use the computer's LAN IP or a deployed HTTPS API.

Generate and apply the Neon schema:

```powershell
npm run db:generate --workspace @restaurant/api
npm run db:migrate --workspace @restaurant/api
npm run db:seed --workspace @restaurant/api
```

When `DATABASE_URL` is set, tables, menu items, order batches, order items, and status changes use Neon through Drizzle. Without it, the API uses an in-memory order repository only for local test startup.

## Android build

Install and authenticate the EAS CLI, add the Expo project ID to the Expo configuration, then build:

```powershell
npm install --global eas-cli
eas login
Set-Location apps/mobile
eas build:configure
eas build --platform android --profile preview
```

The included `preview` profile produces an installable APK. Production push notifications require a real device and Android notification credentials configured in the Expo project.

## Verification

```powershell
npm test
npm run typecheck
npx expo-doctor apps/mobile
```
