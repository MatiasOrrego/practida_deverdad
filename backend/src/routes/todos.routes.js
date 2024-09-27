import { Router } from "express";
import { ctrlTodos } from "../controllers/todos.controllers.js";
import { validateJWT } from "../middlewares/validar-jwt.js";

const todosRouter = Router();

todosRouter.get("/",validateJWT ,ctrlTodos.get);
todosRouter.post("/",validateJWT ,ctrlTodos.create);
todosRouter.put("/:id",validateJWT ,ctrlTodos.update);
todosRouter.delete("/:id",validateJWT ,ctrlTodos.delete);

export { todosRouter };
