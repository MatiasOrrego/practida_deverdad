const fetchTodos = (tbody) => {
  fetch("http://localhost:4000/todos", {
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        alert("Error al obtener las tareas");
      }
      return response.json();
    })
    .then((data) => {
      tbody.innerHTML = "";
      data.todos.forEach((todo) => {
        const tr = document.createElement("tr");

        const td1 = document.createElement("td");
        td1.classList.add("border", "px-4", "py-2");
        td1.textContent = todo.id;

        const td2 = document.createElement("td");
        td2.classList.add("border", "px-4", "py-2");
        td2.textContent = todo.title;

        const td3 = document.createElement("td");
        td3.classList.add("border", "px-4", "py-2");
        td3.textContent = todo.completed ? "Sí" : "No";

        const td4 = document.createElement("td");
        td4.classList.add("border", "px-4", "py-2");
        td4.textContent = todo.owner;

        const td5 = document.createElement("td");
        td5.classList.add("border", "px-4", "py-2");

        const btnEdit = document.createElement("button");
        btnEdit.classList.add(
          "bg-blue-500",
          "text-white",
          "p-2",
          "rounded",
          "hover:bg-blue-600",
          "mr-2"
        );
        btnEdit.textContent = "Edit";
        btnEdit.addEventListener("click", () => {
          showModal(todo, tbody);
        });

        const btnDelete = document.createElement("button");
        btnDelete.classList.add(
          "bg-red-500",
          "text-white",
          "p-2",
          "rounded",
          "hover:bg-red-600",
          "mr-2"
        );
        btnDelete.textContent = "Delete";

        btnDelete.addEventListener("click", () => {
          fetch(`http://localhost:4000/todos/${todo.id}`, {
            method: "DELETE",
            credentials: "include",
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              console.log("Tarea eliminada:", data);
              alert("Tarea eliminada exitosamente");
              fetchTodos(tbody); // Volver a obtener la lista de tareas
            })
            .catch((error) => {
              console.error("Error al eliminar tarea:", error);
              alert("Error al eliminar tarea: " + error.message);
            });
        });

        td5.appendChild(btnDelete);
        td5.appendChild(btnEdit);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tbody.appendChild(tr);
      });
    })
    .catch((error) => {
      console.error("Error al obtener las tareas:", error);
      alert("Error al obtener las tareas: " + error.message);
    });
};

const showModal = (todo, tbody) => {
  const modal = document.createElement("div");
  modal.classList.add(
    "fixed",
    "inset-0",
    "bg-gray-800",
    "bg-opacity-75",
    "flex",
    "items-center",
    "justify-center"
  );

  const modalContent = document.createElement("div");
  modalContent.classList.add("bg-white", "p-4", "w-1/3");

  const title = document.createElement("h2");
  title.classList.add("text-2xl", "font-bold", "mb-4");
  title.textContent = todo.id ? `Edit Todo ${todo.id}` : "Create Todo";
  modalContent.appendChild(title);

  const inputTitle = document.createElement("input");
  inputTitle.value = todo.title || "";
  inputTitle.classList.add("border", "border-gray-400", "p-2", "mb-4", "w-full");
  modalContent.appendChild(inputTitle);

  const completed = document.createElement("input");
  completed.type = "checkbox";
  completed.checked = todo.completed || false;
  modalContent.appendChild(completed);
  modalContent.appendChild(document.createTextNode("Completed"));

  const btnSave = document.createElement("button");
  btnSave.classList.add(
    "bg-green-500",
    "text-white",
    "p-2",
    "rounded",
    "hover:bg-green-600",
    "mr-2"
  );
  btnSave.textContent = "Save";
  btnSave.addEventListener("click", () => {
    if (todo.id) {
      const updatedTodo = {
        title: inputTitle.value,
        completed: completed.checked,
      };
      fetch(`http://localhost:4000/todos/${todo.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTodo),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Tarea actualizada:", data);
          alert("Tarea actualizada exitosamente");
          modal.remove();
          fetchTodos(tbody); // Volver a obtener la lista de tareas
        })
        .catch((error) => {
          console.error("Error al actualizar tarea:", error);
          alert("Error al actualizar tarea: " + error.message);
        });
    } else {
      const newTodo = {
        title: inputTitle.value,
        completed: completed.checked,
      };
      fetch("http://localhost:4000/todos", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Tarea creada:", data);
          alert("Tarea creada exitosamente");
          modal.remove();
          fetchTodos(tbody); // Volver a obtener la lista de tareas
        })
        .catch((error) => {
          console.error("Error al crear tarea:", error);
          alert("Error al crear tarea: " + error.message);
        });
    }
  });

  modalContent.appendChild(btnSave);

  const btnClose = document.createElement("button");
  btnClose.classList.add(
    "bg-red-500",
    "text-white",
    "p-2",
    "rounded",
    "hover:bg-red-600",
    "mr-2"
  );
  btnClose.textContent = "Close";
  btnClose.addEventListener("click", () => {
    modal.remove();
  });

  modalContent.appendChild(btnClose);

  modal.appendChild(modalContent);
  document.body.appendChild(modal);
};

export const todosPage = () => {
  const container = document.createElement("div");

  container.classList.add(
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "h-screen",
    "bg-gray-200"
  );

  const btnHome = document.createElement("button");
  btnHome.classList.add(
    "bg-blue-500",
    "text-white",
    "p-2",
    "rounded",
    "hover:bg-blue-600",
    "mb-4"
  );
  btnHome.textContent = "Home";
  btnHome.addEventListener("click", () => {
    window.location.pathname = "/home";
  });

  const title = document.createElement("h1");
  title.classList.add("text-3xl", "font-bold", "mb-4");
  title.textContent = "List of Todos";

  const table = document.createElement("table");
  table.classList.add(
    "w-1/2",
    "bg-white",
    "shadow-md",
    "h-[700px]",
    "overflow-y-scroll"
  );

  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  const th1 = document.createElement("th");
  th1.classList.add("border", "px-4", "py-2");
  th1.textContent = "ID";

  const th2 = document.createElement("th");
  th2.classList.add("border", "px-4", "py-2");
  th2.textContent = "Title";

  const th3 = document.createElement("th");
  th3.classList.add("border", "px-4", "py-2");
  th3.textContent = "Completed";

  const th4 = document.createElement("th");
  th4.classList.add("border", "px-4", "py-2");
  th4.textContent = "Owner Id";

  const th5 = document.createElement("th");
  th5.classList.add("border", "px-4", "py-2");
  th5.textContent = "Actions";

  tr.appendChild(th1);
  tr.appendChild(th2);
  tr.appendChild(th3);
  tr.appendChild(th4);
  tr.appendChild(th5);

  thead.appendChild(tr);

  const tbody = document.createElement("tbody");
  tbody.classList.add("text-center");
  table.appendChild(thead);
  table.appendChild(tbody);

  container.appendChild(btnHome);

  fetchTodos(tbody); // Obtener la lista de tareas al cargar la página

  const addTodo = document.createElement("button");
  addTodo.classList.add(
    "bg-green-500",
    "text-white",
    "p-2",
    "rounded",
    "hover:bg-green-600",
    "mb-4"
  );
  addTodo.textContent = "Add Todo";
  addTodo.addEventListener("click", () => {
    showModal({}, tbody);
  });

  container.appendChild(addTodo);
  container.appendChild(title);
  container.appendChild(table);

  return container;
};