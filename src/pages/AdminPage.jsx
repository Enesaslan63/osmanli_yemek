import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/AdminPage.css"
import { supabase } from "../lib/supabaseClient"

/* ── Initial Mock Data ─────────────────────── */
const initialMenuItems = [
  {
    id: 1,
    name: "Truffle Arancini",
    category: "Başlangıçlar",
    price: 420,
    status: "Aktif",
    img: "/food_hero_1.png",
  },
  {
    id: 2,
    name: "Wagyu A5 Striploin",
    category: "Ana Yemekler",
    price: 2450,
    status: "Aktif",
    img: "/food_beef.png",
  },
  {
    id: 3,
    name: "Noir Chocolate Sphere",
    category: "Tatlılar",
    price: 380,
    status: "Pasif",
    img: "/food_dessert.png",
  },
  {
    id: 4,
    name: "Saray Usulü Hünkar Beğendi",
    category: "Ana Yemekler",
    price: 680,
    status: "Aktif",
    img: "/food_ceviche.png",
  },
  {
    id: 5,
    name: "Osmanlı İmbik Şerbeti",
    category: "İçecekler",
    price: 180,
    status: "Aktif",
    img: "/food_drinks.png",
  },
]



const initialGalleryItems = [
  { id: 1, title: "İÇ MEKAN", category: "İç Mekan", img: "/restaurant_interior.png" },
  { id: 2, title: "ŞEFİN SEÇİMİ", category: "Tabaklar", img: "/food_ceviche.png" },
  { id: 3, title: "MUTFAK", category: "Mutfak", img: "/press_restaurant.png" },
  { id: 4, title: "EL PANNO", category: "Ambiyans", img: "/food_hero_1.png" },
  { id: 5, title: "ŞEF İMZASI", category: "Tabaklar", img: "/food_dessert.png" },
  { id: 6, title: "ANA TABAK", category: "Tabaklar", img: "/food_beef.png" },
  { id: 7, title: "BAŞLANGIÇ", category: "Tabaklar", img: "/food_hero_2.png" },
  { id: 8, title: "BAR & KOKTEYL", category: "İç Mekan", img: "/food_drinks.png" },
]

const initialReviews = [
  { id: 1, author: "Aylin E.", role: "Gurme Yazar", rating: 5, comment: "Mükemmel kelimesi burayı tanımlamak için yetersiz kalır. Şefin imza tadım menüsü harikaydı.", status: "Onaylandı" },
  { id: 2, author: "Caner K.", role: "İş İnsanı", rating: 5, comment: "Şarap eşleştirmeleri olağanüstüydü. Sommelier'in bilgi birikimi geceyi üst seviyeye taşıdı.", status: "Onaylandı" },
  { id: 3, author: "Mert & Seda", role: "Misafir", rating: 5, comment: "Evlilik yıldönümümüz için tercih ettik. Bize ayrılan özel köşe ve sürpriz tatlı harikaydı.", status: "Onaylandı" },
  { id: 4, author: "Zeynep B.", role: "Tasarımcı", rating: 5, comment: "Karanlık ve sofistike atmosferi, modern mutfak teknikleriyle birleştiğinde ortaya harika sonuç çıkmış.", status: "Onaylandı" },
]

export default function AdminPage() {
  const navigate = useNavigate()

  // Auth state - Oturum Çıkış Yap denene kadar saklanır (localStorage & sessionStorage)
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("admin_session") === "true" || sessionStorage.getItem("admin_session") === "true"
  )
  const [passwordInput, setPasswordInput] = useState("")
  const [authError, setAuthError] = useState("")

  // Active section
  const [activeTab, setActiveTab] = useState("overview")
  const [activeCategory, setActiveCategory] = useState("Hepsi")

  // Data states
  const [menuItems, setMenuItems] = useState(initialMenuItems)
  const [reservations, setReservations] = useState([])
  const [galleryItems, setGalleryItems] = useState(initialGalleryItems)
  const [reviews, setReviews] = useState(initialReviews)
  const [contactMessages, setContactMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("admin_contact_messages")
      const parsed = saved ? JSON.parse(saved) : []
      return Array.isArray(parsed) ? parsed : []
    } catch (e) {
      return []
    }
  })
  const [replyingMessage, setReplyingMessage] = useState(null)
  const [replyText, setReplyText] = useState("")
  const [replyPhone, setReplyPhone] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [adminPassword, setAdminPassword] = useState(
    () => localStorage.getItem("admin_password") || "1234"
  )

  // Modals
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)
  const [isAddGalleryOpen, setIsAddGalleryOpen] = useState(false)
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    name: "",
    category: "Ana Yemekler",
    price: "",
    description: "",
    status: "Aktif",
    img: "/food_hero_1.png",
  })
  const [editMenuItem, setEditMenuItem] = useState(null)
  const [newGalleryItem, setNewGalleryItem] = useState({
    title: "",
    category: "İç Mekan",
    img: "/restaurant_interior.png",
  })
  const [newReviewItem, setNewReviewItem] = useState({
    author: "",
    role: "Misafir",
    rating: 5,
    comment: "",
    status: "Onaylandı",
  })
  const [notification, setNotification] = useState("")

  const showNotify = (msg) => {
    setNotification(msg)
    setTimeout(() => setNotification(""), 3000)
  }

  // Supabase'den Menü Verilerini Çek ve localStorage İle Senkronize Et
  const fetchSupabaseMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("id", { ascending: false })
      if (!error && Array.isArray(data) && data.length > 0) {
        setMenuItems(data)
        localStorage.setItem("admin_menu_items", JSON.stringify(data))
      } else {
        const saved = localStorage.getItem("admin_menu_items")
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            if (Array.isArray(parsed) && parsed.length > 0) setMenuItems(parsed)
          } catch (e) {}
        }
      }
    } catch (err) {
      console.log("Fetch menu items error:", err)
      const saved = localStorage.getItem("admin_menu_items")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) setMenuItems(parsed)
        } catch (e) {}
      }
    }
  }

  // Supabase'den Canlı Rezervasyonları Çek
  const fetchSupabaseReservations = async () => {
    try {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .order("id", { ascending: false })
      if (!error && Array.isArray(data)) {
        setReservations(data)
      } else {
        setReservations([])
      }
    } catch (err) {
      console.log("Fetch reservations error:", err)
      setReservations([])
    }
  }

  // Supabase'den Galeri Görsellerini Çek
  const fetchSupabaseGalleryItems = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .order("id", { ascending: false })
      if (!error && Array.isArray(data) && data.length > 0) {
        setGalleryItems(data)
        localStorage.setItem("admin_gallery_items", JSON.stringify(data))
      } else {
        const saved = localStorage.getItem("admin_gallery_items")
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            if (Array.isArray(parsed) && parsed.length > 0) setGalleryItems(parsed)
          } catch (e) {}
        }
      }
    } catch (err) {
      console.log("Fetch gallery items error:", err)
      const saved = localStorage.getItem("admin_gallery_items")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) setGalleryItems(parsed)
        } catch (e) {}
      }
    }
  }

  // Supabase'den Yorumları Çek
  const fetchSupabaseReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("id", { ascending: false })
      if (!error && Array.isArray(data) && data.length > 0) {
        const mapped = data.map((r) => ({
          id: r.id,
          author: r.author || r.name || "Misafir",
          role: r.role || r.title || "Misafir",
          rating: r.rating || 5,
          comment: r.comment || r.review || "",
          status: r.status || "Onaylandı",
          created_at: r.created_at,
        }))
        setReviews(mapped)
      }
    } catch (err) {
      console.log("Fetch reviews error:", err)
    }
  }

  // Supabase'den Gelen İletişim Mesajlarını Çek
  const fetchSupabaseContactMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")

      if (!error && Array.isArray(data)) {
        const sorted = data.sort((a, b) => new Date(b.created_at || b.id || 0) - new Date(a.created_at || a.id || 0))
        setContactMessages(sorted)
        localStorage.setItem("admin_contact_messages", JSON.stringify(sorted))
      } else {
        const saved = localStorage.getItem("admin_contact_messages")
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            if (Array.isArray(parsed)) setContactMessages(parsed)
          } catch (e) {}
        }
      }
    } catch (err) {
      console.error("Fetch contact messages error:", err)
      const saved = localStorage.getItem("admin_contact_messages")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed)) setContactMessages(parsed)
        } catch (e) {}
      }
    }
  }

  // Supabase'den Admin Şifresini Çek
  const fetchSupabaseAdminSettings = async () => {
    try {
      const { data, error } = await supabase.from("site_settings").select("*").eq("key", "admin_password").maybeSingle()
      if (!error && data && data.value) {
        setAdminPassword(data.value)
        localStorage.setItem("admin_password", data.value)
      }
    } catch (err) {
      console.log("Fetch admin password setting error:", err)
    }
  }

  useEffect(() => {
    fetchSupabaseMenuItems()
    fetchSupabaseReservations()
    fetchSupabaseGalleryItems()
    fetchSupabaseReviews()
    fetchSupabaseContactMessages()
    fetchSupabaseAdminSettings()

    // 3 Saniyede Bir Otomatik Canlı Senkronizasyon (Farklı Tarayıcılar Arası Otomatik Yenileme)
    const interval = setInterval(() => {
      fetchSupabaseContactMessages()
      fetchSupabaseReservations()
    }, 3000)

    // Sekmeler Arası Canlı Veri Senkronizasyonu (Multi-Tab Live Sync)
    const handleStorageChange = (e) => {
      if (e.key === "admin_contact_messages" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          if (Array.isArray(parsed)) setContactMessages(parsed)
        } catch (err) {}
      }
      if (e.key === "admin_menu_items" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          if (Array.isArray(parsed)) setMenuItems(parsed)
        } catch (err) {}
      }
      if (e.key === "admin_reservations" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          if (Array.isArray(parsed)) setReservations(parsed)
        } catch (err) {}
      }
      if (e.key === "admin_gallery_items" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          if (Array.isArray(parsed)) setGalleryItems(parsed)
        } catch (err) {}
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      clearInterval(interval)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  useEffect(() => {
    if (!isLoggedIn) return

    const handlePopState = () => {
      const isStillLoggedIn =
        localStorage.getItem("admin_session") === "true" ||
        sessionStorage.getItem("admin_session") === "true"

      if (isStillLoggedIn) {
        showNotify("Admin panelinden çıkmak için lütfen 'Çıkış Yap' butonunu kullanın.")
      }
    }

    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [isLoggedIn])

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault()
    if (passwordInput === adminPassword) {
      setIsLoggedIn(true)
      localStorage.setItem("admin_session", "true")
      sessionStorage.setItem("admin_session", "true")
      setAuthError("")
      setPasswordInput("")
    } else {
      setAuthError("Hatalı şifre!")
    }
  }

  // Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem("admin_session")
    sessionStorage.removeItem("admin_session")
    navigate("/")
  }

  // Menu Actions
  const handleToggleStatus = async (id) => {
    const targetItem = menuItems.find((i) => i.id === id)
    if (!targetItem) return
    const newStatus = targetItem.status === "Aktif" ? "Pasif" : "Aktif"

    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    )

    try {
      await supabase.from("menu_items").update({ status: newStatus }).eq("id", id)
    } catch (err) {
      console.log("Update status error:", err)
    }
    showNotify("Menü öğesi durumu güncellendi.")
  }

  const handleDeleteItem = async (id) => {
    if (window.confirm("Bu menü öğesini silmek istediğinizden emin misiniz?")) {
      setMenuItems((prev) => {
        const updated = prev.filter((item) => item.id !== id)
        localStorage.setItem("admin_menu_items", JSON.stringify(updated))
        return updated
      })
      try {
        await supabase.from("menu_items").delete().eq("id", id)
      } catch (err) {
        console.log("Delete menu item error:", err)
      }
      showNotify("Menü öğesi silindi.")
    }
  }

  const handleAddItemSubmit = async (e) => {
    e.preventDefault()
    if (!newItem.name || !newItem.price) return

    const itemToAdd = {
      id: Date.now(),
      name: newItem.name,
      category: newItem.category,
      price: Number(newItem.price),
      description: newItem.description || "Özel şef tarifi ile hazırlanan gurme lezzet.",
      status: newItem.status,
      img: newItem.img || "/food_hero_1.png",
      created_at: new Date().toISOString(),
    }

    setMenuItems((prev) => {
      const updated = [itemToAdd, ...prev]
      localStorage.setItem("admin_menu_items", JSON.stringify(updated))
      return updated
    })

    try {
      const { data, error } = await supabase
        .from("menu_items")
        .insert([{
          name: itemToAdd.name,
          category: itemToAdd.category,
          price: itemToAdd.price,
          description: itemToAdd.description,
          status: itemToAdd.status,
          img: itemToAdd.img,
          created_at: itemToAdd.created_at
        }])
        .select()
      
      if (!error && data && data[0]) {
        setMenuItems((prev) => {
          const updated = prev.map((i) => (i.id === itemToAdd.id ? data[0] : i))
          localStorage.setItem("admin_menu_items", JSON.stringify(updated))
          return updated
        })
      }
    } catch (err) {
      console.log("Supabase insert error:", err)
    }

    setIsAddMenuOpen(false)
    setNewItem({ name: "", category: "Ana Yemekler", price: "", description: "", status: "Aktif", img: "/food_hero_1.png" })
    showNotify("Yeni menü öğesi eklendi!")
  }

  const handleOpenEditItem = (item) => {
    setEditMenuItem({ ...item })
  }

  const handleUpdateItemSubmit = async (e) => {
    e.preventDefault()
    if (!editMenuItem || !editMenuItem.name || !editMenuItem.price) return

    const updatedFields = {
      name: editMenuItem.name,
      category: editMenuItem.category,
      price: Number(editMenuItem.price),
      description: editMenuItem.description || "",
      status: editMenuItem.status,
      img: editMenuItem.img || "/food_hero_1.png",
    }

    setMenuItems((prev) => {
      const updated = prev.map((item) => (item.id === editMenuItem.id ? { ...item, ...updatedFields } : item))
      localStorage.setItem("admin_menu_items", JSON.stringify(updated))
      return updated
    })

    try {
      const { error } = await supabase
        .from("menu_items")
        .update(updatedFields)
        .eq("id", editMenuItem.id)
      if (error) console.log("Supabase update error:", error)
    } catch (err) {
      console.log("Update item catch error:", err)
    }

    setEditMenuItem(null)
    showNotify("Ürün başarıyla güncellendi!")
  }

  // Reservation Actions
  const handleApproveReservation = async (r) => {
    // Mobil tarayıcı engelleyicilerine takılmamak için WhatsApp penceresini eşzamanlı olarak hemen aç
    sendWhatsAppNotification(r)

    setReservations((prev) =>
      prev.map((item) => (item.id === r.id ? { ...item, status: "Onaylandı" } : item))
    )
    try {
      await supabase.from("reservations").update({ status: "Onaylandı" }).eq("id", r.id)
    } catch (err) {
      console.log("Approve reservation error:", err)
    }
    showNotify("Rezervasyon onaylandı ve WhatsApp bildirimi açıldı!")
  }

  const handleDeleteReservation = async (id) => {
    if (window.confirm("Bu rezervasyon kaydını silmek istediğinizden emin misiniz?")) {
      setReservations((prev) => prev.filter((r) => r.id !== id))
      try {
        await supabase.from("reservations").delete().eq("id", id)
      } catch (err) {
        console.log("Delete reservation error:", err)
      }
      showNotify("Rezervasyon silindi.")
    }
  }

  // Gallery Actions
  const handleAddGalleryItemSubmit = async (e) => {
    e.preventDefault()
    if (!newGalleryItem.title) return

    const itemToAdd = {
      id: Date.now(),
      title: newGalleryItem.title,
      category: newGalleryItem.category,
      img: newGalleryItem.img || "/restaurant_interior.png",
      created_at: new Date().toISOString(),
    }

    setGalleryItems((prev) => {
      const updated = [itemToAdd, ...prev]
      localStorage.setItem("admin_gallery_items", JSON.stringify(updated))
      return updated
    })

    try {
      await supabase.from("gallery_items").insert([{
        title: itemToAdd.title,
        category: itemToAdd.category,
        img: itemToAdd.img,
        created_at: itemToAdd.created_at
      }])
    } catch (err) {
      console.log("Supabase insert gallery error:", err)
    }

    setIsAddGalleryOpen(false)
    setNewGalleryItem({ title: "", category: "İç Mekan", img: "/restaurant_interior.png" })
    showNotify("Yeni fotoğraf galeriye eklendi!")
  }

  // Quick Upload Handler for Overview Tab
  const handleQuickUploadGallery = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = async () => {
      const itemToAdd = {
        id: Date.now(),
        title: file.name.replace(/\.[^/.]+$/, "") || "Yeni Fotoğraf",
        category: "İç Mekan",
        img: reader.result,
        created_at: new Date().toISOString(),
      }

      setGalleryItems((prev) => {
        const updated = [itemToAdd, ...prev]
        localStorage.setItem("admin_gallery_items", JSON.stringify(updated))
        return updated
      })

      try {
        await supabase.from("gallery_items").insert([{
          title: itemToAdd.title,
          category: itemToAdd.category,
          img: itemToAdd.img,
          created_at: itemToAdd.created_at
        }])
      } catch (err) {
        console.log("Quick upload gallery error:", err)
      }

      showNotify("Yeni görsel başarıyla yüklendi!")
    }
    reader.readAsDataURL(file)
  }

  const handleDeleteGalleryItem = async (id) => {
    if (window.confirm("Bu galeri fotoğrafını silmek istediğinizden emin misiniz?")) {
      setGalleryItems((prev) => prev.filter((item) => item.id !== id))
      try {
        await supabase.from("gallery_items").delete().eq("id", id)
      } catch (err) {
        console.log("Delete gallery item error:", err)
      }
      showNotify("Galeri fotoğrafı silindi.")
    }
  }

  // Review Actions
  const handleAddReviewSubmit = async (e) => {
    e.preventDefault()
    if (!newReviewItem.author || !newReviewItem.comment) return

    const reviewToAdd = {
      author: newReviewItem.author,
      name: newReviewItem.author,
      role: newReviewItem.role || "Misafir",
      title: newReviewItem.role || "Misafir",
      comment: newReviewItem.comment,
      review: newReviewItem.comment,
      rating: Number(newReviewItem.rating) || 5,
      status: newReviewItem.status || "Onaylandı",
      created_at: new Date().toISOString(),
    }

    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert([reviewToAdd])
        .select()

      if (!error && data) {
        setReviews((prev) => [data[0], ...prev])
      } else {
        setReviews((prev) => [{ ...reviewToAdd, id: Date.now() }, ...prev])
      }
    } catch (err) {
      setReviews((prev) => [{ ...reviewToAdd, id: Date.now() }, ...prev])
    }

    setIsAddReviewOpen(false)
    setNewReviewItem({ author: "", role: "Misafir", rating: 5, comment: "", status: "Onaylandı" })
    showNotify("Yeni değerlendirme yorumu eklendi!")
  }

  const handleDeleteReview = async (id) => {
    if (window.confirm("Bu misafir yorumunu silmek istediğinizden emin misiniz?")) {
      setReviews((prev) => prev.filter((r) => r.id !== id))
      try {
        await supabase.from("reviews").delete().eq("id", id)
      } catch (err) {
        console.log("Delete review error:", err)
      }
      showNotify("Misafir yorumu silindi.")
    }
  }

  // Contact Message Actions
  const handleDeleteMessage = async (id) => {
    if (window.confirm("Bu mesajı silmek istediğinizden emin misiniz?")) {
      setContactMessages((prev) => {
        const updated = prev.filter((m) => m.id !== id)
        localStorage.setItem("admin_contact_messages", JSON.stringify(updated))
        return updated
      })
      if (supabase) {
        try {
          await supabase.from("contact_messages").delete().eq("id", id)
        } catch (err) {
          console.log("Delete message error:", err)
        }
      }
      showNotify("Mesaj silindi.")
    }
  }

  const handleSendReply = async (method) => {
    if (!replyingMessage) return

    const updatedFields = {
      status: "Yanıtlandı",
      reply: replyText || "Mesajınız alındı ve ekibimiz tarafından yanıtlandı.",
      replied_at: new Date().toISOString(),
    }

    // Mobil tarayıcı engellemelerini aşmak için yönlendirmeyi tıklama anında eşzamanlı başlatın
    if (method === "whatsapp") {
      const targetPhone = replyPhone || replyingMessage.phone
      if (!targetPhone) {
        showNotify("Lütfen WhatsApp mesajı gönderebilmek için bir telefon numarası girin!")
        return
      }

      let cleanPhone = String(targetPhone).replace(/\D/g, "")
      if (cleanPhone.startsWith("0")) {
        cleanPhone = "90" + cleanPhone.substring(1)
      } else if (!cleanPhone.startsWith("90")) {
        cleanPhone = "90" + cleanPhone
      }

      const msgText = replyText || "Mesajınız alındı ve ekibimiz tarafından yanıtlandı."
      const msg = `Sayın ${replyingMessage.name},\n\n${msgText}\n\nSaygılarımızla,\nOsmanlı Hazır Yemek Ekibi\nİletişim: 0545 785 55 57`
      
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank")
      showNotify("Mesaj yanıtlandı ve WhatsApp yönlendirmesi yapıldı!")
    } else if (method === "email" && replyingMessage.email) {
      const subject = encodeURIComponent(`Re: ${replyingMessage.subject || "Osmanlı Hazır Yemek İletişim"}`)
      const body = encodeURIComponent(`Sayın ${replyingMessage.name},\n\n${replyText}\n\nSaygılarımızla,\nOsmanlı Hazır Yemek Ekibi\nİletişim: 0545 785 55 57`)
      window.location.href = `mailto:${replyingMessage.email}?subject=${subject}&body=${body}`
      showNotify("Mesaj yanıtlandı ve e-posta istemcisi açıldı!")
    } else {
      showNotify("Mesaj yanıtınız başarıyla kaydedildi!")
    }

    setContactMessages((prev) => {
      const updated = prev.map((m) => (m.id === replyingMessage.id ? { ...m, ...updatedFields } : m))
      localStorage.setItem("admin_contact_messages", JSON.stringify(updated))
      return updated
    })

    try {
      await supabase.from("contact_messages").update(updatedFields).eq("id", replyingMessage.id)
    } catch (err) {
      console.log("Update message reply error:", err)
    }

    setReplyingMessage(null)
    setReplyText("")
    setReplyPhone("")
  }

  const handleToggleReviewStatus = async (id) => {
    const target = reviews.find((r) => r.id === id)
    if (!target) return
    const newStatus = target.status === "Onaylandı" ? "Bekliyor" : "Onaylandı"

    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    )

    try {
      await supabase.from("reviews").update({ status: newStatus }).eq("id", id)
    } catch (err) {
      console.log("Update review status error:", err)
    }
    showNotify("Yorum yayın durumu güncellendi.")
  }

  // Password Change (Supabase + LocalStorage Senkronize)
  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (!passwordInput) return
    const newPass = passwordInput
    setAdminPassword(newPass)
    localStorage.setItem("admin_password", newPass)

    try {
      await supabase.from("site_settings").upsert({ key: "admin_password", value: newPass }, { onConflict: "key" })
    } catch (err) {
      console.log("Supabase save admin password error:", err)
    }

    setPasswordInput("")
    showNotify("Admin şifresi başarıyla güncellendi!")
  }

  // WhatsApp Onay Mesajı Gönderme
  const sendWhatsAppNotification = (r) => {
    let cleanPhone = String(r.phone).replace(/\D/g, "")
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "90" + cleanPhone.substring(1)
    } else if (!cleanPhone.startsWith("90")) {
      cleanPhone = "90" + cleanPhone
    }

    const formattedDate = formatTurkishDate(r.date)
    const msg = `Sayın ${r.name}, Osmanlı Hazır Yemek'ten harika haber! ${formattedDate} tarihi, ${r.time} saati için ${r.guests} kişilik masa rezervasyonunuz onaylanmıştır. Sizi ağırlamaktan mutluluk duyacağız. İletişim: 0545 785 55 57`

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
    window.open(url, "_blank")
  }

  // Tarihi Gün.Ay.Yıl Formatına Çevirme (Örn: 2026-08-28 -> 28.08.2026)
  const formatTurkishDate = (dateStr) => {
    if (!dateStr) return ""
    if (dateStr.includes("-")) {
      const parts = dateStr.split("-")
      if (parts.length === 3 && parts[0].length === 4) {
        const [year, month, day] = parts
        return `${day}.${month}.${year}`
      }
    }
    return dateStr
  }

  // Kanonik Kategori Normalleştirme (Türkçe Karakter ve Format Farklarından Bağımsız)
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

  // Filtered menu - Kesin Kategori Filtrelemesi
  const filteredMenu = menuItems.filter((x) => {
    if (!x) return false

    const itemCat = normalizeCategory(x.category)
    const selCat = normalizeCategory(activeCategory)

    // Tam kategori eşleşmesi (Hepsi değilse birebir kanonik kod eşit olmalı)
    const matchesCat = selCat === "hepsi" || selCat === "" || itemCat === selCat

    const query = normalizeStr(searchQuery)
    const matchesSearch =
      !query ||
      normalizeStr(x.name).includes(query) ||
      normalizeStr(x.description).includes(query)

    return matchesCat && matchesSearch
  })

  // ── Password Protected Login Modal ─────────────────────
  if (!isLoggedIn) {
    return (
      <div className="ad-login-overlay">
        <div className="ad-login-card">
          <div className="ad-login-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.8">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <p className="ad-login-subtitle">OSMANLI HAZIR YEMEK</p>
          <h1 className="ad-login-title">Yönetici Girişi</h1>
          <p className="ad-login-desc">
            Yönetim paneline erişmek için lütfen admin şifrenizi giriniz.
          </p>

          <form onSubmit={handleLogin} className="ad-login-form">
            <div className="ad-input-group">
              <label>ŞİFRE</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="******"
                autoFocus
              />
            </div>
            {authError && <p className="ad-login-error">{authError}</p>}
            <button type="submit" className="ad-login-btn">
              GİRİŞ YAP
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── Admin Dashboard UI ─────────────────────────────────
  return (
    <div className="ad-page">
      {/* Toast Notification */}
      {notification && <div className="ad-toast">{notification}</div>}

      <div className="ad-container">
        {/* Left Sidebar: Yönetim */}
        <aside className="ad-sidebar">
          <div className="ad-sidebar-header">
            <h2 className="ad-sidebar-title">Yönetim</h2>
          </div>
          <nav className="ad-nav">
            <button
              className={`ad-nav-btn ${activeTab === "overview" ? "ad-nav-btn--active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <span className="ad-nav-icon">📊</span>
              <span>Genel Bakış</span>
            </button>
            <button
              className={`ad-nav-btn ${activeTab === "menu" ? "ad-nav-btn--active" : ""}`}
              onClick={() => setActiveTab("menu")}
            >
              <span className="ad-nav-icon">🍽️</span>
              <span>Menü Yönetimi</span>
            </button>
            <button
              className={`ad-nav-btn ${activeTab === "reservations" ? "ad-nav-btn--active" : ""}`}
              onClick={() => setActiveTab("reservations")}
            >
              <span className="ad-nav-icon">📅</span>
              <span>Rezervasyonlar</span>
              <span className="ad-badge">{reservations.filter(r => r.status === "Bekliyor").length}</span>
            </button>
            <button
              className={`ad-nav-btn ${activeTab === "gallery" ? "ad-nav-btn--active" : ""}`}
              onClick={() => setActiveTab("gallery")}
            >
              <span className="ad-nav-icon">🖼️</span>
              <span>Galeri &amp; Medya</span>
            </button>
            <button
              className={`ad-nav-btn ${activeTab === "reviews" ? "ad-nav-btn--active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              <span className="ad-nav-icon">⭐</span>
              <span>Yorumlar</span>
            </button>
            <button
              className={`ad-nav-btn ${activeTab === "messages" ? "ad-nav-btn--active" : ""}`}
              onClick={() => setActiveTab("messages")}
            >
              <span className="ad-nav-icon">✉️</span>
              <span>Gelen Mesajlar</span>
              {contactMessages.filter(m => m.status !== "Yanıtlandı").length > 0 && (
                <span className="ad-badge" style={{ background: "#e65100" }}>
                  {contactMessages.filter(m => m.status !== "Yanıtlandı").length}
                </span>
              )}
            </button>
            <button
              className={`ad-nav-btn ${activeTab === "settings" ? "ad-nav-btn--active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <span className="ad-nav-icon">⚙️</span>
              <span>Ayarlar</span>
            </button>
          </nav>

          <div className="ad-sidebar-footer">
            <button className="ad-logout-btn" onClick={handleLogout}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Çıkış Yap</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="ad-main">
          {/* TAB 1: GENEL BAKIŞ (OVERVIEW) */}
          {activeTab === "overview" && (
            <div className="ad-content-block">
              <h1 className="ad-page-title">Genel Bakış</h1>

              {/* Stat Cards Row */}
              <div className="ad-stats-grid">
                <div className="ad-stat-card ad-stat-card--dark">
                  <div className="ad-stat-text">
                    <span className="ad-stat-label">TOPLAM MENÜ ÖĞESİ</span>
                    <span className="ad-stat-val">{menuItems.length}</span>
                  </div>
                  <div className="ad-stat-icon">🍽️</div>
                </div>

                <div className="ad-stat-card">
                  <div className="ad-stat-text">
                    <span className="ad-stat-label">BEKLEYEN REZERVASYONLAR</span>
                    <span className="ad-stat-val ad-stat-val--red">
                      {reservations.filter((r) => r.status === "Bekliyor").length}
                    </span>
                  </div>
                  <div className="ad-stat-icon">📅</div>
                </div>

                <div className="ad-stat-card">
                  <div className="ad-stat-text">
                    <span className="ad-stat-label">YORUM SAYISI</span>
                    <span className="ad-stat-val">{reviews.length}</span>
                  </div>
                  <div className="ad-stat-badge">⭐ {reviews.length > 0 ? (reviews.reduce((s, r) => s + (Number(r.rating || r.stars) || 5), 0) / reviews.length).toFixed(1) : "5.0"}</div>
                </div>
              </div>

              {/* Bekleyen Rezervasyonlar Özet Kartı */}
              <div className="ad-card-section" style={{ marginTop: "1.5rem" }}>
                <div className="ad-card-header">
                  <div>
                    <h2 className="ad-card-title">Son Rezervasyon Talepleri</h2>
                    <p className="ad-card-subtitle">En son gelen masa rezervasyon talepleri.</p>
                  </div>
                  <button className="ad-btn-add" onClick={() => setActiveTab("reservations")}>
                    TÜMÜNÜ GÖR →
                  </button>
                </div>

                <div className="ad-table-wrap">
                  <table className="ad-table ad-table--stack">
                    <thead>
                      <tr>
                        <th>MİSAFİR ADI</th>
                        <th>TARİH / SAAT</th>
                        <th>KİŞİ</th>
                        <th>TELEFON</th>
                        <th>DURUM</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.slice(0, 3).map((r) => (
                        <tr key={r.id}>
                          <td data-label="Misafir"><strong>{r.name}</strong></td>
                          <td data-label="Tarih / Saat">{formatTurkishDate(r.date)} - {r.time}</td>
                          <td data-label="Kişi">{r.guests} Kişi</td>
                          <td data-label="Telefon">{r.phone}</td>
                          <td data-label="Durum">
                            <span
                              className={`ad-status-pill ${
                                r.status === "Onaylandı"
                                  ? "ad-status-pill--active"
                                  : "ad-status-pill--passive"
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Medya & Referanslar Card Section */}
              <div className="ad-card-section" style={{ marginTop: "2.5rem" }}>
                <div className="ad-card-header" style={{ marginBottom: "1.5rem" }}>
                  <div>
                    <h2 className="ad-card-title">Medya &amp; Referanslar ({galleryItems.length} Görsel)</h2>
                    <p className="ad-card-subtitle">Galerinizde yayınlanan görseller ve albüm özetiniz.</p>
                  </div>
                  <button className="ad-btn-add" onClick={() => setActiveTab("gallery")}>
                    GALERİYİ YÖNET →
                  </button>
                </div>

                <div className="ad-media-grid">
                  {/* Dynamic Image Previews (4 adet) */}
                  {(galleryItems.length > 0 ? galleryItems.slice(0, 4) : [
                    { id: "def1", img: "/restaurant_interior.png", title: "Restoran" },
                    { id: "def2", img: "/food_drinks.png", title: "İçecekler" },
                    { id: "def3", img: "/food_beef.png", title: "Gurme Tabak" },
                    { id: "def4", img: "/food_dessert.png", title: "Tatlılar" },
                  ]).map((item) => (
                    <div
                      key={item.id}
                      className="ad-media-thumb"
                      onClick={() => setActiveTab("gallery")}
                      style={{ cursor: "pointer" }}
                      title={`${item.title || "Görsel"} - Galeride yönet`}
                    >
                      <img src={item.img} alt={item.title || "Galeri Görseli"} />
                    </div>
                  ))}

                  {/* Dynamic "+X DİĞER" Badge */}
                  <div
                    className="ad-media-thumb ad-media-more"
                    onClick={() => setActiveTab("gallery")}
                    style={{ cursor: "pointer" }}
                    title="Tüm galeriyi görüntüle"
                  >
                    <span>
                      +{Math.max(0, galleryItems.length > 4 ? galleryItems.length - 4 : 0)} DİĞER
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MENÜ YÖNETİMİ (PANEL İÇİNDE) */}
          {activeTab === "menu" && (
            <div className="ad-content-block">
              <h1 className="ad-page-title">Menü Yönetimi ({menuItems.length} Ürün)</h1>

              <div className="ad-card-section">
                <div className="ad-card-header">
                  <div>
                    <h2 className="ad-card-title">Tüm Menü Öğeleri Listesi</h2>
                    <p className="ad-card-desc">Sitenizdeki tüm yemek, içecek ve tatlıları yönetin.</p>
                  </div>
                  <button className="ad-btn-add" onClick={() => setIsAddMenuOpen(true)}>
                    + YENİ ÜRÜN EKLE
                  </button>
                </div>

                {/* Category Pills & Search */}
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
                        type="button"
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
                      placeholder="Ürün adı ara..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Full Menu Table */}
                <div className="ad-table-wrap">
                  <table className="ad-table ad-table--stack">
                    <thead>
                      <tr>
                        <th>GÖRSEL &amp; ÖĞE ADI</th>
                        <th>KATEGORİ</th>
                        <th>FİYAT</th>
                        <th>DURUM</th>
                        <th style={{ textAlign: "right" }}>İŞLEMLER</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMenu.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ textAlign: "center", padding: "2.5rem", color: "#8a7e70" }}>
                            Aranan kriterlere uygun ürün bulunamadı.
                          </td>
                        </tr>
                      ) : (
                        filteredMenu.map((item) => (
                          <tr
                            key={item.id}
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                              if (!e.target.closest("button")) {
                                handleOpenEditItem(item)
                              }
                            }}
                          >
                            <td data-label="Ürün">
                              <div className="ad-item-cell">
                                <img src={item.img} alt={item.name} className="ad-item-thumb" />
                                <div>
                                  <strong className="ad-item-name">{item.name}</strong>
                                  {item.description && (
                                    <p style={{ fontSize: "0.75rem", color: "#6b6055", margin: "2px 0 0 0" }}>{item.description}</p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td data-label="Kategori" className="ad-item-cat">{item.category}</td>
                            <td data-label="Fiyat" className="ad-item-price">{item.price} ₺</td>
                            <td data-label="Durum">
                              <button
                                className={`ad-status-pill ${
                                  item.status === "Aktif"
                                    ? "ad-status-pill--active"
                                    : "ad-status-pill--passive"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleToggleStatus(item.id)
                                }}
                              >
                                ● {item.status}
                              </button>
                            </td>
                            <td className="ad-table-actions" data-label="İşlemler">
                              <div className="ad-action-btns ad-action-btns--wrap">
                                <button
                                  className="ad-btn-icon"
                                  title="Düzenle"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleOpenEditItem(item)
                                  }}
                                  style={{ color: "#8b6e3e", border: "1px solid #e8dec8", padding: "0.35rem 0.65rem", borderRadius: "6px", cursor: "pointer", background: "#fdfbf7", fontWeight: "600", fontSize: "0.78rem" }}
                                >
                                  ✏️ Düzenle
                                </button>
                                <button
                                  className="ad-btn-icon"
                                  title="Sil"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteItem(item.id)
                                  }}
                                  style={{ color: "#a83232", border: "1px solid #e8d0d0", padding: "0.35rem 0.65rem", borderRadius: "6px", cursor: "pointer", background: "#fff5f5", fontWeight: "600", fontSize: "0.78rem" }}
                                >
                                  🗑️ Sil
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REZERVASYONLAR */}
          {activeTab === "reservations" && (
            <div className="ad-content-block">
              <div className="ad-page-header-row">
                <div>
                  <h1 className="ad-page-title">Canlı Rezervasyon Yönetimi ({reservations.length})</h1>
                  <p className="ad-card-desc">Siteden gelen tüm masa rezervasyon taleplerini ve detaylarını görüntüleyin.</p>
                </div>
              </div>

              <div className="ad-card-section">
                <div className="ad-table-wrap">
                  <table className="ad-table ad-table--stack">
                    <thead>
                      <tr>
                        <th>MİSAFİR &amp; İLETİŞİM</th>
                        <th>TARİH &amp; SAAT</th>
                        <th>KİŞİ SAYISI</th>
                        <th>ÖZEL İSTEK / NOT</th>
                        <th>DURUM</th>
                        <th style={{ textAlign: "right" }}>İŞLEMLER</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center", padding: "3rem", color: "#8a7e70" }}>
                            Henüz kayıtlı bir rezervasyon bulunmuyor.
                          </td>
                        </tr>
                      ) : (
                        reservations.map((r) => (
                          <tr key={r.id}>
                            <td data-label="Misafir & İletişim">
                              <div>
                                <strong style={{ fontSize: "1rem", color: "#1a1510", display: "block" }}>{r.name}</strong>
                                <a href={`tel:${r.phone}`} style={{ fontSize: "0.8rem", color: "#8b6e3e", textDecoration: "none", fontWeight: "600" }}>
                                  📞 {r.phone}
                                </a>
                              </div>
                            </td>
                            <td data-label="Tarih & Saat">
                              <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                                <strong style={{ fontSize: "0.88rem", color: "#1a1510", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b6e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                  {formatTurkishDate(r.date)}
                                </strong>
                                <strong style={{ fontSize: "0.85rem", color: "#1a1510", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8b6e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                  Saat: {r.time}
                                </strong>
                              </div>
                            </td>
                            <td data-label="Kişi Sayısı">
                              <span style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.4rem",
                                background: "#f7f2eb",
                                border: "1px solid #e8dec8",
                                color: "#1a1510",
                                padding: "0.4rem 0.8rem",
                                borderRadius: "20px",
                                fontWeight: "600",
                                fontSize: "0.82rem",
                                whiteSpace: "nowrap"
                              }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#8b6e3e" }}><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                                {r.guests} Kişi
                              </span>
                            </td>
                            <td data-label="Not">
                              {r.note ? (
                                <span style={{ background: "#fff9e6", border: "1px solid #ffe8a3", color: "#856404", padding: "0.4rem 0.7rem", borderRadius: "8px", fontSize: "0.8rem", display: "inline-block", maxWidth: "240px", lineHeight: "1.4" }}>
                                  📝 {r.note}
                                </span>
                              ) : (
                                <span style={{ color: "#b0a595", fontSize: "0.8rem" }}>Yok</span>
                              )}
                            </td>
                            <td data-label="Durum">
                              <span
                                className={`ad-status-pill ${
                                  r.status === "Onaylandı"
                                    ? "ad-status-pill--active"
                                    : "ad-status-pill--passive"
                                }`}
                              >
                                <span style={{
                                  width: "6px",
                                  height: "6px",
                                  borderRadius: "50%",
                                  background: "currentColor",
                                  display: "inline-block"
                                }} />
                                {r.status || "Bekliyor"}
                              </span>
                            </td>
                            <td className="ad-table-actions" data-label="İşlemler">
                              {r.status === "Bekliyor" ? (
                                <button
                                  className="ad-btn-sm"
                                  style={{ background: "#2e7d32", color: "#fff", border: "none", padding: "0.4rem 0.8rem", borderRadius: "2px", cursor: "pointer", fontWeight: "600", fontSize: "0.75rem", marginRight: "0.5rem" }}
                                  onClick={() => handleApproveReservation(r)}
                                  title="Onayla ve WhatsApp Bildirimi Gönder"
                                >
                                  ✓ Onayla &amp; WhatsApp
                                </button>
                              ) : (
                                <button
                                  className="ad-btn-sm"
                                  style={{ background: "#25D366", color: "#fff", border: "none", padding: "0.4rem 0.8rem", borderRadius: "2px", cursor: "pointer", fontWeight: "600", fontSize: "0.75rem", marginRight: "0.5rem" }}
                                  onClick={() => sendWhatsAppNotification(r)}
                                  title="WhatsApp Onay Mesajını Tekrar Gönder"
                                >
                                  💬 WhatsApp Mesajı
                                </button>
                              )}
                              <button
                                className="ad-btn-icon"
                                style={{ color: "#a83232", border: "1px solid #e8d0d0", padding: "0.35rem 0.6rem", borderRadius: "2px" }}
                                onClick={() => handleDeleteReservation(r.id)}
                                title="Sil"
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
          )}

          {/* TAB 3: GALERİ */}
          {activeTab === "gallery" && (
            <div className="ad-content-block">
              <div className="ad-page-header-row">
                <div>
                  <h1 className="ad-page-title">Galeri &amp; Medya Yönetimi ({galleryItems.length} Fotoğraf)</h1>
                  <p className="ad-card-desc">Sitenizin galeri sayfasında yayınlanan fotoğrafları yönetin ve yenilerini ekleyin.</p>
                </div>
                <button className="ad-btn-add" onClick={() => setIsAddGalleryOpen(true)}>
                  + FOTOĞRAF EKLE
                </button>
              </div>

              <div className="ad-card-section">
                <div className="ad-gallery-manage-grid">
                  {galleryItems.map((g) => (
                    <div key={g.id} className="ad-gallery-card">
                      <div className="ad-gallery-card-img">
                        <img src={g.img} alt={g.title} />
                      </div>
                      <div className="ad-gallery-card-body">
                        <strong style={{ fontSize: "0.95rem", color: "#1a1510", marginBottom: "0.25rem" }}>{g.title}</strong>
                        <span style={{ fontSize: "0.75rem", color: "#8b6e3e", fontWeight: "600" }}>🏷️ {g.category}</span>
                        <div style={{ marginTop: "auto", paddingTop: "0.75rem", textAlign: "right" }}>
                          <button
                            className="ad-btn-icon"
                            style={{ color: "#a83232", border: "1px solid #e8d0d0", padding: "0.35rem 0.6rem", borderRadius: "2px", cursor: "pointer" }}
                            onClick={() => handleDeleteGalleryItem(g.id)}
                            title="Fotoğrafı Sil"
                          >
                            🗑️ Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: YORUMLAR YÖNETİMİ */}
          {activeTab === "reviews" && (
            <div className="ad-content-block">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                <div>
                  <h1 className="ad-page-title" style={{ margin: 0 }}>Misafir Yorumları ({reviews.length} Yorum)</h1>
                  <p className="ad-card-desc" style={{ marginTop: "0.2rem" }}>Sitede yayınlanan misafir yorumlarını ve değerlendirmelerini yönetin.</p>
                </div>
              </div>

              <div className="ad-card-section">
                <div className="ad-table-wrap">
                  <table className="ad-table ad-table--stack">
                    <thead>
                      <tr>
                        <th>MİSAFİR / YAZAR</th>
                        <th>PUAN</th>
                        <th>YORUM METNİ</th>
                        <th>DURUM</th>
                        <th style={{ textAlign: "right" }}>İŞLEMLER</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ textAlign: "center", padding: "3rem", color: "#8a7e70" }}>
                            Henüz kayıtlı bir değerlendirme bulunmuyor.
                          </td>
                        </tr>
                      ) : (
                        reviews.map((r) => (
                          <tr key={r.id}>
                            <td data-label="Misafir">
                              <div>
                                <strong style={{ fontSize: "0.95rem", color: "#1a1510", display: "block" }}>{r.author}</strong>
                                <span style={{ fontSize: "0.75rem", color: "#8b6e3e" }}>{r.role}</span>
                              </div>
                            </td>
                            <td data-label="Puan">
                              <span style={{ color: "#d4af37", fontWeight: "700", fontSize: "0.9rem" }}>
                                {"★".repeat(r.rating || 5)} ({r.rating || 5}/5)
                              </span>
                            </td>
                            <td data-label="Yorum">
                              <p style={{ fontSize: "0.82rem", color: "#4a4035", margin: 0, lineHeight: 1.5 }}>
                                "{r.comment}"
                              </p>
                            </td>
                            <td data-label="Durum">
                              <button
                                className={`ad-status-pill ${
                                  r.status === "Onaylandı"
                                    ? "ad-status-pill--active"
                                    : "ad-status-pill--passive"
                                }`}
                                onClick={() => handleToggleReviewStatus(r.id)}
                                title="Yayın Durumunu Değiştir"
                              >
                                ● {r.status}
                              </button>
                            </td>
                            <td className="ad-table-actions" data-label="İşlemler">
                              <button
                                className="ad-btn-icon"
                                style={{ color: "#a83232", border: "1px solid #e8d0d0", padding: "0.35rem 0.6rem", borderRadius: "2px" }}
                                onClick={() => handleDeleteReview(r.id)}
                                title="Sil"
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
          )}

          {/* TAB 5: GELEN İLETİŞİM MESAJLARI */}
          {activeTab === "messages" && (
            <div className="ad-content-block">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                <div>
                  <h1 className="ad-page-title" style={{ margin: 0 }}>Gelen İletişim Mesajları ({contactMessages.length} Mesaj)</h1>
                  <p className="ad-card-desc" style={{ marginTop: "0.2rem" }}>Sitedeki 'Bize Ulaşın' formundan gönderilen müşteri mesajlarını inceleyin ve yanıtlayın.</p>
                </div>
              </div>

              <div className="ad-card-section">
                <div className="ad-table-wrap">
                  <table className="ad-table ad-table--stack">
                    <thead>
                      <tr>
                        <th>GÖNDEREN / E-POSTA</th>
                        <th>KONU</th>
                        <th>MESAJ</th>
                        <th>TARİH</th>
                        <th>DURUM</th>
                        <th style={{ textAlign: "right" }}>İŞLEMLER</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contactMessages.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center", padding: "3rem", color: "#8a7e70" }}>
                            Henüz gelen bir iletişim mesajı bulunmuyor.
                          </td>
                        </tr>
                      ) : (
                        contactMessages.map((m) => (
                          <tr key={m.id}>
                            <td data-label="Gönderen">
                              <div>
                                <strong style={{ fontSize: "0.95rem", color: "#1a1510", display: "block" }}>{m.name}</strong>
                                <a href={`mailto:${m.email}`} style={{ fontSize: "0.8rem", color: "#8b6e3e", textDecoration: "none", fontWeight: "600", display: "block", marginTop: "0.2rem" }}>
                                  ✉️ {m.email}
                                </a>
                                {m.phone && (
                                  <a href={`tel:${m.phone}`} style={{ fontSize: "0.8rem", color: "#2e7d32", textDecoration: "none", fontWeight: "600", display: "block", marginTop: "0.2rem" }}>
                                    📞 {m.phone}
                                  </a>
                                )}
                              </div>
                            </td>
                            <td data-label="Konu">
                              <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#1a1510" }}>{m.subject || "Genel İletişim"}</span>
                            </td>
                            <td data-label="Mesaj">
                              <p style={{ fontSize: "0.82rem", color: "#4a4035", margin: 0, lineHeight: 1.5 }}>
                                "{m.message}"
                              </p>
                              {m.reply && (
                                <div style={{ marginTop: "0.4rem", padding: "0.35rem 0.6rem", background: "#e8f5e9", border: "1px solid #c8e6c9", borderRadius: "4px", fontSize: "0.75rem", color: "#2e7d32" }}>
                                  <strong>Yanıtınız:</strong> {m.reply}
                                </div>
                              )}
                            </td>
                            <td data-label="Tarih">
                              <span style={{ fontSize: "0.8rem", color: "#6b6055" }}>
                                {formatTurkishDate(m.created_at ? m.created_at.split("T")[0] : "")}
                              </span>
                            </td>
                            <td data-label="Durum">
                              <span
                                className={`ad-status-pill ${
                                  m.status === "Yanıtlandı"
                                    ? "ad-status-pill--active"
                                    : "ad-status-pill--passive"
                                }`}
                              >
                                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                                {m.status || "Yanıtlanmadı"}
                              </span>
                            </td>
                            <td className="ad-table-actions" data-label="İşlemler">
                              <div className="ad-action-btns ad-action-btns--wrap">
                                <button
                                  className="ad-btn-sm"
                                  style={{ background: "#25D366", color: "#fff", border: "none", padding: "0.4rem 0.75rem", borderRadius: "4px", cursor: "pointer", fontWeight: "600", fontSize: "0.78rem" }}
                                  onClick={() => {
                                    setReplyingMessage(m)
                                    setReplyText(m.reply || "")
                                    setReplyPhone(m.phone || "")
                                  }}
                                  title="WhatsApp ile Yanıtla"
                                >
                                  💬 WhatsApp Yanıtla
                                </button>
                                <button
                                  className="ad-btn-sm"
                                  style={{ background: "#8b6e3e", color: "#fff", border: "none", padding: "0.4rem 0.75rem", borderRadius: "4px", cursor: "pointer", fontWeight: "600", fontSize: "0.78rem" }}
                                  onClick={() => {
                                    setReplyingMessage(m)
                                    setReplyText(m.reply || "")
                                    setReplyPhone(m.phone || "")
                                  }}
                                  title="Yanıtla & Dönüş Yap"
                                >
                                  ✉️ E-posta Yanıtla
                                </button>
                                <button
                                  className="ad-btn-icon"
                                  style={{ color: "#a83232", border: "1px solid #e8d0d0", padding: "0.35rem 0.6rem", borderRadius: "4px" }}
                                  onClick={() => handleDeleteMessage(m.id)}
                                  title="Sil"
                                >
                                  🗑️ Sil
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AYARLAR */}
          {activeTab === "settings" && (
            <div className="ad-content-block">
              <h1 className="ad-page-title">Yönetim Ayarları</h1>
              <div className="ad-card-section ad-settings-card">
                <h2 className="ad-card-title" style={{ marginBottom: "1.5rem" }}>Admin Şifresini Değiştir</h2>
                <form onSubmit={handleChangePassword}>
                  <div className="ad-input-group" style={{ marginBottom: "1.2rem" }}>
                    <label>YENİ ŞİFRE</label>
                    <input
                      type="password"
                      required
                      placeholder="Yeni şifrenizi girin"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="ad-btn-add">
                    ŞİFREYİ GÜNCELLE
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Add New Menu Item Modal ──────────────────────── */}
      {isAddMenuOpen && (
        <div className="ad-modal-overlay">
          <div className="ad-modal-card">
            <button className="ad-modal-close" onClick={() => setIsAddMenuOpen(false)}>
              ✕
            </button>
            <h2 className="ad-modal-title">Yeni Menü Öğesi Ekle</h2>
            <form onSubmit={handleAddItemSubmit} className="ad-modal-form">
              <div className="ad-input-group">
                <label>ÖĞE ADI</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Hünkar Beğendi"
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
                  placeholder="Örn: 450"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                />
              </div>
              <div className="ad-input-group">
                <label>ÜRÜN GÖRSELİ (DOSYA YÜKLE VEYA URL GİRİN)</label>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <input
                    type="text"
                    placeholder="Görsel URL veya bilgisayarınızdan dosya seçin..."
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
                          reader.onloadend = () => {
                            setNewItem({ ...newItem, img: reader.result })
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Ready Preset Photos */}
              <div className="ad-input-group">
                <label>VEYA HAZIR FOTOĞRAFLARDAN SEÇİN:</label>
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
                      title={p.label}
                    />
                  ))}
                </div>
              </div>

              {/* Image Preview Box */}
              {newItem.img && (
                <div className="ad-img-preview-box">
                  <span style={{ fontSize: "0.6rem", color: "#8a7e70", fontFamily: "var(--font-ui)" }}>GÖRSEL ÖNİZLEME:</span>
                  <img src={newItem.img} alt="Önizleme" className="ad-preview-thumb" />
                </div>
              )}

              <div className="ad-input-group">
                <label>AÇIKLAMA (OPSİYONEL)</label>
                <input
                  type="text"
                  placeholder="Örn: Taze yeşillikler ve trüf mantarı aroması ile..."
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
                KAYDET VE EKLE
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Menu Item Modal ────────────────────────── */}
      {editMenuItem && (
        <div className="ad-modal-overlay">
          <div className="ad-modal-card">
            <button className="ad-modal-close" onClick={() => setEditMenuItem(null)}>
              ✕
            </button>
            <h2 className="ad-modal-title">Ürün Düzenle &amp; Güncelle</h2>
            <form onSubmit={handleUpdateItemSubmit} className="ad-modal-form">
              <div className="ad-input-group">
                <label>ÖĞE ADI</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Hünkar Beğendi"
                  value={editMenuItem.name}
                  onChange={(e) => setEditMenuItem({ ...editMenuItem, name: e.target.value })}
                />
              </div>
              <div className="ad-input-group">
                <label>KATEGORİ</label>
                <select
                  value={editMenuItem.category}
                  onChange={(e) => setEditMenuItem({ ...editMenuItem, category: e.target.value })}
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
                  placeholder="Örn: 450"
                  value={editMenuItem.price}
                  onChange={(e) => setEditMenuItem({ ...editMenuItem, price: e.target.value })}
                />
              </div>
              <div className="ad-input-group">
                <label>AÇIKLAMA / İÇERİK MALZEMELERİ</label>
                <textarea
                  rows="3"
                  placeholder="Ürün açıklaması ve içindekiler..."
                  value={editMenuItem.description || ""}
                  onChange={(e) => setEditMenuItem({ ...editMenuItem, description: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2d8cc", borderRadius: "3px", fontFamily: "inherit", fontSize: "0.85rem" }}
                />
              </div>
              <div className="ad-input-group">
                <label>DURUM</label>
                <select
                  value={editMenuItem.status}
                  onChange={(e) => setEditMenuItem({ ...editMenuItem, status: e.target.value })}
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Pasif">Pasif</option>
                </select>
              </div>
              <div className="ad-input-group">
                <label>ÜRÜN GÖRSELİ (DOSYA YÜKLE VEYA URL GİRİN)</label>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <input
                    type="text"
                    placeholder="Görsel URL veya bilgisayarınızdan dosya seçin..."
                    value={editMenuItem.img || ""}
                    onChange={(e) => setEditMenuItem({ ...editMenuItem, img: e.target.value })}
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
                          reader.onloadend = () => {
                            setEditMenuItem({ ...editMenuItem, img: reader.result })
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Ready Presets */}
              <div className="ad-input-group">
                <label>HAZIR GÖRSEL SEÇ</label>
                <div className="ad-presets-grid">
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
                      className={`ad-preset-img ${editMenuItem.img === p.url ? "ad-preset-img--active" : ""}`}
                      onClick={() => setEditMenuItem({ ...editMenuItem, img: p.url })}
                      title={p.label}
                    />
                  ))}
                </div>
              </div>

              {/* Image Preview Box */}
              {editMenuItem.img && (
                <div className="ad-img-preview-box">
                  <span style={{ fontSize: "0.6rem", color: "#8a7e70", fontFamily: "var(--font-ui)" }}>GÖRSEL ÖNİZLEME:</span>
                  <img src={editMenuItem.img} alt="Önizleme" className="ad-preview-thumb" />
                </div>
              )}

              <div style={{ display: "flex", gap: "0.8rem", marginTop: "1rem" }}>
                <button type="submit" className="ad-login-btn" style={{ flex: 1 }}>
                  GÜNCELLE VE KAYDET
                </button>
                <button type="button" onClick={() => setEditMenuItem(null)} style={{ padding: "0.75rem 1.2rem", background: "#f0ece1", border: "none", borderRadius: "2px", fontWeight: "700", fontSize: "0.7rem", cursor: "pointer", color: "#1a1510" }}>
                  İPTAL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Add New Gallery Item Modal ──────────────────── */}
      {isAddGalleryOpen && (
        <div className="ad-modal-overlay">
          <div className="ad-modal-card" style={{ maxWidth: "480px" }}>
            <button className="ad-modal-close" onClick={() => setIsAddGalleryOpen(false)}>
              ✕
            </button>
            <h2 className="ad-modal-title">Yeni Galeri Fotoğrafı Ekle</h2>
            <form onSubmit={handleAddGalleryItemSubmit} className="ad-modal-form">
              <div className="ad-input-group">
                <label>FOTOĞRAF BAŞLIĞI *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Özel VIP Salonu veya Izgara Şef Masası"
                  value={newGalleryItem.title}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                />
              </div>

              <div className="ad-input-group">
                <label>KATEGORİ</label>
                <select
                  value={newGalleryItem.category}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, category: e.target.value })}
                >
                  <option value="İç Mekan">İç Mekan</option>
                  <option value="Tabaklar">Tabaklar / Lezzetler</option>
                  <option value="Mutfak">Mutfak &amp; Ekip</option>
                  <option value="Ambiyans">Ambiyans &amp; Dekor</option>
                  <option value="Etkinlik">Özel Etkinlikler</option>
                </select>
              </div>

              <div className="ad-input-group">
                <label>GÖRSEL SEÇİMİ (YÜKLE VEYA URL GİRİN)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setNewGalleryItem({ ...newGalleryItem, img: reader.result })
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  style={{ marginBottom: "0.5rem" }}
                />

                <input
                  type="text"
                  placeholder="veya Görsel URL'si yapıştırın (https://...)"
                  value={newGalleryItem.img.startsWith("data:") ? "" : newGalleryItem.img}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, img: e.target.value })}
                />
              </div>

              {/* Ready Presets Picker */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontSize: "0.7rem", fontWeight: "700", color: "#8a7e70", display: "block", marginBottom: "0.4rem" }}>
                  VEYA ÖN HAZIR RESTORAN GÖRSELLERİNDEN SEÇİN:
                </label>
                <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.4rem" }}>
                  {[
                    { src: "/restaurant_interior.png", name: "İç Mekan" },
                    { src: "/press_restaurant.png", name: "Mutfak" },
                    { src: "/food_hero_1.png", name: "Tabak 1" },
                    { src: "/food_hero_2.png", name: "Tabak 2" },
                    { src: "/food_beef.png", name: "Et" },
                    { src: "/food_ceviche.png", name: "Ceviche" },
                    { src: "/food_dessert.png", name: "Tatlı" },
                    { src: "/food_drinks.png", name: "İçecek" },
                  ].map((p) => (
                    <img
                      key={p.src}
                      src={p.src}
                      alt={p.name}
                      onClick={() => setNewGalleryItem({ ...newGalleryItem, img: p.src })}
                      style={{
                        width: "55px",
                        height: "45px",
                        objectFit: "cover",
                        borderRadius: "2px",
                        cursor: "pointer",
                        border: newGalleryItem.img === p.src ? "2px solid #8b6e3e" : "1px solid #d8cfc4",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              {newGalleryItem.img && (
                <div style={{ marginBottom: "1rem", textAlign: "center" }}>
                  <span style={{ fontSize: "0.7rem", color: "#8a7e70" }}>Seçilen Önizleme:</span>
                  <div style={{ width: "100%", height: "120px", marginTop: "0.3rem", borderRadius: "3px", overflow: "hidden" }}>
                    <img src={newGalleryItem.img} alt="Önizleme" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                </div>
              )}

              <button type="submit" className="ad-login-btn">
                FOTOĞRAFI YAYINLA
              </button>
            </form>
          </div>
        </div>
      )}


      {/* ── Reply Contact Message Modal ─────────────────── */}
      {replyingMessage && (
        <div className="ad-modal-overlay">
          <div className="ad-modal-card" style={{ maxWidth: "580px" }}>
            <button className="ad-modal-close" onClick={() => setReplyingMessage(null)}>
              ✕
            </button>
            <h2 className="ad-modal-title">Mesajı Yanıtla</h2>
            <div style={{ background: "#fbf8f2", border: "1px solid #e8dec8", borderRadius: "6px", padding: "1rem 1.2rem", marginBottom: "1.2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <strong style={{ fontSize: "0.95rem", color: "#1a1510" }}>{replyingMessage.name}</strong>
                <a href={`mailto:${replyingMessage.email}`} style={{ fontSize: "0.8rem", color: "#8b6e3e", fontWeight: "600" }}>{replyingMessage.email}</a>
              </div>
              {replyingMessage.phone && (
                <div style={{ fontSize: "0.8rem", color: "#2e7d32", fontWeight: "600", marginBottom: "0.4rem" }}>
                  📞 Telefon: <a href={`tel:${replyingMessage.phone}`} style={{ color: "inherit", textDecoration: "none" }}>{replyingMessage.phone}</a>
                </div>
              )}
              <div style={{ fontSize: "0.8rem", color: "#8b6e3e", fontWeight: "600", marginBottom: "0.4rem" }}>
                Konu: {replyingMessage.subject || "Genel İletişim"}
              </div>
              <p style={{ fontSize: "0.88rem", color: "#4a4035", margin: 0, fontStyle: "italic", lineHeight: "1.5" }}>
                "{replyingMessage.message}"
              </p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="ad-modal-form">
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                <div className="ad-input-group">
                  <label>MÜŞTERİ TELEFON NUMARASI (WHATSAPP İÇİN)</label>
                  <input
                    type="text"
                    placeholder={replyingMessage.phone ? replyingMessage.phone : "Örn: 0545 785 55 57"}
                    value={replyPhone}
                    onChange={(e) => setReplyPhone(e.target.value)}
                    style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2d8cc", borderRadius: "4px", fontFamily: "inherit", fontSize: "0.88rem" }}
                  />
                  <small style={{ fontSize: "0.75rem", color: "#8a7e70", marginTop: "0.3rem", display: "block" }}>
                    {replyingMessage.phone ? "Form üzerinden alınan telefon numarası otomatik dolduruldu." : "Müşteri telefon numarası girmemişse buradan manuel girebilirsiniz."}
                  </small>
                </div>

                <div className="ad-input-group">
                  <label style={{ display: "block", marginBottom: "0.4rem" }}>HAZIR YANIT ŞABLONLARI</label>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
                    {[
                      "Mesajınız alındı, en kısa sürede sizinle iletişime geçeceğiz.",
                      "Rezervasyon talebiniz onaylanmıştır. Sizleri restoranımızda ağırlamaktan mutluluk duyacağız.",
                      "Özel etkinlik teklifimiz hazırlanmaktadır, detaylar için ekibimiz sizinle iletişime geçecektir.",
                      "Talebiniz doğrultusunda gerekli bilgilendirme yapılmıştır. Teşekkür ederiz."
                    ].map((tpl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setReplyText(tpl)}
                        style={{ background: "#f0ece1", border: "1px solid #d8cfc4", borderRadius: "4px", padding: "0.35rem 0.65rem", fontSize: "0.74rem", cursor: "pointer", color: "#4a4035", fontWeight: "600" }}
                      >
                        + Şablon {i + 1}
                      </button>
                    ))}
                  </div>
                  <label>YANIT METNİNİZ</label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Müşteriye iletilecek yanıt metniniz..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2d8cc", borderRadius: "4px", fontFamily: "inherit", fontSize: "0.88rem", resize: "vertical" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "1.2rem" }}>
                <button
                  type="button"
                  onClick={() => handleSendReply("whatsapp")}
                  className="ad-login-btn"
                  style={{ background: "#25D366", borderColor: "#25D366", color: "#fff", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                  WHATSAPP İLE GÖNDER &amp; KAYDET
                </button>
                <button
                  type="button"
                  onClick={() => handleSendReply("email")}
                  className="ad-login-btn"
                  style={{ background: "#0288d1", borderColor: "#0288d1", color: "#fff" }}
                >
                  ✉️ E-POSTA İLE GÖNDER &amp; KAYDET
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReplyingMessage(null)
                    setReplyText("")
                    setReplyPhone("")
                  }}
                  style={{ padding: "0.75rem 1.2rem", background: "#f5f1e8", border: "1px solid #dcd3c1", borderRadius: "4px", fontWeight: "700", fontSize: "0.75rem", cursor: "pointer", color: "#1a1510", textAlign: "center" }}
                >
                  İPTAL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
