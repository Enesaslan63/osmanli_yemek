import "../styles/Footer.css"

export default function Footer() {
  return (
    <footer className="mn-footer">
      <div className="mn-footer-inner">
        <div className="mn-footer-brand">
          <h3 className="mn-footer-logo">Osmanlı Hazır Yemek</h3>
          <p className="mn-footer-tagline">
            Mutfak sanatının derinliklerinde, her lokmanın, her tabağın, her lezzetin anlattığı yol.
          </p>
          <div className="mn-footer-socials">
            <a href="https://www.instagram.com/osmanli.yemek/" target="_blank" rel="noopener noreferrer" className="mn-social" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://www.facebook.com/share/1FANY4j8GA/" target="_blank" rel="noopener noreferrer" className="mn-social" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://x.com/i/flow/login" target="_blank" rel="noopener noreferrer" className="mn-social" aria-label="X">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>

        <div className="mn-footer-col">
          <h4 className="mn-footer-col-title">ADRES</h4>
          <p className="mn-footer-addr">
            Eyyüp Nebi, 3508. Sk. No: 1A<br />
            63200 Eyyübiye / Şanlıurfa<br />
            <span style={{ color: "#e2c478", fontWeight: 600 }}>Tel: 0545 785 55 57</span>
          </p>
        </div>

        <div className="mn-footer-col mn-footer-map-col">
          <h4 className="mn-footer-col-title">KONUMUMUZ</h4>
          <div className="mn-footer-map-oval">
            <iframe
              className="mn-footer-map-iframe"
              title="Osmanlı Hazır Yemek Konum"
              src="https://maps.google.com/maps?q=Eyyüp%20Nebi,%203508.%20Sk.%20no:%201A,%2063200%20Eyyübiye/Şanlıurfa&t=&z=15&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              href="https://maps.google.com/?q=Eyy%C3%BCp+Nebi,+3508.+Sk.+No:+1A,+63200+Eyy%C3%BCbiye/%C5%9Eanl%C4%B1urfa"
              target="_blank"
              rel="noopener noreferrer"
              className="mn-footer-map-overlay"
              title="Haritada Yol Tarifi Al"
            >
              <div className="mn-map-pin-badge">
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>Haritada Gör</span>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div className="mn-footer-bottom">
        <p>© 2026 OSMANLI HAZIR YEMEK. TÜM HAKLARI SAKLIDIR.</p>
      </div>
    </footer>
  )
}
