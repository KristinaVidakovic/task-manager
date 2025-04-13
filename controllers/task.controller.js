import Task from "../models/task.model.js";

const createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        error: "Missing values for title or/and description",
      });
    }

    const task = await Task.create({
      ...req.body,
      userId: req.user._id,
    });

    return res.status(201).json({
      status: "success",
      task,
    });
  } catch (error) {
    next(error);
  }
};

export { createTask };
