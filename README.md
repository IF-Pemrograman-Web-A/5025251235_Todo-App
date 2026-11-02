# E05 — The Offline Abyss: Todo App PWA

**Nama:** Dhanishara Zaschya Putri

**NRP:** 5025251235

**Mata Kuliah:** Pemrograman Web A

**Tugas:** E05 — The Offline Abyss

---

## 1. Deskripsi Proyek

The Offline Abyss merupakan pengembangan lanjutan dari Todo App pada praktikum E04 — The Iron Citadel. Aplikasi ini sebelumnya menggunakan PHP dan MySQL untuk mengelola daftar tugas dengan fitur Personal dan Shared Todo.

Pada praktikum E05, aplikasi dikembangkan menjadi Progressive Web App (PWA) agar dapat diakses ketika koneksi internet tidak tersedia dan dapat di-install seperti aplikasi pada umumnya.

Implementasi PWA dilakukan menggunakan Web App Manifest dan Service Worker. Web App Manifest digunakan untuk mendefinisikan identitas aplikasi, sedangkan Service Worker digunakan untuk melakukan caching terhadap app shell dan menyediakan halaman offline sebagai alternatif ketika halaman tidak dapat diakses melalui jaringan.

Aplikasi tetap mempertahankan fitur CRUD, database MySQL, upload gambar, dan Dark Mode dari praktikum sebelumnya.

## 2. Tujuan Praktikum

Tujuan pengembangan aplikasi ini adalah:

1. Mengimplementasikan Web App Manifest sebagai identitas aplikasi PWA.
2. Menyediakan ikon aplikasi dalam ukuran 192 × 192 dan 512 × 512 piksel.
3. Mengimplementasikan Service Worker untuk mengelola caching resource.
4. Melakukan precaching terhadap app shell dan halaman offline.
5. Menerapkan caching strategy sesuai jenis resource.
6. Menyediakan halaman offline ketika koneksi jaringan tidak tersedia.
7. Menambahkan tombol Install agar aplikasi dapat di-install.
8. Menguji kemampuan aplikasi dalam kondisi offline menggunakan Chrome DevTools.

## 3. Fitur Aplikasi

### 3.1. Personal Todo

Menu Personal digunakan untuk mengelola daftar tugas pribadi. Setiap sesi pengguna memperoleh `owner_key` yang digunakan untuk mengidentifikasi tugas pribadi miliknya.

Fitur yang tersedia meliputi:
- Membuat Todo baru.
- Melihat daftar Todo.
- Melihat dan mengubah detail Todo.
- Mengubah status Todo.
- Mengatur waktu notifikasi.
- Menghapus Todo.
- Mengunggah gambar saat membuat Todo.

### 3.2. Shared Todo

Menu Shared digunakan untuk menampilkan dan mengelola daftar tugas bersama yang disimpan dalam database.

Fitur yang tersedia meliputi:
- Menampilkan daftar Todo dengan scope `shared`.
- Membuat Todo bersama.
- Melihat dan mengubah detail Todo bersama.
- Mengubah status Todo.
- Menghapus Todo bersama.

### 3.3. Dark Mode

Aplikasi menyediakan fitur Dark Mode dan Light Mode. Preferensi tema pengguna disimpan menggunakan `localStorage` sehingga pilihan tema tetap tersedia setelah halaman dimuat ulang.

### 3.4. Progressive Web App

Aplikasi dikembangkan menjadi PWA dengan fitur:

- **Web App Manifest:** Menyediakan identitas, nama, ikon, dan konfigurasi tampilan aplikasi.
- **Service Worker:** Mengelola caching resource dan menangani request ketika offline.
- **Precache:** Menyimpan app shell dan halaman offline ketika Service Worker di-install.
- **Offline Fallback:** Menampilkan halaman alternatif ketika halaman tidak dapat diakses melalui jaringan.
- **Install Button:** Menyediakan tombol untuk meng-install Todo App melalui browser.

### 3.5. Offline Support

Aplikasi menggunakan Cache Storage untuk menyimpan resource statis sehingga dapat digunakan kembali tanpa harus mengambilnya dari server.

Resource yang disimpan meliputi:
- `offline.html`
- `style.css`
- `script.js`
- `manifest.json`
- `icon-192.png`
- `icon-512.png`

Dukungan offline pada implementasi ini mencakup app shell dan halaman offline. Operasi CRUD yang membutuhkan PHP dan database MySQL tetap memerlukan server lokal.

## 4. Teknologi yang Digunakan

| Teknologi | Penggunaan |
|---|---|
| HTML5 | Struktur halaman web dan offline page. |
| CSS3 | Styling, layout, responsivitas, dan Dark Mode. |
| JavaScript | Interaksi antarmuka, Dark Mode, registrasi Service Worker, dan Install Button. |
| PHP | Pemrosesan data dan implementasi CRUD. |
| MySQL | Penyimpanan data Todo. |
| PDO | Koneksi database dan prepared statements. |
| Web App Manifest | Konfigurasi identitas dan instalasi aplikasi PWA. |
| Service Worker API | Mengelola caching dan request aplikasi. |
| Cache Storage API | Menyimpan resource aplikasi untuk penggunaan offline. |
| Laragon | Lingkungan server lokal untuk menjalankan PHP dan MySQL. |
| Chrome DevTools | Pengujian Manifest, Service Worker, Cache Storage, dan kondisi offline. |

## 5. Struktur Folder

```text
E05/
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
├── uploads/
├── README.md
├── config.php
├── content.php
├── data.sql
├── functions.php
├── index.php
├── menubar.php
├── script.js
├── style.css
├── manifest.json
├── service-worker.js
└── offline.html
```

### Keterangan File

| File/Folder | Fungsi |
|---|---|
| `index.php` | Halaman utama, mengambil data dari database, dan menyusun halaman aplikasi. |
| `config.php` | Mengatur koneksi database menggunakan PDO dan session pengguna. |
| `menubar.php` | Menampilkan navigasi Personal dan Shared. |
| `content.php` | Menampilkan daftar Todo, detail Todo, serta form CRUD. |
| `functions.php` | Memproses operasi CRUD, validasi data, dan upload gambar. |
| `script.js` | Mengatur Dark Mode, registrasi Service Worker, dan Install Button. |
| `style.css` | Mengatur tampilan, warna, komponen, Dark Mode, dan responsivitas. |
| `data.sql` | Berisi struktur database dan dummy data. |
| `uploads/` | Menyimpan gambar yang diunggah pengguna. |
| `manifest.json` | Menyimpan konfigurasi identitas dan instalasi aplikasi PWA. |
| `service-worker.js` | Mengatur precaching, caching strategy, offline fallback, dan notifikasi. |
| `offline.html` | Menampilkan halaman alternatif ketika aplikasi tidak dapat mengakses halaman melalui jaringan. |
| `icons/` | Menyimpan ikon aplikasi dalam ukuran 192 × 192 dan 512 × 512 piksel. |

## 6. Implementasi Progressive Web App

### 6.1. Web App Manifest

Web App Manifest dibuat menggunakan file `manifest.json` dan dihubungkan dengan halaman utama melalui elemen:

```html
<link rel="manifest" href="manifest.json">
```

Konfigurasi manifest yang digunakan meliputi:

| Properti | Fungsi |
|---|---|
| `name` | Nama lengkap aplikasi, yaitu Todo List. |
| `short_name` | Nama pendek aplikasi, yaitu Todo. |
| `description` | Deskripsi aplikasi. |
| `start_url` | Halaman awal aplikasi ketika dijalankan. |
| `scope` | Menentukan cakupan halaman aplikasi. |
| `display` | Menggunakan mode `standalone`. |
| `background_color` | Warna latar aplikasi. |
| `theme_color` | Warna tema aplikasi. |
| `orientation` | Orientasi tampilan portrait. |
| `icons` | Menentukan ikon aplikasi berukuran 192 × 192 dan 512 × 512 piksel. |

Mode `standalone` digunakan agar aplikasi yang telah di-install dapat ditampilkan seperti aplikasi mandiri tanpa tampilan browser seperti biasanya.

### 6.2. Service Worker Registration

Service Worker didaftarkan melalui JavaScript menggunakan:

```javascript
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js');
}
```

Registrasi dilakukan setelah halaman selesai dimuat.

Service Worker bertugas menangani proses caching dan request resource sehingga aplikasi dapat menyediakan dukungan offline.

### 6.3. Precaching App Shell

Proses precaching dilakukan ketika Service Worker menjalankan event `install`.

Resource yang dimasukkan ke dalam precache didefinisikan melalui array `APP_SHELL`.

File-file tersebut disimpan menggunakan Cache Storage API dengan nama cache:

```javascript
const CACHE_NAME = 'todo-app-v1';
```

Proses penyimpanan menggunakan:

```javascript
caches.open(CACHE_NAME)
    .then(function(cache) {
        return cache.addAll(APP_SHELL);
    });
```

Dengan precaching, resource yang telah disimpan dapat digunakan kembali tanpa mengambilnya dari server.

### 6.4. Caching Strategy

Aplikasi menggunakan dua caching strategy, yaitu:

**1. Network First**

Strategi ini diterapkan pada request navigasi halaman.

Alur proses:
1. Browser mencoba mengambil halaman melalui jaringan.
2. Jika request berhasil, halaman dari server digunakan.
3. Jika request gagal, Service Worker menampilkan `offline.html`.

Strategi ini memungkinkan aplikasi mengutamakan halaman terbaru dari server ketika koneksi tersedia.

**2. Cache First**

Strategi ini diterapkan pada resource statis.

Alur proses:
1. Service Worker memeriksa apakah resource tersedia di Cache Storage.
2. Jika tersedia, resource diambil dari cache.
3. Jika belum tersedia, browser mengambil resource dari jaringan.
4. Jika berhasil diperoleh, resource disimpan ke dalam cache.

Strategi ini mengurangi kebutuhan pengambilan ulang resource statis yang sudah tersimpan.

### 6.5. Cache Versioning

Service Worker menggunakan nama cache `todo-app-v1` sebagai identitas versi cache.

Pada event `activate`, aplikasi memeriksa cache yang tersimpan dan menghapus cache lama dengan prefix `todo-app-` yang tidak sesuai dengan versi aktif.

Proses ini membantu menjaga agar aplikasi tidak menggunakan resource dari versi cache yang sudah tidak digunakan.

### 6.6. Offline Page

File `offline.html` dibuat sebagai halaman alternatif ketika request navigasi gagal karena jaringan tidak tersedia.

Halaman ini memberikan informasi kepada pengguna bahwa koneksi tidak tersedia dan pengguna perlu menghubungkan kembali jaringan untuk mengakses Todo List.

Halaman offline juga dimasukkan ke dalam precache agar dapat ditampilkan ketika browser tidak memiliki koneksi jaringan.

### 6.7. Install Button

Tombol Install ditambahkan pada bagian header aplikasi.

Implementasinya menggunakan event JavaScript:

- `beforeinstallprompt` untuk mendeteksi kesempatan instalasi aplikasi.
- `preventDefault()` untuk menahan prompt instalasi otomatis browser.
- `prompt()` untuk menampilkan dialog instalasi melalui tombol Install App.
- `appinstalled` untuk mendeteksi ketika aplikasi berhasil di-install.

Tombol Install disembunyikan secara default dan ditampilkan ketika browser menyediakan event `beforeinstallprompt`.

## 7. Instalasi dan Cara Menjalankan

### 7.1. Persiapan

Pastikan perangkat telah memiliki:

- Laragon.
- PHP melalui Laragon.
- MySQL.
- Browser Google Chrome.

### 7.2. Menempatkan Proyek

Salin folder proyek E05 ke direktori web Laragon:

```text
C:\laragon\www\E05
```

Pastikan seluruh file proyek dan folder pendukung tersedia pada lokasi tersebut.

### 7.3. Menyiapkan Database

Jalankan Laragon dan pastikan layanan MySQL aktif.

Database yang digunakan tetap mengikuti konfigurasi proyek E04, yaitu `todo_e04`.

Jika database belum tersedia, impor file `data.sql` menggunakan terminal Laragon:

```bash
mysql -u root < "C:\laragon\www\E05\data.sql"
```

Perintah tersebut mengasumsikan MySQL lokal menggunakan akun `root` tanpa password. Sesuaikan apabila konfigurasi berbeda.

### 7.4. Konfigurasi Koneksi

Periksa file `config.php` dan pastikan konfigurasi koneksi database sesuai dengan lingkungan lokal.

Parameter yang digunakan meliputi:
- Host database.
- Nama database: `todo_e04`.
- Username MySQL.
- Password MySQL.

### 7.5. Menjalankan Aplikasi

Jalankan Apache dan MySQL melalui Laragon.

Kemudian buka browser dan akses:

```text
http://localhost/E05/
```

Aplikasi akan menampilkan Todo App dengan menu Personal dan Shared.

### 7.6. Meng-install Aplikasi

Setelah aplikasi memenuhi persyaratan instalasi browser:

1. Buka aplikasi melalui browser.
2. Tunggu hingga tombol Install App tersedia.
3. Klik tombol Install App.
4. Ikuti dialog instalasi yang ditampilkan browser.

## 8. Pengujian Progressive Web App

Pengujian dilakukan menggunakan Google Chrome DevTools melalui tab Application dan Network.

### 8.1. Pengujian Manifest

Manifest diperiksa melalui:

`DevTools → Application → Manifest`

Pengujian bertujuan memastikan:
- Nama aplikasi terbaca dengan benar.
- Ikon aplikasi terdeteksi.
- Konfigurasi start URL terbaca.
- Display mode menggunakan `standalone`.

**Bukti Pengujian:**

`[Masukkan screenshot Application → Manifest]`

### 8.2. Pengujian Service Worker

Service Worker diperiksa melalui:

`DevTools → Application → Service Workers`

Pengujian bertujuan memastikan:
- Service Worker berhasil didaftarkan.
- Service Worker berhasil di-install dan diaktifkan.
- Status menunjukkan `activated and running`.

**Bukti Pengujian:**

`[Masukkan screenshot Service Workers]`

### 8.3. Pengujian Cache Storage

Cache diperiksa melalui:

`DevTools → Application → Cache Storage`

Pengujian bertujuan memastikan:
- Cache `todo-app-v1` berhasil dibuat.
- Resource app shell tersimpan.
- Halaman offline tersedia dalam cache.

**Bukti Pengujian:**

`[Masukkan screenshot Cache Storage]`

### 8.4. Pengujian Offline

Pengujian dilakukan melalui:

`DevTools → Network → Offline`

Langkah pengujian:
1. Buka aplikasi dalam kondisi online.
2. Pastikan Service Worker telah aktif dan resource sudah tersimpan dalam cache.
3. Ubah kondisi jaringan menjadi Offline.
4. Coba akses kembali halaman aplikasi.
5. Periksa apakah halaman offline ditampilkan ketika request navigasi gagal.

**Hasil yang diharapkan:**

Aplikasi dapat menyediakan halaman offline tanpa mengambilnya kembali dari server.

**Bukti Pengujian:**

`[Masukkan screenshot offline.html ketika Network dalam kondisi Offline]`

### 8.5. Pengujian Install Button

Pengujian dilakukan untuk memastikan tombol Install App dapat digunakan ketika browser menyediakan event `beforeinstallprompt`.

**Hasil yang diharapkan:**

Dialog instalasi aplikasi dapat ditampilkan melalui tombol Install App.

**Bukti Pengujian:**

`[Masukkan screenshot proses instalasi atau aplikasi yang telah ter-install]`

## 9. Catatan Implementasi

- Aplikasi E05 merupakan pengembangan dari kode proyek E04 sehingga fitur Personal, Shared, CRUD, upload gambar, dan Dark Mode tetap dipertahankan.
- Data Todo tetap disimpan menggunakan database MySQL.
- Cache Storage digunakan untuk menyimpan resource statis dan halaman offline.
- Caching app shell tidak berarti seluruh data Todo tersimpan secara offline.
- Operasi CRUD yang membutuhkan pemrosesan PHP dan database MySQL tetap memerlukan server lokal.
- Offline fallback digunakan ketika request navigasi gagal, bukan sebagai pengganti seluruh fungsi backend aplikasi.
- Tombol Install bergantung pada dukungan browser dan terpenuhinya persyaratan instalasi PWA.
- Aplikasi dijalankan melalui `localhost` menggunakan Laragon agar Service Worker dapat digunakan dalam lingkungan secure context.

## 10. Kesimpulan

E05 — The Offline Abyss mengembangkan Todo App dari praktikum E04 menjadi Progressive Web App dengan menambahkan kemampuan caching dan instalasi aplikasi.

Implementasi Web App Manifest menyediakan identitas aplikasi, sedangkan Service Worker digunakan untuk melakukan precaching app shell, mengatur caching strategy, dan menyediakan offline fallback.

Selain itu, tombol Install memungkinkan pengguna memasang aplikasi melalui browser.

Melalui pengembangan ini, aplikasi tidak hanya dapat digunakan melalui browser ketika terhubung dengan server, tetapi juga mampu menyediakan resource utama dan halaman offline ketika koneksi jaringan tidak tersedia.