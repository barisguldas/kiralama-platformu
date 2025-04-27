import React, { useState } from 'react';
import './profil.css';

// Alt bileşenler
const ProfileTab = ({ label, active, onClick, icon }) => (
  <button 
    className={`profile__tab ${active ? 'profile__tab--active' : ''}`}
    onClick={onClick}
  >
    {icon && <i className={`icon-${icon}`}></i>}
    {label}
  </button>
);

const ActionButton = ({ label, onClick, variant, icon }) => (
  <button 
    className={`btn btn--${variant}`}
    onClick={onClick}
  >
    {icon && <i className={`icon-${icon}`}></i>}
    {label}
  </button>
);

const RatingStars = ({ rating, interactive = false, onChange }) => (
  <div className="rating">
    {[...Array(5)].map((_, index) => (
      <span 
        key={index} 
        className={`rating__star ${index < rating ? 'rating__star--filled' : ''}`}
        onClick={interactive ? () => onChange(index + 1) : undefined}
      >
        ★
      </span>
    ))}
  </div>
);

const Card = ({ title, description, category, price, image, onDetailsClick }) => (
  <div className="card card--large">
    <div className="card__image">
      <img src={image || "/api/placeholder/400/250"} alt={title} />
      {category && <span className="card__badge">{category}</span>}
    </div>
    <div className="card__content">
      <h3 className="card__title">{title}</h3>
      <p className="card__description">{description}</p>
      <div className="card__footer">
        <span className="card__price">{price}</span>
        <button className="btn btn--secondary" onClick={onDetailsClick}>Detaylar</button>
      </div>
    </div>
  </div>
);

const Comment = ({ author, content, date, rating }) => (
  <div className="comment">
    <div className="comment__header">
      <div className="comment__author">
        <img src="/api/placeholder/40/40" alt={author} className="comment__avatar" />
        <span>{author}</span>
      </div>
      <div>
        <RatingStars rating={rating} />
        <span className="comment__date">{date}</span>
      </div>
    </div>
    <p>{content}</p>
    <div className="comment__actions">
      <button className="btn btn--secondary btn--sm">
        <i className="icon-thumb-up"></i> Faydalı
      </button>
      <button className="btn btn--secondary btn--sm">
        <i className="icon-reply"></i> Yanıtla
      </button>
    </div>
  </div>
);

const ContactCard = ({ icon, title, content }) => (
  <div className="card">
    <div className="card__content">
      <div className="card__icon">{icon}</div>
      <div>
        <h4>{title}</h4>
        <p>{content}</p>
      </div>
    </div>
  </div>
);

// Ana bileşen
const ProfilePage = () => {
  // Örnek veri (normalde API'den alınır)
  const userData = {
    username: "kullanici_adi",
    profileImage: "/api/placeholder/150/150",
    address: "İstanbul, Türkiye",
    contact: "ornek@email.com | +90 555 123 4567",
    social: "@kullaniciadi",
    listings: [
      { id: 1, title: "Çalışma Masası", description: "Ev ofis için ideal set, ayarlanabilir yükseklik, geniş çalışma alanı ve entegre kablo düzenleyici ile.", price: "1800₺/ay", category: "Mobilya" },
      { id: 2, title: "Bulaşık Makinesi", description: "3 yıllık Bosch marka, A++ enerji sınıfı, 6 programlı bulaşık makinesi. Sessiz çalışma özelliği ile.", price: "3600₺/ay", category: "Beyaz Eşya" },
      { id: 3, title: "Smart TV", description: "1 yıllık Samsung 55 inç 4K UHD Smart TV. Netflix, YouTube ve diğer uygulamalar yüklü, uzaktan kumanda dahil.", price: "8000₺/ay", category: "Elektronik" }
    ],
    comments: [
      { id: 1, author: "Ahmet K.", content: "Çok ilgiliydi.", date: "12.04.2025", rating: 5 },
      { id: 2, author: "Mehmet Y.", content: "Çok güvenilir.", date: "10.04.2025", rating: 4 },
      { id: 3, author: "Ayşe T.", content: "Hiç sorun yaşamadım.", date: "05.04.2025", rating: 5 }
    ]
  };

  const [activeTab, setActiveTab] = useState('listings');
  const [activePage, setActivePage] = useState(1);
  const [commentRating, setCommentRating] = useState(5);

  const handleSendMessage = () => {
    alert("Mesaj gönderme işlevi henüz eklenmedi!");
  };

  return (
    <div className="profile">
      {/* Profil Banner */}
      <header className="profile__header">
        <div className="profile__avatar">
          <img src={userData.profileImage} alt="Profil" />
          <div className="profile__status"></div>
        </div>
        <h2>{userData.username}</h2>
        <div className="profile__badge">Premium Üye</div>
      </header>

      {/* Navigasyon */}
      <nav className="profile__nav">
        <div className="profile__tabs">
          <ProfileTab 
            label="İlanlarım" 
            icon="listings" 
            active={activeTab === 'listings'} 
            onClick={() => setActiveTab('listings')} 
          />
          <ProfileTab 
            label="Yorumlar" 
            icon="comments" 
            active={activeTab === 'comments'} 
            onClick={() => setActiveTab('comments')} 
          />
          <ProfileTab 
            label="İletişim" 
            icon="contact" 
            active={activeTab === 'contact'} 
            onClick={() => setActiveTab('contact')} 
          />
        </div>
        
        <div className="profile__actions">
          <ActionButton 
            label="Mesaj Gönder" 
            icon="message" 
            variant="primary" 
            onClick={handleSendMessage} 
          />
          <ActionButton 
            label="Favorilere Ekle" 
            icon="favorite" 
            variant="secondary" 
          />
        </div>
      </nav>

      {/* Ana İçerik */}
      <main className="content">
        {/* İlanlar Sekmesi */}
        {activeTab === 'listings' && (
          <section className="content__panel">
            <div className="content__header">
              <h3>İlanlarım</h3>
              <div className="content__filters">
                <select className="form__select">
                  <option>Tüm Kategoriler</option>
                  <option>Mobilya</option>
                  <option>Elektronik</option>
                  <option>Beyaz Eşya</option>
                </select>
                <select className="form__select">
                  <option>Fiyata Göre (Artan)</option>
                  <option>Fiyata Göre (Azalan)</option>
                  <option>En Yeni</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid--listings">
              {userData.listings.map(item => (
                <Card 
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  price={item.price}
                  category={item.category}
                />
              ))}
            </div>
            
            <div className="pagination">
              <span>Toplam {userData.listings.length} ilan</span>
              <div className="pagination__numbers">
                {[1, 2, 3].map(page => (
                  <button 
                    key={page} 
                    className={`pagination__number ${page === activePage ? 'pagination__number--active' : ''}`}
                    onClick={() => setActivePage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Yorumlar Sekmesi */}
        {activeTab === 'comments' && (
          <section className="content__panel">
            <div className="content__header">
              <h3>Yorumlar</h3>
              <select className="form__select">
                <option>En Yeni</option>
                <option>En Eski</option>
                <option>En İyi Puanlama</option>
              </select>
            </div>
            
            <div className="comments">
              {userData.comments.map(comment => (
                <Comment 
                  key={comment.id}
                  author={comment.author}
                  content={comment.content}
                  date={comment.date}
                  rating={comment.rating}
                />
              ))}
            </div>
            
            <div className="card">
              <div className="card__content">
                <h4>Yorum Yazın</h4>
                <div className="form">
                  <textarea placeholder="Yorumunuzu buraya yazın..." className="form__textarea"></textarea>
                  <div className="form__footer">
                    <div className="form__rating">
                      <span>Puanınız:</span>
                      <RatingStars 
                        rating={commentRating} 
                        interactive={true} 
                        onChange={setCommentRating} 
                      />
                    </div>
                    <button className="btn btn--primary">Yorum Gönder</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* İletişim Sekmesi */}
        {activeTab === 'contact' && (
          <section className="content__panel">
            <div className="content__header">
              <h3>İletişim Bilgileri</h3>
            </div>
            
            <div className="grid">
              <ContactCard 
                icon="📍" 
                title="Adres" 
                content={userData.address} 
              />
              <ContactCard 
                icon="📱" 
                title="E-posta / Telefon" 
                content={userData.contact} 
              />
              <ContactCard 
                icon="🌐" 
                title="Sosyal Medya" 
                content={userData.social} 
              />
            </div>
            
            <div className="card contact-form">
              <div className="card__content">
                <h4>Hızlı Mesaj Gönder</h4>
                <div className="form">
                  <div className="grid grid--2">
                    <input type="text" placeholder="Adınız" className="form__input" />
                    <input type="email" placeholder="E-posta" className="form__input" />
                  </div>
                  <textarea placeholder="Mesajınız..." className="form__textarea"></textarea>
                  <button className="btn btn--primary">Mesaj Gönder</button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Alt Bilgi */}
      <footer className="profile__footer">
        <div className="profile__footer-content">
          <div className="profile__user">
            <img src={userData.profileImage} alt="Profil" className="profile__avatar-small" />
            <span>{userData.username}</span>
          </div>
          <div className="profile__copyright">
            <span>Son Güncelleme: 25.04.2025</span>
            <span>© 2025 - Tüm Hakları Saklıdır</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProfilePage;