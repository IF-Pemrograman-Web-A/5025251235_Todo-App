# [E02] The Style Warrior - Todo List App

| Nama               | NRP        | Kelas  |
| ------------------ | ---------- | ------ |
| Dhanishara Zaschya | 5025251235 | PWEB A |

## Deskripsi

Tugas ini merupakan pengembangan dari **Todo List Webpage** pada E01 dengan menambahkan interaksi menggunakan **JavaScript**. Halaman tidak lagi hanya bersifat statis, tetapi pengguna dapat menambahkan, mengedit, menghapus, serta menandai Todo sebagai selesai secara langsung pada halaman tanpa melakukan refresh.

Pengembangan dilakukan menggunakan HTML, CSS, dan JavaScript. JavaScript digunakan untuk melakukan **DOM Manipulation**, menangani event dari pengguna, mengelola data Todo dalam bentuk object, serta mengubah tampilan halaman berdasarkan interaksi pengguna.

Selain itu, halaman juga memiliki fitur **Light/Dark Mode** yang dapat diubah dengan melakukan toggle class pada elemen `<body>`.

---

## 1. DOM Manipulation

JavaScript digunakan untuk memanipulasi elemen HTML secara langsung menggunakan DOM. Daftar Todo tidak lagi ditulis seluruhnya secara statis pada HTML, tetapi dibuat berdasarkan data object yang terdapat pada JavaScript.

Elemen daftar Todo diambil menggunakan `getElementById()`.

```javascript
const todoList = document.getElementById("todo-list");
```

Kemudian setiap Todo dibuat menggunakan `document.createElement()`.

```javascript
const li = document.createElement("li");
li.className = "todo-item";
```

Elemen judul dan deskripsi juga dibuat secara dinamis.

```javascript
const title = document.createElement("strong");
title.textContent = todo.title;

const description = document.createElement("span");
description.textContent = todo.description;
```

Setelah elemen selesai dibuat, elemen tersebut dimasukkan ke dalam daftar Todo menggunakan `appendChild()`.

```javascript
label.appendChild(title);
label.appendChild(description);

li.appendChild(checkbox);
li.appendChild(label);

todoList.appendChild(li);
```

Proses tersebut dilakukan pada fungsi `renderTodos()` sehingga daftar Todo dapat diperbarui setiap kali terjadi perubahan data.

---

## 2. Todo Data as Object

Data Todo disimpan dalam bentuk **JavaScript object**. Setiap object memiliki beberapa properti, yaitu `id`, `title`, `description`, `status`, dan `completed`.

Contoh data Todo:

```javascript
const todos = [
    {
        id: 1,
        title: "Learn HTML",
        description: "Practice semantic HTML elements",
        status: "todo",
        completed: false
    },
    {
        id: 2,
        title: "Learn CSS",
        description: "Practice Flexbox and Grid",
        status: "todo",
        completed: false
    }
];
```

Properti tersebut digunakan untuk menyimpan informasi setiap Todo.

* `id` digunakan sebagai identitas Todo.
* `title` menyimpan judul Todo.
* `description` menyimpan deskripsi Todo.
* `status` menyimpan status Todo.
* `completed` menyimpan kondisi apakah Todo sudah selesai atau belum.

Data Todo disimpan hanya di dalam JavaScript sehingga setelah halaman di-refresh, data akan kembali ke data default yang terdapat pada array `todos`.

---

## 3. Create New Todo

Pengguna dapat membuat Todo baru melalui form **Create New Todo**.

Form ditangani menggunakan event `submit`.

```javascript
newTodoForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = newTitleInput.value.trim();
    const description = newDescriptionInput.value.trim();

    ...
});
```

`event.preventDefault()` digunakan agar form tidak melakukan refresh halaman ketika dikirim.

Data Todo baru kemudian dibuat sebagai object.

```javascript
const newTodo = {
    id: Date.now(),
    title: title,
    description: description,
    status: "todo",
    completed: false
};
```

Object tersebut kemudian dimasukkan ke dalam array `todos`.

```javascript
todos.push(newTodo);
```

Setelah data ditambahkan, fungsi `renderTodos()` dipanggil kembali sehingga Todo baru langsung muncul pada daftar tanpa melakukan refresh halaman.

```javascript
renderTodos();
showTodoDetail();
```

Dengan demikian, pengguna dapat langsung melihat Todo yang baru dibuat.

---

## 4. Edit Todo

Todo yang dipilih dapat diedit melalui panel **Todo Detail**.

Ketika pengguna menekan tombol **Save Changes**, data Todo yang dipilih akan dicari berdasarkan `selectedTodoId`.

```javascript
const todo = todos.find(function(item) {
    return item.id === selectedTodoId;
});
```

Setelah Todo ditemukan, nilai object diperbarui berdasarkan input dari form.

```javascript
todo.title = titleInput.value.trim();
todo.description = descriptionInput.value.trim();
todo.status = statusInput.value;
```

Status `completed` juga disesuaikan dengan status Todo.

```javascript
if (todo.status === "done") {
    todo.completed = true;
} else {
    todo.completed = false;
}
```

Setelah perubahan disimpan, daftar Todo dirender kembali menggunakan `renderTodos()`.

---

## 5. Delete Todo

Pengguna dapat menghapus Todo melalui tombol **Delete** pada panel Todo Detail.

Index Todo yang dipilih dicari menggunakan `findIndex()`.

```javascript
const todoIndex = todos.findIndex(function(item) {
    return item.id === selectedTodoId;
});
```

Kemudian Todo dihapus dari array menggunakan `splice()`.

```javascript
todos.splice(todoIndex, 1);
```

Setelah Todo dihapus, daftar Todo dirender kembali agar perubahan langsung terlihat pada halaman.

```javascript
renderTodos();
```

---

## 6. Mark Todo as Complete

Setiap Todo memiliki checkbox yang digunakan untuk menandai apakah Todo sudah selesai.

Checkbox dibuat menggunakan DOM:

```javascript
const checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.checked = todo.completed;
```

Ketika checkbox berubah, event `change` akan dijalankan.

```javascript
checkbox.addEventListener("change", function() {
    todo.completed = checkbox.checked;

    if (todo.completed) {
        todo.status = "done";
    } else {
        todo.status = "todo";
    }

    showTodoDetail();
    renderTodos();
});
```

Jika checkbox dicentang, nilai `completed` menjadi `true` dan status Todo menjadi `done`. Jika checkbox tidak dicentang, nilai `completed` menjadi `false`.

---

## 7. Event Handler

Interaksi pada halaman menggunakan **event handler** melalui `addEventListener()`.

Salah satu event handler digunakan untuk menangani pembuatan Todo baru.

```javascript
newTodoForm.addEventListener("submit", function(event) {
    event.preventDefault();

    ...
});
```

Event handler juga digunakan untuk beberapa interaksi lainnya, seperti:

```javascript
todoEditor.addEventListener("submit", ...);
deleteButton.addEventListener("click", ...);
themeToggle.addEventListener("click", ...);
checkbox.addEventListener("change", ...);
```

Dengan event handler tersebut, JavaScript dapat merespons tindakan yang dilakukan pengguna pada halaman.

---

## 8. Light/Dark Mode

Halaman memiliki fitur **Light/Dark Mode**. Fitur ini dibuat menggunakan `classList.toggle()` untuk menambahkan atau menghapus class `dark-mode` pada elemen `<body>`.

```javascript
themeToggle.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeToggle.textContent = "Light Mode";
    } else {
        themeToggle.textContent = "Dark Mode";
    }
});
```

Ketika tombol ditekan, class `dark-mode` akan ditambahkan pada `<body>` jika sebelumnya belum ada.

CSS kemudian memberikan tampilan berbeda ketika class tersebut aktif.

```css
body.dark-mode {
    background-color: #222222;
    color: #eeeeee;
}

body.dark-mode header {
    background-color: #555555;
    color: white;
}
```

Pada mode gelap, background halaman menjadi lebih gelap dan panel Todo menggunakan warna yang lebih gelap. Header menggunakan warna abu-abu agar tetap terlihat berbeda dari background halaman.

---

## 9. Reset Data Setelah Refresh

Data Todo pada tugas ini tidak disimpan menggunakan `localStorage` maupun database.

Data hanya disimpan pada array JavaScript:

```javascript
const todos = [
    ...
];
```

Oleh karena itu, perubahan seperti menambahkan Todo, mengedit Todo, atau menghapus Todo hanya berlaku selama halaman sedang dibuka.

Ketika halaman di-refresh, JavaScript akan dijalankan kembali dan array `todos` akan kembali menggunakan data default.

Hal ini sesuai dengan ketentuan tugas bahwa setelah halaman di-refresh, data harus kembali ke kondisi awal.

---

## 10. File Structure

Struktur file pada tugas E02 terdiri dari tiga file utama:

```text
Todo-App/
│
├── index.html
├── style.css
└── script.js
```

`index.html` digunakan untuk struktur halaman.

`style.css` digunakan untuk mengatur tampilan dan responsive design.

`script.js` digunakan untuk menambahkan interaksi dan manipulasi DOM pada Todo List.

JavaScript dihubungkan dengan HTML menggunakan `<script>` sebelum penutup `body`.

```html
<script src="script.js"></script>
```

---

## 11. Responsive Design

Tampilan responsive dari E01 tetap digunakan pada E02. Ketika lebar layar berada di bawah atau sama dengan `768px`, dua panel utama akan berubah menjadi satu kolom.

```css
@media (max-width: 768px) {

    main {
        grid-template-columns: 1fr;
    }

}
```

Dengan demikian, fitur interaktif Todo List tetap dapat digunakan pada layar desktop maupun perangkat dengan ukuran layar yang lebih kecil.

---

## 12. Dokumentasi

### Tampilan Light Mode

<img width="1917" height="1078" alt="Screenshot 2026-09-14 194044" src="https://github.com/user-attachments/assets/6f21bd04-6f75-423c-9a57-998e70cd2773" />

### Tampilan Dark Mode

<img width="1893" height="982" alt="image" src="https://github.com/user-attachments/assets/32940790-afd5-47ac-aacf-58da17da1ec7" />

### Menambahkan Todo

<img width="1892" height="972" alt="image" src="https://github.com/user-attachments/assets/9c233380-054a-4d4b-8db5-c41df7a3c575" />

### Edit dan Delete Todo

<img width="1897" height="982" alt="image" src="https://github.com/user-attachments/assets/71c51424-ce0b-4961-9f81-2d6bab787fd1" />



