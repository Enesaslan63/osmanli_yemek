import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import "../styles/MenuPage.css"
import { supabase } from "../lib/supabaseClient"
import Footer from "../components/Footer"

const getImgUrl = (url) => {
  if (!url) return "./food_hero_1.png"
  if (url.startsWith("/")) return "." + url
  return url
}

/* ── Menu Data ──────────────────────────────────── */
const menuData = {
  baslangiclar: {
    label: "BAŞLANGIÇLAR",
    title: "Başlangıçlar",
    desc: "Ana yemeğe geçmeden önce damak zevkinizi uyandıracak hafif ve zarif lezzetler.",
    img: "/food_ceviche.png",
    featured: "Deniz Taraklı Carpaccio",
    accent: "#c9a96e",
    items: [
      {
        id: "b1",
        name: "Deniz Taraklı Carpaccio",
        badge: "ŞEFİN SEÇİMİ",
        desc: "Taze deniz tarağı, narenciye emülsiyonu, fındık turşu, frenk soğanı yağı ve beluga havyarı.",
        price: 450,
        img: "/food_ceviche.png",
        allergens: "Kabuklu Deniz Ürünleri · Süt",
        calories: "220 kcal",
        winePairing: "Chardonnay Reserve 2021",
        chefNote: "Ege kıyılarından günlük olarak getirilen taze deniz tarakları narenciye asidinde pişirilmektedir.",
        isGlutenFree: true,
        isVegetarian: false,
      },
      {
        id: "b2",
        name: "Közlenmiş İlik Kemik",
        badge: null,
        desc: "Karamelize soğan reçeli, maydanoz salatası, ızgara ekşi maya ekmek ve deniz tuzu.",
        price: 380,
        img: "/food_beef.png",
        allergens: "Gluten",
        calories: "450 kcal",
        winePairing: "Syrah Reserve 2019",
        chefNote: "12 saat yavaş fırınlanmış dananın ilik kemiği, odun ateşinde kızartılan özel ekmekle servis edilir.",
        isGlutenFree: false,
        isVegetarian: false,
      },
      {
        id: "b3",
        name: "Füme Ördek Göğsü",
        badge: null,
        desc: "Vişne gastrik, kereviz püresi, çıtır kinoa ve mikro yeşillikler.",
        price: 420,
        img: "/food_hero_1.png",
        allergens: "—",
        calories: "310 kcal",
        winePairing: "Pinot Noir 2020",
        chefNote: "Meşe odunu dumanında soğuk tütsülenmiş ördek göğsü, vişne sosunun ekşiliğiyle dengelenir.",
        isGlutenFree: true,
        isVegetarian: false,
      },
      {
        id: "b4",
        name: "Enginar ve Kuşkonmaz",
        badge: "VEGETARİAN",
        desc: "Buharda pişmiş enginar kalbi, ızgara kuşkonmaz, trüflü hollandaz sos ve parmesan çıtırı.",
        price: 320,
        img: "/food_hero_2.png",
        allergens: "Süt · Yumurta",
        calories: "240 kcal",
        winePairing: "Sauvignon Blanc 2022",
        chefNote: "Urla enginarları ve Ege kuşkonmazı, ev yapımı taze trüflü hollandaz sos ile taçlandırılır.",
        isGlutenFree: true,
        isVegetarian: true,
      },
      {
        id: "b5",
        name: "Karaciğer Pâté",
        badge: null,
        desc: "Tavuk ciğeri püresi, armut reçeli, limon jölesi ve brioche kızartması.",
        price: 290,
        img: "/food_ceviche.png",
        allergens: "Süt · Gluten · Yumurta",
        calories: "380 kcal",
        winePairing: "Sauternes 2018",
        chefNote: "Fransız usulü hazırlanan ipeksi pâté, ev yapımı brioche ekmeği üstünde sunulur.",
        isGlutenFree: false,
        isVegetarian: false,
      },
    ],
  },

  ana_yemekler: {
    label: "ANA YEMEKLER",
    title: "Ana Yemekler",
    desc: "Mevsimin en seçkin malzemeleriyle, şefimizin ustalıkla hazırladığı imza tabaklar.",
    img: "/food_beef.png",
    featured: "Közlenmiş Dana Fileto",
    accent: "#b8860b",
    items: [
      {
        id: "a1",
        name: "Közlenmiş Dana Fileto",
        badge: "ŞEFİN SEÇİMİ",
        desc: "28 gün dinlendirilmiş dana fileto, taze trüf, mevsim sebzeleri ve bordelaise sos.",
        price: 680,
        img: "/food_beef.png",
        allergens: "Süt · Gluten",
        calories: "580 kcal",
        winePairing: "Cabernet Sauvignon Gran Reserva",
        chefNote: "Kuru dinlendirilmiş biftek, meşe kömürü ızgarasında arzuladığınız pişme derecesinde sunulur.",
        isGlutenFree: false,
        isVegetarian: false,
      },
      {
        id: "a2",
        name: "Izgara Levrek",
        badge: null,
        desc: "Kaparili tereyağı, limon risotto, zeytinyağlı enginar ve şarap sosu.",
        price: 520,
        img: "/food_ceviche.png",
        allergens: "Balık · Süt · Gluten",
        calories: "410 kcal",
        winePairing: "Chablis Premier Cru",
        chefNote: "Vahşi olta levreği, çıtır derili olarak tavalanır ve safranlı risotto ile buluşur.",
        isGlutenFree: false,
        isVegetarian: false,
      },
      {
        id: "a3",
        name: "Kuzu Rack",
        badge: "YENİ",
        desc: "Fıstıklı kabuk, güveç domates, patlıcan püresi ve bağ sosu ile.",
        price: 760,
        img: "/food_hero_1.png",
        allergens: "Fındık · Gluten",
        calories: "640 kcal",
        winePairing: "Öküzgözü / Boğazkere 2018",
        chefNote: "Antep fıstığı kabuğunda mühürlenmiş kuzu pirzola, köz patlıcan püresi eşliğinde servis edilir.",
        isGlutenFree: false,
        isVegetarian: false,
      },
      {
        id: "a4",
        name: "Ördek Konfi",
        badge: null,
        desc: "Mantar duxelles, patates graten, kiraz sosu ile servis edilir.",
        price: 580,
        img: "/food_beef.png",
        allergens: "Süt · Gluten",
        calories: "590 kcal",
        winePairing: "Merlot Vintage 2019",
        chefNote: "Kendi yağında 8 saat ağır ağır pişen ördek budu, lokum kıvamındadır.",
        isGlutenFree: false,
        isVegetarian: false,
      },
      {
        id: "a5",
        name: "Ahtapot Izgara",
        badge: null,
        desc: "Akdeniz usulü marine edilmiş ahtapot, chorizo, siyah bezelye püresi ve limon köpüğü.",
        price: 490,
        img: "/food_ceviche.png",
        allergens: "Kabuklu Deniz Ürünleri",
        calories: "360 kcal",
        winePairing: "Rosé de Datcha 2021",
        chefNote: "Ege ahtapotu, defne yaprağı ve karabiberle haşlandıktan sonra kömür ateşinde tütsülenir.",
        isGlutenFree: true,
        isVegetarian: false,
      },
      {
        id: "a6",
        name: "Vejetaryen Risotto",
        badge: "VEGETARİAN",
        desc: "Siyah trüf, parmesan, mantar consommé ve beyaz şarap ile hazırlanan kremsi risotto.",
        price: 380,
        img: "/food_hero_2.png",
        allergens: "Süt · Gluten",
        calories: "430 kcal",
        winePairing: "Pinot Grigio 2021",
        chefNote: "Arborio pirinci, 24 saat demlenmiş dağ mantarları suyuyla demlenerek pişirilir.",
        isGlutenFree: false,
        isVegetarian: true,
      },
    ],
  },

  tatlilar: {
    label: "TATLILAR",
    title: "Tatlılar",
    desc: "Sofistike bitiş dokunuşları; her lokmada mükemmeliyeti arayanlar için.",
    img: "/food_dessert.png",
    featured: "Karanlık Senfoni",
    accent: "#8b4513",
    items: [
      {
        id: "t1",
        name: "Karanlık Senfoni",
        badge: "ŞEFİN SEÇİMİ",
        desc: "Sıcak çikolata sosu, taze ahududu kompostosu, altın varak ve fıstık praline.",
        price: 220,
        img: "/food_dessert.png",
        allergens: "Süt · Yumurta · Gluten · Fındık",
        calories: "480 kcal",
        winePairing: "Porto Quinta 10 Years",
        chefNote: "%70 Belçika bitter çikolatasıyla hazırlanan akışkan küre, masada sıcak sosla eritilir.",
        isGlutenFree: false,
        isVegetarian: true,
      },
      {
        id: "t2",
        name: "Crème Brûlée",
        badge: null,
        desc: "Vanilyalı krem, karamelize şeker kabuğu ve taze mevsim meyveleri.",
        price: 180,
        img: "/food_dessert.png",
        allergens: "Süt · Yumurta",
        calories: "320 kcal",
        winePairing: "Moscato d'Asti",
        chefNote: "Madagaskar vanilya çubuğu ile demlenen krema, anında pürmüzle karamelize edilir.",
        isGlutenFree: true,
        isVegetarian: true,
      },
      {
        id: "t3",
        name: "Limon Tart",
        badge: null,
        desc: "Ekşi limon kreması, beze ve taze fesleğen dondurması.",
        price: 195,
        img: "/food_dessert.png",
        allergens: "Süt · Yumurta · Gluten",
        calories: "310 kcal",
        winePairing: "Limoncello Artizan",
        chefNote: "Bodrum limonları ve taze fesleğenden yapılan dondurma ferahlatıcı bir tezat sunar.",
        isGlutenFree: false,
        isVegetarian: true,
      },
      {
        id: "t4",
        name: "Peynir Tabağı",
        badge: null,
        desc: "Seçkin Fransız ve yerli peynirler, bal, cevizli ekmek ve üzüm püresi ile.",
        price: 280,
        img: "/food_hero_2.png",
        allergens: "Süt · Gluten · Ceviz",
        calories: "510 kcal",
        winePairing: "Sherry Oloroso",
        chefNote: "Roquefort, Comté, Divle Obruk ve Kars Gravyeri harmanı sunulmaktadır.",
        isGlutenFree: false,
        isVegetarian: true,
      },
      {
        id: "t5",
        name: "Fıstıklı Baklava Yorumu",
        badge: "YENİ",
        desc: "Şefin modern yorumuyla katmanlı baklava, antep fıstığı dondurması ve gül suyu sosu.",
        price: 210,
        img: "/food_dessert.png",
        allergens: "Fındık · Gluten · Süt",
        calories: "440 kcal",
        winePairing: "Late Harvest Muscat",
        chefNote: "Çıtır çıtır 40 kat yufka arasında boz fıstık ve keçi sütlü özel dondurma.",
        isGlutenFree: false,
        isVegetarian: true,
      },
    ],
  },

  icecekler: {
    label: "İÇECEKLER",
    title: "İçecekler",
    desc: "Özenle seçilmiş şaraplar, kokteyllar ve alkolsüz alternatifler.",
    img: "/food_drinks.png",
    featured: "Şef Kokteyli",
    accent: "#4a6fa5",
    items: [
      {
        id: "d1",
        name: "İmza Kokteyller",
        badge: "ŞEFİN SEÇİMİ",
        desc: "Günlük değişen, sezona özgü taze malzemeler ile mixologistimizin özel karışımları.",
        price: 195,
        img: "/food_drinks.png",
        allergens: "Alkol",
        calories: "180 kcal",
        winePairing: "—",
        chefNote: "Smoked Bourbon, Biberiye İnfüzyonu ve Ev Yapımı İncir Likörü karışımı.",
        isGlutenFree: true,
        isVegetarian: true,
      },
      {
        id: "d2",
        name: "Türkiye Şarapları",
        badge: null,
        desc: "Thrace, Cappadocia ve Aegean bölgelerinin en iyi bağlarından el seçimi şaraplar.",
        price: 280,
        img: "/food_drinks.png",
        allergens: "Alkol · Sülfitler",
        calories: "120 kcal (Kadeh)",
        winePairing: "Sommelier Seçimi",
        chefNote: "Kadehte veya şişe olarak servis edilen ödüllü yerel rekolteler.",
        isGlutenFree: true,
        isVegetarian: true,
      },
      {
        id: "d3",
        name: "Avrupa Şarapları",
        badge: null,
        desc: "Fransa, İtalya ve İspanya'nın prestijli bağ evlerinden grand cru seçkiler.",
        price: 380,
        img: "/food_drinks.png",
        allergens: "Alkol · Sülfitler",
        calories: "125 kcal (Kadeh)",
        winePairing: "Sommelier Seçimi",
        chefNote: "Bordeaux, Chianti Classico ve Rioja mahsen seçkilerimiz.",
        isGlutenFree: true,
        isVegetarian: true,
      },
      {
        id: "d4",
        name: "Alkolsüz Seçkiler",
        badge: "ALKOLSÜZ",
        desc: "Taze sıkılmış meyveler, botanik infüzyonlar, artizan limonatalar ve butik sodalar.",
        price: 95,
        img: "/food_drinks.png",
        allergens: "—",
        calories: "90 kcal",
        winePairing: "—",
        chefNote: "Lavanta infüzyonlu artizan limonata ve taze zencefilli kombucha.",
        isGlutenFree: true,
        isVegetarian: true,
      },
      {
        id: "d5",
        name: "Champagne & Köpüklü",
        badge: null,
        desc: "Dom Pérignon, Billecart-Salmon ve seçkin İtalyan prosecco çeşitleri.",
        price: 650,
        img: "/food_drinks.png",
        allergens: "Alkol · Sülfitler",
        calories: "110 kcal (Kadeh)",
        winePairing: "—",
        chefNote: "Kutlamalarınız için ideal soğuklukta sunulan prestijli köpüklü seçki.",
        isGlutenFree: true,
        isVegetarian: true,
      },
    ],
  },
}

/* 7 Katlı İmza Tadım Menüsü Verisi */
const tastingCourse = [
  { step: "01", course: "Amuse-Bouche", title: "Deniz Havyarlı Kıtır Tart", desc: "Somon havyarı, ekşi krema ve narenciye köpüğü" },
  { step: "02", course: "Soğuk Başlangıç", title: "Deniz Taraklı Carpaccio", desc: "Beluga havyarı, narenciye emülsiyonu ve fındık yağı" },
  { step: "03", course: "Sıcak Başlangıç", title: "Közlenmiş İlik Kemik & Trüf", desc: "Karamelize soğan reçeli ve ızgara ekşi maya ekmek" },
  { step: "04", course: "Ara Sıcak Deniz", title: "Izgara Ahtapot & Chorizo", desc: "Siyah bezelye püresi ve tütsü aromalı limon köpüğü" },
  { step: "05", course: "Ana Yemek", title: "Közlenmiş Dana Fileto", desc: "28 gün dinlendirilmiş dana, taze trüf ve bordelaise sos" },
  { step: "06", course: "Damak Temizleyici", title: "Fesleğen & Limon Granita", desc: "Taze Ege limonları ve organik fesleğen özü" },
  { step: "07", course: "Tatlı Senfoni", title: "Karanlık Senfoni & Gold Leaf", desc: "Sıcak bitter çikolata küresi, ahududu ve altın varak" },
]

/* badge renk varyantı */
const badgeVariant = (badge) => {
  if (!badge) return ""
  if (badge === "VEGETARİAN") return "mn-item-badge--green"
  if (badge === "YENİ") return "mn-item-badge--blue"
  if (badge === "ALKOLSÜZ") return "mn-item-badge--teal"
  return ""
}

export default function MenuPage({ onOpenReservation }) {
  const [supabaseItems, setSupabaseItems] = useState([])
  
  // Supabase'den Eklenen Menü Ürünlerini Çek
  useEffect(() => {
    async function fetchMenu() {
      try {
        const { data, error } = await supabase
          .from("menu_items")
          .select("*")
          .eq("status", "Aktif")
          .order("id", { ascending: false })
        if (!error && data) {
          setSupabaseItems(data)
        }
      } catch (err) {
        console.log("Supabase fetch menu error:", err)
      }
    }
    fetchMenu()
  }, [])

  // Menü verilerini varsayılan menü ve Supabase verileri ile birleştir
  const mergedMenuData = useMemo(() => {
    const normalizeCategory = (cat) => {
      if (!cat) return "anayemekler"
      const c = cat.toString().trim().toLowerCase()
      if (c.includes("başlangıç") || c.includes("baslangic") || c.includes("starter")) return "baslangiclar"
      if (c.includes("ana") || c.includes("main") || c.includes("yemek")) return "anayemekler"
      if (c.includes("tatlı") || c.includes("tatli") || c.includes("dessert")) return "tatlilar"
      if (c.includes("i̇çecek") || c.includes("icecek") || c.includes("drink") || c.includes("meşrubat")) return "icecekler"
      return "anayemekler"
    }

    const categories = {
      baslangiclar: {
        label: "BAŞLANGIÇLAR",
        title: "Başlangıçlar",
        desc: "Ana yemeğe geçmeden önce damak zevkinizi uyandıracak hafif ve zarif lezzetler.",
        img: "/food_ceviche.png",
        featured: "Deniz Taraklı Carpaccio",
        accent: "#c9a96e",
        items: [...menuData.baslangiclar.items],
      },
      anayemekler: {
        label: "ANA YEMEKLER",
        title: "Ana Yemekler",
        desc: "Mevsimin en seçkin malzemeleriyle, şefimizin ustalıkla hazırladığı imza tabaklar.",
        img: "/food_beef.png",
        featured: "Közlenmiş Dana Fileto",
        accent: "#b8860b",
        items: [...menuData.ana_yemekler.items],
      },
      tatlilar: {
        label: "TATLI LEZZETLER",
        title: "Tatlılar",
        desc: "Şefimizin el yapımı çikolataları, mevsim meyveli tartlar ve gurme tatlı senfonisi.",
        img: "/food_dessert.png",
        featured: "Karanlık Senfoni",
        accent: "#a0522d",
        items: [...menuData.tatlilar.items],
      },
      icecekler: {
        label: "İÇECEKLER",
        title: "Mahzen & İçecekler",
        desc: "Özel kavımızdan seçilmiş şaraplar, kokteyller ve alkolsüz artizan ferahlatıcılar.",
        img: "/food_drinks.png",
        featured: "İmza Kokteyller",
        accent: "#4682b4",
        items: [...menuData.icecekler.items],
      },
    }

    if (supabaseItems && supabaseItems.length > 0) {
      supabaseItems.forEach((item) => {
        const catKey = normalizeCategory(item.category)
        const formattedItem = {
          id: item.id,
          name: item.name,
          badge: item.badge || null,
          desc: item.description || item.desc || "Şef reçetesi ile özenle hazırlanmıştır.",
          price: Number(item.price),
          img: item.img || "/food_hero_1.png",
          allergens: item.allergens || "—",
          calories: item.calories || "350 kcal",
          winePairing: item.winePairing || "Şefin Tavsiyesi",
          chefNote: item.chefNote || "Günlük taze malzemeler ile hazırlanır.",
          isGlutenFree: item.isGlutenFree || false,
          isVegetarian: item.isVegetarian || false,
        }

        const existingIdx = categories[catKey].items.findIndex(
          (i) => i.id === item.id || i.name.toLowerCase() === item.name.toLowerCase()
        )

        if (existingIdx >= 0) {
          categories[catKey].items[existingIdx] = formattedItem
        } else {
          categories[catKey].items.unshift(formattedItem)
        }
      })
    }

    return categories
  }, [supabaseItems])

  const tabKeys = Object.keys(mergedMenuData)
  const [active, setActive] = useState(tabKeys[0])
  const [visible, setVisible] = useState(true)

  /* Yeni Profesyonel Durumlar (States) */
  const [menuType, setMenuType] = useState("alacarte")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedItemDetail, setSelectedItemDetail] = useState(null)
  const [tastingSelection, setTastingSelection] = useState([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const menuStartRef = useRef(null)

  const scrollToMenuStart = useCallback(() => {
    requestAnimationFrame(() => {
      menuStartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }, [])

  const switchTab = (k) => {
    const scrollUp = () => setTimeout(scrollToMenuStart, 50)

    if (k === active) {
      scrollUp()
      return
    }

    setVisible(false)
    setTimeout(() => {
      setActive(k)
      setVisible(true)
      scrollUp()
    }, 200)
  }

  useEffect(() => {
    if (!searchQuery.trim()) return
    const timer = setTimeout(scrollToMenuStart, 400)
    return () => clearTimeout(timer)
  }, [searchQuery, scrollToMenuStart])

  const currentActive = (active && mergedMenuData[active]) ? active : (tabKeys[0] || "baslangiclar")
  const cat = mergedMenuData[currentActive] || { items: [], title: "Menü", desc: "", featured: "", img: "/food_hero_1.png", accent: "#c9a96e" }

  /* Filtrelenmiş Yemekler */
  const filteredItems = useMemo(() => {
    const items = cat && cat.items ? cat.items : []
    return items.filter((item) => {
      if (!item || !item.name) return false
      return (
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.desc && item.desc.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    })
  }, [cat, searchQuery])

  /* Seçim Sepeti İşlemleri */
  const toggleTastingItem = (item) => {
    if (tastingSelection.some((x) => x.id === item.id)) {
      setTastingSelection(tastingSelection.filter((x) => x.id !== item.id))
    } else {
      setTastingSelection([...tastingSelection, item])
    }
  }

  const totalPrice = tastingSelection.reduce((acc, curr) => acc + curr.price, 0)

  return (
    <div className="mn-page">
      {/* ── Hero ── */}
      <section className="mn-hero">
        <p className="mn-hero-eyebrow">OSMANLI HAZIR YEMEK</p>
        <h1 className="mn-hero-title">
          Gastronomi<br />Deneyimi
        </h1>
        <p className="mn-hero-desc">
          Mevsimsel malzemeler ve modern tekniklerle hazırlanan imza menümüz. Her
          tabak, lezzet ve estetiğin mükemmel dengesini sunmak için özenle tasarlandı.
        </p>

        {/* Sade Menü Rozeti */}
        <div className="mn-single-badge">
          MENÜ
        </div>

        <div className="mn-hero-line" />
      </section>

      {/* ── Menü Navigasyonu ve İçerik ── */}
      <>
        {/* ── Tabs & Search Bar ── */}
          <div ref={menuStartRef} className="mn-scroll-anchor" aria-hidden="true" />
          <nav className="mn-tabs">
            <div className="mn-tabs-inner">
              <div className="mn-tab-buttons">
                {tabKeys.map((k) => (
                  <button
                    key={k}
                    className={`mn-tab ${active === k ? "mn-tab--active" : ""}`}
                    onClick={() => switchTab(k)}
                    style={active === k ? { "--tab-accent": mergedMenuData[k]?.accent } : {}}
                  >
                    {mergedMenuData[k]?.label}
                  </button>
                ))}
              </div>

              {/* Canlı Arama Çubuğu */}
              <div className="mn-search-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Yemek veya malzeme ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="mn-search-clear" onClick={() => setSearchQuery("")}>
                    ✕
                  </button>
                )}
              </div>
            </div>
          </nav>

          {/* ── Content ── */}
          <section className={`mn-content ${visible ? "mn-content--visible" : "mn-content--hidden"}`}>
            <div className="mn-content-inner">
              {/* Left Column: Category Highlight */}
              <div className="mn-left">
                <h2 className="mn-cat-title">{cat.title}</h2>
                <p className="mn-cat-desc">{cat.desc}</p>

                <div className="mn-featured-card" onClick={() => {
                  const featItem = cat.items.find(x => x.name === cat.featured) || cat.items[0]
                  if (featItem) setSelectedItemDetail(featItem)
                }}>
                  <img src={getImgUrl(cat.items[0]?.img || cat.img)} alt={cat.featured} />
                  <div className="mn-featured-overlay">
                    <span className="mn-featured-badge">ÖNE ÇIKAN TABAK</span>
                    <p className="mn-featured-name">{cat.items[0]?.name || cat.featured}</p>
                    <span className="mn-featured-click-hint">Detayları Gör →</span>
                  </div>
                </div>

                {/* Alerjen notu */}
                <div className="mn-allergen-note">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
                  </svg>
                  <span>Gıda alerjileriniz için lütfen garsonunuza önceden bilgi veriniz.</span>
                </div>
              </div>

              {/* Right Column: Menu Items */}
              <div className="mn-right">
                <div className="mn-section-accent" style={{ "--accent": cat.accent }} />

                {filteredItems.length === 0 ? (
                  <div className="mn-no-results-card">
                    <div className="mn-no-results-icon">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8b6e3e" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a10 10 0 0 1 10 10v2H2v-2a10 10 0 0 1 10-10z"/>
                        <path d="M2 18h20v2H2z"/>
                        <circle cx="12" cy="5" r="1.5" fill="#8b6e3e"/>
                      </svg>
                    </div>
                    <h3 className="mn-no-results-title">Aradığınız Lezzet Bulunamadı</h3>
                    <p className="mn-no-results-desc">
                      Seçtiğiniz filtreye veya arama kriterinize uygun bir lezzet eşleşmedi. Tüm menümüzü tekrar keşfetmek için filtreleri sıfırlayabilirsiniz.
                    </p>
                    <button
                      type="button"
                      className="mn-no-results-btn"
                      onClick={() => {
                        setSearchQuery("")
                        setActiveFilter("all")
                      }}
                    >
                      <span>FİLTRELERİ SIFIRLA</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                      </svg>
                    </button>
                  </div>
                ) : (
                  filteredItems.map((item) => {
                    const isSelected = tastingSelection.some((x) => x.id === item.id)
                    return (
                      <div key={item.id} className="mn-item">
                        {item.img && (
                          <div className="mn-item-img-container" onClick={() => setSelectedItemDetail(item)}>
                            <img src={getImgUrl(item.img)} alt={item.name} className="mn-item-card-img" />
                          </div>
                        )}
                        <div className="mn-item-content">
                          <div className="mn-item-header">
                            <div className="mn-item-name-wrap">
                              <h3
                                className="mn-item-name mn-item-name--interactive"
                                onClick={() => setSelectedItemDetail(item)}
                              >
                                {item.name}
                              </h3>
                            </div>
                            <div className="mn-item-price-wrap">
                              <span className="mn-item-price">₺{item.price}</span>
                            </div>
                          </div>

                          <p className="mn-item-desc">{item.desc}</p>

                          <div className="mn-item-footer" style={{ justifyContent: "flex-end" }}>
                            <button
                              className="mn-detail-trigger"
                              onClick={() => setSelectedItemDetail(item)}
                            >
                              Detaylar
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}

                {/* Özel Diyet Notu */}
                <div className="mn-diet-note-card">
                  <p className="mn-diet-note-text">
                    <strong>Özel Diyet ve Alerjen Notu:</strong> Vegan, glutensiz veya kişisel diyet gereksinimleriniz için şefimiz tabağınızı arzu ettiğiniz şekilde kişiselleştirebilir.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>

      {/* ════════════════════════════════════════════════
         Yemek Detay Modal Pop-up
      ════════════════════════════════════════════════ */}
      {selectedItemDetail && (
        <div className="mn-modal-overlay" onClick={() => setSelectedItemDetail(null)}>
          <div className="mn-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="mn-modal-close" onClick={() => setSelectedItemDetail(null)}>✕</button>

            {selectedItemDetail.img && (
              <div style={{ width: "100%", maxHeight: "320px", borderRadius: "8px", overflow: "hidden", marginBottom: "1.2rem", border: "1px solid #e8dec8", background: "#0a0806", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img
                  src={getImgUrl(selectedItemDetail.img)}
                  alt={selectedItemDetail.name}
                  style={{ width: "100%", maxHeight: "320px", objectFit: "contain", display: "block" }}
                />
              </div>
            )}

            <div className="mn-modal-header">
              <h3 className="mn-modal-title" style={{ wordBreak: "break-word" }}>{selectedItemDetail.name}</h3>
              <span className="mn-modal-price">₺{selectedItemDetail.price}</span>
            </div>

            <p className="mn-modal-desc" style={{ fontSize: "0.95rem", lineHeight: "1.7", color: "#5c5247", marginBottom: "0.5rem" }}>
              {selectedItemDetail.desc}
            </p>
          </div>
        </div>
      )}

      {/* ── Seasonal Banner ── */}
      <section className="mn-seasonal">
        <div className="mn-seasonal-inner">
          <div className="mn-seasonal-line" />
          <div className="mn-seasonal-text">
            <p className="mn-seasonal-eyebrow">MEVSİMSEL MENÜ</p>
            <h2 className="mn-seasonal-title">Sonbahar &amp; Kış Seçkileri</h2>
            <p className="mn-seasonal-desc">
              Her mevsim değişen özel tadım menüsü için rezervasyon yapın.
              7 kat menü, şarap eşleştirme seçeneğiyle sunulmaktadır.
            </p>
            <button type="button" onClick={onOpenReservation} className="mn-seasonal-btn">
              Rezervasyon Yap
            </button>
          </div>
          <div className="mn-seasonal-line" />
        </div>
      </section>

      {/* ── Shared Footer ── */}
      <Footer />
    </div>
  )
}
