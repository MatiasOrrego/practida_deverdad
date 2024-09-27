import { database } from "../db/database.js";

export const ctrlTodos = {
  get: (req, res) => {
    const userId = req.user.id;
    const todos = database.todos.filter((todo) => todo.owner === userId);
    res.json({ todos });
  },

  create: (req, res) => {
    const { title, completed } = req.body;
    const id = new Date().getTime();
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({ message: "Titulo requerido" });
    } else if (typeof title !== "string") {
      return res.status(400).json({ message: "Titulo debe ser un string" });
    } else if (!title.trim()) {
      return res.status(400).json({ message: "Titulo no puede ser vacío" });
    }

    if (typeof completed !== "boolean") {
      return res.status(400).json({ message: "Completed debe ser un booleano" });
    } else if (completed === undefined) {
      return res.status(400).json({ message: "Completed requerido" });
    }

    const newTodo = {
      id: id,
      title: title,
      completed: completed,
      owner: userId,
    };

    database.todos.push(newTodo);
    res.status(201).json({ message: "Tarea creada exitosamente", todo: newTodo });
  },

  update: (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;
    const userId = req.user.id;
    const todo = database.todos.find((todo) => todo.id === Number(id));

    if (!todo) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    if (todo.owner !== userId) {
      return res.status(403).json({ message: "No tienes permiso para modificar esta Tarea" });
    }

    if (title) {
      if (typeof title !== "string") {
        return res.status(400).json({ message: "Titulo debe ser un string" });
      } else if (!title.trim()) {
        return res.status(400).json({ message: "Titulo no puede ser vacío" });
      }
      todo.title = title;
    }

    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res.status(400).json({ message: "Completed debe ser un booleano" });
      }
      todo.completed = completed;
    }

    res.json({ message: "Tarea actualizada exitosamente", todo });
  },

  delete: (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const todoIndex = database.todos.findIndex((todo) => todo.id === Number(id));

    if (todoIndex === -1) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    if (database.todos[todoIndex].owner !== userId) {
      return res.status(403).json({ message: "No tienes permiso para eliminar esta Tarea" });
    }

    database.todos.splice(todoIndex, 1);
    res.json({ message: "Tarea eliminada exitosamente" });
  },
};