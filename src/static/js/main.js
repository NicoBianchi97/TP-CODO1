const books_form = document.querySelector('#form1');
async function submitHandler(e){
  e.preventDefault();
  const id_libros = books_form["id_libros"].value;
  const nombre_libro = books_form["nombre_libro"].value;
  const autor = books_form["autor"].value;
  const precio = books_form["precio"].value;
  const genero = books_form["genero"].value;
  const imagen = 'cien_años_de_soledad.jpg'

  const url = id_libros !== "" ? `/api/books/${id_libros}` : "/api/books";
  // const url = '/api/books'
  const method = id_libros !== "" ? `PUT` : "POST";
  // const method = 'POST'

  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre_libro,
      autor,
      precio,
      genero,
      imagen,
    }),
  });
  const data = await response.json();
  if (response.status >= 400) {
    alert(data.message)
    return
  }
  if (id_libros !== "") {
    rmBook(data.id_libros);
  }
  addBookRow(
    data.id_libros,
    data.nombre_libro,
    data.autor,
    data.precio,
    data.genero,
    data.imagen,
  )
  books_form.reset()
}

books_form.addEventListener('submit', submitHandler)

function addBookRow(
  id_libros,
  nombre_libro,
  autor,
  precio,
  genero,
  imagen,
) {
  const booksList = document.querySelector("#back");
  const article = document.createElement("article");
  article.id = `book-${id_libros}`;
  article.className = "book-item-v2";
  article.innerHTML = `
    <div class="producto-libro">
      <a href="#" class="link-libro">
        <img src="/static/img/${imagen}" alt="Tapa del libro" class="imagen-libro">
      </a>
      <p class="descripcion-libro">${nombre_libro} Autor: ${autor} Género: ${genero} Precio: ${precio}</p>
      <button class="btn btn-danger btn-sm delete-btn">Eliminar</button>
      <button class="btn btn-warning btn-sm edit-btn">Editar</button>
    </div>
  `
  const deleteButton = article.querySelector(".delete-btn");
  deleteButton.addEventListener("click", async () => {
    const response = await fetch(`/api/books/${id_libros}`, {
      method: "DELETE",
    });
    const data = await response.json();
    rmBook(data.id_libros);
  });

  const editButton = article.querySelector(".edit-btn");
  editButton.addEventListener("click", async () => {
    books_form["id_libros"].value = id_libros;
    books_form["nombre_libro"].value = nombre_libro;
    books_form["autor"].value = autor;
    books_form["genero"].value = genero;
    books_form["precio"].value = precio;
  });

  booksList.appendChild(article);
}

function rmBook(id_libros) {
  const row = document.querySelector(`#book-${id_libros}`);
  row.remove();
}


window.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("/api/books");
  const data = await response.json();
  for (const book of data) {
    // console.log(book)
    addBookRow(
      book.id_libros,
      book.nombre_libro,
      book.autor,
      book.precio,
      book.genero,
      book.imagen,
    );
  }
});
