import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/AdminPage.css"
import { supabase } from "../lib/supabaseClient"

const initialMenuItems = [
  { id: 1, name: "Truffle Arancini", category: "Başlangıçlar", price: 420, status: "Aktif", img: "/food_hero_1.png" },
  { id: 2, name: "Wagyu A5 Striploin", category: "Ana Yemekler", price: 2450, status: "Aktif", img: "/food_beef.png" },
  { id: 3, name: "Noir Chocolate Sphere", category: "Tatlılar", price: 380, status: "Pasif", img: "/food_dessert.png" },
  { id: 4, name: "Saray Usulü Hünkar Beğendi", category: "Ana Yemekler", price: 680, status: "Aktif", img: "/food_ceviche.png" },
  { id: 5, name: "Osmanlı İmbik Şerbeti", category: "İçecekler", price: 180, status: "Aktif", img: "/food_drinks.png" },
]

export default function AdminMenuPage() {
  const navigate = useNavigate()

  // Auth State - Admin oturumu varsa doğrudan açılır
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("admin_session") === "true" || sessionStorage.getItem("admin_session") === "true"
  )
  const [passwordInput, setPasswordInput] = useState("")
  const [authError, setAuthError] = useState("")
  const adminPassword = localStorage.getItem("admin_password") || "1234"

  // Data States
  const [menuItems, setMenuItems] = useState(initialMenuItems)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("Hepsi")

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    name: "",
    category: "Ana Yemekler",
    price: "",
    description: "",
    status: "Aktif",
    img: "/food_hero_1.png",
  })
  const [notification, setNotification] = useState("")

  const showNotify = (msg) => {
    setNotification(msg)
    setTimeout(() => setNotification(""), 3000)
  }

  // Supabase'den Menü Ürünlerini Çek
  const fetchMenu = async () => {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("id", { ascending: false })
      if (!error && data && data.length > 0) {
        setMenuItems([...data, ...initialMenuItems])
      }
    } catch (err) {
      console.log("Fetch menu error:", err)
    }
  }

  useEffect(() => {
    fetchMenu()
  }, [])

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault()
    if (passwordInput === adminPassword) {
      setIsLoggedIn(true)
      localStorage.setItem("admin_session", "true")
      sessionStorage.setItem("admin_session", "true")
      setAuthError("")
    } else {
      setAuthError("Hatalı şifre! Varsayılan şifre: 1234")
    }
  }

  // Actions
  const handleToggleStatus = async (id) => {
    const item = menuItems.find((x) => x.id === id)
    if (!item) return
    const newStatus = item.status === "Aktif" ? "Pasif" : "Aktif"

    setMenuItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, status: newStatus } : x))
    )

    try {
      await supabase.from("menu_items").update({ status: newStatus }).eq("id", id)
    } catch (err) {
      console.log(err)
    }
    showNotify("Durum güncellendi.")
  }

  const handleDeleteItem = async (id) => {
    if (window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      setMenuItems((prev) => prev.filter((x) => x.id !== id))
      try {
        await supabase.from("menu_items").delete().eq("id", id)
      } catch (err) {
        console.log(err)
      }
      showNotify("Ürün silindi.")
    }
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    if (!newItem.name || !newItem.price) return

    const itemToAdd = {
      name: newItem.name,
      category: newItem.category,
      price: Number(newItem.price),
      description: newItem.description || "Özel şef tarifi.",
      status: newItem.status,
      img: newItem.img || "/food_hero_1.png",
      created_at: new Date().toISOString(),
    }

    try {
      const { data, error } = await supabase
        .from("menu_items")
        .insert([itemToAdd])
        .select()
      if (!error && data) {
        setMenuItems((prev) => [data[0], ...prev])
      } else {
        setMenuItems((prev) => [{ ...itemToAdd, id: Date.now() }, ...prev])
      }
    } catch (err) {
      setMenuItems((prev) => [{ ...itemToAdd, id: Date.now() }, ...prev])
    }

    setIsAddOpen(false)
    setNewItem({ name: "", category: "Ana Yemekler", price: "", description: "", status: "Aktif", img: "/food_hero_1.png" })
    showNotify("Yeni ürün menüye eklendi!")
  }

  // Kanonik Kategori Normalleştirme
  const normalizeCategory = (cat) => {
    if (!cat) return ""
    const s = String(cat).trim().toLowerCase()
    if (s.includes("başlangıç") || s.includes("baslangic")) return "baslangic"
    if (s.includes("ana yemek") || s.includes("anayemek")) return "anayemek"
    if (s.includes("tatlı") || s.includes("tatli")) return "tatli"
    if (s.includes("içecek") || s.includes("icecek")) return "icecek"
    return s
  }

  const normalizeStr = (str) => {
    if (!str) return ""
    return String(str).trim().toLowerCase()
  }

  // Filtered menu list - Kesin Kategori Eşleşmesi
  const filtered = menuItems.filter((x) => {
    if (!x) return false

    const itemCat = normalizeCategory(x.category)
    const selCat = normalizeCategory(activeCategory)

    // Tam kategori eşleşmesi
    const matchesCat = selCat === "hepsi" || selCat === "" || itemCat === selCat

    const query = normalizeStr(searchQuery)
    const matchesSearch =
      !query ||
      normalizeStr(x.name).includes(query) ||
      normalizeStr(x.description).includes(query)

    return matchesCat && matchesSearch
  })

  // Şifre Giriş Ekranı
  if (!isLoggedIn) {
    return (
      <div className="ad-login-page">
        <div className="ad-login-card">
          <div className="ad-login-badge">MENÜ YÖNETİMİ</div>
          <h1 className="ad-login-title">Menü Yönetim Paneli</h1>
          <p className="ad-login-subtitle">Lütfen yönetici şifrenizi girin.</p>
          <form onSubmit={handleLogin} className="ad-login-form">
            <div className="ad-input-group">
              <label>YÖNETİCİ ŞİFRESİ</label>
              <input
                type="password"
                required
                placeholder="••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
            </div>
            {authError && <p className="ad-auth-error">{authError}</p>}
            <button type="submit" className="ad-login-btn">GİRİŞ YAP</button>
          </form>
          <button className="ad-btn-sm" style={{ marginTop: "1.5rem", width: "100%" }} onClick={() => navigate("/admin")}>
            ← Admin Paneline Dön
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="ad-page">
      {notification && <div className="ad-toast">{notification}</div>}

      <div className="ad-standalone">
        <div className="ad-standalone-header">
          <div>
            <span className="ad-eyebrow">GİZLİ YÖNETİM MODÜLÜ</span>
            <h1 className="ad-page-title" style={{ margin: "0.2rem 0 0 0" }}>
              Tüm Menü Yönetim Sayfası ({menuItems.length} Ürün)
            </h1>
          </div>

          <div className="ad-header-actions">
            <button className="ad-btn-add" onClick={() => setIsAddOpen(true)}>
              + YENİ ÜRÜN EKLE
            </button>
            <button className="ad-btn-sm" onClick={() => navigate("/admin")}>
              ← Genel Bakışa Dön
            </button>
            <button
              className="ad-btn-sm ad-btn-danger"
              onClick={() => {
                localStorage.removeItem("admin_session")
                sessionStorage.removeItem("admin_session")
                setIsLoggedIn(false)
                navigate("/")
              }}
            >
              Çıkış Yap
            </button>
          </div>
        </div>

        <div className="ad-card-section" style={{ marginBottom: "2rem" }}>
          <div className="ad-toolbar">
            <div
              className="ad-category-pills"
              onMouseDown={(e) => {
                const el = e.currentTarget
                el.isDown = true
                el.startX = e.pageX - el.offsetLeft
                el.scrollLeftStart = el.scrollLeft
              }}
              onMouseLeave={(e) => {
                e.currentTarget.isDown = false
              }}
              onMouseUp={(e) => {
                e.currentTarget.isDown = false
              }}
              onMouseMove={(e) => {
                const el = e.currentTarget
                if (!el.isDown) return
                e.preventDefault()
                const x = e.pageX - el.offsetLeft
                const walk = (x - el.startX) * 1.5
                el.scrollLeft = el.scrollLeftStart - walk
              }}
            >
              {["Hepsi", "Başlangıçlar", "Ana Yemekler", "Tatlılar", "İçecekler"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`ad-cat-pill ${activeCategory === cat ? "ad-cat-pill--active" : ""}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="ad-search-bar ad-search-bar--inline">
              <span className="ad-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Ürün adı veya malzeme ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Full Products Table */}
          <div className="ad-table-wrap">
            <table className="ad-table ad-table--stack">
              <thead>
                <tr>
                  <th>ÜRÜN GÖRSELİ &amp; ADI</th>
                  <th>KATEGORİ</th>
                  <th>FİYAT</th>
                  <th>DURUM</th>
                  <th style={{ textAlign: "right" }}>İŞLEMLER</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "3rem", color: "#8a7e70" }}>
                      Aranan kriterlere uygun ürün bulunamadı.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id}>
                      <td data-label="Ürün">
                        <div className="ad-item-cell">
                          <img src={item.img} alt={item.name} className="ad-item-thumb" style={{ width: "55px", height: "55px" }} />
                          <div>
                            <strong className="ad-item-name" style={{ fontSize: "1rem" }}>{item.name}</strong>
                            {item.description && (
                              <p style={{ fontSize: "0.75rem", color: "#7a7060", margin: "2px 0 0 0" }}>{item.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td data-label="Kategori">
                        <span className="ad-item-cat" style={{ background: "#f4ede1", padding: "0.2rem 0.6rem", borderRadius: "2px" }}>
                          {item.category}
                        </span>
                      </td>
                      <td data-label="Fiyat" className="ad-item-price" style={{ fontSize: "1.1rem", fontWeight: "700" }}>
                        ₺{item.price}
                      </td>
                      <td data-label="Durum">
                        <button
                          className={`ad-status-pill ${
                            item.status === "Aktif"
                              ? "ad-status-pill--active"
                              : "ad-status-pill--passive"
                          }`}
                          onClick={() => handleToggleStatus(item.id)}
                        >
                          ● {item.status}
                        </button>
                      </td>
                      <td className="ad-table-actions" data-label="İşlemler">
                        <button
                          className="ad-btn-icon"
                          style={{ color: "#a83232", border: "1px solid #e8d0d0", padding: "0.4rem 0.8rem", borderRadius: "2px" }}
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          🗑️ Sil
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddOpen && (
        <div className="ad-modal-overlay">
          <div className="ad-modal-card">
            <button className="ad-modal-close" onClick={() => setIsAddOpen(false)}>✕</button>
            <h2 className="ad-modal-title">Yeni Menü Ürünü Ekle</h2>
            <form onSubmit={handleAddSubmit} className="ad-modal-form">
              <div className="ad-input-group">
                <label>ÜRÜN ADI</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Osmanlı Saray Kebabı"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
              </div>

              <div className="ad-input-group">
                <label>KATEGORİ</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                >
                  <option value="Başlangıçlar">Başlangıçlar</option>
                  <option value="Ana Yemekler">Ana Yemekler</option>
                  <option value="Tatlılar">Tatlılar</option>
                  <option value="İçecekler">İçecekler</option>
                </select>
              </div>

              <div className="ad-input-group">
                <label>FİYAT (₺)</label>
                <input
                  type="number"
                  required
                  placeholder="Örn: 550"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                />
              </div>

              <div className="ad-input-group">
                <label>ÜRÜN GÖRSELİ (DOSYA YÜKLE VEYA URL GİRİN)</label>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <input
                    type="text"
                    placeholder="Görsel URL veya dosya seçin..."
                    value={newItem.img}
                    onChange={(e) => setNewItem({ ...newItem, img: e.target.value })}
                  />
                  <label className="ad-file-upload-label" style={{ flexShrink: 0, padding: "0.75rem 1rem", background: "#0a0805", color: "#c9a96e", borderRadius: "2px", cursor: "pointer", fontSize: "0.7rem", fontFamily: "var(--font-ui)", fontWeight: "700" }}>
                    DOSYA SEÇ
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onloadend = () => setNewItem({ ...newItem, img: reader.result })
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Presets */}
              <div className="ad-input-group">
                <label>HAZIR FOTOĞRAFLARDAN SEÇİN:</label>
                <div className="ad-preset-photos">
                  {[
                    { label: "Biftek", url: "/food_beef.png" },
                    { label: "Ceviche", url: "/food_ceviche.png" },
                    { label: "Tatlı", url: "/food_dessert.png" },
                    { label: "İçecek", url: "/food_drinks.png" },
                    { label: "Gurme", url: "/food_hero_1.png" },
                    { label: "Özel Tabak", url: "/food_hero_2.png" },
                  ].map((p) => (
                    <img
                      key={p.url}
                      src={p.url}
                      alt={p.label}
                      className={`ad-preset-img ${newItem.img === p.url ? "ad-preset-img--active" : ""}`}
                      onClick={() => setNewItem({ ...newItem, img: p.url })}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              {newItem.img && (
                <div className="ad-img-preview-box">
                  <span style={{ fontSize: "0.6rem", color: "#8a7e70", fontFamily: "var(--font-ui)" }}>GÖRSEL ÖNİZLEME:</span>
                  <img src={newItem.img} alt="Önizleme" className="ad-preview-thumb" />
                </div>
              )}

              <div className="ad-input-group">
                <label>AÇIKLAMA</label>
                <input
                  type="text"
                  placeholder="Örn: Taze yeşillikler ve meşe dumanı ile..."
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
              </div>

              <div className="ad-input-group">
                <label>DURUM</label>
                <select
                  value={newItem.status}
                  onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Pasif">Pasif</option>
                </select>
              </div>

              <button type="submit" className="ad-login-btn" style={{ marginTop: "1rem" }}>
                KAYDET VE MENÜYE EKLE
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
