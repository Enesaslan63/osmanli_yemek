import { useState } from "react"
import "../styles/ReferencesPage.css"
import Footer from "../components/Footer"
import { getImgUrl } from "../utils/imageHelper"

/* ── Kurumsal İş Ortakları (Şanlıurfa ve Bölgesel Partnerler) ─── */
const partners = [
  { name: "Şanlıurfa Bld.", icon: "ŞBB" },
  { name: "Harran Üni.", icon: "HRÜ" },
  { name: "GAP İdaresi", icon: "GAP" },
  { name: "ŞUTSO", icon: "ŞTSO" },
  { name: "Güneydoğu İhr.", icon: "GAİB" },
  { name: "Organize San.", icon: "OSB" },
  { name: "Şanlıurfa Valiliği", icon: "ŞV" },
  { name: "TİGEM", icon: "TİGEM" },
]

/* ── Press Articles ──────────────────────────── */
const pressArticles = [
  {
    id: "featured",
    source: "ANADOLU GASTRONOMİ GAZETESİ",
    date: "Mart 2026",
    title: "Hijyen, Lezzet ve Kapasitede Sınır Tanımayan Mutfak Teknolojisi",
    excerpt:
      "Osmanlı Hazır Yemek, binlerce kişilik davetlerden kurumsal tabıldot hizmetlerine kadar Şanlıurfa'nın en hijyenik entegre tesislerinde asırlık lezzetleri modern sunumlarla buluşturuyor.",
    img: "./press_restaurant.png",
    link: "#",
    featured: true,
  },
]

/* ── Quote ───────────────────────────────────── */
const quote = {
  text: "\"Binlerce kişiye aynı anda ilk anki tazeliğinde ve ev lezzetinde sıcak yemek ulaştırabilmek büyük bir ustalık ve disiplin işidir. Osmanlı Hazır Yemek bunu kusursuz başarıyor.\"",
  author: "Halil İbrahim Usta",
  role: "Şanlıurfa Mutfak Kültürü Derneği",
}

/* ── Awards ──────────────────────────────────── */
const awards = [
  { year: "2026", title: "En İyi Kurumsal Catering Markası", org: "Anadolu Mutfak Zirvesi" },
  { year: "2025", title: "Hijyen & Kalite Mükemmellik Ödülü", org: "Gıda Sanayi Birliği" },
  { year: "2025", title: "Yılın Geleneksel Üreticisi", org: "Şanlıurfa Kültür Ödülleri" },
  { year: "2024", title: "Bölgesel Lezzet & İstihdam Ödülü", org: "GAP Ekonomi Dergisi" },
  { year: "2024", title: "Tüketici Memnuniyeti Birinciliği", org: "Güneydoğu Lezzet Birliği" },
]

/* ═══════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════ */
export default function ReferencesPage() {
  const [hoveredPartner, setHoveredPartner] = useState(null)

  return (
    <div className="rf-page">

      {/* ── Hero ── */}
      <section className="rf-hero">
        <p className="rf-hero-eyebrow">✦ &nbsp;REFERANSLAR &amp; BASIN&nbsp; ✦</p>
        <h1 className="rf-hero-title">Referanslar &amp; Basın</h1>
        <p className="rf-hero-desc">
          Sektördeki öncü markalarla kurduğumuz güçlü bağlar ve gastronomi dünyasında
          kazandığımız yerli yabancı saygınlık. Osmanlı Yemek'in hikâyesi, değerli iş
          ortaklıklarımız ve basındaki sesi ile şekilleniyor.
        </p>
        <div className="rf-hero-ornament">
          <span className="rf-ornament-line" />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="0.5" y="0.5" width="15" height="15" stroke="#c9a96e" strokeWidth="0.6" />
            <path d="M8 1 L15 8 L8 15 L1 8 Z" stroke="#c9a96e" strokeWidth="0.6" fill="none" />
          </svg>
          <span className="rf-ornament-line" />
        </div>
      </section>

      {/* ── Partners ── */}
      <section className="rf-partners">
        <div className="rf-partners-inner">
          <div className="rf-section-header">
            <div className="rf-section-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h2 className="rf-section-title">Kurumsal İş Ortakları</h2>
            <div className="rf-section-dots">
              <span className="rf-dot rf-dot--active" />
              <span className="rf-dot" />
            </div>
          </div>

          <div className="rf-partner-grid">
            {partners.map((p, i) => (
              <div
                key={i}
                className={`rf-partner-card ${hoveredPartner === i ? "rf-partner-card--hover" : ""}`}
                onMouseEnter={() => setHoveredPartner(i)}
                onMouseLeave={() => setHoveredPartner(null)}
              >
                <div className="rf-partner-logo-wrap">
                  <span className="rf-partner-icon">{p.icon}</span>
                </div>
                <p className="rf-partner-name">{p.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Awards Strip ── */}
      <section className="rf-awards">
        <div className="rf-awards-inner">
          <p className="rf-awards-eyebrow">ÖDÜLLER &amp; BAŞARILAR</p>
          <div className="rf-awards-track">
            {[...awards, ...awards].map((a, i) => (
              <div key={i} className="rf-award-item">
                <span className="rf-award-year">{a.year}</span>
                <span className="rf-award-sep">—</span>
                <span className="rf-award-title">{a.title}</span>
                <span className="rf-award-org">{a.org}</span>
                <span className="rf-award-gem">✦</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Press ── */}
      <section className="rf-press">
        <div className="rf-press-inner">
          <div className="rf-press-header">
            <p className="rf-press-eyebrow">MEDYA</p>
            <h2 className="rf-press-title">Basında Biz</h2>
            <div className="rf-title-line" />
          </div>

          <div className="rf-press-bento">

            {/* Featured large card */}
            <div className="rf-press-card rf-press-card--featured">
              <div className="rf-press-img-wrap">
                <img src={getImgUrl("press_restaurant.png")} alt="Basın Haberi" />
                <div className="rf-press-img-overlay" />
              </div>
              <div className="rf-press-card-body rf-press-card-body--featured">
                <p className="rf-press-source">ANADOLU GASTRONOMİ GAZETESİ</p>
                <h3 className="rf-press-card-title">
                  "Hijyen, Lezzet ve Kapasitede Sınır Tanımayan Mutfak Teknolojisi"
                </h3>
                <p className="rf-press-card-excerpt">
                  Osmanlı Hazır Yemek, binlerce kişilik davetlerden kurumsal tabıldot hizmetlerine kadar Şanlıurfa'nın en hijyenik entegre tesislerinde asırlık lezzetleri modern sunumlarla buluşturuyor.
                </p>
              </div>
            </div>

            {/* Right column */}
            <div className="rf-press-col">

              {/* ISO Sertifika Kartı */}
              <div className="rf-press-card rf-press-card--michelin">
                <div className="rf-michelin-icon">
                  <svg viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="19" stroke="#c9a96e" strokeWidth="1"/>
                    <path d="M20 8 C14 8 10 13 10 20 C10 27 14 32 20 32 C26 32 30 27 30 20 C30 13 26 8 20 8Z" stroke="#c9a96e" strokeWidth="0.8" fill="none"/>
                    <circle cx="20" cy="20" r="3" fill="#c9a96e"/>
                  </svg>
                </div>
                <div className="rf-michelin-text">
                  <p className="rf-michelin-label">ISO 22000 &amp; HACCP</p>
                  <p className="rf-michelin-subtitle">GİDA GÜVENLİĞİ &amp; HİJYEN BELGELİ</p>
                  <p className="rf-michelin-years">%100 YERLİ &amp; KALİTELİ ÜRETİM</p>
                </div>
                <div className="rf-michelin-stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="rf-michelin-star">★</span>
                  ))}
                </div>
              </div>

              {/* Lifestyle card (dark) */}
              <div className="rf-press-card rf-press-card--dark">
                <div className="rf-press-img-wrap rf-press-img-wrap--sm">
                  <img src={getImgUrl("press_restaurant.png")} alt="Güneydoğu Sanayi Gazetesi" />
                  <div className="rf-press-img-overlay" />
                </div>
                <div className="rf-press-card-body">
                  <p className="rf-press-source rf-press-source--gold">SANAYİ &amp; EKONOMİ REHBERİ</p>
                  <h3 className="rf-press-card-title rf-press-card-title--sm">
                    Kurumsal Yemek Çözümlerinde Güvenilir Ortak
                  </h3>
                  <p className="rf-press-card-excerpt rf-press-card-excerpt--sm">
                    Fabrika, okul ve şantiye tabıldot yemeklerinde günlük taze ve hijyenik lezzet garantisi.
                  </p>
                </div>
              </div>

            </div>

            {/* Quote card */}
            <div className="rf-press-card rf-press-card--quote">
              <div className="rf-quote-mark">"</div>
              <blockquote className="rf-quote-text">{quote.text}</blockquote>
              <div className="rf-quote-author">
                <span className="rf-quote-name">{quote.author}</span>
                <span className="rf-quote-role">{quote.role}</span>
              </div>
            </div>

            {/* Living Magazine -> Lezzet Dergisi */}
            <div className="rf-press-card rf-press-card--dark rf-press-card--cocktail">
              <div className="rf-press-img-wrap rf-press-img-wrap--full">
                <img src={getImgUrl("restaurant_interior.png")} alt="Geleneksel Şanlıurfa Mutfağı" />
                <div className="rf-press-img-overlay" />
              </div>
              <div className="rf-press-card-body rf-press-card-body--abs">
                <p className="rf-press-source">LEZZET &amp; KÜLTÜR MAGAZINE</p>
                <h3 className="rf-press-card-title rf-press-card-title--sm">
                  Geleneksel Şanlıurfa Mutfak Mirası
                </h3>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Media Logos Strip ── */}
      <section className="rf-media-logos">
        <div className="rf-media-logos-inner">
          <p className="rf-media-eyebrow">BİZİ HABER YAPAN BASIN YAYINLARI</p>
          <div className="rf-media-grid">
            {[
              "Güneydoğu Haber",
              "Şanlıurfa Gazetesi",
              "Anadolu Gastronomi",
              "Sanayi & Ekonomi TR",
              "Gıda Üreticileri Dergisi",
              "Gurme Anadolu",
            ].map((m, i) => (
              <div key={i} className="rf-media-item">
                <span>{m}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="rf-cta">
        <div className="rf-cta-inner">
          <p className="rf-cta-eyebrow">KURUMSAL ÇÖZÜMLER</p>
          <h2 className="rf-cta-title">Sizin de Hikâyenizi Yazalım</h2>
          <p className="rf-cta-desc">
            Toplu yemek, kurumsal catering ve özel organizasyon teklifleriniz için uzman ekibimizle iletişime geçin.
          </p>
          <div className="rf-cta-btns">
            <a href="/iletisim" className="rf-cta-btn rf-cta-btn--primary">
              İLETİŞİME GEÇ
            </a>
            <a href="/menu" className="rf-cta-btn rf-cta-btn--secondary">
              MENÜYÜ İNCELE
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      {/* ── Footer ── */}
      <Footer />

    </div>
  )
}
