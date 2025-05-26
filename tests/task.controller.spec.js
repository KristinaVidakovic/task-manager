import { v4 as uuidv4 } from "uuid";
import Task from "../models/task.model.js";
import { getAllTasks } from "../controllers/task.controller.js";

jest.mock("../models/task.model");

describe("getAllTasks controller", () => {
  let req, res, next;
  const id = uuidv4();

  beforeEach(() => {
    req = {
      user: { _id: id },
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns paginated tasks for authenticated user", async () => {
    const tasksMock = [
      { title: "Task 1", description: "description", status: "completed" },
      { title: "Task 2", description: "description 2", status: "in-progress" },
    ];

    Task.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(tasksMock),
        }),
      }),
    });

    Task.countDocuments.mockResolvedValue(2);

    await getAllTasks(req, res, next);

    expect(Task.find).toHaveBeenCalledWith({ userId: id });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      tasks: tasksMock,
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  });

  it("filters tasks by status", async () => {
    req.query.status = "pending";

    Task.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([]),
        }),
      }),
    });

    Task.countDocuments.mockResolvedValue(0);

    await getAllTasks(req, res, next);

    expect(Task.find).toHaveBeenCalledWith({
      userId: id,
      status: "pending",
    });
  });

  it("searches tasks by title and description", async () => {
    req.query.search = "meeting";

    Task.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([]),
        }),
      }),
    });

    Task.countDocuments.mockResolvedValue(0);

    await getAllTasks(req, res, next);

    expect(Task.find).toHaveBeenCalledWith({
      userId: id,
      $or: [{ title: expect.any(RegExp) }, { description: expect.any(RegExp) }],
    });
  });

  it("calls next with error when something fails", async () => {
    const error = new Error("Database error");
    Task.find.mockImplementation(() => {
      throw error;
    });

    await getAllTasks(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
