# MediCare — Doctor Appointment Booking System (DABS)

A modern, responsive, full-stack **Doctor Appointment Booking System** built with **React 19, Tailwind CSS, Lucide Icons, Recharts, Firebase Authentication, and Cloud Firestore**.

Designed for college project demonstrations, technical evaluations, and healthcare portfolio showcases.

---

## 🌟 Key Features & Highlights

### 1. Multi-Role RBAC (Role-Based Access Control)
- **Patient Portal**: Search doctors by specialty, view slots, book appointments with double-booking prevention, reschedule, cancel, view appointment history, update profile, and receive notifications.
- **Doctor Portal**: Dedicated dashboard with today's appointments, pending approval queue, calendar schedule view, working hours & break time configuration, profile & fee settings.
- **Admin Console**: Central operations dashboard with real-time statistics calculated directly from stored data, Recharts trend visualizations, doctor management (add/edit/activate/deactivate), patient directory, global appointment oversight, and **CSV appointment report exports**.

### 2. Double-Booking Prevention & Concurrency Protection
- Employs **atomic transaction slot reservation** (via Cloud Firestore transactions / simulated atomic checks).
- When two patients attempt to book the identical doctor and time slot simultaneously, the first transaction claims the slot; the second is prevented and gracefully alerted.

### 3. Dual-Mode Database Engine
- **Live Firebase Ready**: Automatically connects to Firebase Auth and Firestore if `.env` contains your Firebase project keys.
- **Demo Mode**: If Firebase keys are not provided, it seamlessly operates with an identical local persistence engine (stored in browser `localStorage`), complete with 1-click role logins and rich sample data.

### 4. Email Automation & Scheduled Reminders
- Firebase Cloud Functions supporting **Resend / SendGrid / SMTP**.
- Automated transactional emails for **Booking Confirmations, Approvals, Rejections, Cancellations, and Rescheduling**.
- **Idempotent 24-hour daily reminders** scheduled via Cron (`0 8 * * *`) that check `reminderSentAt` to prevent duplicate emails.
- Admin Email Dispatch Inspector that logs every outgoing email with rendered HTML previews.

---

## 🔑 1-Click Demo Accounts

For immediate testing, use the floating **Demo Bar** at the top of the app or log in with these pre-seeded demo accounts:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Patient** | `patient@medicare.demo` | `Patient@123` | Alex Rivera (Has upcoming and pending bookings) |
| **Doctor** | `doctor.sarah@medicare.demo` | `Doctor@123` | Dr. Sarah Jenkins, MD (Cardiologist) |
| **Admin** | `admin@medicare.demo` | `Admin@123` | System Administrator (Full metrics & controls) |

---

## 🚀 Quick Start (Running Locally)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## ⚙️ Connecting Live Firebase (Optional)

To connect to your live Firebase project:

1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Email/Password provider).
3. Create a **Cloud Firestore** database.
4. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
5. Fill in your Firebase Web App credentials:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:...
   ```
6. Deploy security rules and indexes:
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes
   ```

---

## 📧 Cloud Functions Setup (Email Service)

1. Navigate to the `functions/` folder:
   ```bash
   cd functions
   npm install
   ```
2. Copy `functions/.env.example` to `functions/.env`:
   ```env
   RESEND_API_KEY=re_your_api_key_here
   FROM_EMAIL=appointments@yourdomain.com
   ```
3. Deploy functions:
   ```bash
   firebase deploy --only functions
   ```
4. Copy the `sendEmailNotification` URL into your frontend `.env` as `VITE_EMAIL_FUNCTION_URL`.

---

## 📁 Project Architecture

```
DABS/
├── public/                 # Static assets & favicon
├── src/
│   ├── assets/             # Icons & styles
│   ├── components/
│   │   ├── common/         # Navbar, Footer, DemoBar, Modal, Badge, Toast, Skeleton
│   │   ├── booking/        # DoctorCard, SlotPicker, BookingModal
│   │   └── dashboard/      # Sidebar, StatsCard, AppointmentTable, CalendarView
│   ├── context/            # AuthContext, NotificationContext, ThemeContext
│   ├── layouts/            # MainLayout, DashboardLayout
│   ├── pages/
│   │   ├── public/         # Home, About, FindDoctors, DoctorDetail, Contact, FAQ, Login, Register
│   │   ├── patient/        # PatientDashboard, PatientAppointments, PatientProfile
│   │   ├── doctor/         # DoctorDashboard, DoctorAppointments, DoctorAvailability, DoctorProfile
│   │   └── admin/          # AdminDashboard, AdminDoctors, AdminPatients, AdminAppointments, AdminReports
│   ├── services/           # firebase.js, dbService.js, authService.js, emailService.js, seedData.js
│   ├── utils/              # dateUtils.js, exportCsv.js, constants.js
│   ├── App.jsx             # React Router v7 routes & layout integration
│   ├── index.css           # Tailwind CSS v4 styling & animations
│   └── main.jsx            # Entry point
├── functions/              # Cloud Functions (sendEmailNotification, scheduled reminders)
├── firestore.rules         # RBAC Cloud Firestore security rules
├── firestore.indexes.json  # Query performance composite indexes
├── .env.example            # Environment template
└── vite.config.js          # Vite 8 config with @tailwindcss/vite
```

---

## 🧪 Testing Checklist

- [x] **Registration & Login**: Tested with role redirection and invalid credentials prevention.
- [x] **Doctor Search & Filters**: Tested search by name, specialty, and sorting by rating/fee.
- [x] **Appointment Booking**: Tested slot availability, past date restrictions, and double booking prevention.
- [x] **Doctor Workflows**: Tested approving, rejecting with reason, and marking completed.
- [x] **Availability Settings**: Tested customizing working days, operating hours, and break periods.
- [x] **Admin Analytics**: Tested real-time Recharts trends and specialty distribution.
- [x] **CSV Report Export**: Tested downloading CSV audit reports.
- [x] **Dark / Light Mode**: Tested theme toggling and contrast across all pages.
- [x] **Responsive Layout**: Tested mobile menus, tablet sidebars, and desktop dashboards.

---

## 📄 License
MIT License. Built for educational and academic project presentation.
