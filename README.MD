# 🧾 PRD — Personal Time Tracker with AI Enrichment

## 🧠 Summary
Personal web application built with **SvelteKit + daisyUI + OpenRouter + Vercel** for tracking billable tasks, managing payment status, generating printable invoices, and enhancing task descriptions with AI. Includes a monthly summary powered by LLMs, with smart caching.

---

## 🎯 Goals

- Register clients, projects, and time entries (tasks).
- Set hourly rates per project.
- Mark tasks as billable or not.
- Track whether each entry has been paid.
- Filter, list, and export data.
- Generate printable invoices by project and date range.
- Use AI to enhance task descriptions.
- Display cached smart monthly summaries.

---

## 🧱 Data Model (Logical Structure)

### Client
- `id: string`
- `name: string`
- `email?: string`

### Project
- `id: string`
- `name: string`
- `clientId: string`
- `hourRate: number`

### Entry
- `id: string`
- `date: Date`
- `projectId: string`
- `description: string`
- `hours: number`
- `paymentStatus: "PENDING" | "PAID"`
- `billable: boolean` (default: `true`)

### MonthlySummary
- `id: string` (format: `YYYY-MM`)
- `summary: string`
- `checksum: string`
- `generatedAt: Date`

---

## 🔄 Core Flows

### Create client
- Input: name, optional email

### Create project
- Inputs: name, client selection, hourly rate

### Create time entry
- Inputs:
  - Project
  - Brief description
  - Duration (manual input or via timer)
  - "Billable" checkbox (default: checked)

### Enrich description (AI)
- Magic wand button (`🪄`) next to input
- Calls OpenAI to rewrite short text into clear, professional description

### Generate invoice
- Modal form:
  - Select project
  - Date range
  - Invoice number
  - Due date
- Redirects to dynamic preview page with:
  - Client/project info
  - Task table (billable + pending only)
  - Totals
  - Print/export button

---

## 📊 Monthly Summary with AI

- Natural language summary of activity during a given month
- Includes hours worked, projects, payment status, and estimated income
- Generated with GPT (LLM)
- Cached using a `checksum` based on relevant entries
- Only regenerates when data changes

---

## ✅ AI Features

### 1. Enrich task description
- Uses LLM to rewrite short or vague task descriptions
- Prompt: friendly, clear, professional, freelancer tone

### 2. Monthly summary generation
- LLM-generated overview of the month’s work
- Uses `sha256` hash of all relevant time entries to determine if regeneration is needed

---

## 💻 Tech Stack

- **Frontend**: SvelteKit + Tailwind CSS + daisyUI
- **Backend / DB**: SQLite (optionally Redis or Supabase)
- **AI API**: OpenAI (GPT-3.5-turbo or Instruct)

---

## 📌 Notes

- Single-user personal app (no auth needed for now)
- Could expand to multi-user in the future
- Designed to be fast, offline-capable, and portable
