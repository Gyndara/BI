# Retail Business Intelligence Dashboard (360° Retail Analytics)

Sebuah prototipe dashboard **Business Intelligence (BI) statis** dan visualisasi data retail interaktif yang dikembangkan berdasarkan referensi jurnal ilmiah internasional:

> **“360° Retail Business Analytics by Adopting Hybrid Machine Learning and a Business Intelligence Approach”**  
> *Abdulmajeed Alqhatani, Muhammad Shoaib Ashraf, Javed Ferzund, Ahmad Shaf, Hamad Ali Abosaq, Saifur Rahman, Muhammad Irfan, & Samar M. Alqhtani.*  
> **Sustainability (MDPI)**, 2022, Vol. 14, Issue 19, Art. 11942.  
> DOI: [10.3390/su141911942](https://doi.org/10.3390/su141911942)

---

## 📋 Daftar Isi
1. [Fitur Utama Dashboard](#-fitur-utama-dashboard)
2. [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
3. [Struktur File](#-struktur-file)
4. [Cara Menjalankan Secara Lokal](#-cara-menjalankan-secara-lokal)
5. [Cara Mengubah Data Demonstrasi](#-cara-mengubah-data-demonstrasi)
6. [Cara Mengubah Warna & Tema Tampilan](#-cara-mengubah-warna--tema-tampilan)
7. [Panduan Deployment ke Netlify](#-panduan-deployment-ke-netlify)
8. [Batasan Akademik & Dashboard Statis](#-batasan-akademik--dashboard-statis)

---

## ✨ Fitur Utama Dashboard

- **Executive KPI Overview:** 6 metrik utama (Total Revenue, Total Orders, Units Sold, Unique Customers, Unique Products, Average Order Value / AOV).
- **Sales Analytics:**
  - Tren pendapatan bulanan (*Monthly Revenue Trend*) menggunakan grafik garis halus.
  - Volume pesanan bulanan (*Monthly Orders Count*) menggunakan grafik batang.
  - Distribusi penjualan per hari (*Sales by Day of Week*) dengan deteksi puncak hari Kamis dan tidak ada transaksi di hari Sabtu sesuai dataset asli.
  - Panel **Business Interpretation** berbasis aturan (*rule-based insight*) yang menghitung tren secara dinamis.
- **Product Analytics:**
  - Top 10 produk berdasarkan pendapatan (*Revenue*) dan kuantitas (*Quantity Sold*).
  - Kartu sorotan produk terlaris (*Regency Cakestand 3 Tier* & *White Hanging Heart T-Light Holder*).
  - Tabel katalog produk interaktif dengan fitur pencarian dan pengurutan (*sorting*).
- **Customer Analytics & Segmentasi RFM:**
  - Penjelasan konseptual metodologi **RFM (Recency, Frequency, Monetary)** sesuai Bagian 3 & Gambar 9 pada jurnal.
  - 4 segmen pelanggan ilustratif (*High Value / Champions, Loyal, Potential, At Risk*).
  - Grafik kontribusi pendapatan pelanggan (*Doughnut Chart*) dan tabel akun kunci.
- **Geographic Analysis:**
  - Analisis pendapatan berdasarkan 10 negara utama (dominasi UK 88.9%, Jerman, Perancis, EIRE, Belanda, dll.).
  - Perbandingan pangsa pasar domestik vs ekspor internasional.
- **ML Model Comparison (Tabel 1 Jurnal):**
  - Penyajian persis hasil eksperimen klasifikasi kategori pelanggan dari Tabel 1 jurnal referensi (*Gradient Boosting 95.39%, Voting Classifier 95.30%, Logistic Regression 94.93%, Random Forest 94.56%, DT 89.76%, KNN 84.23%, SVC 75.92%, AdaBoost 59.59%*).
  - Label dan disclaimer integritas akademik yang jelas tanpa metrik fabrikasi.
  - Panduan interpretasi hasil evaluasi machine learning.
- **About the Research & Architecture:**
  - Informasi sitasi lengkap dengan tautan DOI aktif.
  - Diagram alur arsitektur 6 tahap (*Business Data → ETL → Data Warehouse → BI Analytics → Machine Learning → Dashboard Insights*).
- **Interaktivitas Penuh:**
  - Filter dinamis berdasarkan Rentang Waktu (*Date Range*), Negara (*Country*), dan Kategori Produk (*Category*).
  - Tombol Reset Filter & penanganan *Empty State*.
  - Pengurutan tabel interaktif (klik *header* untuk *asc/desc*).
  - Pencarian tabel langsung.
  - Tombol kembali ke atas (*Back to Top*).
  - Navigasi responsif dengan *drawer menu* mobile.

---

## 🛠️ Teknologi yang Digunakan

- **HTML5:** Struktur semantik, aksesibilitas ARIA, dan hierarki heading yang teratur.
- **CSS3:** Variabel CSS (*design tokens*), Flexbox, CSS Grid, *sticky positioning*, dan desain responsif mobile-first.
- **Vanilla JavaScript (ES6+):** Mesin simulasi agregasi data multi-dimensi, filter dinamis, pengurutan tabel, dan pengatur event.
- **Chart.js (v4.4.1 CDN):** Rendering grafik responsif garis, batang horizontal/vertikal, dan donat.
- **Lucide Icons (CDN):** Ikon modern berbasis vektor yang ringan dan bersih.
- **Google Fonts (Inter):** Tipografi sans-serif modern standar aplikasi analitik.

---

## 📁 Struktur File

```text
BI/
├── index.html                  # Halaman utama dashboard
├── style.css                   # Sistem desain dan styling responsif
├── script.js                   # Mesin data demonstrasi, chart, filter & sorting
├── README.md                   # Dokumentasi proyek & panduan deployment
```

---

## 🚀 Cara Menjalankan Secara Lokal

Proyek ini tidak memerlukan Node.js, npm, database, atau proses build. Anda dapat menjalankannya langsung di browser:

### Opsi A: Langsung Buka File HTML
1. Buka folder proyek di File Explorer komputer Anda.
2. Klik ganda file `index.html` untuk membukanya di peramban (Google Chrome, Microsoft Edge, Firefox, dll.).

### Opsi B: Menggunakan Local Web Server (Direkomendasikan)
Untuk pengalaman terbaik (menghindari kebijakan pembatasan file lokal browser tertentu):
- **VS Code Live Server:** Klik kanan `index.html` dan pilih **"Open with Live Server"**.
- **Python HTTP Server:**
  ```bash
  # Jalankan di terminal/command prompt pada folder proyek:
  python -m http.server 8000
  ```
  Lalu buka peramban di `http://localhost:8000`.

---

## ✏️ Cara Mengubah Data Demonstrasi

Semua data simulasi tersimpan secara terstruktur di awal file [`script.js`](file:///c:/Users/bisma/OneDrive/Documents/KULIAH/semester5/BI/BI/script.js):

1. **Mengubah Katalog Produk:**  
   Edit array `PRODUCT_CATALOG` di baris ~15:
   ```javascript
   { stockCode: '22423', name: 'NAMA PRODUK BARU', category: 'Kategori', unitPrice: 12.50 }
   ```
2. **Mengubah Bobot Negara:**  
   Sesuaikan array `COUNTRY_SHARES` di baris ~32.
3. **Mengubah Akun Pelanggan:**  
   Sesuaikan array `CUSTOMER_PROFILES` di baris ~47.
4. **Hasil Akurasi Model ML Jurnal:**  
   Data pada array `ML_REPORTED_MODELS` di baris ~130 mencerminkan Tabel 1 jurnal resmi. *Jangan diubah jika ingin menjaga akurasi akademik referensi jurnal.*

Setelah menyimpan `script.js`, muat ulang (*refresh*) halaman browser untuk melihat perubahannya seketika.

---

## 🎨 Cara Mengubah Warna & Tema Tampilan

Seluruh palet warna dan parameter tampilan diatur menggunakan variabel CSS pada bagian atas file [`style.css`](file:///c:/Users/bisma/OneDrive/Documents/KULIAH/semester5/BI/BI/style.css):

```css
:root {
  /* Warna Sidebar & Brand */
  --color-navy-dark: #0f172a;   /* Warna latar sidebar */
  --color-primary: #2563eb;     /* Aksen biru utama */
  --color-teal: #0d9488;        /* Aksen teal */
  --color-emerald: #059669;     /* Aksen hijau status & ML Champion */

  /* Latar Belakang & Permukaan */
  --bg-app: #f8fafc;            /* Background aplikasi (abu-abu sangat muda) */
  --bg-card: #ffffff;           /* Background kartu KPI & chart */
  --border-light: #e2e8f0;      /* Garis batas kartu & tabel */
}
```

Ubah kode warna hex di atas sesuai dengan preferensi estetika yang diinginkan.

---

## 🌐 Panduan Deployment ke Netlify

Website ini merupakan aplikasi statis murni sehingga dapat langsung di-deploy ke Netlify dalam hitungan detik secara gratis:

### Cara 1: Drag-and-Drop Folder (Paling Mudah)
1. Buka [Netlify](https://app.netlify.com/) dan masuk ke akun Anda.
2. Buka tab **"Sites"**.
3. Cari area bertuliskan **"Want to deploy a new site without connecting to Git? Drag and drop your site output folder here"**.
4. Tarik (*drag*) seluruh folder proyek ini (pastikan folder tersebut langsung berisi `index.html`, `style.css`, dan `script.js`) ke area tersebut.
5. Netlify akan langsung mengunggah file dan memberikan URL publik instan (misal: `https://retail-bi-dashboard.netlify.app`).

### Cara 2: Melalui GitHub
1. Buat repositori baru di GitHub (misal: `retail-bi-dashboard`).
2. Unggah file `index.html`, `style.css`, `script.js`, dan `README.md` ke repositori tersebut:
   ```bash
   git init
   git add .
   git commit -m "Initial release of 360 Retail BI Dashboard"
   git branch -M main
   git remote add origin https://github.com/USERNAME/retail-bi-dashboard.git
   git push -u origin main
   ```
3. Di Netlify, pilih **"Add new site"** &rarr; **"Import an existing project"** &rarr; **"GitHub"**.
4. Pilih repositori Anda.
5. Biarkan **Build command** dan **Publish directory** kosong (karena website statis murni).
6. Klik **"Deploy site"**. Setiap kali Anda melakukan `git push`, Netlify akan memperbarui situs secara otomatis.

---

## ⚠️ Batasan Akademik & Dashboard Statis

1. **Prototipe Statis:** Dashboard ini dibuat untuk keperluan tugas akademik perkuliahan *Kecerdasan Bisnis dan Visualisasi Data*, bukan sistem analitik cloud terintegrasi enterprise secara langsung.
2. **Data Demonstrasi:** Angka KPI, penjualan bulanan, produk, pelanggan, dan negara dihitung dari dataset simulasi berbasis parameter transaksi dataset *UCI Online Retail* (2010–2011) yang konsisten secara matematis. Angka tersebut bukan angka resmi audit keuangan retailer.
3. **Pemisahan Hasil Machine Learning:** Bagian evaluasi algoritma ML mengutip persis hasil empiris yang dipublikasikan pada **Tabel 1 jurnal acuan (Sustainability 2022)**. Dashboard statis ini tidak melatih atau menjalankan inferensi model ML secara *real-time*.
4. **Privasi & Keamanan:** Tidak ada data rahasia pribadi pelanggan (*PII*) yang digunakan, dan dashboard tidak memerlukan otentikasi login, database server, maupun kunci API berbayar.
