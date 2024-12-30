<h1 align="center">PDF Merge & Convert</h1>

<p align="center">
  PDF dosyalarını birleştirme ve Word dosyalarını PDF'e dönüştürme uygulaması.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js">
</p>



https://github.com/user-attachments/assets/5a659089-13f2-45b2-b1e1-ec781a19c595



<h2>🚀 Özellikler</h2>

<ul>
  <li>Birden fazla PDF dosyasını tek bir PDF'te birleştirme</li>
  <li>Word (.docx) dosyalarını PDF'e dönüştürme</li>
  <li>Sürükle-bırak dosya yükleme desteği</li>
  <li>Yükleme sırasında görsel geri bildirim</li>
  <li>Modern ve kullanıcı dostu arayüz</li>
</ul>

<h2>📋 Gereksinimler</h2>

<h3>Backend için Gereksinimler</h3>
<ul>
  <li>Node.js (v14 veya üzeri)</li>
  <li>LibreOffice (Word dönüştürme işlemleri için)</li>
  <li>npm veya yarn</li>
</ul>

<h3>Frontend için Gereksinimler</h3>
<ul>
  <li>Node.js (v14 veya üzeri)</li>
  <li>Angular CLI</li>
  <li>npm veya yarn</li>
</ul>

<h2>🛠️ Kurulum</h2>

<h3>Backend Kurulumu</h3>

1. Gerekli paketleri yükleyin:
bash
cd pdf-merge-backend
npm install

2. LibreOffice'i sisteminize yükleyin:

<h4>Windows için:</h4>
<ul>
  <li><a href="https://www.libreoffice.org/download/download/">LibreOffice'in resmi sitesinden</a> indirin ve yükleyin</li>
</ul>

<h4>Linux için:</h4>
bash
sudo apt-get install libreoffice

3. .env dosyasını oluşturun:
```bash
PORT=3001
```

4. Sunucuyu başlatın:
```bash
npm start
```

<h3>Frontend Kurulumu</h3>

1. Gerekli paketleri yükleyin:
```bash
cd pdf-merge-client
npm install
```

2. Uygulamayı geliştirme modunda başlatın:
```bash
ng serve
```

<h2>📦 Kullanılan Teknolojiler</h2>

<h3>Backend</h3>
<ul>
  <li>Express.js</li>
  <li>multer (dosya yükleme işlemleri için)</li>
  <li>pdf-lib (PDF işlemleri için)</li>
  <li>libreoffice-convert (Word -> PDF dönüşümü için)</li>
  <li>cors</li>
  <li>dotenv</li>
</ul>

<h3>Frontend</h3>
<ul>
  <li>Angular 19</li>
  <li>Angular Material</li>
  <li>RxJS</li>
  <li>TypeScript</li>
</ul>

<h2>💡 Kullanım</h2>

1. Tarayıcınızda `http://localhost:4200` adresine gidin
2. PDF birleştirme için:
   - "PDF Birleştir" sekmesini seçin
   - Birleştirmek istediğiniz PDF dosyalarını sürükleyin veya seçin
   - "Birleştir" butonuna tıklayın
   
3. Word'den PDF'e dönüştürme için:
   - "Word'den PDF'e Dönüştür" sekmesini seçin
   - Dönüştürmek istediğiniz Word dosyasını sürükleyin veya seçin
   - "Dönüştür" butonuna tıklayın

<h2>🤝 Katkıda Bulunma</h2>

1. Bu depoyu fork edin
2. Yeni bir özellik dalı oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Dalınıza push edin (`git push origin feature/AmazingFeature`)
5. Bir Pull Request oluşturun


