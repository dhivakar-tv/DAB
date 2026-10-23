// Email & Automated Communication Service
// Handles appointment notifications, reminders, status changes, and template generation.
// Integrates with backend endpoints or provides structured logging & preview when in demo mode.

const EMAIL_LOGS_KEY = 'dabs_email_logs';

function getEmailLogs() {
  try {
    const raw = localStorage.getItem(EMAIL_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEmailLogs(logs) {
  try {
    localStorage.setItem(EMAIL_LOGS_KEY, JSON.stringify(logs.slice(0, 50))); // keep latest 50
  } catch (err) {
    console.error('Failed to save email logs', err);
  }
}

export async function sendEmailNotification({
  to,
  recipientName,
  subject,
  type, // 'booking_confirmation' | 'doctor_approval' | 'rejection' | 'cancellation' | 'reschedule' | 'reminder'
  appointmentDetails = {},
}) {
  const timestamp = new Date().toISOString();
  const emailEndpoint = import.meta.env.VITE_EMAIL_FUNCTION_URL;

  const htmlContent = generateEmailTemplate({
    recipientName,
    subject,
    type,
    appointmentDetails,
  });

  const payload = {
    to,
    recipientName,
    subject,
    type,
    appointmentDetails,
    html: htmlContent,
    timestamp,
  };

  // If live Cloud Function or Email Endpoint is configured:
  if (emailEndpoint && !emailEndpoint.includes('placeholder')) {
    try {
      const response = await fetch(emailEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      const logEntry = {
        id: `email-${Date.now()}`,
        ...payload,
        status: 'delivered_live',
        providerResponse: data,
      };

      const logs = getEmailLogs();
      logs.unshift(logEntry);
      saveEmailLogs(logs);

      return { success: true, mode: 'live', message: 'Email sent via live provider.' };
    } catch (err) {
      console.warn('Live email dispatch failed, recording in preview log:', err.message);
    }
  }

  // Demo / Simulation Mode: Transparently record email dispatch in inspectable activity log
  const logEntry = {
    id: `email-${Date.now()}`,
    ...payload,
    status: 'simulated_local',
    notice: 'Demo Mode: Configure VITE_EMAIL_FUNCTION_URL and RESEND_API_KEY in functions/.env for production SMTP delivery.',
  };

  const logs = getEmailLogs();
  logs.unshift(logEntry);
  saveEmailLogs(logs);

  console.info(`[Email Dispatcher] Mock sent to: ${to} | Subject: "${subject}" | Type: ${type}`);

  return {
    success: true,
    mode: 'simulation',
    notice: 'Email notification captured in communication log (Demo Mode).',
    log: logEntry,
  };
}

export function getDispatchedEmailLogs() {
  return getEmailLogs();
}

export function clearEmailLogs() {
  localStorage.removeItem(EMAIL_LOGS_KEY);
}

// Generate professional responsive HTML email template
function generateEmailTemplate({ recipientName, subject, type, appointmentDetails }) {
  const {
    doctorName = 'Your Doctor',
    patientName = 'Valued Patient',
    appointmentDate = 'Upcoming Date',
    startTime = 'Scheduled Time',
    specialty = 'Specialty Care',
    fee = '$0',
    reason = '',
    cancellationReason = '',
  } = appointmentDetails;

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #0284c7 0%, #0d9488 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Medicare Health Portal</h1>
        <p style="margin: 8px 0 0; opacity: 0.9; font-size: 15px;">Appointment Notification Center</p>
      </div>
      <div style="padding: 32px 24px; color: #1e293b;">
        <h2 style="font-size: 20px; font-weight: 600; margin-top: 0; color: #0f172a;">Hello ${recipientName || 'there'},</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #475569;">${subject}</p>
        
        <div style="background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; padding: 20px; margin: 24px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Doctor:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 600; text-align: right;">${doctorName} (${specialty})</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Patient:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 600; text-align: right;">${patientName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Date & Time:</td>
              <td style="padding: 8px 0; color: #0284c7; font-weight: 700; text-align: right;">${appointmentDate} at ${startTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Consultation Fee:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 600; text-align: right;">$${fee}</td>
            </tr>
            ${reason ? `
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Reason:</td>
              <td style="padding: 8px 0; color: #334155; text-align: right;">${reason}</td>
            </tr>` : ''}
            ${cancellationReason ? `
            <tr>
              <td style="padding: 8px 0; color: #e11d48; font-weight: 500;">Cancellation Note:</td>
              <td style="padding: 8px 0; color: #e11d48; text-align: right;">${cancellationReason}</td>
            </tr>` : ''}
          </table>
        </div>

        <p style="font-size: 14px; color: #64748b; line-height: 1.5;">
          You can manage this appointment, check doctor notes, or reschedule anytime by logging into your Medicare portal.
        </p>
      </div>
      <div style="background: #f1f5f9; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
        &copy; 2026 Medicare Appointment System. Automated notification. Please do not reply directly.
      </div>
    </div>
  `;
}
