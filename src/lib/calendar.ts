interface CalendarEvent {
  title: string;
  description: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  location?: string;
}

/**
 * Format a Date object or ISO string to the ICS date format: YYYYMMDDTHHmmssZ
 */
function formatToIcsDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

/**
 * Generate a Google Calendar link
 */
export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const start = formatToIcsDate(event.startTime);
  const end = formatToIcsDate(event.endTime);
  const title = encodeURIComponent(event.title);
  const details = encodeURIComponent(event.description);
  const location = encodeURIComponent(event.location || "Live Online");

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
}

/**
 * Generate a downloadable ICS data URL
 */
export function generateIcsUrl(event: CalendarEvent): string {
  const start = formatToIcsDate(event.startTime);
  const end = formatToIcsDate(event.endTime);
  const timestamp = formatToIcsDate(new Date().toISOString());
  const uid = Math.random().toString(36).substring(2) + "@webinar-landing-page";

  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Antigravity//Webinar Landing Page//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${timestamp}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title.replace(/[,;]/g, "\\$&")}`,
    `DESCRIPTION:${event.description.replace(/[,;]/g, "\\$&").replace(/\n/g, "\\n")}`,
    `LOCATION:${(event.location || "Live Online").replace(/[,;]/g, "\\$&")}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const icsString = icsLines.join("\r\n");
  
  if (typeof btoa !== "undefined") {
    // Client-side compatible base64 encoding
    try {
      return `data:text/calendar;charset=utf-8;base64,${btoa(unescape(encodeURIComponent(icsString)))}`;
    } catch {
      return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsString)}`;
    }
  }
  
  // Server-side fallback
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsString)}`;
}
