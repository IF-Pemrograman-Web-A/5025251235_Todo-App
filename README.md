# E06 — The Endpoint of Portals: Todo App REST API

**Nama:** Dhanishara Zaschya Putri

**NRP:** 5025251235

**Mata Kuliah:** Pemrograman Web A

**Tugas:** E06 — The Endpoint of Portals

---

## 1. Deskripsi Proyek

The Endpoint of Portals merupakan pengembangan lanjutan dari Todo App pada praktikum E05 — The Offline Abyss. Pada praktikum sebelumnya, operasi CRUD diproses melalui form HTML yang dikirim ke `functions.php`, kemudian halaman dimuat ulang menggunakan redirect.

Pada praktikum E06, backend CRUD dimigrasikan menjadi REST API yang menggunakan HTTP method yang sesuai (GET, POST, PUT/PATCH, dan DELETE), mengembalikan response dalam format JSON, serta menggunakan HTTP status code yang tepat untuk setiap kondisi, baik berhasil maupun gagal. Akses ke API dilindungi menggunakan API Key.

Antarmuka aplikasi juga disesuaikan agar tidak lagi mengirim form secara langsung, melainkan memanggil REST API menggunakan `fetch` sehingga operasi Create, Update, dan Delete dapat dilakukan tanpa memuat ulang halaman.

Aplikasi tetap mempertahankan fitur Personal Todo, Shared Todo, upload gambar, Dark Mode, dan Progressive Web App dari praktikum sebelumnya.

## 2. Tujuan Praktikum

Tujuan pengembangan aplikasi ini adalah:

1. Memigrasikan backend CRUD menjadi REST API dengan HTTP method yang benar (GET, POST, PUT/PATCH, dan DELETE).
2. Mengimplementasikan response code yang benar untuk setiap endpoint ketika proses berhasil.
3. Mengimplementasikan response code yang sesuai ketika terjadi kesalahan, seperti data tidak valid dan Todo tidak ditemukan.
4. Mengimplementasikan autentikasi menggunakan API Key.
5. Menghubungkan antarmuka aplikasi dengan REST API menggunakan `fetch`.
6. Menyesuaikan Service Worker agar data dari API tidak tersimpan di cache.
7. Menguji seluruh endpoint menggunakan Postman atau curl.

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

Fitur PWA dari praktikum E05 tetap dipertahankan, yaitu Web App Manifest, Service Worker, precache app shell, offline fallback, dan tombol Install App. Pada E06, Service Worker disesuaikan agar request ke REST API tidak ikut di-cache (lihat bagian 8).

### 3.5. REST API

REST API disediakan pada endpoint `api/todos.php` dengan fitur:

- **CRUD lengkap:** GET (daftar dan detail), POST, PUT, PATCH, dan DELETE.
- **Response JSON:** Seluruh response menggunakan format JSON, kecuali status `204 No Content`.
- **Status code sukses:** `200 OK`, `201 Created`, dan `204 No Content`.
- **Status code error:** `400`, `401`, `403`, `404`, `405`, `413`, `415`, `422`, dan `500`.
- **Validasi data:** Title, status, scope, ID, dan format waktu notifikasi divalidasi sebelum diproses.
- **Autentikasi:** Setiap request wajib menyertakan API Key pada header `X-API-Key`.
- **Scope:** Mendukung Todo `personal` dan `shared`.

## 4. Teknologi yang Digunakan

| Teknologi | Penggunaan |
|---|---|
| HTML5 | Struktur halaman web dan offline page. |
| CSS3 | Styling, layout, responsivitas, dan Dark Mode. |
| JavaScript | Interaksi antarmuka, pemanggilan REST API menggunakan `fetch`, Dark Mode, registrasi Service Worker, dan Install Button. |
| PHP | Implementasi REST API, validasi data, dan autentikasi API Key. |
| MySQL | Penyimpanan data Todo. |
| PDO | Koneksi database dan prepared statements. |
| JSON | Format request dan response REST API. |
| Web App Manifest | Konfigurasi identitas dan instalasi aplikasi PWA. |
| Service Worker API | Mengelola caching dan request aplikasi. |
| Cache Storage API | Menyimpan resource aplikasi untuk penggunaan offline. |
| Laragon | Lingkungan server lokal untuk menjalankan PHP dan MySQL. |
| Postman / curl | Pengujian endpoint REST API. |
| Chrome DevTools | Pengujian request `fetch`, Service Worker, dan Cache Storage. |

## 5. Struktur Folder

```text
E06/
├── api/
│   └── todos.php
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
| `api/todos.php` | Endpoint REST API untuk operasi CRUD, validasi data, dan autentikasi API Key. |
| `index.php` | Halaman utama; menyiapkan konfigurasi awal (scope, ID terpilih, API Key) untuk `script.js`. |
| `config.php` | Mengatur koneksi database menggunakan PDO, session pengguna, dan konstanta `API_KEY`. |
| `menubar.php` | Menampilkan navigasi Personal dan Shared. |
| `content.php` | Menyediakan kerangka daftar Todo, detail Todo, dan form yang diisi melalui `script.js`. |
| `script.js` | Memanggil REST API menggunakan `fetch`, mengatur tampilan, Dark Mode, registrasi Service Worker, dan Install Button. |
| `functions.php` | Handler form dari E05. Tidak lagi digunakan oleh antarmuka E06 karena digantikan oleh REST API. |
| `style.css` | Mengatur tampilan, warna, komponen, Dark Mode, dan responsivitas. |
| `data.sql` | Berisi struktur database dan dummy data. |
| `uploads/` | Menyimpan gambar yang diunggah pengguna. |
| `manifest.json` | Menyimpan konfigurasi identitas dan instalasi aplikasi PWA. |
| `service-worker.js` | Mengatur precaching, caching strategy, offline fallback, dan pengecualian request API. |
| `offline.html` | Menampilkan halaman alternatif ketika halaman tidak dapat diakses melalui jaringan. |
| `icons/` | Menyimpan ikon aplikasi dalam ukuran 192 × 192 dan 512 × 512 piksel. |

## 6. Implementasi REST API

### 6.1. Daftar Endpoint

Base URL:

```text
http://localhost/E06/api/todos.php
```

| Method | Endpoint | Fungsi | Status Sukses |
|---|---|---|---|
| GET | `/api/todos.php?scope={scope}` | Mengambil seluruh Todo | `200 OK` |
| GET | `/api/todos.php?scope={scope}&id={id}` | Mengambil detail satu Todo | `200 OK` |
| POST | `/api/todos.php?scope={scope}` | Membuat Todo baru | `201 Created` |
| PUT | `/api/todos.php?scope={scope}&id={id}` | Mengganti seluruh data Todo | `200 OK` |
| PATCH | `/api/todos.php?scope={scope}&id={id}` | Mengubah sebagian data Todo | `200 OK` |
| DELETE | `/api/todos.php?scope={scope}&id={id}` | Menghapus Todo | `204 No Content` |

### 6.2. Parameter

**Query string**

| Parameter | Keterangan |
|---|---|
| `scope` | `personal` atau `shared`. Nilai bawaan: `personal`. |
| `id` | ID Todo (bilangan bulat positif). Wajib untuk PUT, PATCH, dan DELETE. |

**Body (JSON atau form-data untuk POST)**

| Field | Tipe | Keterangan |
|---|---|---|
| `title` | string | Wajib pada POST dan PUT. Tidak boleh kosong, maksimal 255 karakter. |
| `description` | string | Opsional. Bawaan: string kosong. |
| `status` | string | `todo`, `progress`, atau `done`. Bawaan: `todo`. |
| `notification_time` | string | Opsional. Format `YYYY-MM-DDTHH:MM` atau `YYYY-MM-DD HH:MM:SS`. |
| `image` | file | Opsional, hanya pada POST (`multipart/form-data`). Format jpg, png, gif, atau webp, maksimal 2 MB. |

### 6.3. Perbedaan PUT dan PATCH

- **PUT** mengganti seluruh data Todo. Field `title` wajib dikirim, sedangkan field lain yang tidak dikirim akan menggunakan nilai bawaan.
- **PATCH** hanya mengubah field yang dikirim. Field yang tidak dikirim tidak berubah.

### 6.4. Response Code Sukses

| Status | Digunakan Pada | Keterangan |
|---|---|---|
| `200 OK` | GET, PUT, PATCH | Request berhasil dan data dikembalikan. |
| `201 Created` | POST | Todo berhasil dibuat. Header `Location` berisi alamat Todo baru. |
| `204 No Content` | DELETE | Todo berhasil dihapus dan tidak ada body response. |

### 6.5. Response Code Error

| Status | Kondisi |
|---|---|
| `400 Bad Request` | ID tidak valid, scope tidak valid, ID tidak dikirim pada PUT/PATCH/DELETE, body kosong, atau JSON tidak valid. |
| `401 Unauthorized` | Header `X-API-Key` tidak dikirim. |
| `403 Forbidden` | API Key salah. |
| `404 Not Found` | Todo tidak ditemukan (atau bukan milik pengguna pada scope personal). |
| `405 Method Not Allowed` | HTTP method tidak didukung. Header `Allow` berisi daftar method yang diizinkan. |
| `413 Payload Too Large` | Ukuran gambar melebihi 2 MB. |
| `415 Unsupported Media Type` | PUT/PATCH tidak menggunakan `Content-Type: application/json`. |
| `422 Unprocessable Entity` | Data tidak lolos validasi (misalnya title kosong, status tidak valid, format waktu salah, atau tipe gambar tidak didukung). |
| `500 Internal Server Error` | Terjadi kesalahan pada database. |

Perbedaan `400` dan `422`: `400` digunakan ketika request itu sendiri rusak atau tidak dapat dibaca (misalnya JSON tidak valid atau ID bukan angka), sedangkan `422` digunakan ketika request dapat dibaca tetapi isi datanya tidak memenuhi aturan validasi.

### 6.6. Autentikasi API Key

Setiap request wajib menyertakan header:

```text
X-API-Key: <API_KEY>
```

API Key didefinisikan pada `config.php`:

```php
define('API_KEY', 'isi-dengan-api-key');
```

Alur autentikasi pada `api/todos.php`:
1. Server memeriksa apakah HTTP method didukung. Jika tidak, server mengembalikan `405`.
2. Server memeriksa header `X-API-Key`. Jika tidak ada, server mengembalikan `401` beserta header `WWW-Authenticate`.
3. Server membandingkan API Key menggunakan `hash_equals()` untuk menghindari timing attack. Jika tidak cocok, server mengembalikan `403`.
4. Jika valid, request diproses.

### 6.7. Contoh Request dan Response

**GET — daftar Todo**

```http
GET /E06/api/todos.php?scope=shared HTTP/1.1
X-API-Key: <API_KEY>
```

```json
{
    "success": true,
    "data": [
        {
            "id": 4,
            "title": "Finish Assignment",
            "description": "Complete the web programming task",
            "status": "todo",
            "scope": "shared",
            "owner_key": "team",
            "image_path": null,
            "notification_time": null,
            "created_at": "2026-11-15 20:00:00",
            "updated_at": "2026-11-15 20:00:00"
        }
    ]
}
```

**POST — membuat Todo (`201 Created`)**

```http
POST /E06/api/todos.php?scope=shared HTTP/1.1
X-API-Key: <API_KEY>
Content-Type: application/json

{
    "title": "Belajar REST",
    "description": "Mengerjakan tugas E06",
    "status": "progress",
    "notification_time": "2026-11-20T10:00"
}
```

```json
{
    "success": true,
    "message": "Todo created",
    "data": {
        "id": 5,
        "title": "Belajar REST",
        "description": "Mengerjakan tugas E06",
        "status": "progress",
        "scope": "shared",
        "image_path": null,
        "notification_time": "2026-11-20 10:00:00"
    }
}
```

**PATCH — mengubah sebagian data (`200 OK`)**

```http
PATCH /E06/api/todos.php?scope=shared&id=5 HTTP/1.1
X-API-Key: <API_KEY>
Content-Type: application/json

{
    "status": "done"
}
```

**DELETE — menghapus Todo (`204 No Content`)**

```http
DELETE /E06/api/todos.php?scope=shared&id=5 HTTP/1.1
X-API-Key: <API_KEY>
```

**Contoh response error (`422 Unprocessable Entity`)**

```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "title": "Title is required"
    }
}
```

**Contoh response error lainnya**

```json
{ "success": false, "message": "API key is required" }
```

```json
{ "success": false, "message": "Todo not found" }
```

## 7. Integrasi Antarmuka dengan REST API

Antarmuka tidak lagi mengirim form ke `functions.php`. Seluruh operasi dilakukan oleh `script.js` menggunakan `fetch`:

| Aksi di Antarmuka | Request API |
|---|---|
| Membuka halaman / berpindah scope | `GET /api/todos.php?scope={scope}` |
| Klik Create Todo | `POST /api/todos.php?scope={scope}` (`multipart/form-data` agar gambar dapat diunggah) |
| Klik Save Changes | `PUT /api/todos.php?scope={scope}&id={id}` (JSON) |
| Klik Delete | `DELETE /api/todos.php?scope={scope}&id={id}` |

Cara kerja:

- `index.php` menyisipkan konfigurasi awal (`scope`, `selectedId`, dan `apiKey`) ke objek `window.TODO_APP`.
- Fungsi `apiRequest()` pada `script.js` menambahkan header `X-API-Key`, mengirim cookie session (`credentials: 'same-origin'`), dan menangani response JSON maupun `204`.
- Daftar Todo dibuat menggunakan DOM (`textContent`) sehingga data dari server tidak diproses sebagai HTML.
- Pesan keberhasilan dan pesan error dari API (termasuk detail validasi `422`) ditampilkan kepada pengguna.
- Ketika server tidak dapat dihubungi, aplikasi menampilkan pesan bahwa koneksi ke server gagal.
- Jika Todo yang sedang diubah ternyata sudah tidak ada (`404`), daftar Todo dimuat ulang.
- Form HTML tidak dapat mengirim method PUT dan DELETE, sehingga penggunaan `fetch` juga diperlukan untuk menerapkan method yang benar.

## 8. Penyesuaian Progressive Web App

Service Worker dari E05 menggunakan strategi Cache First untuk seluruh request GET. Jika tidak diubah, respons `GET /api/todos.php` akan tersimpan di cache sehingga data Todo yang ditampilkan dapat tertinggal dari data di database.

Penyesuaian yang dilakukan:

1. Request yang path-nya mengandung `/api/` tidak ditangani Service Worker dan selalu menuju jaringan:

```javascript
if (url.pathname.includes('/api/')) {
    return;
}
```

2. Nama cache dinaikkan dari `todo-app-v1` menjadi `todo-app-v2`:

```javascript
const CACHE_NAME = 'todo-app-v2';
```

Karena `script.js` diambil menggunakan strategi Cache First, perubahan versi cache diperlukan agar browser tidak terus menggunakan `script.js` versi lama. Event `activate` akan menghapus cache `todo-app-v1`.

Strategi lainnya tidak berubah: Network First untuk navigasi halaman dan Cache First untuk resource statis.

## 9. Instalasi dan Cara Menjalankan

### 9.1. Persiapan

Pastikan perangkat telah memiliki:

- Laragon.
- PHP melalui Laragon.
- MySQL.
- Browser Google Chrome.
- Postman (atau curl) untuk pengujian API.

### 9.2. Menempatkan Proyek

Salin folder proyek E06 ke direktori web Laragon:

```text
C:\laragon\www\E06
```

Pastikan seluruh file proyek, termasuk folder `api/`, `icons/`, dan `uploads/`, tersedia pada lokasi tersebut.

### 9.3. Menyiapkan Database

Jalankan Laragon dan pastikan layanan MySQL aktif.

Database yang digunakan tetap mengikuti konfigurasi proyek sebelumnya, yaitu `todo_e04`.

Jika database belum tersedia, impor file `data.sql` menggunakan terminal Laragon:

```bash
mysql -u root < "C:\laragon\www\E06\data.sql"
```

Perintah tersebut mengasumsikan MySQL lokal menggunakan akun `root` tanpa password. Sesuaikan apabila konfigurasi berbeda.

### 9.4. Konfigurasi Koneksi dan API Key

Periksa file `config.php` dan pastikan:

- Host database, nama database (`todo_e04`), username, dan password sesuai dengan lingkungan lokal.
- Konstanta `API_KEY` tersedia:

```php
define('API_KEY', 'isi-dengan-api-key');
```

### 9.5. Menjalankan Aplikasi

Jalankan Apache dan MySQL melalui Laragon.

Kemudian buka browser dan akses:

```text
http://localhost/E06/
```

Setelah Service Worker versi baru terpasang, lakukan hard refresh (`Ctrl + Shift + R`). Jika tampilan masih menggunakan versi lama, buka `DevTools → Application → Service Workers`, klik Unregister, lalu muat ulang halaman.

## 10. Pengujian

Pengujian REST API dilakukan menggunakan Postman. Pengujian antarmuka dan PWA dilakukan menggunakan Google Chrome DevTools.

### 10.1. Persiapan Pengujian di Postman

1. Buat request baru dan isi URL, misalnya `http://localhost/E06/api/todos.php?scope=shared`.
2. Pada tab **Headers**, tambahkan `X-API-Key` dengan nilai API Key dari `config.php`.
3. Untuk request yang mengirim data, pilih tab **Body → raw → JSON**, lalu isi data JSON.
4. Klik **Send** dan periksa **Status** serta **Body** pada bagian response.

Catatan: Todo dengan `scope=personal` terikat pada session (`owner_key`) sehingga Postman harus menyimpan cookie (pengaturan bawaan Postman). Pengujian pada dokumen ini menggunakan `scope=shared` agar tidak bergantung pada cookie.

### 10.2. Pengujian Response Sukses

#### 10.2.1. GET — Daftar Todo (200 OK)

Request: `GET /api/todos.php?scope=shared`

**Hasil yang diharapkan:** Status `200 OK` dan body berisi `success: true` serta array `data`.

**Bukti Pengujian:**

`[Masukkan screenshot Postman GET daftar Todo]`

#### 10.2.2. GET — Detail Todo (200 OK)

Request: `GET /api/todos.php?scope=shared&id=1`

**Hasil yang diharapkan:** Status `200 OK` dan body berisi data satu Todo.

**Bukti Pengujian:**

`[Masukkan screenshot Postman GET detail Todo]`

#### 10.2.3. POST — Membuat Todo (201 Created)

Request: `POST /api/todos.php?scope=shared` dengan body JSON:

```json
{
    "title": "Belajar REST",
    "description": "Mengerjakan tugas E06",
    "status": "progress"
}
```

**Hasil yang diharapkan:** Status `201 Created`, header `Location` berisi alamat Todo baru, dan body berisi data Todo yang dibuat.

**Bukti Pengujian:**

`[Masukkan screenshot Postman POST (status 201 dan body)]`

`[Masukkan screenshot tab Headers pada response yang menampilkan header Location]`

#### 10.2.4. PUT — Mengganti Data Todo (200 OK)

Request: `PUT /api/todos.php?scope=shared&id={id Todo baru}` dengan body JSON:

```json
{
    "title": "Belajar REST (revisi)",
    "description": "Sudah diperbarui",
    "status": "todo"
}
```

**Hasil yang diharapkan:** Status `200 OK` dan body berisi data Todo yang telah diperbarui.

**Bukti Pengujian:**

`[Masukkan screenshot Postman PUT]`

#### 10.2.5. PATCH — Mengubah Sebagian Data Todo (200 OK)

Request: `PATCH /api/todos.php?scope=shared&id={id Todo baru}` dengan body JSON:

```json
{
    "status": "done"
}
```

**Hasil yang diharapkan:** Status `200 OK`; hanya `status` yang berubah, sedangkan field lain tetap.

**Bukti Pengujian:**

`[Masukkan screenshot Postman PATCH]`

#### 10.2.6. DELETE — Menghapus Todo (204 No Content)

Request: `DELETE /api/todos.php?scope=shared&id={id Todo baru}`

**Hasil yang diharapkan:** Status `204 No Content` dan body kosong.

**Bukti Pengujian:**

`[Masukkan screenshot Postman DELETE (status 204)]`

### 10.3. Pengujian Response Error

#### 10.3.1. 400 — ID Tidak Valid

Request: `GET /api/todos.php?scope=shared&id=abc`

**Hasil yang diharapkan:** Status `400 Bad Request` dengan pesan `Invalid Todo ID`.

**Bukti Pengujian:**

`[Masukkan screenshot Postman 400 ID tidak valid]`

#### 10.3.2. 400 — Scope Tidak Valid

Request: `GET /api/todos.php?scope=abc`

**Hasil yang diharapkan:** Status `400 Bad Request` dengan pesan `Invalid scope`.

**Bukti Pengujian:**

`[Masukkan screenshot Postman 400 scope tidak valid]`

#### 10.3.3. 400 — JSON Tidak Valid

Request: `POST /api/todos.php?scope=shared` dengan `Content-Type: application/json` dan body yang rusak, misalnya `{"title": `.

**Hasil yang diharapkan:** Status `400 Bad Request` dengan pesan `Invalid JSON body`.

**Bukti Pengujian:**

`[Masukkan screenshot Postman 400 JSON tidak valid]`

#### 10.3.4. 404 — Todo Tidak Ditemukan

Request: `GET /api/todos.php?scope=shared&id=99999`

**Hasil yang diharapkan:** Status `404 Not Found` dengan pesan `Todo not found`.

**Bukti Pengujian:**

`[Masukkan screenshot Postman 404]`

#### 10.3.5. 405 — Method Tidak Didukung

Request: `OPTIONS /api/todos.php?scope=shared`

**Hasil yang diharapkan:** Status `405 Method Not Allowed` dan header `Allow` berisi `GET, POST, PUT, PATCH, DELETE`.

**Bukti Pengujian:**

`[Masukkan screenshot Postman 405 beserta header Allow]`

#### 10.3.6. 415 — Content-Type Bukan JSON

Request: `PUT /api/todos.php?scope=shared&id=1` dengan body bertipe **raw → Text** (`Content-Type: text/plain`).

**Hasil yang diharapkan:** Status `415 Unsupported Media Type`.

**Bukti Pengujian:**

`[Masukkan screenshot Postman 415]`

#### 10.3.7. 422 — Validasi Gagal (Title Kosong)

Request: `POST /api/todos.php?scope=shared` dengan body JSON:

```json
{
    "title": "",
    "status": "todo"
}
```

**Hasil yang diharapkan:** Status `422 Unprocessable Entity` dan body berisi detail kesalahan pada `errors.title`.

**Bukti Pengujian:**

`[Masukkan screenshot Postman 422 title kosong]`

#### 10.3.8. 422 — Validasi Gagal (Status Tidak Valid)

Request: `POST /api/todos.php?scope=shared` dengan body JSON:

```json
{
    "title": "Tes status",
    "status": "selesai"
}
```

**Hasil yang diharapkan:** Status `422 Unprocessable Entity` dan body berisi detail kesalahan pada `errors.status`.

**Bukti Pengujian:**

`[Masukkan screenshot Postman 422 status tidak valid]`

### 10.4. Pengujian Autentikasi API Key

#### 10.4.1. 401 — API Key Tidak Dikirim

Request: `GET /api/todos.php?scope=shared` **tanpa** header `X-API-Key`.

**Hasil yang diharapkan:** Status `401 Unauthorized` dengan pesan `API key is required`.

**Bukti Pengujian:**

`[Masukkan screenshot Postman 401]`

#### 10.4.2. 403 — API Key Salah

Request: `GET /api/todos.php?scope=shared` dengan `X-API-Key` yang salah.

**Hasil yang diharapkan:** Status `403 Forbidden` dengan pesan `Invalid API key`.

**Bukti Pengujian:**

`[Masukkan screenshot Postman 403]`

### 10.5. Pengujian Antarmuka

Pengujian dilakukan melalui `http://localhost/E06/` dengan `DevTools → Network → Fetch/XHR` terbuka.

#### 10.5.1. Memuat Daftar Todo

**Hasil yang diharapkan:** Daftar Todo tampil dan terdapat request `GET api/todos.php` dengan status `200`.

**Bukti Pengujian:**

`[Masukkan screenshot halaman aplikasi beserta tab Network yang menampilkan request GET]`

#### 10.5.2. Membuat Todo

**Hasil yang diharapkan:** Todo baru muncul di daftar tanpa reload halaman, pesan sukses ditampilkan, dan terdapat request `POST` dengan status `201`.

**Bukti Pengujian:**

`[Masukkan screenshot aplikasi setelah Create beserta request POST di tab Network]`

#### 10.5.3. Mengubah Todo

**Hasil yang diharapkan:** Perubahan tampil di daftar dan detail, pesan sukses ditampilkan, dan terdapat request `PUT` dengan status `200`.

**Bukti Pengujian:**

`[Masukkan screenshot aplikasi setelah Save Changes beserta request PUT di tab Network]`

#### 10.5.4. Menghapus Todo

**Hasil yang diharapkan:** Todo hilang dari daftar tanpa reload halaman, pesan sukses ditampilkan, dan terdapat request `DELETE` dengan status `204`.

**Bukti Pengujian:**

`[Masukkan screenshot aplikasi setelah Delete beserta request DELETE di tab Network]`

#### 10.5.5. Menampilkan Pesan Error dari API

Pengujian dilakukan dengan mengisi title hanya dengan spasi pada form Create atau Save Changes.

**Hasil yang diharapkan:** Pesan error dari API (response `422`) ditampilkan pada antarmuka.

**Bukti Pengujian:**

`[Masukkan screenshot pesan error pada antarmuka]`

### 10.6. Pengujian Service Worker dan Cache

#### 10.6.1. Cache Storage

Cache diperiksa melalui:

`DevTools → Application → Cache Storage`

**Hasil yang diharapkan:** Cache `todo-app-v2` tersedia dan cache `todo-app-v1` sudah dihapus.

**Bukti Pengujian:**

`[Masukkan screenshot Cache Storage]`

#### 10.6.2. Request API Tidak Di-cache

Pengujian dilakukan melalui `DevTools → Network`, lalu memeriksa request `todos.php`.

**Hasil yang diharapkan:** Request `api/todos.php` tidak memiliki keterangan `(ServiceWorker)` pada kolom Size, dan resource `api/todos.php` tidak ditemukan pada Cache Storage.

**Bukti Pengujian:**

`[Masukkan screenshot tab Network yang menampilkan request api/todos.php]`

## 11. Catatan Implementasi

- Aplikasi E06 merupakan pengembangan dari kode proyek E05 sehingga fitur Personal, Shared, upload gambar, Dark Mode, dan PWA tetap dipertahankan.
- ID Todo dikirim melalui query string (`?id=`), sedangkan data Todo dikirim melalui body request.
- Upload gambar hanya tersedia pada POST (`multipart/form-data`). PUT dan PATCH hanya menerima JSON sehingga gambar tidak dapat diganti melalui kedua method tersebut.
- Response `204 No Content` pada DELETE tidak memiliki body sesuai ketentuan HTTP.
- Todo dengan scope personal dibatasi berdasarkan `owner_key` pada session. Request ke Todo milik session lain menghasilkan `404`.
- Ketika Todo dihapus, file gambar yang terkait ikut dihapus dari folder `uploads/`.
- Untuk menjalankan operasi CRUD, aplikasi tetap memerlukan server lokal (PHP dan MySQL) karena dukungan offline hanya mencakup app shell dan halaman offline.
- **Keterbatasan:** Karena antarmuka dijalankan di browser, API Key disisipkan ke halaman (`window.TODO_APP`) dan dapat dilihat oleh siapa pun yang membuka halaman tersebut. Pendekatan ini cukup untuk keperluan praktikum, tetapi pada aplikasi sesungguhnya sebaiknya digunakan login dengan token per pengguna (misalnya JWT atau OAuth2).
- Aplikasi dijalankan melalui `localhost` menggunakan Laragon agar Service Worker dapat digunakan dalam lingkungan secure context.

## 12. Kesimpulan

E06 — The Endpoint of Portals mengembangkan Todo App dari praktikum E05 dengan memigrasikan backend CRUD menjadi REST API.

Endpoint `api/todos.php` menerapkan method GET, POST, PUT, PATCH, dan DELETE dengan format response JSON. Setiap endpoint mengembalikan status code yang sesuai, yaitu `200`, `201`, dan `204` ketika berhasil, serta `400`, `401`, `403`, `404`, `405`, `413`, `415`, `422`, dan `500` ketika terjadi kesalahan. Akses ke API dilindungi menggunakan API Key.

Antarmuka aplikasi telah disesuaikan untuk memanggil REST API menggunakan `fetch`, dan Service Worker diperbarui agar data dari API tidak tersimpan di cache. Dengan demikian, aplikasi tidak hanya mempertahankan fitur dari praktikum sebelumnya, tetapi juga memiliki backend yang terstruktur dan dapat digunakan oleh klien lain di luar antarmuka web ini.