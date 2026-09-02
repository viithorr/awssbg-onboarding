import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { google } from "googleapis";

type CalendarBooking = { bookingId: string; candidateName: string; candidateEmail: string; startsAt: string; endsAt: string };

async function calendarClient() {
  const credentials = JSON.parse(await fs.readFile(path.join(process.cwd(), "google-oauth-client.json"), "utf8"));
  const tokens = JSON.parse(await fs.readFile(path.join(process.cwd(), "google-token.json"), "utf8"));
  const config = credentials.installed ?? credentials.web;
  if (!config?.client_id || !config?.client_secret || !tokens?.refresh_token) throw new Error("Credenciais do Google Agenda incompletas.");
  const oauth = new google.auth.OAuth2(config.client_id, config.client_secret);
  oauth.setCredentials(tokens);
  return google.calendar({ version: "v3", auth: oauth });
}

export async function createCalendarBooking(input: CalendarBooking) {
  const calendar = await calendarClient();
  const response = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
    conferenceDataVersion: 1,
    sendUpdates: "all",
    requestBody: {
      summary: `Onboarding individual — ${input.candidateName}`,
      description: "Onboarding individual do processo seletivo Core Team AWS SBG UVV.",
      start: { dateTime: input.startsAt, timeZone: "America/Sao_Paulo" },
      end: { dateTime: input.endsAt, timeZone: "America/Sao_Paulo" },
      attendees: [{ email: input.candidateEmail, displayName: input.candidateName }],
      conferenceData: { createRequest: { requestId: `booking-${input.bookingId}`, conferenceSolutionKey: { type: "hangoutsMeet" } } },
    },
  });
  const meetUrl = response.data.hangoutLink ?? response.data.conferenceData?.entryPoints?.find((entry) => entry.entryPointType === "video")?.uri;
  if (!response.data.id || !meetUrl) throw new Error("O Google não retornou o evento ou o link do Meet.");
  return { eventId: response.data.id, meetUrl };
}

export async function deleteCalendarBooking(eventId: string) {
  const calendar = await calendarClient();
  await calendar.events.delete({ calendarId: process.env.GOOGLE_CALENDAR_ID || "primary", eventId, sendUpdates: "all" });
}
