import { v4 as uuidv4 } from "uuid";
import Task from "../../models/task.model.js";
import { getAllTasks, getTaskById } from "../../controllers/task.controller.js";

jest.mock("../../models/task.model.js");

describe("TaskController tests", () => {
  let req, res, next;
  const id = uuidv4();
  const userId = uuidv4();

  beforeEach(() => {
    req = {
      params: { id: id },
      user: { _id: userId },
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

  describe("getAllTasks tests", () => {
    it("returns paginated tasks for authenticated user", async () => {
      const tasksMock = [
        { title: "Task 1", description: "description", status: "completed" },
        {
          title: "Task 2",
          description: "description 2",
          status: "in-progress",
        },
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

      expect(Task.find).toHaveBeenCalledWith({ userId: userId });
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
        userId: userId,
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
        userId: userId,
        $or: [
          { title: expect.any(RegExp) },
          { description: expect.any(RegExp) },
        ],
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

  describe("getTaskById tests", () => {
    it('should return 200 and the task if found', async () => {
      const mockTask = { _id: id, userId: userId, title: 'Test Task' };
      Task.findOne.mockResolvedValue(mockTask);

      await getTaskById(req, res, next);

      expect(Task.findOne).toHaveBeenCalledWith({
        _id: id,
        userId: userId,
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        task: mockTask,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 404 if task is not found', async () => {
      Task.findOne.mockResolvedValue(null);

      await getTaskById(req, res, next);

      expect(Task.findOne).toHaveBeenCalledWith({
        _id: id,
        userId: userId,
      });

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Task with forwarded ID not found',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if something goes wrong', async () => {
      const error = new Error('DB error');
      Task.findOne.mockRejectedValue(error);

      await getTaskById(req, res, next);

      expect(Task.findOne).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
