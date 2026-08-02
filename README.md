[README.md](https://github.com/user-attachments/files/30632997/README.md)
# SEVEN Madinah — Material Request System

Two files, deployed together on GitHub Pages.

| File | Who uses it | Password? |
|---|---|---|
| `index.html` | Any employee submitting a request | No |
| `log.html` | Specialist, Head of Operations, General Manager | Yes — one password per role |

---

## 1. Change the passwords (do this first)

Open `log.html`, find this block near the bottom (search for `const ROLES`):

```javascript
const ROLES = {
  specialist: { label:"Senior Inventory Specialist", password:"specialist123" },
  ops:        { label:"Head of Operations",          password:"ops123" },
  gm:         { label:"General Manager",             password:"gm123" }
};
```

Replace the three passwords. Give each person only their own.

---

## 2. Set the notification email

Open `index.html`, search for `const CONFIG`:

```javascript
const CONFIG = {
  specialistEmail: "",              // put the specialist's email here
  emailjs: { publicKey:"", serviceId:"", templateId:"" }
};
```

**Option A — manual (works immediately).** Fill in `specialistEmail` only. After submitting, the employee sees an "Email the Specialist" button that opens their mail app with the full request details pre-written. They just press send.

**Option B — automatic.** A static site cannot send email on its own, so this needs a free third-party service:

1. Sign up at emailjs.com (free tier: 200 emails/month)
2. Connect your email account, create a template
3. Copy your Public Key, Service ID and Template ID into the `emailjs` block

Template variables available: `to_email`, `request_no`, `request_date`, `recipient`, `department`, `employee_email`, `item_name`, `item_code`, `qty`, `reason`.

Once filled in, the specialist is emailed automatically on every submission.

---

## 3. Load your Excel data

Sign in as Specialist, go to **Reference Data**, upload your `.xlsx`. It reads the القوائم المرجعية sheet and matches columns by header name, so it keeps working when you add rows later. Uploading never touches saved requests.

---

## The approval flow

```
Employee submits
   -> Pending Head of Operations   (Ops approves + sets approved qty, or rejects)
   -> Pending General Manager      (GM approves or rejects)
   -> Approved, awaiting issue     (Specialist marks issued + voucher no.)
   -> Issued  ->  moves to Archive
```

Rejections at any stage go straight to Archive with the reason recorded.
Marking a request issued automatically deducts the approved quantity from that item's stock balance.

Every request keeps its full voucher permanently. Open it from any table by clicking the request number, then print or save as PDF.

---

## Excel records and backups

**Export & Backup** tab (Specialist only):

- **Download Full Excel Record** — workbook with three sheets: All Requests, Active, Archive. Bilingual headers matching your original file, including both approval columns, approver names, dates and notes.
- **Active Requests Only** / **Export Archive to Excel** — narrower exports.
- **Download Backup File** — a `.json` containing every request, every approval and your reference lists.
- **Restore from Backup** — merges a backup back in. It only adds requests that aren't already there, so restoring is safe and never overwrites.

**Download a backup weekly, and always before clearing browser data or changing computers.**

---

## Important: how data is stored

Everything is saved in the browser's own storage on the device where it was entered. This means:

- Data survives closing the tab, restarting the browser, and site updates
- Works offline, nothing leaves the device, no monthly cost
- **Data does not travel between devices.** A request submitted on an employee's phone will not appear on the specialist's laptop.

For a single shared warehouse computer this works well. If requests will be submitted from many different devices, the system needs a real backend database — see below.

### Moving to shared central storage

Three options, cheapest first:

1. **Google Sheets + Apps Script** — free. The form posts each request into a Google Sheet, which also sends the notification email. Everyone sees the same live data, and you get the Excel record automatically.
2. **Supabase or Firebase** — free tier, a real database, proper user logins, instant sync.
3. **Microsoft Power Apps + SharePoint list** — fits your existing SEVEN SharePoint setup and Microsoft accounts, with approvals built into Power Automate.

Option 3 is likely the best long-term fit given the SharePoint inventory file you already use.

---

## Deploying

Put `index.html` and `log.html` in the root of your `username.github.io` repository. Settings, then Pages, then deploy from `main` branch. Live at `https://username.github.io` within a minute or two.

---

*SEVEN Madinah Complex · Warehouse Operations*
