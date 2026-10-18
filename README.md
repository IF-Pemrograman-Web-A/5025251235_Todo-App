# E04 — The Iron Citadel: Todo App

**Nama:** Dhanishara Zaschya Putri
**NRP:** 5025251235  
**Mata Kuliah:** Pemrograman Web 
**Tugas:** E04 — The Iron Citadel

---

## 1. Deskripsi Proyek

The Iron Citadel merupakan pengembangan dari Todo App pada praktikum sebelumnya. Aplikasi ini awalnya menggunakan HTML, CSS, JavaScript, dan IndexedDB untuk mengelola daftar tugas secara lokal di browser.

Pada praktikum E04, aplikasi dikembangkan menggunakan PHP dan MySQL agar data Todo dapat disimpan secara persisten di database. Aplikasi juga dilengkapi dengan menu Personal dan Shared untuk membedakan tugas pribadi dan tugas bersama.

Kode HTML dimigrasikan ke PHP dan dibagi menjadi beberapa file agar struktur program lebih modular, terorganisasi, dan mudah dipelihara. Selain itu, aplikasi mendukung operasi CRUD dan upload gambar sebagai implementasi tambahan file handling menggunakan PHP.

## 2. Tujuan Praktikum

Tujuan pengembangan aplikasi ini adalah:

1. Mengimplementasikan menu navigasi Personal dan Shared.
2. Memigrasikan halaman HTML menjadi PHP dengan struktur modular.
3. Membuat database MySQL beserta dummy data dalam file `data.sql`.
4. Mengimplementasikan operasi Create, Read, Update, dan Delete (CRUD) menggunakan PHP.
5. Mengimplementasikan file handling untuk upload dan penyimpanan gambar Todo.
6. Mempertahankan tampilan responsif dan fitur Dark Mode pada aplikasi.

## 3. Fitur Aplikasi

### 3.1. Personal Todo

Menu Personal digunakan untuk mengelola daftar tugas pribadi. Setiap sesi pengguna memperoleh `owner_key` yang digunakan untuk mengidentifikasi tugas pribadi miliknya.

Fitur yang tersedia meliputi:
- Membuat Todo baru.
- Melihat daftar Todo.
- Melihat dan mengubah detail Todo.
- Mengubah status Todo.
- Mengatur waktu notifikasi pada data Todo.
- Menghapus Todo.
- Mengunggah gambar saat membuat Todo.

### 3.2. Shared Todo

Menu Shared digunakan untuk menampilkan daftar tugas bersama yang disimpan dalam database.

Fitur yang tersedia meliputi:
- Menampilkan daftar Todo dengan scope `shared`.
- Membuat Todo bersama.
- Melihat dan mengubah detail Todo bersama.
- Mengubah status Todo.
- Menghapus Todo bersama.

### 3.3. Status Todo

Setiap Todo memiliki status yang menunjukkan perkembangan tugas.

| Status | Keterangan |
|---|---|
| `todo` | Tugas belum dikerjakan. |
| `progress` | Tugas sedang dikerjakan. |
| `done` | Tugas telah selesai. |

### 3.4. Database Persistence

Data Todo disimpan dalam database MySQL sehingga perubahan data tetap tersedia setelah halaman dimuat ulang.

### 3.5. File Handling

Aplikasi menyediakan fitur upload gambar pada proses pembuatan Todo. File gambar disimpan di folder `uploads/`, sedangkan lokasi file disimpan pada kolom `image_path` di database.

Validasi upload mencakup jenis file gambar yang diperbolehkan dan batas ukuran file maksimal 2 MB.

### 3.6. User Interface

Aplikasi menggunakan desain pink aesthetic dengan warna cream, blush pink, dan dusty rose. Tampilan dilengkapi dengan:
- Navigasi Personal dan Shared.
- Panel daftar Todo dan detail Todo.
- Form untuk membuat dan mengubah Todo.
- Dark Mode dengan preferensi tema yang disimpan menggunakan `localStorage`.
- Layout responsif untuk layar yang lebih kecil.

## 4. Teknologi yang Digunakan

| Teknologi | Penggunaan |
|---|---|
| HTML5 | Struktur halaman web. |
| CSS3 | Styling, layout, responsivitas, dan Dark Mode. |
| JavaScript | Interaksi antarmuka dan pengaturan tema. |
| PHP | Pemrosesan data dan implementasi CRUD. |
| MySQL | Penyimpanan data Todo. |
| PDO | Koneksi database dan eksekusi query menggunakan prepared statements. |
| Laragon | Lingkungan server lokal untuk menjalankan PHP dan MySQL. |

## 5. Struktur Folder

```text
E04/
├── index.php
├── config.php
├── menubar.php
├── content.php
├── functions.php
├── script.js
├── style.css
├── data.sql
└── uploads/
```

Keterangan:

| File/Folder | Fungsi |
|---|---|
| `index.php` | Halaman utama, mengambil data dari database, menentukan scope aktif, dan menyusun halaman menggunakan file modular. |
| `config.php` | Mengatur koneksi database menggunakan PDO dan menginisialisasi session pengguna. |
| `menubar.php` | Menampilkan navigasi Personal dan Shared. |
| `content.php` | Menampilkan daftar Todo, detail Todo, serta form Create, Update, dan Delete. |
| `functions.php` | Memproses permintaan POST, operasi CRUD, validasi data, dan upload gambar. |
| `script.js` | Mengatur Dark Mode dan menyimpan preferensi tema pada browser. |
| `style.css` | Mengatur tampilan, warna, komponen, Dark Mode, dan responsivitas. |
| `data.sql` | Berisi pembuatan database, struktur tabel, dan dummy data. |
| `uploads/` | Menyimpan file gambar yang diunggah. |

## 6. Struktur Database

Database yang digunakan bernama `todo_e04`, dengan tabel `todos`.

### 6.1. Skema Tabel `todos`

| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | INT, AUTO_INCREMENT | Primary key setiap Todo. |
| `title` | VARCHAR(255) | Judul Todo. |
| `description` | TEXT | Deskripsi Todo. |
| `status` | ENUM | Status Todo: `todo`, `progress`, atau `done`. |
| `scope` | ENUM | Kategori Todo: `personal` atau `shared`. |
| `owner_key` | VARCHAR(128) | Identitas sesi pemilik Todo pribadi. |
| `image_path` | VARCHAR(255) | Lokasi file gambar yang diunggah. |
| `notification_time` | DATETIME | Waktu notifikasi yang disimpan pada Todo. |
| `created_at` | TIMESTAMP | Waktu pembuatan Todo. |
| `updated_at` | TIMESTAMP | Waktu terakhir Todo diperbarui. |

Kolom `id` menjadi primary key untuk membedakan setiap Todo. Kolom `scope` menentukan apakah Todo termasuk kategori Personal atau Shared, sedangkan `owner_key` digunakan untuk memfilter data pribadi berdasarkan sesi.

### 6.2. Dummy Data

File `data.sql` menyediakan contoh data awal untuk menguji aplikasi. Dummy data mencakup tugas seperti mempelajari HTML, mempelajari CSS, rapat tim, dan menyelesaikan tugas.

Dummy data digunakan untuk membantu pengujian tampilan daftar Todo, detail tugas, dan pemisahan kategori.

## 7. Implementasi CRUD

### 7.1. Create

Pengguna mengisi form pembuatan Todo yang berisi judul, deskripsi, status, waktu notifikasi, dan gambar jika diperlukan.

Data diproses oleh `functions.php`, kemudian disimpan menggunakan query `INSERT` ke tabel `todos`. Setelah berhasil, aplikasi mengarahkan pengguna kembali ke halaman daftar Todo.

### 7.2. Read

`index.php` mengambil data dari database menggunakan query `SELECT`. Data difilter berdasarkan scope yang sedang dipilih.

- Personal: data difilter berdasarkan `scope = 'personal'` dan `owner_key` sesi pengguna.
- Shared: data difilter berdasarkan `scope = 'shared'`.

Todo yang dipilih ditampilkan pada panel detail.

### 7.3. Update

Pengguna dapat mengubah judul, deskripsi, status, dan waktu notifikasi Todo melalui form detail.

Data perubahan diproses oleh `functions.php` dan disimpan menggunakan query `UPDATE`.

### 7.4. Delete

Pengguna dapat menghapus Todo melalui tombol Delete. Aplikasi memproses permintaan menggunakan query `DELETE` berdasarkan ID Todo dan batasan scope atau kepemilikan yang berlaku.

### 7.5. Keamanan Query

Aplikasi menggunakan PDO prepared statements untuk menjalankan query dengan parameter terikat. Pendekatan ini membantu mencegah SQL injection.

Selain itu, nilai yang ditampilkan pada halaman HTML di-escape menggunakan `htmlspecialchars()` untuk membantu mencegah injeksi HTML.

## 8. Modularisasi PHP

Migrasi dari HTML ke PHP dilakukan dengan memisahkan bagian-bagian aplikasi sesuai tanggung jawabnya.

1. `config.php` menangani koneksi database dan session.
2. `menubar.php` menangani navigasi.
3. `content.php` menangani tampilan konten dan form.
4. `functions.php` menangani pemrosesan operasi CRUD.
5. `index.php` menjadi halaman utama yang menggabungkan komponen tersebut.

Dengan modularisasi ini, perubahan pada satu bagian dapat dilakukan tanpa harus menulis ulang keseluruhan halaman.

## 9. File Handling

Fitur file handling menggunakan fungsi PHP untuk menerima dan menyimpan gambar yang diunggah melalui form.

Alur proses upload:

1. Pengguna memilih file gambar pada form Create Todo.
2. Form mengirim data menggunakan metode `POST` dengan `multipart/form-data`.
3. PHP memeriksa status upload, tipe MIME, dan ukuran file.
4. File disimpan di folder `uploads/` menggunakan nama file yang dibuat secara acak.
5. Lokasi file disimpan pada kolom `image_path`.
6. Gambar ditampilkan pada panel detail Todo.

Jenis gambar yang diperbolehkan adalah JPEG, PNG, GIF, dan WebP dengan ukuran maksimal 2 MB.

## 10. Instalasi dan Cara Menjalankan

### 10.1. Persiapan

Pastikan perangkat telah memiliki:
- Laragon.
- PHP yang tersedia melalui Laragon.
- MySQL.
- Browser web.

### 10.2. Menempatkan Proyek

1. Salin folder proyek `E04` ke direktori web Laragon:

   ```text
   C:\laragon\www\E04
   ```

2. Pastikan file PHP, CSS, JavaScript, dan `data.sql` berada pada lokasi yang benar.
3. Pastikan folder `uploads/` tersedia dan dapat ditulisi oleh PHP.

### 10.3. Menyiapkan Database

Jalankan Laragon dan pastikan layanan MySQL aktif.

Buka terminal Laragon, kemudian jalankan:

```bash
mysql -u root < "C:\laragon\www\E04\data.sql"
```

Perintah tersebut mengimpor file SQL yang membuat database, tabel, dan dummy data.

Perintah di atas mengasumsikan MySQL lokal menggunakan akun `root` tanpa password. Jika konfigurasi berbeda, sesuaikan kredensialnya.

### 10.4. Konfigurasi Koneksi

Periksa file `config.php` dan pastikan konfigurasi koneksi database sesuai dengan lingkungan lokal.

Parameter yang digunakan meliputi:
- Host database.
- Nama database: `todo_e04`.
- Username MySQL.
- Password MySQL.

### 10.5. Menjalankan Aplikasi

Buka browser dan akses:

```text
http://localhost/E04/
```

Aplikasi seharusnya menampilkan halaman Todo App dengan menu Personal dan Shared.

## 11. Pengujian Aplikasi

Pengujian dilakukan untuk memastikan setiap fitur utama berjalan sesuai fungsinya.

| No. | Pengujian | Hasil yang Diharapkan |
|---|---|---|
| 1 | Membuka halaman utama | Halaman Todo App ditampilkan. |
| 2 | Memilih Personal | Daftar Todo pribadi ditampilkan sesuai session. |
| 3 | Memilih Shared | Daftar Todo bersama ditampilkan. |
| 4 | Membuat Todo | Data baru tersimpan dan muncul pada daftar. |
| 5 | Membuka detail Todo | Detail Todo yang dipilih ditampilkan. |
| 6 | Mengubah Todo | Perubahan data tersimpan di database. |
| 7 | Menghapus Todo | Data yang dipilih dihapus dari database. |
| 8 | Refresh halaman | Data yang telah tersimpan tetap tersedia. |
| 9 | Mengunggah gambar | Gambar disimpan dan dapat ditampilkan. |
| 10 | Mengaktifkan Dark Mode | Tema halaman berubah dan preferensi tersimpan. |
| 11 | Mengubah ukuran layar | Layout menyesuaikan ukuran layar. |

Hasil pengujian akhir perlu disesuaikan dengan hasil pengujian aktual pada lingkungan lokal.

<img width="1902" height="970" alt="Screenshot 2026-10-18 195603" src="https://github.com/user-attachments/assets/a1fc1728-71ea-41a9-9522-555de148ec22" />

<img width="1897" height="967" alt="Screenshot 2026-10-18 195631" src="https://github.com/user-attachments/assets/8372271a-8551-4d44-b32b-8c7c8359035f" />

<img width="1902" height="971" alt="Screenshot 2026-10-18 195655" src="https://github.com/user-attachments/assets/f3297b08-0c6f-45bb-923b-261aab51e303" />

## 12. Catatan Implementasi

- Identitas Personal menggunakan session dan `owner_key`, bukan sistem autentikasi akun dengan username dan password.
- Menu Shared menggunakan data bersama dalam satu database. Pada implementasi ini, operasi terhadap Todo Shared tidak dibatasi berdasarkan akun pengguna.
- Kolom `notification_time` menyimpan waktu yang dipilih pada form. Penyimpanan waktu tersebut tidak dengan sendirinya menjamin notifikasi otomatis dikirim oleh server.
- Fitur upload gambar diterapkan pada proses Create Todo. Penggantian gambar saat Update dan penghapusan file fisik ketika Todo dihapus belum menjadi bagian dari implementasi ini.
- Folder `uploads/` perlu disertakan saat memindahkan proyek apabila gambar yang sudah diunggah ingin tetap tersedia.

## 13. Kesimpulan

E04 — The Iron Citadel mengembangkan Todo App dari aplikasi berbasis browser menjadi aplikasi web berbasis PHP dan MySQL. Melalui modularisasi PHP, data Todo dapat dikelola menggunakan operasi CRUD dan dikelompokkan ke dalam menu Personal dan Shared.

Implementasi file handling menambahkan kemampuan untuk mengunggah gambar pada Todo, sedangkan CSS dan JavaScript mempertahankan antarmuka responsif serta Dark Mode.

Proyek ini menerapkan konsep dasar pengembangan web sisi server, integrasi database, pemrosesan form, modularisasi kode, dan pengelolaan file menggunakan PHP.
