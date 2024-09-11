import { Router } from "express";

import { Todo } from "../models/todo";

const router = Router();

let todos: Todo[] = [];

type RequestBody = { text: string };

router.get("/todos", (req, res) => {
  res.status(200).json({ todos });
});

router.post("/todos", (req, res) => {
  const { text } = req.body as RequestBody;
  const todo: Todo = { id: new Date().toISOString(), text };
  todos.push(todo);
  res.status(201).json({ message: "Success created todo.", todo });
});

router.put("/todos/:todoId", (req, res) => {
  const { todoId } = req.params;
  const { text } = req.body as RequestBody;
  const indexTodo = todos.findIndex((todo) => todo.id === todoId);
  if (!indexTodo) {
    return res.status(404).json({ message: "Could not find todo." });
  }

  todos[indexTodo].text = text;
  res
    .status(200)
    .json({ message: "Success updated todo.", todo: todos[indexTodo] });
});

router.delete("/todos/:todoId", (req, res) => {
  const { todoId } = req.params;
  todos = todos.filter((todo) => todo.id !== todoId);
  res.status(200).json({ message: "Success deleted todo." });
});

export default router;
