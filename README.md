# SkillConnect

A mobile marketplace that connects customers with skilled local service providers: barbers, hairdressers, tailors, caterers and more. Customers can discover providers, compare services and prices, and connect with them directly on WhatsApp.


## The problem

In the informal economy, skilled service providers are usually found through word-of-mouth alone. Customers can't easily discover, compare, or vet providers, and providers have no simple way to be found beyond personal referrals.

## Features

- Onboarding carousel and email/password authentication
- Client / Service Provider role selection at signup
- Home screen with category browsing
- Search by name or location, with live category filtering
- Provider profiles with services, pricing, location and photo
- **Connect on WhatsApp** opens a chat directly with the provider's number, with a prefilled message
- Each connection is logged to Firestore
- Editable user profile
- Error and empty states (offline retry on Search, "contact unavailable" when a provider has no number)

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Expo SDK 57 (React Native 0.86) |
| Language | TypeScript |
| Navigation | Expo Router (file-based) |
| Auth | Firebase Authentication (email/password) |
| Database | Cloud Firestore |
| Builds | EAS Build (Android APK) |

## Getting started

### Prerequisites

- Node.js 20 or newer
- A Firebase project (free Spark plan is enough)
- The Expo Go app on an Android phone, or an Android emulator

### 1. Clone and install

```bash
git clone https://github.com/JustTrying652/skillconnect.git
cd skillconnect
npm install
```

The repo includes an `.npmrc` with `legacy-peer-deps=true`, which avoids peer dependency conflicts between React 19 and some Expo packages. If you ever see an `ERESOLVE` error, make sure that file is present.

### 2. Set up Firebase

1. Create a project in the [Firebase Console](https://console.firebase.google.com).
2. Register a **Web app** under Project Settings and copy its config values.
3. Go to **Build > Authentication > Sign-in method** and enable **Email/Password**.
4. Go to **Build > Firestore Database** and create a database.
5. Paste the security rules below into the **Rules** tab and publish.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /providers/{providerId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.createdBy == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.createdBy == request.auth.uid;
    }
    match /connections/{connectionId} {
      allow create: if request.auth != null && request.resource.data.customerId == request.auth.uid;
      allow read: if request.auth != null;
    }
  }
}
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in the values from your Firebase web app config:

```
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

### 4. Add sample providers

The app lists whatever is in the `providers` collection. In the Firebase Console, add a few documents to a collection named `providers`, using this shape:

| Field | Type | Example |
| --- | --- | --- |
| `name` | string | `The Golden Scissor` |
| `category` | string | `hairdresser` (one of `barber`, `hairdresser`, `tailor`, `caterer`, `other`, lowercase) |
| `bio` | string | `Braids, cuts and styling since 2015.` |
| `location` | string | `Westlands, Nairobi` |
| `phone` | string | `0712345678` or `254712345678` |
| `photoUrl` | string | any public image URL |
| `rating` | number | `4.8` |
| `services` | array of maps | `[{ name: "Braids", price: 1500 }]` |
| `createdBy` | string | any user uid |

Use a phone number you control when testing, since Connect opens a real WhatsApp chat with it.

### 5. Run the app

```bash
npx expo start -c
```

Scan the QR code with Expo Go. To see the onboarding screens again after the first run, clear the app's storage (or reinstall).

## Using the app

1. Swipe through onboarding, then sign up as a **Client**. (Service Provider accounts currently land on a "coming soon" screen.)
2. Browse by category on Home, or use the Search tab to filter by name, location and category.
3. Open a provider to see their services and pricing.
4. Tap **Connect on WhatsApp** to start a chat with them.

## Building an APK

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

The Firebase variables must exist in the EAS `preview` environment (`eas env:create`) so they are bundled into the build.

## Project structure

```
app/
  _layout.tsx            Root navigation, auth and onboarding gate
  onboarding.tsx         Onboarding carousel
  (auth)/                Login and signup
  (tabs)/                Home, Search, Bookings (placeholder), Profile
  provider/[id].tsx      Provider detail and Connect
  category/[cat].tsx     Providers in one category
  edit-profile.tsx       Edit profile
  provider-pending.tsx   Placeholder for provider-role accounts
components/              ProviderCard, CategoryTile, CategoryChip, GradientButton
context/                 AuthContext (user and role)
services/                firebase.ts, auth.ts, providers.ts
utils/                   phone.ts (WhatsApp number formatting)
constants/               theme.ts, categories
types/                   Shared TypeScript types
```

## Known limitations and roadmap

SkillConnect is an MVP. These gaps are known:

- **Ratings are seeded values.** There is no review system yet, so displayed ratings are not backed by real customer reviews.
- **Providers can't create their own listings.** Provider accounts see a "coming soon" screen; listings are currently added by an admin in Firestore.
- **No verification or payments.** There is no provider verification, booking flow, or in-app payment.
- **Bookings tab is a placeholder.** Connections are logged in Firestore but not yet shown to users.
- Profile menu items other than Edit Profile are not wired up.
- Google/Facebook sign-in buttons are visual only.

Planned next: customer reviews with calculated ratings, provider self-listing, verified-provider badges, and booking and payment flows.

## Credits

- UI designed in Figma by Oluwabukunmi
- Provider photos from [Unsplash](https://unsplash.com)
- Built by Evans ([@JustTrying652](https://github.com/JustTrying652)) and Oluwabukunmi