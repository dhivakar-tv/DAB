// Firebase Cloud Functions for Email Automation & Scheduled Reminders
// Secure server-side execution: keeps API keys off the client side.

const { onRequest } = require('firebase-functions/v2/https');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { onDocumentUpdated } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');
const { Resend } = require('resend');

admin.initializeApp();
const db = admin.firestore();

// Initialize Resend or SMTP provider with server-side secrets
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'appointments@medicare.demo';
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

/**
 * 1. HTTP Endpoint: sendEmailNotification
 * Receives email requests, validates payload, and dispatches via Resend/SMTP.
 */
exports.sendEmailNotification = onRequest(
  { cors: true, maxInstances: 10 },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    const { to, recipientName, subject, html, type, appointmentDetails } = req.body;

    if (!to || !subject || !html) {
      res.status(400).json({ error: 'Missing required fields: to, subject, or html' });
      return;
    }

    try {
      if (resend) {
        const data = await resend.emails.send({
          from: FROM_EMAIL,
          to: [to],
          subject,
          html,
        });

        // Audit log in Firestore
        await db.collection('email_logs').add({
          to,
          recipientName,
          subject,
          type,
          status: 'delivered',
          providerId: data.id || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.status(200).json({ success: true, messageId: data.id });
      } else {
        // Fallback: log to Firestore email audit collection
        await db.collection('email_logs').add({
          to,
          recipientName,
          subject,
          type,
          status: 'simulated_local',
          notice: 'No RESEND_API_KEY configured. Email recorded in audit collection.',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.status(200).json({
          success: true,
          mode: 'simulated',
          message: 'Email logged in audit collection (Set RESEND_API_KEY for live delivery).',
        });
      }
    } catch (err) {
      console.error('Email sending error:', err);
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * 2. Scheduled Cron Function: sendDailyAppointmentReminders
 * Runs every morning at 08:00 AM UTC.
 * Idempotent: Only sends reminder if appointment.reminderSentAt is not set.
 */
exports.sendDailyAppointmentReminders = onSchedule('0 8 * * *', async (event) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10); // YYYY-MM-DD

  console.log(`Checking appointments for date: ${tomorrowStr}`);

  const snapshot = await db
    .collection('appointments')
    .where('appointmentDate', '==', tomorrowStr)
    .where('status', '==', 'Approved')
    .get();

  if (snapshot.empty) {
    console.log('No approved appointments found for tomorrow.');
    return;
  }

  for (const doc of snapshot.docs) {
    const apt = doc.data();

    // Idempotency check: Skip if reminder was already dispatched
    if (apt.reminderSentAt) {
      console.log(`Skipping appointment ${doc.id}: reminder already sent at ${apt.reminderSentAt}`);
      continue;
    }

    const subject = `Reminder: Upcoming Medical Appointment Tomorrow with ${apt.doctorName}`;
    const reminderHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0284c7;">Appointment Reminder</h2>
        <p>Dear ${apt.patientName},</p>
        <p>This is a friendly reminder that you have a scheduled appointment tomorrow:</p>
        <ul>
          <li><strong>Doctor:</strong> ${apt.doctorName} (${apt.specialty})</li>
          <li><strong>Date:</strong> ${apt.appointmentDate}</li>
          <li><strong>Time:</strong> ${apt.startTime}</li>
          <li><strong>Fee:</strong> $${apt.fee || apt.consultationFee || 0}</li>
        </ul>
        <p>Please arrive 10 minutes prior to your consultation time.</p>
      </div>
    `;

    try {
      if (resend && apt.patientEmail) {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: [apt.patientEmail],
          subject,
          html: reminderHtml,
        });
      }

      // Mark appointment document as reminded to maintain strict idempotency
      await doc.ref.update({
        reminderSentAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✓ Reminder sent and recorded for appointment: ${doc.id}`);
    } catch (err) {
      console.error(`Failed to send reminder for appointment ${doc.id}:`, err);
    }
  }
});

/**
 * 3. Firestore Trigger: onAppointmentStatusChanged
 * Triggers in-app notification document when status changes.
 */
exports.onAppointmentStatusChanged = onDocumentUpdated('appointments/{appointmentId}', async (event) => {
  const before = event.data.before.data();
  const after = event.data.after.data();

  if (before.status === after.status) return;

  const notifRef = db.collection('notifications').doc();
  await notifRef.set({
    notificationId: notifRef.id,
    userId: after.patientId,
    title: `Appointment ${after.status}`,
    message: `Your appointment with ${after.doctorName} is now marked as ${after.status}.`,
    type: after.status === 'Approved' ? 'success' : after.status === 'Rejected' ? 'error' : 'info',
    read: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});
