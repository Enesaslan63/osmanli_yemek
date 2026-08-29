import { useState, useEffect } from "react"
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom"
import "./styles/App.css"
import "./styles/AdminPage.css"
import Footer from "./components/Footer"
import AboutPage from "./pages/AboutPage.jsx"
import MenuPage from "./pages/MenuPage.jsx"
import ReferencesPage from "./pages/ReferencesPage.jsx"
import GalleryPage from "./pages/GalleryPage.jsx"
import ReviewsPage from "./pages/ReviewsPage.jsx"
import ContactPage from "./pages/ContactPage.jsx"
import AdminPage from "./pages/AdminPage.jsx"
import AdminMenuPage from "./pages/AdminMenuPage.jsx"
import { supabase } from "./lib/supabaseClient"

/* ── Reservation Modal ─────────────────────── */
function ReservationModal({ isOpen, onClose }) {
  const [tab, setTab] = useState("create") // "create" | "query"
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "19:00",
    guests: "2",
    phone: "",
    note: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // Query tab states
  const [queryPhone, setQueryPhone] = useState("")
  const [queryResult, setQueryResult] = useState(null)
  const [queryLoading, setQueryLoading] = useState(false)
  const [querySearched, setQuerySearched] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.phone || !formData.date) {
      setErrorMsg("Lütfen tüm zorunlu alanları doldurun.")
      return
    }

    setLoading(true)
    setErrorMsg("")

    try {
      const resToAdd = {
        name: formData.name,
        date: formData.date,
        time: formData.time,
        guests: Number(formData.guests),
        phone: formData.phone,
        note: formData.note || "",
        status: "Bekliyor",
        created_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("reservations").insert([resToAdd])

      if (error) {
        console.log("Supabase reservation insert error:", error)
      }

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
        setFormData({ name: "", date: "", time: "19:00", guests: "2", phone: "", note: "" })
      }, 2500)
    } catch (err) {
      console.log(err)
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 2500)
    } finally {
      setLoading(false)
    }
  }

  const handleQuery = async (e) => {
    e.preventDefault()
    if (!queryPhone) return
    setQueryLoading(true)
    setQuerySearched(true)
    try {
      const cleanInput = queryPhone.replace(/\D/g, "")
      const { data } = await supabase
        .from("reservations")
        .select("*")
        .order("id", { ascending: false })

      if (data && data.length > 0) {
        const found = data.filter((item) => {
          const itemClean = String(item.phone).replace(/\D/g, "")
          return itemClean.includes(cleanInput) || cleanInput.includes(itemClean)
        })
        setQueryResult(found)
      } else {
        setQueryResult([])
      }
    } catch (err) {
      console.log(err)
      setQueryResult([])
    } finally {
      setQueryLoading(false)
    }
  }

  return (
    <div className="ad-modal-overlay">
      <div className="ad-modal-card" style={{ maxWidth: "500px" }}>
        <button className="ad-modal-close" onClick={onClose}>✕</button>

        {/* Modal Tab Buttons */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.2rem", borderBottom: "1px solid #e8e0d5", paddingBottom: "0.5rem" }}>
          <button
            type="button"
            onClick={() => setTab("create")}
            style={{
              flex: 1,
              padding: "0.5rem",
              background: tab === "create" ? "#8b6e3e" : "transparent",
              color: tab === "create" ? "#fff" : "#5a5040",
              border: "none",
              borderRadius: "2px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.75rem",
            }}
          >
            ✏️ Yeni Rezervasyon
          </button>
          <button
            type="button"
            onClick={() => setTab("query")}
            style={{
              flex: 1,
              padding: "0.5rem",
              background: tab === "query" ? "#8b6e3e" : "transparent",
              color: tab === "query" ? "#fff" : "#5a5040",
              border: "none",
              borderRadius: "2px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.75rem",
            }}
          >
            🔍 Durum Sorgula
          </button>
        </div>
        
        {tab === "create" ? (
          success ? (
            <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
              <h2 style={{ fontFamily: "var(--font-body)", fontSize: "1.8rem", color: "#1a1510", marginBottom: "0.5rem" }}>
                Rezervasyon Talebiniz Alındı!
              </h2>
              <p style={{ color: "#7a7060", fontSize: "0.9rem", lineHeight: "1.6" }}>
                Talebiniz yönetici panelimize başarıyla iletildi. Onaylandığında WhatsApp üzerinden bilgi gönderilecektir.
              </p>
            </div>
          ) : (
            <>
              <h2 className="ad-modal-title" style={{ marginTop: "0.2rem", marginBottom: "1.2rem" }}>
                Anında Masa Ayırtın
              </h2>

              <form onSubmit={handleSubmit} className="ad-modal-form">
                <div className="ad-input-group">
                  <label>AD SOYAD *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Ahmet Yılmaz"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="ad-modal-row-2">
                  <div className="ad-input-group">
                    <label>TARİH *</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="ad-input-group">
                    <label>SAAT *</label>
                    <select
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    >
                      {["12:00", "13:00", "14:00", "18:00", "19:00", "20:00", "21:00", "22:00"].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="ad-modal-row-2">
                  <div className="ad-input-group">
                    <label>KİŞİ SAYISI *</label>
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15].map((g) => (
                        <option key={g} value={g}>{g} Kişi</option>
                      ))}
                    </select>
                  </div>
                  <div className="ad-input-group">
                    <label>TELEFON *</label>
                    <input
                      type="tel"
                      required
                      placeholder="05XX XXX XX XX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="ad-input-group">
                  <label>ÖZEL İSTEK / NOT (OPSİYONEL)</label>
                  <input
                    type="text"
                    placeholder="Örn: Cam kenarı masa veya kutlama..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  />
                </div>

                {errorMsg && <p className="ad-auth-error">{errorMsg}</p>}

                <button type="submit" className="ad-login-btn" disabled={loading} style={{ marginTop: "0.5rem" }}>
                  {loading ? "GÖNDERİLİYOR..." : "REZERVASYONU ONAYLA"}
                </button>
              </form>
            </>
          )
        ) : (
          /* TAB 2: SORGULA */
          <div>
            <h2 className="ad-modal-title" style={{ marginTop: "0.2rem", marginBottom: "0.5rem" }}>
              Rezervasyon Durumu Öğrenin
            </h2>
            <p style={{ color: "#7a7060", fontSize: "0.8rem", marginBottom: "1.2rem" }}>
              Rezervasyon yaparken girdiğiniz telefon numarasını yazarak canlı durumunuzu kontrol edebilirsiniz.
            </p>

            <form onSubmit={handleQuery} className="ad-modal-query-form" style={{ marginBottom: "1.2rem" }}>
              <input
                type="tel"
                placeholder="05XX XXX XX XX"
                value={queryPhone}
                onChange={(e) => setQueryPhone(e.target.value)}
                style={{ flex: 1, padding: "0.6rem 0.8rem", border: "1px solid #d8cfc4", borderRadius: "2px" }}
              />
              <button type="submit" className="ad-btn-add" disabled={queryLoading}>
                {queryLoading ? "SORGULANIYOR..." : "SORGULA"}
              </button>
            </form>

            {querySearched && (
              <div>
                {!queryResult || queryResult.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "1.5rem", background: "#faf7f2", borderRadius: "3px", color: "#8a7e70" }}>
                    Bu telefon numarasına ait aktif rezervasyon bulunamadı.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "250px", overflowY: "auto" }}>
                    {queryResult.map((res) => (
                      <div key={res.id} style={{ padding: "0.85rem", border: "1px solid #e2d9cc", borderRadius: "3px", background: "#fcfaf7" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                          <strong style={{ fontSize: "0.95rem", color: "#1a1510" }}>{res.name}</strong>
                          <span
                            className={`ad-status-pill ${
                              res.status === "Onaylandı"
                                ? "ad-status-pill--active"
                                : "ad-status-pill--passive"
                            }`}
                          >
                            ● {res.status}
                          </span>
                        </div>
                        <p style={{ fontSize: "0.85rem", color: "#4a3c2c", margin: "6px 0" }}>
                          📅 <strong>Tarih:</strong> <strong style={{ color: "#1a1510", fontWeight: "700", fontSize: "0.9rem" }}>{res.date}</strong> &nbsp;&nbsp; ⏰ <strong>Saat:</strong> <strong style={{ color: "#1a1510", fontWeight: "700", fontSize: "0.9rem" }}>{res.time}</strong>
                        </p>
                        <p style={{ fontSize: "0.85rem", color: "#4a3c2c", margin: "6px 0" }}>
                          👥 <strong>Masa:</strong> <strong style={{ color: "#1a1510", fontWeight: "700", fontSize: "0.9rem" }}>{res.guests} Kişilik</strong>
                        </p>
                        {res.status === "Onaylandı" && (
                          <div style={{ marginTop: "0.6rem", padding: "0.5rem 0.75rem", background: "#e8f5e9", border: "1px solid #c8e6c9", borderRadius: "4px", color: "#2e7d32", fontSize: "0.82rem", fontWeight: "700" }}>
                            ✓ Rezervasyonunuz onaylanmıştır. Sizi ağırlamaktan mutluluk duyacağız!
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Navbar ─────────────────────────────── */
function Navbar({ onOpenReservation }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isLight = location.pathname === "/menu" || location.pathname === "/galeri" || location.pathname === "/yorumlar" || location.pathname === "/iletisim" || location.pathname === "/referanslar"

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    setMenuOpen(false)
  }, [location])

  const links = [
    { label: "ANA SAYFA", to: "/" },
    { label: "HAKKIMIZDA", to: "/hakkimizda" },
    { label: "MENÜ", to: "/menu" },
    { label: "GALERİ", to: "/galeri" },
    { label: "REFERANSLAR", to: "/referanslar" },
    { label: "YORUMLAR", to: "/yorumlar" },
    { label: "İLETİŞİM", to: "/iletisim" },
  ]

  return (
    <nav className={`navbar ${
      isLight
        ? "navbar--light" + (scrolled ? " navbar--light-scrolled" : "")
        : (scrolled ? "navbar--scrolled" : "")
    }`}>
      <div className="nav-inner">
        <div className="nav-logo">
          <svg className="logo-icon-svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="0.5" y="0.5" width="19" height="19" stroke="#c9a96e" strokeWidth="0.8"/>
            <path d="M10 3 L17 10 L10 17 L3 10 Z" stroke="#c9a96e" strokeWidth="0.7" fill="none"/>
          </svg>
          <div className="logo-text">
            <span className="logo-main" style={isLight ? { color: "#1a1510" } : {}}>OSMANLI</span>
            <span className="logo-sub">HAZIR YEMEK</span>
          </div>
        </div>

        <ul className={`nav-links ${menuOpen ? "nav-links--open" : ""}`}>
          {links.map(l => {
            const isActive = location.pathname === l.to
            return (
              <li key={l.label}>
                <Link
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className={isActive ? "active nav-link--active" : ""}
                  style={
                    isActive
                      ? (isLight ? { color: "#1a1510", fontWeight: "700" } : { color: "#c9a96e", fontWeight: "700" })
                      : (isLight ? { color: "rgba(26,21,16,0.7)" } : {})
                  }
                >
                  {l.label}
                </Link>
              </li>
            )
          })}
          <li className="nav-links-cta-mobile">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                onOpenReservation()
              }}
            >
              REZERVASYON YAP
            </button>
          </li>
        </ul>

        <button
          className="nav-cta"
          onClick={onOpenReservation}
          style={isLight ? { color: "#8b6e3e", borderColor: "#8b6e3e" } : {}}
        >
          REZERVASYON YAP
        </button>

        <button className="nav-burger" onClick={() => setMenuOpen(o => !o)} aria-label="Menü">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}

/* ── Home Hero ───────────────────────────── */
function Hero() {
  return (
    <section className="hero">
      <div className="hero-mosaic">
        <div className="mosaic-col mosaic-col--1">
          <div className="mosaic-cell cell-tall">
            <img src="./food_hero_1.png" alt="Gurme Tabak" />
            <div className="cell-overlay" />
          </div>
          <div className="mosaic-cell cell-short">
            <img src="./food_beef.png" alt="Dana Fileto" />
            <div className="cell-overlay" />
          </div>
        </div>
        <div className="mosaic-col mosaic-col--center">
          <div className="mosaic-cell cell-top-sm">
            <img src="./food_dessert.png" alt="Tatlı" />
            <div className="cell-overlay" />
          </div>
          <div className="hero-text-box">
            <p className="hero-eyebrow">✦ &nbsp;Gastronomi Sanatı&nbsp; ✦</p>
            <h1 className="hero-title">
              Eşsiz Lezzetlerin<br />
              <em>Buluşma Noktası</em>
            </h1>
            <p className="hero-desc">
              Gastronomik dünyanın en nadide lezzetleri, her köşesinde yeni bir hikâye anlatan bir mekânla buluşuyor.
            </p>
            <Link to="/hakkimizda" className="hero-btn">HİKÂYEMİZİ KEŞFET</Link>
          </div>
          <div className="mosaic-cell cell-bottom-sm">
            <img src="./restaurant_interior.png" alt="İç Mekan" />
            <div className="cell-overlay" />
          </div>
        </div>
        <div className="mosaic-col mosaic-col--3">
          <div className="mosaic-cell cell-short">
            <img src="./food_ceviche.png" alt="Ceviche" />
            <div className="cell-overlay" />
          </div>
          <div className="mosaic-cell cell-tall">
            <img src="./food_hero_2.png" alt="Şef Tabağı" />
            <div className="cell-overlay" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── App ─────────────────────────────────── */
export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const isAdmin = location.pathname.startsWith("/admin")
  const [isResModalOpen, setIsResModalOpen] = useState(false)

  // Global popstate dinleyicisi: Admin oturumu açıkken geri tuşu ile dışarıya çıkmayı engeller
  useEffect(() => {
    const handlePopState = () => {
      const hasAdminSession =
        localStorage.getItem("admin_session") === "true" ||
        sessionStorage.getItem("admin_session") === "true"

      if (hasAdminSession && !window.location.pathname.startsWith("/admin")) {
        window.history.forward()
      }
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  // Admin oturumu varken admin dışındaki bir rotaya gidildiğinde /admin sayfasına yönlendir
  useEffect(() => {
    const hasAdminSession =
      localStorage.getItem("admin_session") === "true" ||
      sessionStorage.getItem("admin_session") === "true"

    if (hasAdminSession && !isAdmin) {
      navigate("/admin", { replace: true })
    }
  }, [location.pathname, isAdmin, navigate])

  return (
    <div className="app">
      {!isAdmin && <Navbar onOpenReservation={() => setIsResModalOpen(true)} />}
      <Routes>
        <Route path="/" element={<><Hero /><Footer /></>} />
        <Route path="/hakkimizda" element={<AboutPage />} />
        <Route path="/menu" element={<MenuPage onOpenReservation={() => setIsResModalOpen(true)} />} />
        <Route path="/referanslar" element={<ReferencesPage />} />
        <Route path="/galeri" element={<GalleryPage />} />
        <Route path="/yorumlar" element={<ReviewsPage />} />
        <Route path="/iletisim" element={<ContactPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/menu" element={<AdminMenuPage />} />
      </Routes>

      <ReservationModal
        isOpen={isResModalOpen}
        onClose={() => setIsResModalOpen(false)}
      />
    </div>
  )
}
