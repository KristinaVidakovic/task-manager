import Task from "../models/task.model.js";

const createTask = async (req, res, next) => {
  try {
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

const getAllTasks = async (req, res, next) => {
  try {
    const status = req.query.status;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const order = req.query.sort === 'asc' ? 1 : -1;
    const sortField = 'createdAt';

    const query = {
      userId: req.user._id,
    };

    if (status) {
      query.status = status;
    }

    const allTasks = await Task.find(query).sort({ [sortField]: order })
      .skip(skip)
      .limit(limit);
    const total = await Task.countDocuments();

    return res.status(200).json({
      tasks: allTasks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

export { createTask, getAllTasks };
