import { useState, useEffect, useMemo } from "react"
import "../styles/ReviewsPage.css"
import { supabase } from "../lib/supabaseClient"
import Footer from "../components/Footer"
import { getImgUrl } from "../utils/imageHelper"

/* ── Initial Featured Reviews ───────────────────────── */
const defaultReviews = [
  {
    id: 1,
    stars: 5,
    quote:
      "Mükemmel kelimesi burayı tanımlamak için yetersiz kalır. Şefin imza tadım menüsü, her tabakta ayrı bir sanat eseriydi. Ambiyans, loş ışıklar ve kusursuz servis, İstanbul'daki en iyi fine-dining deneyimini sundu.",
    name: "AYLİN E.",
    title: "Gurme Yazar",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    theme: "light",
    size: "large",
  },
  {
    id: 2,
    stars: 5,
    quote:
      "Şarap eşleştirmeleri olağanüstüydü. Sommelier'in bilgi birikimi ve bizi yönlendirmesi geceyi bambaşka bir seviyeye taşıdı.",
    name: "CANER K.",
    title: "İş İnsanı",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    theme: "dark",
    size: "small",
  },
  {
    id: 3,
    stars: 5,
    quote:
      "Evlilik yıldönümümüz için tercih ettik. Bize ayrılan özel köşe ve sürpriz tatlı harikaydı. Kesinlikle tekrar geleceğiz.",
    name: "MERT & SEDA",
    title: "Misafir",
    initials: "M",
    theme: "light",
    size: "small",
  },
  {
    id: 4,
    stars: 5,
    quote:
      "Karanlık ve sofistike atmosferi, modern mutfak teknikleriyle birleştiğinde ortaya inanılmaz bir kontrast çıkıyor. Trüf mantarlı risotto rüya gibiydi.",
    name: "ZEYNEP B.",
    title: "Tasarımcı",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    theme: "light",
    size: "large",
  },
]

export default function ReviewsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: "", title: "", review: "", rating: 5 })
  const [dbReviews, setDbReviews] = useState([])
  const [errorMsg, setErrorMsg] = useState("")

  // Supabase'den canlı yorumları çek
  const fetchSupabaseReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("id", { ascending: false })
      if (!error && data) {
        const approved = data
          .filter((r) => !r.status || r.status === "Onaylandı")
          .map((r) => ({
            id: r.id,
            stars: r.rating || 5,
            quote: r.comment || r.review || "",
            name: (r.author || r.name || "Misafir").toUpperCase(),
            title: r.role || r.title || "Misafir",
            theme: "light",
            size: "small",
          }))
        setDbReviews(approved)
      }
    } catch (err) {
      console.log("Fetch reviews error:", err)
    }
  }

  useEffect(() => {
    fetchSupabaseReviews()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg("")

    if (!formData.name.trim() || !formData.review.trim()) {
      setErrorMsg("Lütfen adınızı ve yorumunuzu doldurun.")
      return
    }

    const cleanName = formData.name.trim().toLowerCase()

    try {
      // Supabase Veritabanında Mükerrer İsim Kontrolü
      const { data: existingData } = await supabase.from("reviews").select("author, name")
      if (existingData && existingData.length > 0) {
        const isDuplicate = existingData.some((r) => {
          const authorName = (r.author || r.name || "").trim().toLowerCase()
          return authorName === cleanName
        })
        if (isDuplicate) {
          setErrorMsg(`Sayın ${formData.name.trim()}, bu isimle daha önce bir değerlendirme yorumu gönderilmiştir.`)
          return
        }
      }

      // Supabase'e Yeni Yorumu Ekle
      const { error: insertErr } = await supabase.from("reviews").insert([
        {
          author: formData.name.trim(),
          name: formData.name.trim(),
          role: formData.title.trim() || "Misafir",
          title: formData.title.trim() || "Misafir",
          comment: formData.review.trim(),
          review: formData.review.trim(),
          rating: Number(formData.rating) || 5,
          status: "Onaylandı",
          created_at: new Date().toISOString(),
        },
      ])

      if (insertErr) {
        console.log("Supabase insert review error:", insertErr)
        setErrorMsg("Yorum kaydedilirken bir hata oluştu: " + insertErr.message)
        return
      }

      setSubmitted(true)
      await fetchSupabaseReviews()
    } catch (err) {
      console.log("Supabase insert review error:", err)
      setErrorMsg("Yorum kaydedilirken bir hata oluştu.")
      return
    }

    setTimeout(() => {
      setSubmitted(false)
      setModalOpen(false)
      setFormData({ name: "", title: "", review: "", rating: 5 })
    }, 2500)
  }

  const avgRating = useMemo(() => {
    if (!dbReviews || dbReviews.length === 0) return "5.0"
    const total = dbReviews.reduce((sum, r) => sum + (Number(r.stars) || 5), 0)
    return (total / dbReviews.length).toFixed(1)
  }, [dbReviews])

  const starIcons = useMemo(() => {
    const score = parseFloat(avgRating)
    const fullStars = Math.min(5, Math.floor(score))
    const emptyStars = Math.max(0, 5 - fullStars)
    return "★".repeat(fullStars) + "☆".repeat(emptyStars)
  }, [avgRating])

  return (
    <div className="rv-page">
      {/* ── Hero Section ── */}
      <section className="rv-hero">
        <div className="rv-hero-inner">
          <div className="rv-hero-content">
            <p className="rv-hero-eyebrow">MİSAFİR DENEYİMLERİ</p>
            <h1 className="rv-hero-title">
              Unutulmaz<br />Anların İzleri
            </h1>
            <p className="rv-hero-desc">
              Osmanlı Yemek'te geçirdiğiniz her an, bizim için eşsiz bir hikâyedir.
              İlhamını sizden alan mutfağımızın, değerli misafirlerimizde bıraktığı
              tatlı ve derin izler.
            </p>
            <button className="rv-hero-btn" onClick={() => setModalOpen(true)}>
              + Yorum Yaz
            </button>
          </div>

          <div className="rv-hero-image-wrap">
            <img src={getImgUrl("restaurant_interior.png")} alt="Osmanlı Yemek Ambiyans" />
            <div className="rv-hero-rating-badge">
              <span className="rv-rating-score">{avgRating}</span>
              <div className="rv-rating-stars">{starIcons}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews Grid Section ── */}
      <section className="rv-grid-section">
        <div className="rv-reviews-grid">
          {dbReviews.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem 1rem", background: "#fcfaf7", border: "1px solid #e8e0d5", borderRadius: "4px" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⭐</div>
              <h3 style={{ fontFamily: "var(--font-body)", fontSize: "1.4rem", color: "#1a1510", marginBottom: "0.5rem" }}>
                Henüz Yayınlanmış Değerlendirme Bulunmuyor
              </h3>
              <p style={{ color: "#7a7060", fontSize: "0.9rem", maxWidth: "450px", margin: "0 auto 1.5rem auto" }}>
                Osmanlı Yemek deneyiminizi paylaşan ilk misafirimiz siz olun!
              </p>
              <button className="rv-hero-btn" onClick={() => setModalOpen(true)}>
                + İLK YORUMU SİZ YAZIN
              </button>
            </div>
          ) : (
            dbReviews.map((r, idx) => (
              <div
                key={r.id || idx}
                className={`rv-card ${idx % 2 === 1 ? "rv-card--dark" : "rv-card--light"}`}
                style={{ display: "flex", flexDirection: "column", height: "100%" }}
              >
                <div className="rv-stars" style={{ color: "#d4af37", marginBottom: "1rem" }}>
                  {"★".repeat(r.stars || 5)}{"☆".repeat(5 - (r.stars || 5))}
                </div>
                <p className="rv-quote-text" style={{ flex: 1, fontStyle: "italic", lineHeight: "1.6" }}>
                  "{r.quote}"
                </p>
                <div className="rv-author" style={{ marginTop: "1.5rem" }}>
                  <div className="rv-avatar-initials" style={{ background: "#8b6e3e", color: "#fff", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700" }}>
                    {(r.name || "M").charAt(0).toUpperCase()}
                  </div>
                  <div className="rv-author-info" style={{ marginLeft: "0.75rem" }}>
                    <span className="rv-author-name" style={{ fontWeight: "700", display: "block" }}>
                      {(r.name || "Misafir").toUpperCase()}
                    </span>
                    <span className="rv-author-title" style={{ fontSize: "0.75rem", opacity: 0.8 }}>
                      {r.title || "Misafir"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── Call To Action Banner ── */}
      <section className="rv-cta-section">
        <div className="rv-cta-inner">
          <p className="rv-cta-eyebrow">HİKÂYEYE KATILIN</p>
          <h2 className="rv-cta-title">Sizin Deneyiminiz, Bizim İlhamımız</h2>
          <p className="rv-cta-desc">
            Osmanlı Yemek ailesi olarak, misafirlerimizin yorumları en değerli rehberimizdir.
            Masamızdaki yerinizi aldıysanız, düşüncelerinizi bizimle paylaşın.
          </p>
          <button className="rv-cta-btn" onClick={() => setModalOpen(true)}>
            SİZ DE YAZIN &nbsp;↗
          </button>
        </div>
      </section>

      {/* ── Review Modal Form ── */}
      {modalOpen && (
        <div className="rv-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="rv-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="rv-modal-close" onClick={() => setModalOpen(false)}>✕</button>
            {submitted ? (
              <div className="rv-modal-success">
                <h3>Teşekkür Ederiz!</h3>
                <p>Değerlendirme yorumunuz başarıyla alındı ve yayınlandı.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rv-form">
                <h3 className="rv-form-title">Deneyiminizi Paylaşın</h3>

                {errorMsg && (
                  <div style={{ background: "#f8d7da", border: "1px solid #f5c6cb", color: "#721c24", padding: "0.6rem 0.8rem", borderRadius: "3px", fontSize: "0.8rem", marginBottom: "1rem" }}>
                    ⚠️ {errorMsg}
                  </div>
                )}
                <div className="rv-form-group">
                  <label>Adınız ve Soyadınız / Rumuz</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Örn: Aylin E."
                  />
                </div>
                <div className="rv-form-group">
                  <label>Unvan / Meslek (Opsiyonel)</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Örn: Gurme Yazar"
                  />
                </div>
                <div className="rv-form-group">
                  <label>Puanınız</label>
                  <div className="rv-star-picker">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`rv-star-picker-btn ${star <= formData.rating ? "rv-star-picker-btn--active" : ""}`}
                        onClick={() => setFormData({ ...formData, rating: star })}
                      >
                        ★
                      </button>
                    ))}
                    <span className="rv-star-picker-text">({formData.rating}/5)</span>
                  </div>
                  <select
                    style={{ marginTop: "0.5rem" }}
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  >
                    <option value={5}>★★★★★ (5/5 Mükemmel)</option>
                    <option value={4}>★★★★☆ (4/5 Çok İyi)</option>
                    <option value={3}>★★★☆☆ (3/5 Orta)</option>
                    <option value={2}>★★☆☆☆ (2/5 Zayıf)</option>
                    <option value={1}>★☆☆☆☆ (1/5 Kötü)</option>
                  </select>
                </div>
                <div className="rv-form-group">
                  <label>Yorumunuz</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.review}
                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                    placeholder="Osmanlı Yemek hakkındaki görüşleriniz..."
                  />
                </div>
                <button type="submit" className="rv-form-submit">YORUMU GÖNDER</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <Footer />
    </div>
  )
}
