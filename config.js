/* ============================================================
   SEVEN MADINAH WAREHOUSE - SETTINGS
   This is the only file you need to edit.
   ============================================================ */

const SEVEN_CONFIG = {

  /* --- 1. Where new-request notifications go --- */
  specialistEmail: "murad.alzaher@seven.sa",

  /* --- 2. EmailJS keys --- */
  emailjs: {
    publicKey:  "kzUtolJtp0KXWUjfo",
    serviceId:  "service_fkm16vs",
    templateId: "template_lz5a18x"
  },

  /* --- 3. Shared employee login -------------------------------
     Everyone in the warehouse uses this one account to
     submit and track requests.                                */
  employeeLogin: {
    username: "seven",
    password: "2026"
  },

  /* --- 4. Management accounts ---------------------------------
     Username is the person's first name.
     CHANGE THE NAMES to the real people.
     role must stay as specialist / ops / gm.                  */
  staffLogins: [
    { username: "murad",    password: "2026", role: "specialist", label: "Senior Inventory Specialist" },
    { username: "abdullah", password: "2026", role: "ops",        label: "Head of Operations" },
    { username: "ahmed",    password: "2026", role: "gm",         label: "General Manager" }
  ]
};


/* ============================================================
   Helpers. Do not edit below this line.
   ============================================================ */
function sevenCheckLogin(username, password){
  var u = String(username||"").trim().toLowerCase();
  var p = String(password||"");
  var emp = SEVEN_CONFIG.employeeLogin;
  if(u === String(emp.username).toLowerCase() && p === String(emp.password)){
    return { role:"employee", label:"Employee", name:emp.username };
  }
  var list = SEVEN_CONFIG.staffLogins || [];
  for(var i=0;i<list.length;i++){
    if(u === String(list[i].username).toLowerCase() && p === String(list[i].password)){
      return { role:list[i].role, label:list[i].label, name:list[i].username };
    }
  }
  return null;
}

function sevenSession(){
  try{
    var raw = sessionStorage.getItem('seven-session');
    return raw ? JSON.parse(raw) : null;
  }catch(e){ return null; }
}
function sevenSetSession(s){
  try{ sessionStorage.setItem('seven-session', JSON.stringify(s)); }catch(e){}
}
function sevenClearSession(){
  try{ sessionStorage.removeItem('seven-session'); }catch(e){}
}
function sevenRequireLogin(allowedRoles){
  var s = sevenSession();
  if(!s || (allowedRoles && allowedRoles.indexOf(s.role) === -1)){
    location.href = 'index.html';
    return null;
  }
  return s;
}

function sevenAudit(action, details){
  try{
    var log = JSON.parse(localStorage.getItem('seven-audit-log') || '[]');
    var s = sevenSession();
    log.push({
      ts: new Date().toISOString(),
      by: (s && s.name) || 'unknown',
      role: (s && s.role) || '',
      action: action,
      details: details || ''
    });
    if(log.length > 3000) log = log.slice(log.length - 3000);
    localStorage.setItem('seven-audit-log', JSON.stringify(log));
  }catch(e){ /* audit logging must never block the real action */ }
}

function sevenSendMail(toEmail, subject, message){
  var cfg = SEVEN_CONFIG.emailjs;
  if(!toEmail) return Promise.resolve(false);
  if(!cfg.publicKey || !cfg.serviceId || !cfg.templateId) return Promise.resolve(false);
  if(typeof emailjs === "undefined") return Promise.resolve(false);
  try{
    emailjs.init({ publicKey: cfg.publicKey });
    return emailjs.send(cfg.serviceId, cfg.templateId, {
      to_email: toEmail,
      subject: subject,
      message: message
    }).then(function(){ return true; }).catch(function(err){ console.warn("Email failed:", err); return false; });
  }catch(err){
    console.warn("Email failed:", err);
    return Promise.resolve(false);
  }
}

function sevenRequestSummary(r){
  var lines = [
    "Request No: " + r.reqNo,
    "Date: " + r.dateDisplay,
    "Recipient: " + r.recipient + (r.dept ? " (" + r.dept + ")" : ""),
    "Requester email: " + (r.email || "-"),
    "Item: " + r.itemName + (r.itemCode ? " (" + r.itemCode + ")" : " (not in inventory)"),
    "Quantity requested: " + r.qtyRequested
  ];
  if(r.qtyApproved != null) lines.push("Quantity approved: " + r.qtyApproved);
  if(r.needsOrder) lines.push("NOTE: this item must be ordered - not available in stock.");
  lines.push("Reason: " + (r.reason || "-"));
  return lines.join("\n");
}
