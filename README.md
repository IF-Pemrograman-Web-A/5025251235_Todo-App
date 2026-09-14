# [E01a] The Style Warrior - Todo List App


| Nama               | NRP        | Kelas  |
| ------------------ | ---------- | ------ |
| Dhanishara Zaschya | 5025251235 | PWEB A |

## Deskripsi

Tugas ini merupakan implementasi tampilan **Todo List Webpage** menggunakan HTML dan CSS. Halaman dibuat sebagai antarmuka statis untuk menampilkan daftar tugas, melihat detail tugas, serta menyediakan form untuk membuat Todo baru.

Pengembangan dilakukan dengan HTML semantic dan CSS eksternal. Layout menggunakan **CSS Grid** agar dua panel dapat ditampilkan berdampingan pada layar desktop dan berubah menjadi satu kolom pada layar yang lebih kecil.

---

## 1. Semantic HTML

Struktur halaman menggunakan beberapa elemen semantic HTML5 agar setiap bagian halaman memiliki fungsi yang jelas. Elemen yang digunakan antara lain `<header>`, `<main>`, `<section>`, `<aside>`, dan `<footer>`.

### Header

Bagian `<header>` digunakan untuk menampilkan identitas utama halaman berupa judul dan deskripsi singkat.

```html
<header>
    <h1>Todo List</h1>
    <p>Manage your tasks easily</p>
</header>
```

Dengan demikian, pengguna dapat langsung mengetahui fungsi halaman ketika membukanya.

### Main

Elemen `<main>` digunakan sebagai wadah untuk konten utama Todo List. Di dalamnya terdapat dua bagian utama, yaitu panel daftar Todo dan panel detail Todo.

```html
<main>

    <section class="todo-panel">
        ...
    </section>

    <aside class="detail-panel">
        ...
    </aside>

</main>
```

`<section>` digunakan untuk bagian daftar tugas, sedangkan `<aside>` digunakan untuk bagian detail atau editor Todo.

### Footer

Bagian `<footer>` digunakan untuk menampilkan informasi pada bagian paling bawah halaman.

```html
<footer>
    <p>&copy; 2026 Todo List. All rights reserved.</p>
</footer>
```

---

## 2. Layout Dua Panel

Konten utama dibagi menjadi dua panel menggunakan **CSS Grid**.

* **Panel kiri** berisi daftar Todo yang tersedia.
* **Panel kanan** berisi detail dan editor Todo yang dipilih.

Struktur HTML kedua panel tersebut adalah:

```html
<main>

    <section class="todo-panel">
        <div class="panel-header">
            <h2>My Todos</h2>
            <button type="button">+ New Todo</button>
        </div>

        <ul class="todo-list">
            ...
        </ul>
    </section>

    <aside class="detail-panel">
        <div class="panel-header">
            <h2>Todo Detail</h2>
        </div>

        <form class="todo-editor">
            ...
        </form>
    </aside>

</main>
```

Pengaturan layout dilakukan melalui properti `display: grid`.

```css
main {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 24px;
}
```

`grid-template-columns` membuat panel terbagi menjadi dua kolom. Panel kanan dibuat sedikit lebih lebar karena menggunakan `1.5fr`, sedangkan panel kiri menggunakan `1fr`.

Secara sederhana, pembagian layoutnya adalah:

```text
┌───────────────────┬────────────────────────────┐
│                   │                            │
│    My Todos       │       Todo Detail          │
│                   │                            │
│    Panel Kiri     │       Panel Kanan          │
│                   │                            │
└───────────────────┴────────────────────────────┘
```

---

## 3. Form Todo

Panel kanan menyediakan form untuk melihat dan mengedit informasi Todo. Form terdiri dari beberapa input yang berhubungan dengan sebuah tugas.

### Judul Todo

Input teks digunakan untuk menampilkan judul tugas.

```html
<div class="form-group">
    <label for="title">Title</label>
    <input
        type="text"
        id="title"
        name="title"
        value="Learn HTML"
    >
</div>
```

### Deskripsi

Deskripsi tugas menggunakan `<textarea>` agar dapat menampung teks yang lebih panjang.

```html
<div class="form-group">
    <label for="description">Description</label>
    <textarea
        id="description"
        name="description"
        rows="6"
    >Practice semantic HTML elements</textarea>
</div>
```

### Status

Status Todo dibuat menggunakan `<select>` sehingga pengguna dapat memilih salah satu status yang tersedia.

```html
<div class="form-group">
    <label for="status">Status</label>
    <select id="status" name="status">
        <option value="todo">To Do</option>
        <option value="progress">In Progress</option>
        <option value="done">Done</option>
    </select>
</div>
```

### Tombol Aksi

Form juga memiliki tombol untuk menghapus Todo dan menyimpan perubahan.

```html
<div class="form-actions">
    <button type="button">Delete</button>
    <button type="submit">Save Changes</button>
</div>
```

Selain editor pada panel kanan, terdapat form terpisah untuk membuat Todo baru.

```html
<section class="new-todo">
    <h2>Create New Todo</h2>

    <form>
        ...
        <button type="submit">Create Todo</button>
    </form>
</section>
```

Form tersebut dibuat sebagai komponen terpisah sesuai dengan kriteria tugas.

---

## 4. Static Todo List

Daftar Todo pada halaman menggunakan data dummy atau data statis. Data tidak berasal dari database maupun JavaScript.

Contoh salah satu Todo:

```html
<li class="todo-item active">
    <input type="checkbox" id="todo1">

    <label for="todo1">
        <strong>Learn HTML</strong>
        <span>Practice semantic HTML elements</span>
    </label>
</li>
```

Beberapa Todo yang digunakan pada halaman antara lain:

1. Learn HTML
2. Learn CSS
3. Finish assignment
4. Read documentation

Setiap item Todo memiliki checkbox, judul, dan deskripsi singkat.

Class `active` digunakan untuk memberikan tampilan berbeda pada Todo yang sedang dipilih.

```css
.todo-item.active {
    border-color: #222;
    background-color: #f2f2f2;
}
```

---

## 5. Styling dan Layout

Selain mengatur layout utama, CSS digunakan untuk memberikan tampilan pada komponen halaman seperti panel, tombol, input, dan daftar Todo.

Panel dibuat menggunakan background putih, border radius, padding, dan shadow.

```css
.todo-panel,
.detail-panel {
    background-color: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
```

Form juga menggunakan Flexbox untuk menyusun elemen input secara vertikal.

```css
.todo-editor {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
```

Sementara itu, bagian header panel menggunakan Flexbox agar judul dan tombol dapat ditempatkan pada sisi yang berbeda.

```css
.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
```

---

## 6. Responsive Design

Tampilan dibuat responsive menggunakan **media query**. Ketika lebar layar berada di bawah atau sama dengan `768px`, layout dua kolom akan berubah menjadi satu kolom.

```css
@media (max-width: 768px) {

    main {
        grid-template-columns: 1fr;
    }

}
```

Pada desktop, tampilannya menjadi:

```text
┌──────────────┬───────────────────┐
│  My Todos    │   Todo Detail     │
│              │                   │
└──────────────┴───────────────────┘
```

Sedangkan pada perangkat mobile, kedua panel disusun secara vertikal:

```text
┌──────────────────────┐
│      My Todos        │
└──────────────────────┘
          ↓
┌──────────────────────┐
│     Todo Detail      │
└──────────────────────┘
```

Ukuran padding dan margin juga disesuaikan agar konten menyesuaikandigunakan pada layar yang lebih kecil.

```css
@media (max-width: 768px) {

    header {
        padding: 20px;
    }

    main {
        grid-template-columns: 1fr;
        padding: 0 16px;
    }

    .form-actions {
        flex-direction: column;
    }

    .form-actions button {
        width: 100%;
    }

}
```

Dengan responsive design tersebut, halaman tetap dapat digunakan baik pada desktop maupun perangkat mobile.

---

## 7. External CSS

CSS dibuat pada file terpisah bernama `style.css`. File HTML hanya digunakan untuk menyusun struktur halaman, sedangkan tampilan halaman diatur oleh file CSS.

Hubungan antara kedua file dibuat menggunakan `<link>` pada bagian `<head>`.

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo List</title>

    <link rel="stylesheet" href="style.css">
</head>
```

---

## 7. Dokumentasi

<img width="1917" height="1078" alt="Screenshot 2026-09-14 194044" src="https://github.com/user-attachments/assets/46edf94b-c118-4b14-953e-7eabc2536a60" />

<img width="758" height="661" alt="Screenshot 2026-09-14 194112" src="https://github.com/user-attachments/assets/ed94a62d-e69e-453c-9ede-c03ab60ab08a" />

<img width="722" height="978" alt="Screenshot 2026-09-14 194129" src="https://github.com/user-attachments/assets/78de9cf2-cfd2-4493-b847-82659ceca6ec" />

<img width="1917" height="975" alt="Screenshot 2026-09-14 194058" src="https://github.com/user-attachments/assets/74e80f11-02ac-40ea-9a37-64dc908262be" />

