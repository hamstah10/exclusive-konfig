## Ziel

Den kompletten Ankauf-Flow aus dem AutoFux-Projekt 1:1 funktional übernehmen, aber visuell und strukturell vollständig in die bestehende exclusiv-Automobile-Rügen-Seite integrieren. Eigener Bereich unter `/ankauf`, eigener Voice-Button (ElevenLabs), eigenes Admin-Modul `/portal/ankauf`.

## Scope-Abgrenzung

**Übernommen** (gehört zum Ankauf):
Bewertungs-Funnel (5 Schritte), KI-Bewertung, Voice-Agent (ElevenLabs), Foto-Upload + KI-Foto-Analyse, Lead-Score, Lead-Emails an Kunde + Admin, Telegram-Benachrichtigung, Follow-Up-Automation, Markt-Daten-Scraping, Funnel-Analytics-Dashboard, Business-Dashboard (Käufe/Marge), Lead-Timeline, Kaufvertrag-PDF, Wochen-Report.

**NICHT übernommen** (ist Verkaufs-Seite, eigener Vertrieb, oder doppelt vorhanden):
Public-Fahrzeug-Listings (`/fahrzeuge` ist schon da), Watchlist, Hero-Model, Inserate/Marketplace-Export, AB-Preis-Vorschläge, Stripe/Reservierungen, Vehicle-Database als Nachschlagwerk (du hast bereits eigene Vehicle-DB-API), AdminLayout/AdminSidebar (eigenes Portal vorhanden).

## Routen & Integration

```
/ankauf                  → Bewertungs-Funnel (5 Schritte)
/ankauf/danke            → Bestätigungsseite mit Preis-Range
/portal/ankauf           → Lead-Liste (Ankauf-Leads)
/portal/ankauf/:id       → Lead-Detail (Timeline, Foto-Analyse, Markt-Daten, Kaufvertrag, Email-Historie)
/portal/ankauf/analytics → Funnel-Analytics
/portal/ankauf/business  → Business-Dashboard (Käufe, Marge, Aufwand)
```

Voice-Button (Mikrofon, gold) wird global gemountet und steuert ausschließlich den Ankauf-Funnel — vor Verbindung navigiert er bei Bedarf nach `/ankauf`.

## Datenbank (neue Tabellen)

Eigene `valuation_leads`-Tabelle, damit der bestehende `leads`-Flow (Verkauf/Konfigurator) nicht beeinflusst wird:

- `valuation_leads` — Fahrzeugdaten, Zustand, Kontakt, Termin, KI-Bewertung (`min_eur`, `typical_eur`, `max_eur`, `rationale`), Foto-URLs, Status (`neu`, `qualifiziert`, `kontaktiert`, `termin`, `gekauft`, `abgesagt`), `lead_score`, `purchased_at`, `purchase_price`, `sold_at`, `sale_price`, `expenses_eur`, `admin_notes`.
- `valuation_market_data` — Markt-Vergleichspreise pro Lead.
- `valuation_photo_analysis` — KI-Befunde + Re-Bewertung pro Lead.
- `valuation_lead_events` — Timeline-Events.
- `analytics_events` — Funnel-Tracking (`source = 'valuation_funnel'`).
- `purchase_contracts` — generierte PDFs/Vertragsdaten.
- `follow_up_jobs` + Cron — automatische Erinnerungen.

Storage-Bucket `valuation-photos` (öffentlich-lesbar mit signierten URLs für Detail-Ansicht).

RLS: Insert öffentlich (anon + authenticated), Select/Update nur Admin (über vorhandene `has_role`).

## Edge Functions (übernommen / angepasst)

- `valuate-vehicle` — KI-Bewertung über Lovable AI Gateway (gpt-5 für Reasoning).
- `analyze-lead-photos` — Foto-Analyse via gemini-2.5-pro (Vision), aktualisiert Bewertung.
- `compute-lead-score` — heuristische Score-Berechnung.
- `scrape-market-data` — Markt-Vergleichspreise.
- `notify-lead-telegram` — Telegram-Bot-Nachricht (optional, nur wenn `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID` gesetzt).
- `send-transactional-email` + `process-email-queue` + `auth-email-hook` — Email-Infrastruktur (nur wenn nicht schon vorhanden).
- `process-follow-ups` — Cron-Job für Follow-Up-Versand.
- `generate-counter-replies` — KI-Antworten für Preisverhandlung.
- `generate-purchase-contract` — Kaufvertrag als PDF.
- `send-weekly-report` — Wochen-Zusammenfassung an Admin.
- `elevenlabs-conversation-token` — neu, generiert WebRTC-Token (Agent-ID übernommen).

## Voice-Agent

ElevenLabs React-SDK (`@elevenlabs/react`). Agent-ID aus AutoFux übernommen (`agent_6201kpp7yr7zfa5rzr5ebzhszytx`) — kann später in den Settings ausgetauscht werden. Client-Tools `setVehicleData` / `setConditionData` / `setContactData` / `setAppointmentData` / `openValuationFunnel` / `submitValuation` füllen den Funnel live mit Typewriter-Effekt. Authentifizierung über serverseitig generierten Conversation-Token (`elevenlabs-conversation-token`-Edge-Function), damit der API-Key nie im Client landet.

## Branding-Anpassung

Funnel und Admin-Module werden auf das exclusiv-Design umgestellt:
- `SiteHeader` (overlay/solid) + `SiteFooter` statt AutoFux-Header.
- Container `max-w-5xl mx-auto px-6`, Stepper in Gold/Dark-Navy.
- Headlines `font-display` mit Gold-Hervorhebung im Eyebrow-Pattern.
- Buttons als bestehende `Button`-Komponente, primär Gold.
- Voice-Button rund, Gold (`bg-[hsl(var(--brand-gold))]`), Schatten `shadow-elegant`.
- Admin-Seiten nutzen das vorhandene `/portal`-Layout.

## Komponenten-Mapping

| AutoFux | Hier |
|---|---|
| `pages/Bewertung.tsx` | `pages/AnkaufFunnel.tsx` |
| `pages/Danke.tsx` | `pages/AnkaufDanke.tsx` |
| `components/funnel/*` | `components/ankauf/*` (komplett übernommen, Klassen umgeschrieben) |
| `components/voice/VoiceAgentButton.tsx` | `components/ankauf/VoiceAgentButton.tsx` |
| `contexts/ValuationDraftContext` | 1:1 übernommen |
| `contexts/FunnelProgressContext` | 1:1 übernommen |
| `hooks/use-vehicle-valuation` | 1:1 übernommen |
| `lib/valuation-schema` / `valuation-draft-mapper` / `lead-submission` / `analytics` | 1:1 übernommen, `submitLead` schreibt in `valuation_leads` |
| `pages/admin/LeadDetail` | `pages/portal/AnkaufLeadDetail.tsx` |
| `components/admin/AdminDashboard` | `pages/portal/AnkaufDashboard.tsx` |
| `components/admin/BusinessDashboard` | `pages/portal/AnkaufBusiness.tsx` |
| `components/admin/FunnelAnalyticsDashboard` | `pages/portal/AnkaufAnalytics.tsx` |
| `components/admin/PhotoAnalysisPanel` / `PurchaseContractCard` / `LeadTimeline` / `MarketDataPanel` / `LeadScoreBadge` / `LeadEmailHistory` | übernommen |

## API-Keys / Secrets

- `LOVABLE_API_KEY` ✅ vorhanden (für Bewertung, Foto-Analyse, Counter-Replies).
- `ELEVENLABS_API_KEY` — wird angefragt.
- `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` — optional, wird angefragt (Telegram sonst übersprungen).
- Email-Versand: Mailgun/Resend-Connector wird zum Schluss vorgeschlagen, sofern noch keiner verbunden ist.

## Umsetzung in 6 Schritten

1. **DB-Schicht** — Migration für `valuation_leads`, `valuation_market_data`, `valuation_photo_analysis`, `valuation_lead_events`, `analytics_events`, `purchase_contracts`, `follow_up_jobs`, RLS, Storage-Bucket `valuation-photos`.
2. **Funnel-Frontend** — `lib/valuation-schema`, Contexts, Hook, Schritt-Komponenten in `components/ankauf/*`, Seiten `/ankauf` + `/ankauf/danke`, im exclusiv-Look mit `SiteHeader`/`SiteFooter`.
3. **Edge Functions Bewertung** — `valuate-vehicle`, `compute-lead-score`, `analyze-lead-photos`, `scrape-market-data` deployen + Live-Bewertung im Funnel.
4. **Voice-Agent** — `@elevenlabs/react` installieren, Edge-Function `elevenlabs-conversation-token`, `VoiceAgentButton` global mounten, Client-Tools verdrahten.
5. **Notifications & Automation** — Telegram, Email-Infra (falls nötig), Follow-Ups, Counter-Replies, Wochen-Report; Bestätigungs-Mail nach Lead-Submit.
6. **Admin-Module** — Lead-Liste, Lead-Detail (Timeline, Markt, Foto-Analyse, Vertrag, Email-Historie), Funnel-Analytics, Business-Dashboard unter `/portal/ankauf/*` integriert.

Nach Schritt 1 melde ich mich für die Migration-Bestätigung; Secrets (`ELEVENLABS_API_KEY`) frage ich vor Schritt 4 an.