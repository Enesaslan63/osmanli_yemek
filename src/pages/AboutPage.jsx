import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import "../styles/AboutPage.css"
import Footer from "../components/Footer"
import { getImgUrl } from "../utils/imageHelper"

/* ── Hero ────────────────────────────────── */
function AboutHero() {
  return (
    <section className="ab-hero">
      <div className="ab-hero-bg">
        <img src={getImgUrl("restaurant_hero.png")} alt="Osmanlı Hazır Yemek" />
        <div className="ab-hero-overlay" />
      </div>
      <div className="ab-hero-content">
        <p className="ab-eyebrow">HİKÂYEMİZ</p>
        <h1 className="ab-hero-title">
          Mutfak<br />
          <em>Sanatının</em><br />
          Derinliklerinde
        </h1>
        <p className="ab-hero-desc">
          Osmanlı Hazır Yemek, sadece bir restoran değil, lezzetin ve geleneğin
          sınırlarını zorlayan eşsiz bir lezzet yolculuğudur. Karanlığın içindeki
          aydınlığı, sadeliğin ardındaki zenginliği tabaklarda
          yansıtıyoruz.
        </p>
        <div className="ab-hero-mini">
          <div className="ab-mini-img">
            <img src={getImgUrl("food_plate.png")} alt="Tabak" />
          </div>
          <div className="ab-mini-text">
            <p>Yılların getirdiği estetiği</p>
            <p>ve lezzetiyle.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Chef ────────────────────────────────── */
function ChefSection() {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="ab-chef" ref={ref}>
      <div className={`ab-chef-inner ${vis ? "ab-chef-inner--vis" : ""}`}>
        {/* Photo */}
        <div className="ab-chef-photo-col">
          <div className="ab-chef-photo-wrap">
            <img src={getImgUrl("chef_alexandre.png")} alt="Şef Mehmet Usta" />
            <div className="ab-chef-badge">
              <span className="ab-badge-num">15</span>
              <span className="ab-badge-lbl">YIL DENEYİM</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="ab-chef-info">
          <p className="ab-chef-eyebrow">BAŞ AŞÇI <span className="ab-eyebrow-line">──────</span></p>
          <h2 className="ab-chef-name">
            Şef Mehmet<br />
            <em>Usta</em>
          </h2>
          <blockquote className="ab-chef-quote">
            "Geleneksel mutfağımızda her tarif bir mirastır. Her tabağın kendi
            dilinde anlattığı asırlık bir hikâye olmalı ve her lokma misafirlerimize
            unutulmaz bir lezzet şöleni yaşatmalıdır."
          </blockquote>
          <p className="ab-chef-bio">
            Anadolu'nun zengin lezzet mirası ile Saray mutfağının köklü geleneklerini
            harmanlayan Şef Mehmet Usta, 15 yılı aşkın tecrübesiyle Osmanlı Hazır Yemek
            mutfağına liderlik etmektedir. Ustalıkla hazırladığı özel tarifler, lezzeti
            ve kaliteyi en üst seviyede sunar.
          </p>
          <div className="ab-chef-sig">
            <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 30 Q30 10 50 25 Q70 40 90 15 Q105 5 115 20" stroke="#c9a96e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M15 35 Q40 20 60 30" stroke="#c9a96e" strokeWidth="0.8" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Vision & Values ─────────────────────── */
function VisionValues() {
  const values = [
    { icon: "◈", title: "TUTKU", desc: "İşimize olan tutkuyu, her tabağı muhteşem yaratmak için kullanıyoruz." },
    { icon: "◇", title: "SANAT", desc: "Sofistike yemekler ve estetikte derinlik her servise yansır." },
    { icon: "✦", title: "PARAGRAF", desc: "Samimi servis, her detayda, her köşede ve her müşteri için çalışılmıştır." },
    { icon: "◉", title: "USTALÜK", desc: "Sınırları zorlamak; estetiği, özgünlüğü ve yaratıcılığı birleştirmek." },
  ]

  return (
    <section className="ab-vv">
      <div className="ab-vv-inner">

        {/* Vision */}
        <div className="ab-vision-col">
          <div className="ab-section-head">
            <h2 className="ab-section-title">Vizyonumuz</h2>
            <div className="ab-head-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.2">
                <ellipse cx="12" cy="12" rx="10" ry="5.5" />
                <circle cx="12" cy="12" r="2.5" fill="#c9a96e" fillOpacity="0.3" />
                <circle cx="12" cy="12" r="1" />
              </svg>
            </div>
          </div>
          <p className="ab-vision-desc">
            Gastronomi dünyasında yenilikçi yaklaşımlarımız ve tarz ile kalite
            anlayışımızla bir referans noktan olmak. Yalnızca yemek yemiyor değil,
            tüm duyuların birleştiği, unutulmaz bir deneyim bırakmayı hedefliyoruz.
          </p>
          <ul className="ab-vision-list">
            <li><span className="ab-v-bullet">○</span> Sürdürülebilir ve yerel malzeme kullanışı;</li>
            <li><span className="ab-v-bullet">○</span> Sınırlı konuklara yönelik, avangard menü buluşmaları</li>
          </ul>
        </div>

        <div className="ab-vv-sep" />

        {/* Values */}
        <div className="ab-values-col">
          <div className="ab-section-head">
            <h2 className="ab-section-title">Değerlerimiz</h2>
            <div className="ab-head-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
          </div>
          <div className="ab-values-grid">
            {values.map((v, i) => (
              <div key={i} className="ab-value-item">
                <p className="ab-value-icon">{v.icon}</p>
                <p className="ab-value-title">{v.title}</p>
                <p className="ab-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

/* ── AboutPage ───────────────────────────── */
export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <ChefSection />
      <VisionValues />
      <Footer />
    </>
  )
}
