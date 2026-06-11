import { useState, useRef, useEffect, useCallback } from "react";

const ADMIN_ACCOUNT = { username: "admin", password: "Admin@KCH2024", email: "admin@kalbe.co.id", phone: "08111234567", role: "admin", initials: "AD", name: "Admin KCH" };
const COLORS = { green: { bg: "#085041", mid: "#1D9E75", light: "#E1F5EE", text: "#0F6E56" }, blue: { bg: "#0C447C", mid: "#378ADD", light: "#E6F1FB", text: "#185FA5" } };

const css = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{--green-dark:#085041;--green-mid:#1D9E75;--green-light:#E1F5EE;--blue-dark:#0C447C;--blue-mid:#378ADD;--blue-light:#E6F1FB;--red:#E24B4A;--gray-bg:#f0f4f8;--card-bg:#fff;--border:#dde5ef;--text:#1a2533;--text2:#4a5a6a;--muted:#7a8a9a}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;background:var(--gray-bg);color:var(--text);line-height:1.6}
  button{font-family:inherit;cursor:pointer}
  input,select,textarea{font-family:inherit}
  ul{list-style:none}
  .app{min-height:100vh;background:var(--gray-bg)}

  /* AUTH SCREEN */
  .auth-screen{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#04342C 0%,#042C53 100%);padding:20px}
  .auth-card{background:#fff;border-radius:16px;width:100%;max-width:440px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.3)}
  .auth-brand{background:linear-gradient(135deg,#085041,#0C447C);padding:28px 32px;display:flex;align-items:center;gap:14px}
  .auth-logo{width:52px;height:52px;background:#fff;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#085041;line-height:1.2;text-align:center}
  .auth-brand-text .t1{color:#fff;font-size:17px;font-weight:700}
  .auth-brand-text .t2{color:rgba(159,225,203,0.85);font-size:12px}
  .auth-tabs{display:flex;border-bottom:1px solid #e5e7eb}
  .auth-tab{flex:1;padding:14px;font-size:14px;font-weight:500;border:none;background:transparent;color:#6b7280;transition:all .15s;border-bottom:2px solid transparent;cursor:pointer}
  .auth-tab.active{color:#085041;border-bottom-color:#1D9E75;background:#f9fafb}
  .auth-body{padding:28px 32px}
  .auth-body h3{font-size:18px;font-weight:600;margin-bottom:6px;color:#1a2533}
  .auth-body p{font-size:13px;color:#6b7280;margin-bottom:22px}
  .field{margin-bottom:16px}
  .field label{display:block;font-size:12px;font-weight:600;color:#4a5a6a;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em}
  .field input{width:100%;padding:10px 13px;border:1px solid #dde5ef;border-radius:8px;font-size:13px;color:#1a2533;outline:none;transition:border-color .15s}
  .field input:focus{border-color:#1D9E75;box-shadow:0 0 0 3px rgba(29,158,117,.1)}
  .field-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .auth-note{font-size:11px;color:#9ca3af;background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;margin-bottom:16px;line-height:1.5}
  .auth-note strong{color:#374151}
  .btn-primary{width:100%;padding:11px;border-radius:8px;border:none;background:linear-gradient(135deg,#085041,#0C447C);color:#fff;font-size:14px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px;transition:opacity .15s;margin-top:4px}
  .btn-primary:hover{opacity:.9}
  .btn-primary:disabled{opacity:.6;cursor:not-allowed}
  .auth-err{background:#fef2f2;border:1px solid #fecaca;border-radius:6px;padding:10px 13px;font-size:12px;color:#991b1b;margin-bottom:14px}

  /* TOPBAR */
  .topbar{position:sticky;top:0;z-index:100;height:60px;background:linear-gradient(135deg,#085041 0%,#0C447C 100%);display:flex;align-items:center;justify-content:space-between;padding:0 28px;border-bottom:1px solid rgba(255,255,255,.08);box-shadow:0 2px 16px rgba(0,0,0,.18)}
  .brand{display:flex;align-items:center;gap:12px}
  .brand-logo{width:38px;height:38px;background:#fff;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#085041;line-height:1.2;text-align:center;flex-shrink:0}
  .brand-title{color:#fff;font-size:15px;font-weight:600}
  .brand-sub{color:rgba(159,225,203,.85);font-size:11px}
  .topbar-right{display:flex;align-items:center;gap:10px}
  .top-btn{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.22);color:#fff;border-radius:6px;padding:7px 16px;font-size:13px;font-weight:500;display:flex;align-items:center;gap:6px;transition:background .15s}
  .top-btn:hover{background:rgba(255,255,255,.22)}
  .top-btn.icon-btn{padding:7px 10px}
  .user-avatar{width:34px;height:34px;border-radius:50%;background:var(--green-mid);border:2px solid rgba(255,255,255,.3);display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:600;cursor:pointer;position:relative}
  .user-avatar.admin-av{background:#D85A30}
  .avatar-menu{position:absolute;top:42px;right:0;background:#fff;border:1px solid #dde5ef;border-radius:10px;box-shadow:0 8px 30px rgba(0,0,0,.15);min-width:180px;z-index:200;overflow:hidden}
  .avatar-menu-item{padding:10px 16px;font-size:13px;color:#374151;display:flex;align-items:center;gap:9px;cursor:pointer;transition:background .1s}
  .avatar-menu-item:hover{background:#f9fafb}
  .avatar-menu-item.danger{color:#dc2626}
  .avatar-menu-item.danger:hover{background:#fef2f2}
  .avatar-menu-divider{height:1px;background:#e5e7eb}

  /* MAIN */
  .main-content{max-width:1280px;margin:0 auto;padding:24px 24px 48px}
  .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:22px}
  .stat-card{background:#fff;border-radius:14px;border:1px solid var(--border);padding:18px 20px;position:relative;overflow:hidden;transition:border-color .15s,transform .15s}
  .stat-card:hover{border-color:#b8c8dc;transform:translateY(-1px)}
  .stat-icon{position:absolute;top:16px;right:18px;font-size:28px;opacity:.18}
  .stat-icon.g{color:var(--green-mid)} .stat-icon.b{color:var(--blue-mid)}
  .stat-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:8px}
  .stat-val{font-size:28px;font-weight:700;line-height:1;margin-bottom:6px}
  .stat-val.g{color:var(--green-mid)} .stat-val.b{color:var(--blue-mid)}
  .stat-sub{font-size:12px;color:var(--muted);display:flex;align-items:center;gap:3px}
  .tab-bar{display:flex;gap:6px;background:#fff;border-radius:14px;border:1px solid var(--border);padding:6px;margin-bottom:22px}
  .tab-btn{flex:1;padding:11px 20px;border-radius:10px;border:none;background:transparent;font-size:14px;font-weight:500;display:flex;align-items:center;justify-content:center;gap:8px;color:var(--text2);transition:all .18s}
  .tab-btn:hover{background:#f0f4f8;color:var(--text)}
  .tab-btn.active-wts{background:linear-gradient(135deg,#085041,#0F6E56);color:#fff;box-shadow:0 2px 10px rgba(15,110,86,.3)}
  .tab-btn.active-wtb{background:linear-gradient(135deg,#0C447C,#185FA5);color:#fff;box-shadow:0 2px 10px rgba(24,95,165,.3)}
  .tab-badge{background:rgba(255,255,255,.2);border-radius:20px;padding:2px 9px;font-size:11px;font-weight:600}
  .tab-badge.ig{background:var(--green-light);color:var(--green-text,#0F6E56)}
  .tab-badge.ib{background:var(--blue-light);color:#185FA5}
  .sidebar-layout{display:grid;grid-template-columns:1fr 260px;gap:24px}
  .content-area{}
  .section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
  .section-title{font-size:15px;font-weight:600;display:flex;align-items:center;gap:8px;color:var(--text)}
  .section-title i{color:var(--green-mid)}
  .pill{font-size:11px;padding:3px 10px;border-radius:20px;font-weight:500}
  .pill.g{background:var(--green-light);color:#0F6E56} .pill.b{background:var(--blue-light);color:#185FA5}

  /* FILTER BAR */
  .filter-bar{display:flex;align-items:center;gap:8px;margin-bottom:18px;flex-wrap:wrap}
  .search-box{flex:1;min-width:200px;display:flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--border);border-radius:8px;padding:0 12px}
  .search-box i{color:var(--muted);font-size:16px;flex-shrink:0}
  .search-box input{flex:1;border:none;outline:none;padding:9px 0;font-size:13px;color:var(--text);background:transparent}
  .filter-chip{padding:7px 14px;border-radius:20px;border:1px solid var(--border);background:#fff;font-size:12px;font-weight:500;color:var(--text2);transition:all .15s;cursor:pointer;white-space:nowrap}
  .filter-chip:hover{border-color:#b8c8dc;color:var(--text)}
  .filter-chip.active{background:var(--green-mid);border-color:var(--green-mid);color:#fff}
  .filter-chip.active-b{background:var(--blue-mid);border-color:var(--blue-mid);color:#fff}

  /* CARDS */
  .cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px}
  .product-card{background:#fff;border-radius:14px;border:1px solid var(--border);overflow:hidden;transition:border-color .15s,transform .15s,box-shadow .15s;position:relative}
  .product-card:hover{border-color:#b8c8dc;transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.08)}
  .card-img{height:140px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
  .card-img.green-bg{background:var(--green-light)} .card-img.blue-bg{background:var(--blue-light)}
  .card-img i{font-size:40px;opacity:.4}
  .card-img.green-bg i{color:var(--green-mid)} .card-img.blue-bg i{color:var(--blue-mid)}
  .card-img img{width:100%;height:100%;object-fit:cover}
  .card-badge{position:absolute;top:10px;right:10px;font-size:10px;font-weight:600;padding:3px 8px;border-radius:4px}
  .badge-v{background:#064e3b;color:#a7f3d0} .badge-wts{background:#1D9E75;color:#fff} .badge-wtb{background:#378ADD;color:#fff}
  .badge-admin{background:#991b1b;color:#fecaca}
  .card-body{padding:14px}
  .card-cat{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px}
  .card-cat.g{color:var(--green-mid)} .card-cat.b{color:var(--blue-mid)}
  .card-title{font-size:14px;font-weight:600;color:var(--text);margin-bottom:6px;line-height:1.4}
  .card-desc{font-size:12px;color:var(--text2);margin-bottom:12px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .card-footer{display:flex;align-items:center;justify-content:space-between;gap:8px}
  .card-price{font-size:13px;font-weight:700;margin-bottom:2px}
  .card-price.g{color:var(--green-mid)} .card-price.b{color:var(--blue-mid)}
  .card-vendor{font-size:11px;color:var(--muted);display:flex;align-items:center;gap:5px}
  .vendor-dot{width:18px;height:18px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:8px;font-weight:700;color:#fff}
  .vendor-dot.g{background:var(--green-mid)} .vendor-dot.b{background:var(--blue-mid)}
  .contact-btn{padding:6px 12px;border-radius:6px;font-size:12px;font-weight:500;display:flex;align-items:center;gap:5px;border:1px solid;transition:all .15s;flex-shrink:0}
  .contact-btn.g{border-color:var(--green-mid);color:#0F6E56;background:transparent}
  .contact-btn.g:hover{background:var(--green-mid);color:#fff}
  .contact-btn.b{border-color:var(--blue-mid);color:#185FA5;background:transparent}
  .contact-btn.b:hover{background:var(--blue-mid);color:#fff}
  .card-actions{display:flex;gap:6px;align-items:center}
  .btn-del{padding:6px 10px;border-radius:6px;font-size:12px;font-weight:500;display:flex;align-items:center;gap:5px;border:1px solid #fecaca;color:#dc2626;background:transparent;transition:all .15s}
  .btn-del:hover{background:#fef2f2}
  .posted-by{font-size:10px;color:var(--muted);margin-top:4px}

  /* EMPTY STATE */
  .empty-state{text-align:center;padding:64px 24px}
  .empty-state i{font-size:48px;color:var(--muted);opacity:.5;margin-bottom:16px;display:block}
  .empty-state h3{font-size:16px;font-weight:600;color:var(--text);margin-bottom:6px}
  .empty-state p{font-size:13px;color:var(--text2);max-width:300px;margin:0 auto 18px}
  .btn-empty{padding:9px 20px;border-radius:8px;border:none;background:linear-gradient(135deg,#085041,#0C447C);color:#fff;font-size:13px;font-weight:600;display:inline-flex;align-items:center;gap:7px;cursor:pointer;transition:opacity .15s}
  .btn-empty:hover{opacity:.9}

  /* SIDEBAR */
  .sidebar{position:sticky;top:80px}
  .sidebar-widget{background:#fff;border-radius:14px;border:1px solid var(--border);padding:16px;margin-bottom:16px}
  .sw-title{font-size:13px;font-weight:600;color:var(--text);margin-bottom:12px;display:flex;align-items:center;gap:7px}
  .sw-title i{color:var(--green-mid);font-size:16px}
  .cat-list{display:flex;flex-direction:column;gap:2px}
  .cat-item{display:flex;align-items:center;justify-content:space-between;padding:9px 10px;border-radius:6px;cursor:pointer;font-size:13px;color:var(--text2);transition:background .12s,color .12s}
  .cat-item:hover{background:#f0f4f8;color:var(--text)}
  .cat-item.sel{background:var(--green-light);color:#0F6E56;font-weight:600}
  .cat-count{font-size:11px;background:#f0f4f8;padding:2px 8px;border-radius:20px;color:var(--muted)}
  .trend-list{display:flex;flex-direction:column;gap:7px}
  .trend-item{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:6px;border:1px solid var(--border);background:#f0f4f8;cursor:pointer;transition:border-color .12s}
  .trend-item:hover{border-color:var(--green-mid)}
  .trend-rank{font-size:14px;font-weight:700;color:var(--green-mid);width:18px;flex-shrink:0}
  .trend-text{font-size:12px;color:var(--text);flex:1}
  .trend-num{font-size:11px;color:var(--muted)}
  .status-list{display:flex;flex-direction:column;gap:8px}
  .status-list li{display:flex;justify-content:space-between;font-size:12px;color:var(--text2)}
  .sv{font-weight:600;font-size:12px}
  .sv.g{color:var(--green-mid)} .sv.b{color:var(--blue-mid)}

  /* MODAL */
  .overlay{position:fixed;inset:0;background:rgba(8,20,35,.6);z-index:500;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(2px)}
  .modal-box{background:#fff;border-radius:20px;border:1px solid var(--border);width:100%;max-width:580px;max-height:90vh;overflow-y:auto;box-shadow:0 16px 60px rgba(0,0,0,.25);animation:mIn .2s ease}
  @keyframes mIn{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:none}}
  .modal-header{display:flex;align-items:center;justify-content:space-between;padding:20px 22px 16px;border-bottom:1px solid var(--border)}
  .modal-header h2{font-size:16px;font-weight:600;display:flex;align-items:center;gap:8px;color:var(--text)}
  .modal-header h2 i{color:var(--green-mid)}
  .modal-close{width:30px;height:30px;border-radius:6px;border:1px solid var(--border);background:transparent;font-size:18px;color:var(--text2);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .12s}
  .modal-close:hover{background:#f0f4f8;color:var(--text)}
  .modal-tab-bar{display:flex;gap:6px;padding:12px 22px;border-bottom:1px solid var(--border)}
  .modal-tab{flex:1;padding:9px 14px;border-radius:6px;border:1px solid var(--border);background:transparent;font-size:13px;font-weight:500;color:var(--text2);display:flex;align-items:center;justify-content:center;gap:6px;transition:all .15s;cursor:pointer}
  .modal-tab:hover{background:#f0f4f8}
  .modal-tab.active-wts{background:linear-gradient(135deg,#085041,#0F6E56);color:#fff;border-color:#0F6E56}
  .modal-tab.active-wtb{background:linear-gradient(135deg,#0C447C,#185FA5);color:#fff;border-color:#185FA5}
  .modal-body{padding:20px 22px}
  .form-row{margin-bottom:16px}
  .form-row label{display:block;font-size:12px;font-weight:600;color:var(--text2);margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em}
  .form-row input,.form-row select,.form-row textarea{width:100%;padding:9px 12px;border-radius:6px;border:1px solid var(--border);background:#fff;color:var(--text);font-size:13px;transition:border-color .15s;outline:none}
  .form-row input:focus,.form-row select:focus,.form-row textarea:focus{border-color:var(--green-mid);box-shadow:0 0 0 3px rgba(29,158,117,.12)}
  .form-row textarea{resize:vertical;min-height:80px}
  .two-col{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .modal-footer{display:flex;justify-content:flex-end;gap:10px;padding-top:8px;border-top:1px solid var(--border);margin-top:20px}
  .btn-cancel{padding:9px 20px;border-radius:6px;border:1px solid var(--border);background:transparent;color:var(--text2);font-size:13px;font-weight:500;cursor:pointer;transition:background .12s}
  .btn-cancel:hover{background:#f0f4f8}
  .btn-submit{padding:9px 22px;border-radius:6px;border:none;background:linear-gradient(135deg,#085041,#0F6E56);color:#fff;font-size:13px;font-weight:600;display:flex;align-items:center;gap:6px;cursor:pointer;transition:opacity .12s}
  .btn-submit.wtb{background:linear-gradient(135deg,#0C447C,#185FA5)}
  .btn-submit:hover{opacity:.9}
  .btn-submit:disabled{opacity:.6;cursor:not-allowed}

  /* IMAGE UPLOAD */
  .img-upload-zone{border:2px dashed var(--border);border-radius:10px;padding:20px;text-align:center;cursor:pointer;transition:border-color .15s,background .15s;position:relative}
  .img-upload-zone:hover,.img-upload-zone.drag{border-color:var(--green-mid);background:var(--green-light)}
  .img-upload-zone input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
  .img-upload-zone i{font-size:28px;color:var(--muted);margin-bottom:8px;display:block}
  .img-upload-zone p{font-size:12px;color:var(--text2)} .img-upload-zone span{font-size:11px;color:var(--muted)}
  .img-preview{width:100%;height:120px;object-fit:cover;border-radius:8px;margin-top:10px;border:1px solid var(--border)}
  .img-remove{display:block;text-align:center;font-size:12px;color:#dc2626;cursor:pointer;margin-top:6px}

  /* TOAST */
  .toast{position:fixed;bottom:28px;right:28px;z-index:9999;background:#085041;color:#fff;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:500;box-shadow:0 6px 24px rgba(0,0,0,.2);transform:translateY(8px);opacity:0;pointer-events:none;transition:opacity .22s,transform .22s;max-width:320px}
  .toast.show{opacity:1;transform:translateY(0)}
  .toast.err{background:#A32D2D}

  /* ADMIN PANEL */
  .admin-bar{background:#7f1d1d;color:#fef2f2;padding:8px 28px;font-size:12px;font-weight:500;display:flex;align-items:center;gap:8px}
  .admin-bar i{font-size:14px}

  @media(max-width:1100px){.sidebar-layout{grid-template-columns:1fr}}
  @media(max-width:900px){.stats-row{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:640px){.main-content{padding:16px 14px 40px}.topbar{padding:0 16px}.stats-row{gap:10px}.cards-grid{grid-template-columns:1fr}.two-col{grid-template-columns:1fr}.tab-btn{font-size:12px;padding:9px 12px}}
`;

const TRENDING = [
  { text: "Paracetamol bulk", num: 284 },
  { text: "Blister packaging", num: 201 },
  { text: "Jasa HPLC testing", num: 178 },
  { text: "Cold chain 2–8°C", num: 143 },
  { text: "MCC PH-102", num: 122 },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [authTab, setAuthTab] = useState("login");
  const [authErr, setAuthErr] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [users, setUsers] = useState([]);

  // Login form
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  // Register form
  const [regForm, setRegForm] = useState({ username: "", name: "", email: "", phone: "", password: "", confirm: "" });

  // Main state
  const [activeTab, setActiveTab] = useState("wts");
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState("wts");
  const [toast, setToast] = useState({ show: false, msg: "", err: false });
  const [searchWTS, setSearchWTS] = useState("");
  const [searchWTB, setSearchWTB] = useState("");
  const [catFilter, setCatFilter] = useState("Semua");
  const [chipFilter, setChipFilter] = useState("Semua");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [postBusy, setPostBusy] = useState(false);

  // Post form
  const [pf, setPf] = useState({ judul: "", kategori: "", harga: "", deskripsi: "", perusahaan: "", kontak: "" });
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [imgDrag, setImgDrag] = useState(false);
  const imgRef = useRef(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg, err = false) => {
    clearTimeout(toastTimer.current);
    setToast({ show: true, msg, err });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 3200);
  }, []);

  const handleLogin = () => {
    setAuthErr("");
    if (!loginForm.email || !loginForm.password) { setAuthErr("Email dan password wajib diisi."); return; }

    if (loginForm.email === ADMIN_ACCOUNT.email && loginForm.password === ADMIN_ACCOUNT.password) {
      setUser({ ...ADMIN_ACCOUNT }); return;
    }
    const found = users.find(u => u.email === loginForm.email && u.password === loginForm.password);
    if (!found) { setAuthErr("Email atau password salah."); return; }
    setUser({ ...found });
  };

  const handleRegister = () => {
    setAuthErr("");
    if (!regForm.username || !regForm.name || !regForm.email || !regForm.phone || !regForm.password) {
      setAuthErr("Semua field wajib diisi."); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email)) { setAuthErr("Format email tidak valid."); return; }
    if (!/^(\+62|08)\d{8,12}$/.test(regForm.phone)) { setAuthErr("Format nomor HP tidak valid (contoh: 08123456789)."); return; }
    if (regForm.password.length < 6) { setAuthErr("Password minimal 6 karakter."); return; }
    if (regForm.password !== regForm.confirm) { setAuthErr("Konfirmasi password tidak cocok."); return; }
    if (regForm.email === ADMIN_ACCOUNT.email || users.find(u => u.email === regForm.email)) {
      setAuthErr("Email sudah terdaftar."); return;
    }
    if (users.find(u => u.username === regForm.username)) { setAuthErr("Username sudah digunakan."); return; }

    setAuthBusy(true);
    setTimeout(() => {
      const newUser = {
        username: regForm.username, name: regForm.name, email: regForm.email,
        phone: regForm.phone, password: regForm.password, role: "user",
        initials: regForm.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
      };
      setUsers(prev => [...prev, newUser]);
      setUser({ ...newUser });
      setAuthBusy(false);
    }, 800);
  };

  const handleImageUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("File harus berupa gambar.", true); return; }
    if (file.size > 2 * 1024 * 1024) { showToast("Ukuran gambar maksimal 2MB.", true); return; }
    setImgFile(file);
    const reader = new FileReader();
    reader.onload = e => setImgPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const submitPost = () => {
    if (!pf.judul.trim()) { showToast("Judul iklan wajib diisi.", true); return; }
    if (!pf.kategori) { showToast("Pilih kategori terlebih dahulu.", true); return; }
    if (!pf.perusahaan.trim()) { showToast("Nama perusahaan wajib diisi.", true); return; }
    if (!pf.kontak.trim()) { showToast("Kontak (WA/Email) wajib diisi.", true); return; }

    setPostBusy(true);
    setTimeout(() => {
      const newPost = {
        id: Date.now(),
        type: modalTab,
        judul: pf.judul, kategori: pf.kategori, harga: pf.harga,
        deskripsi: pf.deskripsi, perusahaan: pf.perusahaan, kontak: pf.kontak,
        imgPreview: imgPreview,
        postedBy: user.username, postedName: user.name || user.username,
        postedAt: new Date().toLocaleDateString("id-ID"),
        initials: user.initials,
      };
      setPosts(prev => [newPost, ...prev]);
      setPf({ judul: "", kategori: "", harga: "", deskripsi: "", perusahaan: "", kontak: "" });
      setImgFile(null); setImgPreview(null);
      setPostBusy(false);
      setShowModal(false);
      showToast(`✓ Iklan ${modalTab.toUpperCase()} berhasil dipublikasikan!`);
    }, 1000);
  };

  const deletePost = (id) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    showToast("Postingan telah dihapus.");
  };

  const filteredPosts = (type) => {
    let list = posts.filter(p => p.type === type);
    const q = (type === "wts" ? searchWTS : searchWTB).trim().toLowerCase();
    if (q) list = list.filter(p => (p.judul + p.kategori + p.deskripsi + p.perusahaan).toLowerCase().includes(q));
    if (catFilter !== "Semua") list = list.filter(p => p.kategori === catFilter);
    if (chipFilter !== "Semua") list = list.filter(p => p.kategori === chipFilter);
    return list;
  };

  const wts = filteredPosts("wts");
  const wtb = filteredPosts("wtb");

  const allWTS = posts.filter(p => p.type === "wts");
  const allWTB = posts.filter(p => p.type === "wtb");

  const countByKat = (kat) => posts.filter(p => p.kategori === kat).length;

  if (!user) {
    return (
      <>
        <style>{css}</style>
        <div className="auth-screen">
          <div className="auth-card">
            <div className="auth-brand">
              <div className="auth-logo">B7<br/>KCH</div>
              <div className="auth-brand-text">
                <div className="t1">B7 × Kalbe Marketplace</div>
                <div className="t2">Pharma Industry Procurement Platform</div>
              </div>
            </div>

            <div className="auth-tabs">
              <button className={"auth-tab" + (authTab === "login" ? " active" : "")} onClick={() => { setAuthTab("login"); setAuthErr(""); }}>
                <i className="ti ti-login" aria-hidden="true" /> Masuk
              </button>
              <button className={"auth-tab" + (authTab === "register" ? " active" : "")} onClick={() => { setAuthTab("register"); setAuthErr(""); }}>
                <i className="ti ti-user-plus" aria-hidden="true" /> Daftar Akun
              </button>
            </div>

            <div className="auth-body">
              {authTab === "login" ? (
                <>
                  <h3>Selamat datang kembali</h3>
                  <p>Masuk untuk mengakses marketplace</p>
                  <div className="auth-note">
                    <strong>Admin:</strong> admin@kalbe.co.id / Admin@KCH2024
                  </div>
                  {authErr && <div className="auth-err"><i className="ti ti-alert-circle" /> {authErr}</div>}
                  <div className="field">
                    <label>Email / Gmail</label>
                    <input type="email" placeholder="nama@gmail.com" value={loginForm.email}
                      onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                      onKeyDown={e => e.key === "Enter" && handleLogin()} />
                  </div>
                  <div className="field">
                    <label>Password</label>
                    <input type="password" placeholder="••••••••" value={loginForm.password}
                      onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                      onKeyDown={e => e.key === "Enter" && handleLogin()} />
                  </div>
                  <button className="btn-primary" onClick={handleLogin}>
                    <i className="ti ti-login" aria-hidden="true" /> Masuk
                  </button>
                  <p style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: "#6b7280" }}>
                    Belum punya akun?{" "}
                    <span style={{ color: "#085041", fontWeight: 600, cursor: "pointer" }} onClick={() => setAuthTab("register")}>Daftar sekarang</span>
                  </p>
                </>
              ) : (
                <>
                  <h3>Buat akun baru</h3>
                  <p>Daftarkan diri Anda untuk mulai berjual beli</p>
                  {authErr && <div className="auth-err"><i className="ti ti-alert-circle" /> {authErr}</div>}
                  <div className="field-row">
                    <div className="field">
                      <label>Username</label>
                      <input placeholder="johndoe" value={regForm.username} onChange={e => setRegForm(f => ({ ...f, username: e.target.value }))} />
                    </div>
                    <div className="field">
                      <label>Nama Lengkap</label>
                      <input placeholder="John Doe" value={regForm.name} onChange={e => setRegForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                  </div>
                  <div className="field">
                    <label>Email / Gmail</label>
                    <input type="email" placeholder="nama@gmail.com" value={regForm.email} onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div className="field">
                    <label>No. Handphone</label>
                    <input type="tel" placeholder="08123456789" value={regForm.phone} onChange={e => setRegForm(f => ({ ...f, phone: e.target.value }))} />
                  </div>
                  <div className="field-row">
                    <div className="field">
                      <label>Password</label>
                      <input type="password" placeholder="Min. 6 karakter" value={regForm.password} onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))} />
                    </div>
                    <div className="field">
                      <label>Konfirmasi Password</label>
                      <input type="password" placeholder="Ulangi password" value={regForm.confirm} onChange={e => setRegForm(f => ({ ...f, confirm: e.target.value }))} />
                    </div>
                  </div>
                  <button className="btn-primary" onClick={handleRegister} disabled={authBusy}>
                    {authBusy ? <><i className="ti ti-loader-2" /> Mendaftarkan...</> : <><i className="ti ti-user-check" /> Buat Akun</>}
                  </button>
                  <p style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: "#6b7280" }}>
                    Sudah punya akun?{" "}
                    <span style={{ color: "#085041", fontWeight: 600, cursor: "pointer" }} onClick={() => setAuthTab("login")}>Masuk</span>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="app">

        {user.role === "admin" && (
          <div className="admin-bar">
            <i className="ti ti-shield-check" aria-hidden="true" />
            Mode Admin aktif — Anda dapat menghapus postingan apapun yang melanggar ketentuan.
          </div>
        )}

        {/* TOPBAR */}
        <header className="topbar">
          <div className="brand">
            <div className="brand-logo">B7<br/>KCH</div>
            <div>
              <div className="brand-title">B7 × Kalbe Marketplace</div>
              <div className="brand-sub">Pharma Industry Procurement Platform</div>
            </div>
          </div>
          <nav className="topbar-right">
            {user.role !== "admin" && (
              <button className="top-btn" onClick={() => { setShowModal(true); setModalTab("wts"); }}>
                <i className="ti ti-plus" aria-hidden="true" /> Post Iklan
              </button>
            )}
            <div style={{ position: "relative" }}>
              <div className={"user-avatar" + (user.role === "admin" ? " admin-av" : "")}
                onClick={() => setShowUserMenu(s => !s)} title={user.name || user.username}>
                {user.initials}
              </div>
              {showUserMenu && (
                <div className="avatar-menu">
                  <div className="avatar-menu-item" style={{ pointerEvents: "none", color: "#6b7280", fontSize: 12 }}>
                    <i className="ti ti-user" aria-hidden="true" />
                    <div>
                      <div style={{ fontWeight: 600, color: "#374151", fontSize: 13 }}>{user.name || user.username}</div>
                      <div>{user.email}</div>
                    </div>
                  </div>
                  {user.role !== "admin" && user.phone && (
                    <div className="avatar-menu-item" style={{ pointerEvents: "none", color: "#6b7280", fontSize: 12 }}>
                      <i className="ti ti-phone" aria-hidden="true" /> {user.phone}
                    </div>
                  )}
                  <div className="avatar-menu-divider" />
                  <div className="avatar-menu-item danger" onClick={() => { setUser(null); setShowUserMenu(false); setLoginForm({ email: "", password: "" }); }}>
                    <i className="ti ti-logout" aria-hidden="true" /> Keluar
                  </div>
                </div>
              )}
            </div>
          </nav>
        </header>

        {/* MAIN */}
        <main className="main-content" onClick={() => showUserMenu && setShowUserMenu(false)}>

          {/* STATS */}
          <section className="stats-row">
            <div className="stat-card">
              <div className="stat-icon g"><i className="ti ti-tag" aria-hidden="true" /></div>
              <div className="stat-label">Total WTS</div>
              <div className="stat-val g">{allWTS.length}</div>
              <div className="stat-sub">Listing aktif</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon b"><i className="ti ti-shopping-cart" aria-hidden="true" /></div>
              <div className="stat-label">Total WTB</div>
              <div className="stat-val b">{allWTB.length}</div>
              <div className="stat-sub">Permintaan aktif</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon g"><i className="ti ti-building" aria-hidden="true" /></div>
              <div className="stat-label">Pengguna</div>
              <div className="stat-val g">{users.length}</div>
              <div className="stat-sub">Terdaftar</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon b"><i className="ti ti-check-circle" aria-hidden="true" /></div>
              <div className="stat-label">Total Postingan</div>
              <div className="stat-val b">{posts.length}</div>
              <div className="stat-sub">WTS + WTB</div>
            </div>
          </section>

          {/* TABS */}
          <div className="tab-bar" role="tablist">
            <button className={"tab-btn" + (activeTab === "wts" ? " active-wts" : "")} onClick={() => setActiveTab("wts")}>
              <i className="ti ti-tag" aria-hidden="true" /> Want To Sell (WTS)
              <span className={"tab-badge" + (activeTab !== "wts" ? " ig" : "")}>{allWTS.length}</span>
            </button>
            <button className={"tab-btn" + (activeTab === "wtb" ? " active-wtb" : "")} onClick={() => setActiveTab("wtb")}>
              <i className="ti ti-shopping-cart" aria-hidden="true" /> Want To Buy (WTB)
              <span className={"tab-badge" + (activeTab !== "wtb" ? " ib" : "")}>{allWTB.length}</span>
            </button>
          </div>

          <div className="sidebar-layout">
            <div className="content-area">

              {/* WTS */}
              {activeTab === "wts" && (
                <section>
                  <div className="section-header">
                    <div className="section-title">
                      <i className="ti ti-package" aria-hidden="true" /> Produk &amp; Jasa Tersedia
                      <span className="pill g">Vendor Terverifikasi</span>
                    </div>
                  </div>
                  <div className="filter-bar">
                    <div className="search-box">
                      <i className="ti ti-search" aria-hidden="true" />
                      <input type="search" placeholder="Cari produk, vendor, kategori..." value={searchWTS}
                        onChange={e => setSearchWTS(e.target.value)} />
                    </div>
                    {["Semua", "Barang", "Jasa"].map(c => (
                      <button key={c} className={"filter-chip" + (chipFilter === c && activeTab === "wts" ? " active" : "")}
                        onClick={() => setChipFilter(chipFilter === c ? "Semua" : c)}>
                        {c}
                      </button>
                    ))}
                  </div>
                  {wts.length === 0 ? (
                    <div className="empty-state">
                      <i className="ti ti-package" aria-hidden="true" />
                      <h3>Belum ada listing WTS</h3>
                      <p>Jadilah yang pertama memposting produk atau jasa Anda di marketplace ini.</p>
                      <button className="btn-empty" onClick={() => { setShowModal(true); setModalTab("wts"); }}>
                        <i className="ti ti-plus" aria-hidden="true" /> Post WTS Pertama
                      </button>
                    </div>
                  ) : (
                    <div className="cards-grid">
                      {wts.map(p => <PostCard key={p.id} post={p} type="wts" user={user} onDelete={deletePost} showToast={showToast} />)}
                    </div>
                  )}
                </section>
              )}

              {/* WTB */}
              {activeTab === "wtb" && (
                <section>
                  <div className="section-header">
                    <div className="section-title">
                      <i className="ti ti-search" aria-hidden="true" /> Permintaan Pembelian
                      <span className="pill b">Buyer Terverifikasi</span>
                    </div>
                  </div>
                  <div className="filter-bar">
                    <div className="search-box">
                      <i className="ti ti-search" aria-hidden="true" />
                      <input type="search" placeholder="Cari permintaan, kategori..." value={searchWTB}
                        onChange={e => setSearchWTB(e.target.value)} />
                    </div>
                    {["Semua", "Barang", "Jasa"].map(c => (
                      <button key={c} className={"filter-chip" + (chipFilter === c && activeTab === "wtb" ? " active-b" : "")}
                        onClick={() => setChipFilter(chipFilter === c ? "Semua" : c)}>
                        {c}
                      </button>
                    ))}
                  </div>
                  {wtb.length === 0 ? (
                    <div className="empty-state">
                      <i className="ti ti-shopping-cart" aria-hidden="true" />
                      <h3>Belum ada permintaan WTB</h3>
                      <p>Belum ada permintaan pembelian. Pasang iklan WTB untuk menemukan supplier.</p>
                      <button className="btn-empty" onClick={() => { setShowModal(true); setModalTab("wtb"); }}>
                        <i className="ti ti-plus" aria-hidden="true" /> Post WTB Pertama
                      </button>
                    </div>
                  ) : (
                    <div className="cards-grid">
                      {wtb.map(p => <PostCard key={p.id} post={p} type="wtb" user={user} onDelete={deletePost} showToast={showToast} />)}
                    </div>
                  )}
                </section>
              )}
            </div>

            {/* SIDEBAR */}
            <aside className="sidebar">
              <div className="sidebar-widget">
                <div className="sw-title"><i className="ti ti-category" aria-hidden="true" /> Kategori</div>
                <ul className="cat-list">
                  {["Semua", "Barang", "Jasa"].map(c => (
                    <li key={c} className={"cat-item" + (catFilter === c ? " sel" : "")}
                      onClick={() => { setCatFilter(c); setChipFilter(c); }}>
                      <span>{c === "Semua" ? "Semua Kategori" : c}</span>
                      <span className="cat-count">
                        {c === "Semua" ? posts.length : countByKat(c)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="sidebar-widget">
                <div className="sw-title"><i className="ti ti-trending-up" aria-hidden="true" /> Trending Pencarian</div>
                <ul className="trend-list">
                  {TRENDING.map((t, i) => (
                    <li key={i} className="trend-item" onClick={() => {
                      if (activeTab === "wts") setSearchWTS(t.text);
                      else setSearchWTB(t.text);
                    }}>
                      <span className="trend-rank">{i + 1}</span>
                      <span className="trend-text">{t.text}</span>
                      <span className="trend-num">{t.num}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="sidebar-widget">
                <div className="sw-title"><i className="ti ti-shield-check" aria-hidden="true" /> Status Platform</div>
                <ul className="status-list">
                  <li><span>Pengguna Terdaftar</span><span className="sv g">{users.length} akun</span></li>
                  <li><span>Listing Aktif</span><span className="sv b">{posts.length} iklan</span></li>
                  <li><span>WTS Live</span><span className="sv g">{allWTS.length} listing</span></li>
                  <li><span>WTB Live</span><span className="sv b">{allWTB.length} permintaan</span></li>
                </ul>
              </div>
            </aside>
          </div>
        </main>

        {/* MODAL */}
        {showModal && (
          <div className="overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <div className="modal-box">
              <div className="modal-header">
                <h2><i className="ti ti-plus" aria-hidden="true" /> Buat Posting Baru</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
              </div>
              <div className="modal-tab-bar">
                <button className={"modal-tab" + (modalTab === "wts" ? " active-wts" : "")} onClick={() => setModalTab("wts")}>
                  <i className="ti ti-tag" aria-hidden="true" /> Want To Sell
                </button>
                <button className={"modal-tab" + (modalTab === "wtb" ? " active-wtb" : "")} onClick={() => setModalTab("wtb")}>
                  <i className="ti ti-shopping-cart" aria-hidden="true" /> Want To Buy
                </button>
              </div>
              <div className="modal-body">
                <div className="form-row">
                  <label>Judul Iklan</label>
                  <input type="text" placeholder={modalTab === "wts" ? "Contoh: Paracetamol USP Grade — Bulk 500kg" : "Contoh: Dicari supplier ibuprofen 1 ton"}
                    value={pf.judul} onChange={e => setPf(f => ({ ...f, judul: e.target.value }))} />
                </div>
                <div className="two-col form-row" style={{ marginBottom: 0 }}>
                  <div className="form-row">
                    <label>Kategori</label>
                    <select value={pf.kategori} onChange={e => setPf(f => ({ ...f, kategori: e.target.value }))}>
                      <option value="">Pilih kategori</option>
                      <option>Barang</option>
                      <option>Jasa</option>
                    </select>
                  </div>
                  <div className="form-row">
                    <label>Harga / Budget</label>
                    <input type="text" placeholder="Contoh: Rp 45.000/kg" value={pf.harga}
                      onChange={e => setPf(f => ({ ...f, harga: e.target.value }))} />
                  </div>
                </div>
                <div className="form-row">
                  <label>Deskripsi</label>
                  <textarea rows={3} placeholder="Jelaskan detail produk/jasa, spesifikasi, syarat, dll."
                    value={pf.deskripsi} onChange={e => setPf(f => ({ ...f, deskripsi: e.target.value }))} />
                </div>
                <div className="two-col form-row" style={{ marginBottom: 0 }}>
                  <div className="form-row">
                    <label>Nama Perusahaan</label>
                    <input type="text" placeholder="PT / CV / nama usaha" value={pf.perusahaan}
                      onChange={e => setPf(f => ({ ...f, perusahaan: e.target.value }))} />
                  </div>
                  <div className="form-row">
                    <label>Kontak (WA/Email)</label>
                    <input type="text" placeholder="+62 atau email@domain.com" value={pf.kontak}
                      onChange={e => setPf(f => ({ ...f, kontak: e.target.value }))} />
                  </div>
                </div>

                {/* IMAGE UPLOAD */}
                <div className="form-row">
                  <label>Foto Produk <span style={{ color: "#9ca3af", fontSize: 11, textTransform: "none", fontWeight: 400 }}>(opsional, maks. 2MB)</span></label>
                  {!imgPreview ? (
                    <div className={"img-upload-zone" + (imgDrag ? " drag" : "")}
                      onDragOver={e => { e.preventDefault(); setImgDrag(true); }}
                      onDragLeave={() => setImgDrag(false)}
                      onDrop={e => { e.preventDefault(); setImgDrag(false); handleImageUpload(e.dataTransfer.files[0]); }}>
                      <input type="file" accept="image/*" ref={imgRef}
                        onChange={e => handleImageUpload(e.target.files[0])} />
                      <i className="ti ti-photo-up" aria-hidden="true" />
                      <p>Klik atau seret gambar ke sini</p>
                      <span>PNG, JPG, WEBP — maksimal 2MB</span>
                    </div>
                  ) : (
                    <div>
                      <img className="img-preview" src={imgPreview} alt="Preview" />
                      <span className="img-remove" onClick={() => { setImgFile(null); setImgPreview(null); }}>
                        <i className="ti ti-trash" /> Hapus gambar
                      </span>
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button className="btn-cancel" onClick={() => setShowModal(false)}>Batal</button>
                  <button className={"btn-submit" + (modalTab === "wtb" ? " wtb" : "")} onClick={submitPost} disabled={postBusy}>
                    {postBusy
                      ? <><i className="ti ti-loader-2" /> Mempublikasikan...</>
                      : <><i className="ti ti-send" /> Publikasikan {modalTab.toUpperCase()}</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TOAST */}
        <div className={"toast" + (toast.show ? " show" : "") + (toast.err ? " err" : "")} role="alert">
          {toast.msg}
        </div>
      </div>
    </>
  );
}

function PostCard({ post, type, user, onDelete, showToast }) {
  const isGreen = type === "wts";
  const color = isGreen ? "g" : "b";
  const canDelete = user.role === "admin" || user.username === post.postedBy;

  return (
    <article className="product-card">
      <div className={"card-img" + (isGreen ? " green-bg" : " blue-bg")}>
        {post.imgPreview
          ? <img src={post.imgPreview} alt={post.judul} />
          : <i className={"ti " + (post.kategori === "Jasa" ? "ti-tools" : "ti-package")} aria-hidden="true" />}
        <span className={"card-badge" + (user.role === "admin" && post.postedBy !== user.username ? " badge-admin" : " badge-wts")}>
          {type.toUpperCase()}
        </span>
      </div>
      <div className="card-body">
        <div className={"card-cat " + color}>{post.kategori}</div>
        <h3 className="card-title">{post.judul}</h3>
        {post.deskripsi && <p className="card-desc">{post.deskripsi}</p>}
        <div className="posted-by">Oleh: {post.postedName} · {post.postedAt}</div>
        <div className="card-footer" style={{ marginTop: 10 }}>
          <div>
            {post.harga && <div className={"card-price " + color}>{post.harga}</div>}
            <div className="card-vendor">
              <span className={"vendor-dot " + color}>{post.perusahaan.slice(0, 2).toUpperCase()}</span>
              {post.perusahaan}
            </div>
          </div>
          <div className="card-actions">
            {canDelete && (
              <button className="btn-del" onClick={() => onDelete(post.id)} title="Hapus postingan">
                <i className="ti ti-trash" aria-hidden="true" />
              </button>
            )}
            <button className={"contact-btn " + color} onClick={() => showToast(`✓ Pesan dikirim ke ${post.perusahaan}`)}>
              <i className={"ti " + (type === "wts" ? "ti-message-circle" : "ti-send")} aria-hidden="true" />
              {type === "wts" ? "Hubungi" : "Tawar"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
