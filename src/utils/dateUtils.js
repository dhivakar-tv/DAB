// Date and Time Helper Utilities

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatTime(timeString) {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  if (hours === undefined || minutes === undefined) return timeString;
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${minutes} ${ampm}`;
}

export function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDayName(dateString) {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    // Treat as local midnight to avoid UTC offset issues
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(d);
  }
  const d = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(d);
}

// Generate time slots based on doctor availability configuration
export function generateTimeSlots(availability, bookedSlots = [], selectedDate = '') {
  if (!availability) return [];
  const {
    startTime = '09:00',
    endTime = '17:00',
    slotDuration = 30,
    breakStartTime = '13:00',
    breakEndTime = '14:00',
    days = []
  } = availability;

  // Check if doctor works on selected day
  if (selectedDate) {
    const dayOfWeek = getDayName(selectedDate);
    if (days.length > 0 && !days.includes(dayOfWeek)) {
      return []; // Doctor not available on this day
    }
  }

  const slots = [];
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  const [breakStartH, breakStartM] = (breakStartTime || '13:00').split(':').map(Number);
  const [breakEndH, breakEndM] = (breakEndTime || '14:00').split(':').map(Number);

  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  const breakStartMinutes = breakStartH * 60 + breakStartM;
  const breakEndMinutes = breakEndH * 60 + breakEndM;

  const todayStr = getTodayDateString();
  const now = new Date();
  const currentMinutesNow = now.getHours() * 60 + now.getMinutes();

  for (let mins = startMinutes; mins + slotDuration <= endMinutes; mins += slotDuration) {
    // Skip if inside break window
    if (mins >= breakStartMinutes && mins < breakEndMinutes) {
      continue;
    }

    const slotStartH = Math.floor(mins / 60);
    const slotStartM = mins % 60;
    const slotEndMins = mins + slotDuration;
    const slotEndH = Math.floor(slotEndMins / 60);
    const slotEndM = slotEndMins % 60;

    const timeStr = `${String(slotStartH).padStart(2, '0')}:${String(slotStartM).padStart(2, '0')}`;
    const endTimeStr = `${String(slotEndH).padStart(2, '0')}:${String(slotEndM).padStart(2, '0')}`;

    // Is slot already booked?
    const isBooked = bookedSlots.some((s) => s === timeStr);

    // Is slot in past if date is today?
    const isPast = selectedDate === todayStr && mins <= currentMinutesNow;

    slots.push({
      startTime: timeStr,
      endTime: endTimeStr,
      available: !isBooked && !isPast,
      isBooked,
      isPast,
    });
  }

  return slots;
}
