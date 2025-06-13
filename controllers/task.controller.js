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

const getAllTasks = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const order = req.query.sort === "asc" ? 1 : -1;
    const sortField = "createdAt";

    const query = {
      userId: req.user._id,
    };

    if (status) {
      query.status = status;
    }

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [{ title: regex }, { description: regex }];
    }

    const allTasks = await Task.find(query)
      .sort({ [sortField]: order })
      .skip(skip)
      .limit(limit);
    const total = await Task.countDocuments();

    return res.status(200).json({
      tasks: allTasks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const query = {
      _id: id,
      userId: req.user._id,
    };

    const task = await Task.findOne(query);

    if (!task) {
      return res.status(404).json({
        error: "Task with forwarded ID not found",
      });
    }

    return res.status(200).json({
      status: "success",
      task,
    });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const id = req.params.id;

    const query = {
      _id: id,
      userId: req.user._id,
    };

    const task = await Task.findOne(query);

    if (!task) {
      return res.status(404).json({
        error: "Task with forwarded ID not found",
      });
    }

    const newTask = {
      id,
      title: req.body.title ? req.body.title : task.title,
      description: req.body.description ? req.body.description : task.description,
      status: req.body.status ? req.body.status : task.status,
      userId: req.user._id,
    };

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        ...newTask,
        $inc: { __v: 1 }
      },
      { new: true },
    );

    return res.status(200).json({
      status: "success",
      task: updatedTask,
    });

  } catch (error) {
    next(error);
  }
}

const deleteTask = async (req, res, next) => {
  try {
    const id = req.params.id;

    const query = {
      _id: id,
      userId: req.user._id,
    };

    const task = await Task.findOne(query);

    if (!task) {
      return res.status(404).json({
        error: "Task with forwarded ID not found",
      });
    }

    await Task.findByIdAndDelete(id);

    return res.status(200).json({
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

export { createTask, getAllTasks, getTaskById, updateTask, deleteTask };
