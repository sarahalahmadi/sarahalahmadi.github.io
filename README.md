[README.md](https://github.com/user-attachments/files/30945767/README.md)
# SEVEN Madinah — Material Request System

## Files

| File | Purpose | Password |
|---|---|---|
| `config.js` | Settings: emails and passwords. The file you edit. | - |
| `data.js` | Employee, item and entity lists from your Excel file. | - |
| `index.html` | Employee submits a request | No |
| `track.html` | Employee checks their own request status | No |
| `log.html` | Specialist, Head of Operations, General Manager | Yes |

Upload all five to the root of your repository.

`data.js` currently holds **61 employees, 1138 items and 6 recipient entities**, read straight from the reference sheet of your workbook. You do not normally edit it by hand. Uploading a new Excel file in the Staff Portal overrides it.

---

## Logins

The site now opens on a sign-in screen. Nobody sees anything until they log in.

**Employees** share one account:

| Username | Password |
|---|---|
| seven | 2026 |

Signing in with this takes them to the request form and the tracking page. They never see the approvals portal.

**Management** each have their own account, username is their first name. Edit these in `config.js`:

```javascript
staffLogins: [
  { username: "murad",    password: "2026", role: "specialist", label: "Senior Inventory Specialist" },
  { username: "abdullah", password: "2026", role: "ops",        label: "Head of Operations" },
  { username: "ahmed",    password: "2026", role: "gm",         label: "General Manager" }
]
```

Change the usernames to the real first names and set proper passwords. Keep the `role` values exactly as they are, they control who approves what.

Signing in with a management account goes straight to the staff portal.

**A word on what this login is and is not.** It keeps ordinary staff out of the approvals screen and makes the system feel like a proper internal tool. It is not real security. The credentials sit in a file the browser downloads, so anyone who views the page source can read them. That is a limitation of hosting a static site, not a bug. It is fine for a warehouse intake form. Do not reuse any password anyone uses elsewhere.

## Setup, step 2: turn on email notifications

A website hosted on GitHub Pages cannot send email by itself. EmailJS does the sending. It is free for 200 emails a month and takes about five minutes.

1. Go to emailjs.com and create an account.
2. **Email Services** > Add New Service > connect the mailbox the notifications will be sent from. Copy the **Service ID**.
3. **Email Templates** > Create New Template. Set it up exactly like this:
   - To Email: `{{to_email}}`
   - Subject: `{{subject}}`
   - Content: `{{message}}`

   Save it and copy the **Template ID**.
4. **Account** > copy your **Public Key**.
5. Paste all three into `config.js`.

That single template handles every notification. Do not add other fields to it.

### What gets sent, and to whom

| Event | Email goes to |
|---|---|
| Employee submits a request | Inventory specialist |
| Head of Operations approves | The employee |
| Head of Operations rejects | The employee, with the reason |
| General Manager approves | The employee, and the specialist |
| General Manager rejects | The employee, with the reason |
| Specialist marks it issued | The employee |

The employee's email is only collected so these notifications can reach them.

If you leave the EmailJS fields blank, everything else still works. Nothing is emailed, and the request is still saved and visible in the portal.

---

## What the employee sees

Employees do not see stock levels. The item list shows the name and code only, never the quantity on hand. They can request any quantity, including more than the warehouse holds, and the request goes through normally.

When an employee needs something that is not in the inventory list, they pick **Other** at the top of the item list and type a description of what they need.

Whenever a request cannot be filled from stock, either because the quantity exceeds what is available or because it is an Other item, the system flags it automatically. The status reads **Need to Order** all the way through the approval chain, so management can see at a glance that this one needs purchasing rather than picking from a shelf. The Excel export has a **Need To Order** column for the same reason. The flag clears once the request is issued.

## Searching for names and items

The employee, entity and item fields are type-ahead search boxes, not dropdowns. Start typing and matches appear immediately. With 61 employees and over a thousand items, nobody has to scroll.

- Employees match on **name or employee ID**
- Items match on **item name or item code**
- Names that start with what you typed are listed first
- Arrow keys move through results, Enter picks the highlighted one, the small x clears the field

A request will not submit unless a name is actually picked from the list, so typos cannot create a mismatched record.

## Updating the lists later

Sign in to `log.html` as Specialist, go to **Reference Data**, upload your Excel file. It reads the reference sheet and matches columns by header name, in Arabic or English. That upload replaces what is in `data.js` for that browser, and never affects saved requests.

---

## Approval flow

```
Employee submits
   -> Pending Head of Operations   (approves and sets the approved quantity, or rejects)
   -> Pending General Manager      (approves or rejects)
   -> Approved, awaiting issue     (specialist marks issued, adds voucher number)
   -> Issued, moves to Archive
```

Marking a request issued deducts the approved quantity from that item's stock balance.

Rejections go straight to the archive with the reason recorded.

---

## Records and backups

In the **Export and Backup** tab, specialist only:

- **Download Full Excel Record** gives a workbook with three sheets: All Requests, Active, Archive. Includes both approval columns, approver names, dates and notes.
- **Download Backup File** saves a `.json` with every request, approval and reference list.
- **Restore from Backup** merges a backup back in without overwriting anything.

Download a backup weekly, and always before clearing browser data or changing computers.

---

## How data is stored

Everything is stored in the browser on the device where it was entered.

- Survives closing the tab, restarting the browser, and site updates
- Works offline, costs nothing
- **Does not move between devices.** A request submitted on a phone will not appear on the specialist's laptop.

This works well if the warehouse uses one shared computer. If requests come from many devices, the system needs a real backend. Given the SharePoint file already in use, Power Apps with a SharePoint list is the natural fit, and it has approvals and notifications built in.

---

*SEVEN Madinah Complex, Warehouse Operations*


---

## New: Suppliers, Locations, Reports, Audit Log

Four new tabs in the staff portal, specialist only.

**Suppliers** — a contact list: name, contact person, phone, notes. Not linked to specific items, just a reference sheet for who you order from.

**Locations** — physical storage areas: a code (e.g. A-01), a name, and notes. A simple reference list for where things are kept.

**Reports** — four live tables computed from your actual data:
- Stock under 10 units, sorted lowest first
- Most requested items, by total quantity across all requests
- Requests per month
- Requests per department or entity

**Audit Log** — every sign-in, request submission, approval, rejection, deletion, and reference-data change is recorded automatically, with who did it, their role, and when. Not editable from inside the app. Exports to Excel from the tab itself.

All four store their data in the same browser local storage as everything else, so the same per-device limitation applies: a supplier added on one computer will not show up on another until that device also has it entered.

### What this does not include yet

A few things from the local system you shared are real architectural changes, not additions to this one, and need their own dedicated build:

- **Encrypted logins** (PBKDF2 + AES-GCM) in place of the current config.js passwords
- **Shared OneDrive-folder sync**, which is the actual fix for the multi-device problem
- **Employee offboarding / clearance tracking** against custody
- **Purchase-order matching** against receipts
- **Arabic item-name translation layer**

Say the word on any of these and I'll scope and build it next.
