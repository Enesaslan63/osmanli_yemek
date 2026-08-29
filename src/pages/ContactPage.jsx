import { useState } from "react"
import "../styles/ContactPage.css"
import Footer from "../components/Footer"
import { supabase } from "../lib/supabaseClient"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Genel İletişim & Geri Bildirim",
    message: "",
  })

  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return
    setSubmitted(true)

    const msgObj = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject || "Genel İletişim",
      message: formData.message,
      status: "Yanıtlanmadı",
      created_at: new Date().toISOString(),
    }

    // LocalStorage ile anında senkronize et ve diğer sekmelere canlı bildirim gönder
    try {
      const saved = localStorage.getItem("admin_contact_messages")
      const existing = saved ? JSON.parse(saved) : []
      const updated = [msgObj, ...existing]
      localStorage.setItem("admin_contact_messages", JSON.stringify(updated))
      window.dispatchEvent(new StorageEvent("storage", { key: "admin_contact_messages", newValue: JSON.stringify(updated) }))
    } catch (e) {
      console.log("localStorage write error:", e)
    }

    // Supabase'e ekle (Esnek şema toleransı ile)
    try {
      const payload = {
        name: msgObj.name,
        email: msgObj.email,
        phone: msgObj.phone,
        subject: msgObj.subject,
        message: msgObj.message,
        status: msgObj.status,
        created_at: msgObj.created_at,
      }

      const { data, error } = await supabase
        .from("contact_messages")
        .insert([payload])
        .select()

      if (error) {
        console.error("Supabase insert uyarısı, minimal şema deneniyor:", error.message || error)
        await supabase.from("contact_messages").insert([{
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          subject: payload.subject,
          message: payload.message
        }])
      } else {
        console.log("Supabase mesaj kaydı başarılı:", data)
      }
    } catch (err) {
      console.error("Supabase insert catch hatası:", err)
    }

    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: "", email: "", phone: "", subject: "Genel İletişim & Geri Bildirim", message: "" })
    }, 4000)
  }

  return (
    <div className="ct-page">
      {/* ── Top Map Background & Hero Section ── */}
      <section className="ct-hero-section">
        <div className="ct-map-bg">
          <iframe
            title="Osmanlı Hazır Yemek Konum"
            src="https://maps.google.com/maps?q=Eyyüp%20Nebi,%203508.%20Sk.%20no:%201A,%2063200%20Eyyübiye/Şanlıurfa&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "contrast(95%) opacity(70%) grayscale(20%)" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="ct-map-overlay" />
        </div>

        {/* ── Floating Contact Card ── */}
        <div className="ct-card-container">
          <div className="ct-card">
            {/* Left Column: Contact Info */}
            <div className="ct-info-col">
              <h1 className="ct-title">Bize Ulaşın</h1>
              <p className="ct-desc">
                Rezervasyon, özel etkinlikler veya sadece bir merhaba demek için bizimle
                iletişime geçin. Ekibimiz size yardımcı olmaktan mutluluk duyacaktır.
              </p>

              <div className="ct-info-list">
                {/* Item 1: Adres */}
                <div className="ct-info-item">
                  <div className="ct-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 21s-8-7.5-8-12a8 8 0 1 1 16 0c0 4.5-8 12-8 12z" />
                      <circle cx="12" cy="9" r="3" />
                    </svg>
                  </div>
                  <div className="ct-info-text">
                    <span className="ct-info-label">Adres</span>
                    <p className="ct-info-val">
                      Eyyüp Nebi, 3508. Sk. no: 1A<br />63200 Eyyübiye/Şanlıurfa
                    </p>
                  </div>
                </div>

                {/* Item 2: Telefon */}
                <div className="ct-info-item">
                  <div className="ct-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div className="ct-info-text">
                    <span className="ct-info-label">Telefon / WhatsApp</span>
                    <a href="tel:05457855557" style={{ color: "inherit", textDecoration: "none" }} className="ct-info-val">
                      0545 785 55 57
                    </a>
                  </div>
                </div>

                {/* Item 3: E-posta */}
                <div className="ct-info-item">
                  <div className="ct-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div className="ct-info-text">
                    <span className="ct-info-label">E-posta</span>
                    <p className="ct-info-val">reservations@osmanliyemek.com</p>
                  </div>
                </div>

                {/* Item 4: Çalışma Saatleri */}
                <div className="ct-info-item">
                  <div className="ct-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div className="ct-info-text">
                    <span className="ct-info-label">Çalışma Saatleri</span>
                    <p className="ct-info-val">
                      Pazartesi - Pazar: 09:00 - 00:00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="ct-form-col">
              {submitted ? (
                <div className="ct-form-success">
                  <h3>Mesajınız İletildi</h3>
                  <p>En kısa sürede tarafınıza dönüş yapılacaktır. İlginiz için teşekkür ederiz.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="ct-form">
                  <div className="ct-field">
                    <label>AD SOYAD</label>
                    <input
                      type="text"
                      required
                      placeholder="İsminizi giriniz"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="ct-field">
                    <label>E-POSTA</label>
                    <input
                      type="email"
                      required
                      placeholder="E-posta adresinizi giriniz"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="ct-field">
                    <label>TELEFON NUMARASI / WHATSAPP</label>
                    <input
                      type="tel"
                      placeholder="Örn: 0545 785 55 57 (WhatsApp ile yanıt almak için)"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="ct-field">
                    <label>KONU</label>
                    <div className="ct-select-wrap">
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      >
                        <option value="Masa Rezervasyonu">Masa Rezervasyonu</option>
                        <option value="Özel Etkinlik & Davet">Özel Etkinlik & Davet</option>
                        <option value="Basın & Medya İletişimi">Basın & Medya İletişimi</option>
                        <option value="Genel İletişim & Geri Bildirim">Genel İletişim & Geri Bildirim</option>
                      </select>
                      <span className="ct-select-arrow">❯</span>
                    </div>
                  </div>

                  <div className="ct-field">
                    <label>MESAJINIZ</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Mesajınızı buraya yazınız..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="ct-submit-btn">
                    MESAJ GÖNDER &nbsp;→
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Social Follow Section ── */}
      <section className="ct-social-section">
        <div className="ct-social-line" />
        <p className="ct-social-eyebrow">BİZİ TAKİP EDİN</p>
        <div className="ct-social-links">
          <a href="https://www.instagram.com/osmanli.yemek/" target="_blank" rel="noopener noreferrer" className="ct-social-box" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a href="https://x.com/i/flow/login" target="_blank" rel="noopener noreferrer" className="ct-social-box" aria-label="X">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="https://www.facebook.com/share/1FANY4j8GA/" target="_blank" rel="noopener noreferrer" className="ct-social-box" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <Footer />
    </div>
  )
}
