# [E03] The Lost Cavern — Todo List

**Nama:** Dhanishara Zaschya  
**NRP:** 5025251235  
**Mata Kuliah:** Pemrograman Web  
**Kelas:** PWEB A

---

# 1. Deskripsi

Pada tugas E03 **The Lost Cavern**, aplikasi Todo List dikembangkan dengan beberapa fitur web modern agar data dapat tersimpan secara lokal, preferensi pengguna dapat dipertahankan, pengguna dapat menambahkan gambar pada Todo, serta Todo dapat memiliki waktu notifikasi.

Fitur yang diimplementasikan:

1. IndexedDB untuk menyimpan data Todo.
2. localStorage untuk menyimpan preferensi tema.
3. Media Capture API untuk mengambil atau memilih gambar.
4. Service Worker untuk mendukung notifikasi Todo.
5. Notification Time untuk menentukan waktu pengingat Todo.
6. Accessibility dan best practices pada komponen antarmuka.

---

# 2. Struktur File

Struktur file yang digunakan pada project:

```text
.
├── index.html
├── style.css
├── script.js
└── service-worker.js
```

### Fungsi masing-masing file

| File | Fungsi |
|---|---|
| `index.html` | Struktur dan komponen antarmuka Todo List |
| `style.css` | Styling, responsive layout, dark mode, dan accessibility |
| `script.js` | Logika aplikasi, IndexedDB, localStorage, gambar, dan notifikasi |
| `service-worker.js` | Service Worker untuk menangani notifikasi |

---

# 3. IndexedDB

## 3.1 Tujuan

IndexedDB digunakan untuk menyimpan data Todo secara lokal di browser.

Dengan IndexedDB, data Todo tidak hanya berada di variabel JavaScript. Data tetap tersimpan ketika halaman direfresh.

Database yang digunakan bernama:

```text
TodoAppDB
```

Object store yang digunakan:

```text
todos
```

Primary key:

```text
id
```

---

## 3.2 Membuat Database

### Kode

```javascript
let db;

const dbRequest = indexedDB.open("TodoAppDB", 1);

dbRequest.onupgradeneeded = function(event) {
    db = event.target.result;

    if (!db.objectStoreNames.contains("todos")) {
        db.createObjectStore("todos", { keyPath: "id" });
    }
};

dbRequest.onsuccess = function(event) {
    db = event.target.result;
    console.log("Database opened successfully:", db);

    initializeTodos();
};

dbRequest.onerror = function(event) {
    console.error("Database error:", event.target.error);
};
```

### Penjelasan

`indexedDB.open()` digunakan untuk membuka atau membuat database bernama `TodoAppDB`.

Versi database yang digunakan adalah `1`.

Ketika database pertama kali dibuat atau versinya berubah, event `onupgradeneeded` dijalankan. Pada bagian ini dibuat object store `todos`.

```javascript
db.createObjectStore("todos", { keyPath: "id" });
```

`keyPath: "id"` berarti setiap Todo memiliki `id` sebagai identifier.

Jika database berhasil dibuka, `onsuccess` dijalankan dan aplikasi melanjutkan proses inisialisasi Todo.

---

## 3.3 Menyimpan Todo

### Kode

```javascript
function saveTodo(todo) {
    const transaction = db.transaction("todos", "readwrite");
    const store = transaction.objectStore("todos");

    store.put(todo);
}
```

### Penjelasan

Untuk menyimpan data digunakan transaction dengan mode:

```text
readwrite
```

Kemudian object store `todos` diakses dan data disimpan menggunakan:

```javascript
store.put(todo);
```

`put()` dapat digunakan untuk menambahkan Todo baru maupun memperbarui Todo yang sudah memiliki `id` yang sama.

---

## 3.4 Menghapus Todo dari IndexedDB

### Kode

```javascript
function deleteTodo(id) {
    const transaction = db.transaction("todos", "readwrite");
    const store = transaction.objectStore("todos");

    store.delete(id);
}
```

### Penjelasan

Fungsi `deleteTodo()` membuat transaction `readwrite`, kemudian menghapus data berdasarkan `id`.

Dengan demikian, ketika Todo dihapus dari aplikasi, data Todo tersebut juga dihapus dari IndexedDB.

---

## 3.5 Membaca Data Todo

### Kode

```javascript
function loadTodos() {
    const transaction = db.transaction("todos", "readonly");
    const store = transaction.objectStore("todos");

    const request = store.getAll();

    request.onsuccess = function(event) {
        todos.length = 0;

        event.target.result.forEach(function(todo) {
            todos.push(todo);
        });

        if (todos.length > 0) {
            selectedTodoId = todos[0].id;
        } else {
            selectedTodoId = null;
        }

        renderTodos();
        showTodoDetail();

        todos.forEach(function(todo) {
            scheduleNotification(todo);
        });
    };
}
```

### Penjelasan

Data dibaca menggunakan transaction dengan mode `readonly`.

Kemudian:

```javascript
store.getAll();
```

digunakan untuk mengambil seluruh Todo dari object store.

Data yang diperoleh dimasukkan kembali ke array `todos`, kemudian aplikasi melakukan:

```javascript
renderTodos();
showTodoDetail();
```

untuk menampilkan data pada halaman.

Setiap Todo juga diproses kembali menggunakan:

```javascript
scheduleNotification(todo);
```

agar jadwal notifikasinya dibuat kembali setelah halaman dibuka atau direfresh.

---

## 3.6 Inisialisasi Data Awal

### Kode

```javascript
function initializeTodos() {
    const transaction = db.transaction("todos", "readwrite");
    const store = transaction.objectStore("todos");

    const request = store.count();

    request.onsuccess = function(event) {
        if (event.target.result === 0) {
            todos.forEach(function(todo) {
                store.put(todo);
            });
        }
    };

    transaction.oncomplete = function() {
        loadTodos();
    };
}
```

### Penjelasan

Fungsi `initializeTodos()` mengecek jumlah data yang terdapat pada IndexedDB.

Jika jumlah data adalah `0`, data Todo awal dimasukkan ke database.

Setelah transaction selesai, fungsi `loadTodos()` dipanggil untuk mengambil data dan menampilkannya.

---

# 4. localStorage

## 4.1 Tujuan

`localStorage` digunakan untuk menyimpan preferensi tema pengguna.

Tema yang tersedia:

- Light Mode
- Dark Mode

Dengan localStorage, pilihan tema tetap tersimpan setelah halaman direfresh.

---

## 4.2 Menyimpan Tema

### Kode

```javascript
themeToggle.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeToggle.textContent = "Light Mode";
        localStorage.setItem("theme", "dark");
    } else {
        themeToggle.textContent = "Dark Mode";
        localStorage.setItem("theme", "light");
    }
});
```

### Penjelasan

Ketika tombol tema ditekan, class `dark-mode` ditambahkan atau dihapus dari elemen `<body>`.

Jika dark mode aktif:

```javascript
localStorage.setItem("theme", "dark");
```

digunakan untuk menyimpan pilihan pengguna.

Jika light mode aktif:

```javascript
localStorage.setItem("theme", "light");
```

digunakan.

---

## 4.3 Membaca Tema yang Tersimpan

### Kode

```javascript
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "Light Mode";
} else {
    document.body.classList.remove("dark-mode");
    themeToggle.textContent = "Dark Mode";
}
```

### Penjelasan

Saat halaman dibuka, aplikasi mengambil nilai tema dari localStorage.

Jika nilainya `dark`, maka dark mode langsung diterapkan.

Dengan demikian, pengguna tidak perlu memilih ulang tema setiap kali membuka atau melakukan refresh halaman.

---

# 5. Media Capture API

## 5.1 Tujuan

Fitur gambar ditambahkan pada form pembuatan Todo.

Pengguna dapat memilih gambar dari perangkat. Pada perangkat yang mendukung Media Capture, atribut `capture` dapat digunakan untuk mengakses kamera.

---

## 5.2 Input Gambar

### Kode HTML

```html
<div class="form-group">
    <label for="new-image">Image</label>
    <input
        type="file"
        id="new-image"
        name="new-image"
        accept="image/*"
        capture="environment"
    >
</div>
```

### Penjelasan

Input menggunakan:

```html
type="file"
```

untuk memungkinkan pengguna memilih file.

Atribut:

```html
accept="image/*"
```

membatasi jenis file yang dipilih menjadi gambar.

Atribut:

```html
capture="environment"
```

meminta perangkat menggunakan kamera belakang jika perangkat dan browser mendukungnya.

---

# 6. Membaca File Gambar

## 6.1 Kode

```javascript
function readImageFile(file) {
    return new Promise(function(resolve, reject) {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Error reading file"));

        reader.readAsDataURL(file);
    });
}
```

## Penjelasan

`FileReader` digunakan untuk membaca file gambar yang dipilih pengguna.

File dibaca menggunakan:

```javascript
reader.readAsDataURL(file);
```

Hasilnya berupa Data URL yang dapat disimpan sebagai bagian dari data Todo.

Data gambar kemudian dapat disimpan ke IndexedDB bersama data Todo.

---

# 7. Menampilkan Gambar pada Detail Todo

## Kode HTML

```html
<div class="form-group">
    <span class="form-label">Image</span>
    <img
        id="todo-img"
        src=""
        alt="Todo image preview"
        width="150"
        hidden
    >
</div>
```

### Penjelasan

Elemen `<img>` digunakan untuk menampilkan gambar yang tersimpan pada Todo.

Atribut:

```html
alt="Todo image preview"
```

digunakan sebagai teks alternatif untuk accessibility.

Atribut:

```html
hidden
```

digunakan ketika Todo tidak memiliki gambar.

---

# 8. Menampilkan Gambar pada Todo List

### CSS

```css
#todo-img {
    max-width: 200px;
    max-height: 200px;
    object-fit: cover;
    border-radius: 8px;
}

.todo-item img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
    margin-top: 8px;
}
```

### Penjelasan

CSS digunakan untuk membatasi ukuran gambar agar tidak terlalu besar.

`object-fit: cover` membuat gambar menyesuaikan area yang tersedia.

`border-radius` digunakan untuk membuat sudut gambar lebih rapi.

---

# 9. Service Worker

## 9.1 Tujuan

Service Worker digunakan untuk menangani notifikasi Todo.

Service Worker didaftarkan dari `script.js` menggunakan file:

```text
service-worker.js
```

---

## 9.2 Registrasi Service Worker

### Kode

```javascript
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker.register("service-worker.js")
            .then(function(registration) {
                console.log("Service Worker registered");
                return registration.update();
            })
            .catch(function(error) {
                console.error(
                    "Service Worker registration failed:",
                    error
                );
            });
    });
}
```

### Penjelasan

Sebelum melakukan registrasi, aplikasi mengecek apakah browser mendukung Service Worker:

```javascript
"serviceWorker" in navigator
```

Kemudian file `service-worker.js` didaftarkan.

Jika berhasil, console menampilkan:

```text
Service Worker registered
```

---

# 10. Service Worker Notification

## 10.1 Install

### Kode

```javascript
self.addEventListener("install", function() {
    console.log("Service Worker installed");
});
```

### Penjelasan

Event `install` dijalankan ketika Service Worker sedang dipasang.

---

## 10.2 Activate

### Kode

```javascript
self.addEventListener("activate", function() {
    console.log("Service Worker activated");
});
```

### Penjelasan

Event `activate` dijalankan ketika Service Worker sudah aktif.

---

## 10.3 Menerima Pesan Notifikasi

### Kode

```javascript
self.addEventListener("message", function(event) {
    if (!event.data || event.data.type !== "show-notification") {
        return;
    }

    event.waitUntil(
        self.registration.showNotification(event.data.title, {
            body: event.data.description || "You have a new todo reminder."
        })
    );
});
```

### Penjelasan

Service Worker mendengarkan pesan menggunakan event `message`.

Jika pesan memiliki:

```text
type: "show-notification"
```

Service Worker akan membuat browser notification menggunakan:

```javascript
self.registration.showNotification()
```

Judul notifikasi berasal dari judul Todo, sedangkan isi notifikasi berasal dari deskripsi Todo.

---

# 11. Notification Time

## 11.1 Input Notification Time

Notification Time ditambahkan pada form detail Todo.

### Kode

```html
<div class="form-group">
    <label for="notification-time">
        Notification Time
    </label>
    <input
        type="datetime-local"
        id="notification-time"
        name="notification-time"
    >
</div>
```

Notification Time juga tersedia pada form pembuatan Todo:

```html
<div class="form-group">
    <label for="new-notification-time">
        Notification Time
    </label>
    <input
        type="datetime-local"
        id="new-notification-time"
        name="new-notification-time"
    >
</div>
```

### Penjelasan

Input menggunakan:

```html
type="datetime-local"
```

sehingga pengguna dapat menentukan tanggal dan waktu pengingat Todo.

---

# 12. Permission Notifikasi

### Kode

```javascript
function requestNotificationPermission() {
    if (!("Notification" in window)) {
        console.error("Notifications are not supported.");
        return;
    }

    if (Notification.permission === "default") {
        Notification.requestPermission().then(function(permission) {
            console.log("Notification permission:", permission);
        });
    }
}
```

### Penjelasan

Sebelum mengirim notifikasi, aplikasi mengecek apakah browser mendukung Notification API.

Jika permission masih `default`, browser meminta izin kepada pengguna.

Notifikasi hanya dapat ditampilkan jika permission telah diberikan.

---

# 13. Menjadwalkan Notifikasi

### Kode

```javascript
function scheduleNotification(todo) {
    if (notificationTimers.has(todo.id)) {
        clearTimeout(notificationTimers.get(todo.id));
        notificationTimers.delete(todo.id);
    }

    if (!todo.notificationTime) {
        return;
    }

    const notificationDate = new Date(todo.notificationTime);
    const delay = notificationDate.getTime() - Date.now();

    if (Number.isNaN(notificationDate.getTime())) {
        console.error("Invalid notification time:", todo.notificationTime);
        return;
    }

    if (delay <= 0) {
        return;
    }

    console.log("Notification scheduled:", todo.title);
    console.log("Notification time:", notificationDate);
    console.log("Delay:", delay);

    const timer = setTimeout(function() {
        if (Notification.permission !== "granted") {
            console.error("Notification permission is not granted.");
            notificationTimers.delete(todo.id);
            return;
        }

        navigator.serviceWorker.ready
            .then(function(registration) {
                return registration.showNotification(todo.title, {
                    body: todo.description || "Todo reminder"
                });
            })
            .then(function() {
                console.log("Notification shown:", todo.title);
            })
            .catch(function(error) {
                console.error("Notification error:", error);
            });

        notificationTimers.delete(todo.id);
    }, delay);

    notificationTimers.set(todo.id, timer);
}
```

### Penjelasan

Fungsi `scheduleNotification()` digunakan untuk membuat timer berdasarkan waktu yang dipilih pengguna.

Pertama, aplikasi mengecek apakah Todo tersebut sudah memiliki timer. Jika ada, timer lama dihapus agar tidak terjadi notifikasi ganda.

Kemudian waktu notifikasi dikonversi menjadi objek `Date`.

Selisih waktu antara waktu notifikasi dan waktu sekarang dihitung menggunakan:

```javascript
const delay = notificationDate.getTime() - Date.now();
```

Setelah itu `setTimeout()` digunakan untuk menunggu sampai waktu yang telah ditentukan.

Ketika timer selesai, aplikasi mengecek permission notification dan menggunakan Service Worker registration untuk menampilkan notifikasi.

---

# 14. Menyimpan Notification Time pada Todo

Notification Time ikut disimpan bersama data Todo.

Contoh struktur data Todo:

```javascript
{
    id: 1,
    title: "Learn HTML",
    description: "Practice semantic HTML elements",
    status: "todo",
    completed: false,
    notificationTime: "2026-10-05T19:18"
}
```

Dengan demikian, waktu notifikasi tersimpan sebagai bagian dari data Todo di IndexedDB.

Ketika aplikasi dibuka kembali, `loadTodos()` akan membaca Todo dari IndexedDB dan menjalankan:

```javascript
todos.forEach(function(todo) {
    scheduleNotification(todo);
});
```

---

# 15. Notification Click

### Kode

```javascript
self.addEventListener("notificationclick", function(event) {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: "window" }).then(function(clientList) {
            for (const client of clientList) {
                if ("focus" in client) {
                    return client.focus();
                }
            }

            if (clients.openWindow) {
                return clients.openWindow("/");
            }
        })
    );
});
```

### Penjelasan

Ketika pengguna menekan notifikasi:

1. Notifikasi ditutup.
2. Service Worker mencari halaman aplikasi yang sedang terbuka.
3. Jika ditemukan, halaman tersebut difokuskan.
4. Jika tidak ditemukan, aplikasi dapat membuka halaman baru.

---

# 16. Dark Mode

## HTML

```html
<button
    type="button"
    id="theme-toggle"
    aria-label="Toggle dark mode"
>
    Dark Mode
</button>
```

## JavaScript

```javascript
themeToggle.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeToggle.textContent = "Light Mode";
        localStorage.setItem("theme", "dark");
    } else {
        themeToggle.textContent = "Dark Mode";
        localStorage.setItem("theme", "light");
    }
});
```

### Penjelasan

Tombol digunakan untuk mengubah class `dark-mode` pada `<body>`.

Preferensi pengguna kemudian disimpan menggunakan localStorage sehingga pilihan tema tidak hilang ketika halaman direfresh.

---

# 17. Accessibility

Accessibility diterapkan pada struktur HTML dan styling.

## 17.1 Semantic HTML

Aplikasi menggunakan elemen semantic seperti:

```html
<header>
<main>
<section>
<aside>
<footer>
```

Elemen tersebut membantu struktur halaman lebih mudah dipahami oleh browser dan assistive technology.

---

## 17.2 Label pada Form

Setiap input utama memiliki label.

Contoh:

```html
<label for="title">Title</label>
<input
    type="text"
    id="title"
    name="title"
    required
>
```

Atribut `for` pada `<label>` sesuai dengan `id` input.

Hal ini membuat form lebih mudah digunakan, termasuk ketika pengguna menggunakan screen reader.

---

## 17.3 ARIA Label

Contoh:

```html
<button
    type="button"
    id="theme-toggle"
    aria-label="Toggle dark mode"
>
    Dark Mode
</button>
```

Todo list juga memiliki:

```html
<ul
    class="todo-list"
    id="todo-list"
    aria-label="Todo list"
>
```

ARIA digunakan untuk memberikan informasi tambahan mengenai fungsi elemen kepada assistive technology.

---

## 17.4 Accessible Checkbox

Setiap checkbox memiliki label yang terhubung dengan input.

Contoh:

```html
<input
    type="checkbox"
    id="todo1"
    aria-label="Complete Learn HTML"
>
```

Dengan demikian, tujuan checkbox dapat diketahui dengan jelas.

---

## 17.5 Focus Indicator

### CSS

```css
button:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
    outline: 3px solid #005fcc;
    outline-offset: 2px;
}
```

### Penjelasan

`focus-visible` digunakan agar elemen form dan button memiliki indikator visual ketika mendapatkan keyboard focus.

Hal ini membantu pengguna yang melakukan navigasi menggunakan keyboard.

---

## 17.6 Disabled Button

### CSS

```css
button:disabled {
    cursor: not-allowed;
    opacity: .6;
}
```

### Penjelasan

Button yang disabled dibuat terlihat berbeda dan cursor menunjukkan bahwa button tidak dapat digunakan.

---

## 17.7 Label Styling

### CSS

```css
.form-group label,
.form-label {
    font-weight: bold;
    font-size: 14px;
}
```

Label dibuat lebih jelas secara visual sehingga hubungan antara label dan input lebih mudah dikenali.

---

# 18. Responsive Design

Layout menggunakan CSS Grid.

Contoh:

```css
main {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
}
```

Pada ukuran layar yang lebih kecil, layout diubah menjadi satu kolom menggunakan media query.

```css
@media (max-width: 768px) {
    main {
        grid-template-columns: 1fr;
    }
}
```

Dengan demikian, aplikasi dapat digunakan pada layar desktop maupun perangkat dengan layar yang lebih kecil.

---

# 19. Form Pembuatan Todo

Form pembuatan Todo terdiri dari beberapa input.

### Kode

```html
<form id="new-todo-form">

    <div class="form-group">
        <label for="new-title">Title</label>
        <input
            type="text"
            id="new-title"
            name="new-title"
            placeholder="Enter todo title"
            required
        >
    </div>

    <div class="form-group">
        <label for="new-description">Description</label>
        <textarea
            id="new-description"
            name="new-description"
            rows="4"
            placeholder="Enter todo description"
        ></textarea>
    </div>

    <div class="form-group">
        <label for="new-image">Image</label>
        <input
            type="file"
            id="new-image"
            name="new-image"
            accept="image/*"
            capture="environment"
        >
    </div>

    <div class="form-group">
        <label for="new-notification-time">
            Notification Time
        </label>
        <input
            type="datetime-local"
            id="new-notification-time"
            name="new-notification-time"
        >
    </div>

    <button type="submit">
        Create Todo
    </button>

</form>
```

### Penjelasan

Form memungkinkan pengguna membuat Todo baru dengan:

- Judul.
- Deskripsi.
- Gambar.
- Waktu notifikasi.

Setelah form disubmit, data Todo disimpan ke IndexedDB.

---

# 20. Todo Detail

Panel detail digunakan untuk melihat dan mengubah Todo yang dipilih.

Komponen yang tersedia:

```text
Title
Description
Image
Status
Notification Time
Delete
Save Changes
```

Contoh struktur:

```html
<form class="todo-editor" id="todo-editor">

    <div class="form-group">
        <label for="title">Title</label>
        <input
            type="text"
            id="title"
            name="title"
            required
        >
    </div>

    <div class="form-group">
        <label for="description">Description</label>
        <textarea
            id="description"
            name="description"
            rows="6"
        ></textarea>
    </div>

    <div class="form-group">
        <span class="form-label">Image</span>
        <img
            id="todo-img"
            src=""
            alt="Todo image preview"
            width="150"
            hidden
        >
    </div>

    <div class="form-group">
        <label for="status">Status</label>
        <select id="status" name="status">
            <option value="todo">To Do</option>
            <option value="progress">In Progress</option>
            <option value="done">Done</option>
        </select>
    </div>

    <div class="form-group">
        <label for="notification-time">
            Notification Time
        </label>
        <input
            type="datetime-local"
            id="notification-time"
            name="notification-time"
        >
    </div>

    <div class="form-actions">
        <button
            type="button"
            id="delete-button"
        >
            Delete
        </button>

        <button type="submit">
            Save Changes
        </button>
    </div>

</form>
```

---

# 21. Alur Keseluruhan Aplikasi

```text
                    ┌─────────────────────┐
                    │     Todo List       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     IndexedDB       │
                    │     TodoAppDB        │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
             Create          Edit          Delete
                │              │              │
                └──────────────┼──────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Todo Data      │
                    │ title, description  │
                    │ image, status, time  │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
        localStorage       Image/File       Notification
             │                 │                 │
             ▼                 ▼                 ▼
         Dark/Light        FileReader       Service Worker
             │                 │                 │
             │                 ▼                 ▼
             │             IndexedDB       showNotification()
             │
             ▼
        Theme Preference
```

---

# 22. Alur IndexedDB

```text
Open TodoAppDB
       │
       ▼
Check object store
       │
       ▼
Object store "todos"
       │
       ├───────────────┐
       │               │
       ▼               ▼
    saveTodo()     loadTodos()
       │               │
       ▼               ▼
   store.put()      store.getAll()
       │               │
       └───────┬───────┘
               ▼
          Render Todo
```

---

# 23. Alur Notification

```text
User membuat Todo
        │
        ▼
Mengisi Notification Time
        │
        ▼
Todo disimpan ke IndexedDB
        │
        ▼
scheduleNotification(todo)
        │
        ▼
Hitung selisih waktu
        │
        ▼
setTimeout()
        │
        ▼
Waktu tercapai
        │
        ▼
Cek Notification Permission
        │
        ▼
Service Worker Ready
        │
        ▼
showNotification()
        │
        ▼
Notifikasi muncul
```

---

# 24. Pengujian IndexedDB

### Langkah Pengujian

1. Membuka aplikasi.
2. Membuat Todo baru.
3. Melakukan refresh halaman.
4. Memeriksa apakah Todo masih tersedia.
5. Mengedit Todo.
6. Melakukan refresh kembali.
7. Menghapus Todo.
8. Memeriksa apakah Todo benar-benar hilang.

### Hasil

Data Todo tetap tersimpan setelah halaman direfresh karena data disimpan menggunakan IndexedDB.

---

# 25. Pengujian localStorage

### Langkah Pengujian

1. Membuka aplikasi.
2. Menekan tombol `Dark Mode`.
3. Memastikan tampilan berubah menjadi dark mode.
4. Melakukan refresh halaman.
5. Memastikan dark mode tetap aktif.
6. Mengubah kembali ke light mode.
7. Melakukan refresh.

### Hasil

Preferensi tema tetap tersimpan setelah refresh menggunakan localStorage.

---

# 26. Pengujian Image

### Langkah Pengujian

1. Membuka form `Create New Todo`.
2. Memilih gambar pada bagian `Image`.
3. Membuat Todo.
4. Memilih Todo tersebut.
5. Memeriksa gambar pada bagian detail.

### Hasil

Gambar dapat dipilih dan disimpan bersama data Todo, kemudian ditampilkan kembali pada aplikasi.

---

# 27. Pengujian Service Worker

### Langkah Pengujian

Service Worker diperiksa melalui browser console.

Pesan yang diharapkan:

```text
Service Worker registered
```

Service Worker kemudian digunakan untuk menampilkan browser notification.

### Hasil

Service Worker berhasil diregistrasikan dan dapat digunakan untuk proses notification.

---

# 28. Pengujian Notification Time

### Langkah Pengujian

1. Membuat Todo baru.
2. Mengisi `Notification Time`.
3. Memilih waktu beberapa saat setelah waktu sekarang.
4. Menyimpan Todo.
5. Memastikan console menampilkan informasi scheduling.
6. Menunggu hingga waktu yang telah ditentukan.
7. Memeriksa browser notification.

Contoh output console:

```text
Notification scheduled: tes wkt
Notification time: Mon Oct 05 2026 19:18:00
Delay: 40785
```

Setelah timer selesai, aplikasi menampilkan:

```text
Notification shown: tes wkt
```

### Hasil

Todo dapat memiliki waktu pengingat dan aplikasi menjalankan proses notifikasi berdasarkan waktu yang telah ditentukan.

---

# 29. Pengujian Accessibility

Beberapa hal yang diperiksa:

- Semua input memiliki `<label>`.
- Tombol memiliki nama/fungsi yang jelas.
- Gambar memiliki `alt`.
- Struktur halaman menggunakan semantic HTML.
- Komponen memiliki ARIA label jika diperlukan.
- Elemen yang mendapatkan keyboard focus memiliki visual focus indicator.
- Form menggunakan `required` pada input yang wajib diisi.
- Layout dapat menyesuaikan ukuran layar.

### Hasil

Aplikasi telah menerapkan beberapa praktik accessibility dasar untuk membuat antarmuka lebih mudah digunakan.

---

# 30. Fitur yang Berhasil Diimplementasikan

| Requirement | Implementasi | Status |
|---|---|---|
| IndexedDB | `TodoAppDB` dan object store `todos` | ✅ |
| Menyimpan Todo | `store.put()` | ✅ |
| Membaca Todo | `store.getAll()` | ✅ |
| Menghapus Todo | `store.delete()` | ✅ |
| localStorage | Penyimpanan tema | ✅ |
| Light/Dark Mode | `localStorage.getItem()` dan `setItem()` | ✅ |
| Media Capture API | `<input type="file" capture="environment">` | ✅ |
| Image Preview | `<img>` + FileReader | ✅ |
| Penyimpanan Image | Data URL pada Todo | ✅ |
| Service Worker | `service-worker.js` | ✅ |
| Notification Permission | `Notification.requestPermission()` | ✅ |
| Notification Time | `datetime-local` | ✅ |
| Scheduled Notification | `scheduleNotification()` | ✅ |
| Accessibility | Semantic HTML, label, ARIA, focus | ✅ |
| Responsive Design | CSS Grid + media query | ✅ |

---

# 31. Kesimpulan

Pada tugas **E03 — The Lost Cavern**, Todo List dikembangkan menggunakan beberapa Web API dan teknologi browser modern.

IndexedDB digunakan untuk menyimpan data Todo secara persisten, sedangkan localStorage digunakan untuk menyimpan preferensi tema pengguna. Media Capture API digunakan untuk memungkinkan pengguna menambahkan gambar pada Todo. Service Worker digunakan dalam mekanisme browser notification dan Todo dapat diberikan `Notification Time` sebagai waktu pengingat.

Selain fitur utama tersebut, aplikasi juga menerapkan accessibility melalui semantic HTML, label pada form, ARIA label, alternative text pada gambar, serta focus indicator untuk navigasi keyboard.

Dengan implementasi tersebut, aplikasi Todo List dapat melakukan operasi dasar seperti membuat, mengedit, dan menghapus Todo, serta memiliki penyimpanan lokal, dukungan gambar, tema yang persisten, dan sistem pengingat berbasis notifikasi.
