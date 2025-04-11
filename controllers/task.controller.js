import Task from "../models/task.model.js";

const createTask = async (req, res, next) => {
    try {
        const task = await Task.create({
            ...req.body,
            userId: req.user._id,
        });

        return res.status(201).json({
            status: "success",
            task
        });
    } catch (error) {
        next(error);
    }
}

export { createTask };