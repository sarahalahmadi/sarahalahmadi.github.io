/* ============================================================
   SEVEN MADINAH WAREHOUSE — SETTINGS
   This is the only file you need to edit.
   ============================================================ */

const SEVEN_CONFIG = {

  /* --- 1. Where new-request notifications go --- */
  specialistEmail: "",          // e.g. "specialist@seven.sa"

  /* --- 2. EmailJS keys (see README for the 5-minute setup) ---
     Leave blank and the system still works, it just will not
     send email automatically.                                  */
  emailjs: {
    publicKey:  "",
    serviceId:  "",
    templateId: ""
  },

  /* --- 3. Staff passwords --- */
  roles: {
    specialist: { label: "Senior Inventory Specialist", password: "specialist123" },
    ops:        { label: "Head of Operations",          password: "ops123" },
    gm:         { label: "General Manager",             password: "gm123" }
  }
};


/* ============================================================
   Mail sender. Do not edit below this line.
   ============================================================ */
function sevenSendMail(toEmail, subject, message){
  const cfg = SEVEN_CONFIG.emailjs;
  if(!toEmail) return Promise.resolve(false);
  if(!cfg.publicKey || !cfg.serviceId || !cfg.templateId) return Promise.resolve(false);
  if(typeof emailjs === "undefined") return Promise.resolve(false);
  try{
    emailjs.init({ publicKey: cfg.publicKey });
    return emailjs.send(cfg.serviceId, cfg.templateId, {
      to_email: toEmail,
      subject: subject,
      message: message
    }).then(()=>true).catch(err=>{ console.warn("Email failed:", err); return false; });
  }catch(err){
    console.warn("Email failed:", err);
    return Promise.resolve(false);
  }
}

function sevenRequestSummary(r){
  const lines = [
    "Request No: " + r.reqNo,
    "Date: " + r.dateDisplay,
    "Recipient: " + r.recipient + (r.dept ? " (" + r.dept + ")" : ""),
    "Requester email: " + (r.email || "-"),
    "Item: " + r.itemName + " (" + r.itemCode + ")",
    "Quantity requested: " + r.qtyRequested
  ];
  if(r.qtyApproved != null) lines.push("Quantity approved: " + r.qtyApproved);
  lines.push("Reason: " + (r.reason || "-"));
  return lines.join("\n");
}
