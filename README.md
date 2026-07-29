# SEVEN Madinah Material Request Web App

A production-ready material request tracking system for warehouse operations, deployed on GitHub Pages.

## Files

- **index.html** — Public request submission form (employees submit material requests here)
- **log.html** — Password-protected saved requests log and reference data manager (senior inventory specialist only)

## Setup Instructions

### 1. Deploy to GitHub Pages

1. Create a new repository named `username.github.io` (replace `username` with your GitHub username, all lowercase)
2. Upload both `index.html` and `log.html` to the root of that repository
3. Go to **Settings → Pages** and make sure "Build and deployment" is set to deploy from the `main` branch
4. Your site will be live at `https://username.github.io` in a minute or two

### 2. Change the Admin Password

**IMPORTANT:** The default password is `specialist123`. You **must** change this before going live.

In `log.html`, find this line (around line 450 in the JavaScript):
```javascript
const SPECIALIST_PASSWORD = "specialist123"; // Change this to your own password
```

Replace `specialist123` with your own secure password.

### 3. Load Your Employee & Item Lists

1. Go to `https://username.github.io/log.html`
2. Enter your password
3. Under "Reference Data", click "Choose File" and upload your Excel workbook
4. The app reads from the "القوائم المرجعية" (reference) sheet and auto-detects columns like:
   - اسم الموظف (Employee Name)
   - الرقم الوظيفي (Employee ID)
   - القسم (Department)
   - اسم الصنف (Item Name)
   - كود الصنف (Item Code)
   - الرصيد المتاح (Available Balance)
   - الجهات المستلمة (Recipient Entities)

If your Excel sheet has different headers, you can also paste tab-separated data manually in the textboxes below.

## How It Works

### Request Form (index.html)
- **Public, no password needed**
- Employees select their name or department, choose an item, enter quantity and reason
- Submits a request and prints/saves a digital voucher
- All submissions are saved automatically to the browser's local storage

### Saved Requests Log (log.html)
- **Password protected** — only senior inventory specialist can access
- View all submitted requests in a table
- Delete individual requests or clear the entire log
- Upload updated Excel files to refresh employee/item lists
- Manually edit reference data by pasting from Excel

## Data Storage

All data is stored in your **browser's localStorage**, which persists even after closing the page. This means:
- ✅ Requests are saved locally on the device/browser
- ✅ Survives page refreshes, browser restarts, and updates
- ✅ Works completely offline
- ⚠️ Data is specific to this browser (won't sync across devices)

If you need **central cloud storage** (so requests from multiple devices appear in one place), contact us for a Firebase/Supabase integration.

## Updating Employee & Item Lists

Two options:

**Option 1: Upload Excel file** (recommended)
1. Update your Excel file with new employees or items
2. Go to Saved Requests → Reference Data → Upload your Excel file
3. Changes take effect immediately

**Option 2: Paste manually**
1. Copy-paste from Excel into the textboxes (tab-separated)
2. Click "Save Reference Data"

## Printing/Downloading Requests

After submitting a request, employees can:
- Click "Print / Save as PDF" to create a digital copy
- Use browser's print dialog (Ctrl+P or Cmd+P) to save as PDF

## Support

If you need to:
- Add more fields to requests (cost center, priority level, etc.)
- Integrate with a real database (so requests sync across devices)
- Change the design or layout
- Add SMS/email notifications when requests are submitted

…let me know and I can extend the app.

---

**Built for SEVEN Madinah Complex Warehouse Operations**  
Last updated: July 2026
