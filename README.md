[README.md](https://github.com/user-attachments/files/30688911/README.md)# SEVEN Madinah — Material Request System

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

## Setup, step 1: passwords and email

Open `config.js`. Everything you need is at the top:

```javascript
specialistEmail: "",        // the inventory specialist's address

emailjs: { publicKey:"", serviceId:"", templateId:"" },

roles: {
  specialist: { label:"Senior Inventory Specialist", password:"specialist123" },
  ops:        { label:"Head of Operations",          password:"ops123" },
  gm:         { label:"General Manager",             password:"gm123" }
}
```

Change the three passwords. Put the specialist's email address in `specialistEmail`.

---

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
