# Web App (Angular + Firebase)

Hotel Booking Web Application built with Angular and integrated with Firebase Firestore.

## Tech Stack
- Angular 17+
- TailwindCSS
- Firebase Firestore
- RxJS

## Setup Instructions
1. Go to [Firebase Console](https://console.firebase.google.com).
2. Create a new project: `hotel-booking-app`.
3. Enable **Firestore Database** in "Native mode".
4. Register a Web App and copy the `firebaseConfig` object.
5. Paste the config into `src/environments/environment.ts`.
6. Set Firestore rules to allow read/write (for development):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

## Running the Web App
```bash
npm install
ng serve
```
Runs on `http://localhost:4200`.

## Features
- JWT Authentication via Auth Service.
- Real-time hotel listing and booking status.
- Interactive booking calendar for next 7 days.
- Admin dashboard to view bookings and add new hotels.
- Toast notifications and loading states.
