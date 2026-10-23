// CSV Export Utility for Appointment Reports

export function exportAppointmentsToCsv(appointments, filename = 'appointments_report.csv') {
  if (!appointments || appointments.length === 0) {
    alert('No appointment data to export.');
    return;
  }

  const headers = [
    'Appointment ID',
    'Patient Name',
    'Patient Email',
    'Patient Phone',
    'Doctor Name',
    'Specialty',
    'Date',
    'Start Time',
    'End Time',
    'Fee ($)',
    'Status',
    'Reason',
    'Created At',
  ];

  const rows = appointments.map((apt) => [
    `"${apt.appointmentId || apt.id || ''}"`,
    `"${apt.patientName || ''}"`,
    `"${apt.patientEmail || ''}"`,
    `"${apt.patientPhone || ''}"`,
    `"${apt.doctorName || ''}"`,
    `"${apt.specialty || ''}"`,
    `"${apt.appointmentDate || ''}"`,
    `"${apt.startTime || ''}"`,
    `"${apt.endTime || ''}"`,
    `"${apt.fee || apt.consultationFee || 0}"`,
    `"${apt.status || ''}"`,
    `"${(apt.reason || '').replace(/"/g, '""')}"`,
    `"${apt.createdAt ? new Date(apt.createdAt).toLocaleString() : ''}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
