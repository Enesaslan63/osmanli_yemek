import { useState, useEffect } from "react"
import "../styles/GalleryPage.css"
import { supabase } from "../lib/supabaseClient"
import Footer from "../components/Footer"

/* ── Gallery Items ──────────────────────── */
const initialGalleryItems = [
  {
    id: 1,
    src: "./restaurant_interior.png",
    label: "İÇ MEKAN",
    category: "ic_mekan",
    monochrome: true,
    featured: false,
  },
  {
    id: 2,
    src: "./food_ceviche.png",
    label: "ŞEFİN SEÇİMİ",
    category: "tabaklar",
    monochrome: false,
    featured: false,
  },
  {
    id: 3,
    src: "./press_restaurant.png",
    label: "MUTFAK",
    category: "mutfak",
    monochrome: true,
    featured: false,
  },
  {
    id: 4,
    src: "./food_hero_1.png",
    label: "EL PANNO",
    category: "ambiyans",
    monochrome: false,
    featured: false,
  },
  {
    id: 5,
    src: "./food_dessert.png",
    label: "ŞEF İMZASI",
    category: "tabaklar",
    monochrome: false,
    featured: true,
  },
  {
    id: 6,
    src: "./food_beef.png",
    label: "ANA TABAK",
    category: "tabaklar",
    monochrome: false,
    featured: false,
  },
  {
    id: 7,
    src: "./food_hero_2.png",
    label: "BAŞLANGIÇ",
    category: "tabaklar",
    monochrome: false,
    featured: false,
  },
  {
    id: 8,
    src: "./food_drinks.png",
    label: "BAR",
    category: "ic_mekan",
    monochrome: false,
    featured: false,
  },
]

/* ── Lightbox ───────────────────────────── */
function Lightbox({ item, onClose, onPrev, onNext }) {
  if (!item) return null
  return (
    <div className="gl-lightbox" onClick={onClose}>
      <button className="gl-lb-close" onClick={onClose} aria-label="Kapat">✕</button>
      <button className="gl-lb-prev" onClick={(e) => { e.stopPropagation(); onPrev() }} aria-label="Önceki">‹</button>
      <div className="gl-lb-img-wrap" onClick={(e) => e.stopPropagation()}>
        <img src={item.src} alt={item.label} />
        <div className="gl-lb-label">{item.label}</div>
      </div>
      <button className="gl-lb-next" onClick={(e) => { e.stopPropagation(); onNext() }} aria-label="Sonraki">›</button>
    </div>
  )
}

/* ═══════════════════════════════════════════
   PAGE
═══════════════════════════════════════════ */
export default function GalleryPage() {
  const [items, setItems] = useState([])
  const [lightboxIdx, setLightboxIdx] = useState(null)

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data, error } = await supabase
          .from("gallery_items")
          .select("*")
          .order("id", { ascending: false })
        if (!error && data) {
          const mapped = data.map((d) => ({
            id: d.id,
            src: d.img,
            label: d.title ? d.title.toUpperCase() : "GALERİ",
            category: d.category || "tabaklar",
            monochrome: false,
            featured: false,
          }))
          setItems(mapped)
        } else {
          setItems([])
        }
      } catch (err) {
        console.log("Fetch gallery error:", err)
        setItems([])
      }
    }
    fetchGallery()
  }, [])

  const openLightbox = (idx) => setLightboxIdx(idx)
  const closeLightbox = () => setLightboxIdx(null)
  const prevItem = () => setLightboxIdx((i) => (i - 1 + items.length) % items.length)
  const nextItem = () => setLightboxIdx((i) => (i + 1) % items.length)

  return (
    <div className="gl-page">

      {/* ── Hero ── */}
      <section className="gl-hero">
        <p className="gl-hero-eyebrow">GALERİ ATANAS</p>
        <h1 className="gl-hero-title">Galeri</h1>
        <p className="gl-hero-desc">
          Osmanlı Yemek'i bir görüntü ile anlatmak isteriz, inanıyoruz ki
          her birinin, tabakların ve mekânın zamansız güzelliğini yansıtır.
        </p>
      </section>

      {/* ── Editorial Gallery ── */}
      <section className="gl-editorial">

        {/* ── Row 1 ── */}
        <div className="gl-row gl-row--1">
          {/* Large B&W interior */}
          {items[0] && (
            <div
              className="gl-item gl-item--large-left gl-item--bw"
              onClick={() => openLightbox(0)}
            >
              <div className="gl-item-img-wrap">
                <img src={items[0].src} alt={items[0].label} />
              </div>
              <div className="gl-item-overlay">
                <span className="gl-item-label">{items[0].label}</span>
              </div>
            </div>
          )}

          {/* Overlapping color food */}
          {items[1] && (
            <div
              className="gl-item gl-item--overlap-right"
              onClick={() => openLightbox(1)}
            >
              <div className="gl-item-img-wrap">
                <img src={items[1].src} alt={items[1].label} />
              </div>
              <div className="gl-item-badge">{items[1].label}</div>
            </div>
          )}
        </div>

        {/* ── Row 2: MUTFAK ── */}
        <div className="gl-row gl-row--2">
          {/* Vertical category label */}
          <div className="gl-category-tag">
            <span>MUTFAK</span>
          </div>

          {/* Chef B&W photo */}
          {items[2] && (
            <div
              className="gl-item gl-item--chef gl-item--bw"
              onClick={() => openLightbox(2)}
            >
              <div className="gl-item-img-wrap">
                <img src={items[2].src} alt={items[2].label} />
              </div>
              <div className="gl-item-overlay">
                <span className="gl-item-label">{items[2].label}</span>
              </div>
            </div>
          )}

          {/* Table setting color */}
          {items[3] && (
            <div
              className="gl-item gl-item--table"
              onClick={() => openLightbox(3)}
            >
              <div className="gl-item-img-wrap">
                <img src={items[3].src} alt={items[3].label} />
              </div>
              <div className="gl-item-badge gl-item-badge--top-right">{items[3].label}</div>
            </div>
          )}
        </div>

        {/* ── Row 3: Featured dessert ── */}
        <div className="gl-row gl-row--3">
          {items[4] && (
            <div
              className="gl-item gl-item--center-featured"
              onClick={() => openLightbox(4)}
            >
              <div className="gl-item-img-wrap">
                <img src={items[4].src} alt={items[4].label} />
              </div>
              <div className="gl-item-badge gl-item-badge--bottom">{items[4].label}</div>
            </div>
          )}
        </div>

        {/* ── Extra grid row ── */}
        <div className="gl-row gl-row--4">
          {items.slice(5).map((item, sliceIdx) => {
            const actualIdx = sliceIdx + 5
            return (
              <div
                key={item.id || actualIdx}
                className="gl-item gl-item--grid"
                onClick={() => openLightbox(actualIdx)}
              >
                <div className="gl-item-img-wrap">
                  <img src={item.src} alt={item.label} />
                </div>
                <div className="gl-item-overlay">
                  <span className="gl-item-label">{item.label}</span>
                </div>
              </div>
            )
          })}
        </div>

      </section>

      {/* ── Lightbox ── */}
      <Lightbox
        item={lightboxIdx !== null ? items[lightboxIdx] : null}
        onClose={closeLightbox}
        onPrev={prevItem}
        onNext={nextItem}
      />

      {/* ── Footer ── */}
      <Footer />

    </div>
  )
}
