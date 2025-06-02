describe("/api/tasks - Integration Tests", () => {
  let token;
  const baseUrl = `http://localhost:9000`;
  let createdTasks = [];

  const testTasks = [
    {
      title: "Task One",
      description: "Alpha task",
      status: "pending",
    },
    {
      title: "Task Two",
      description: "Beta task",
      status: "completed",
    },
    {
      title: "Important Meeting",
      description: "Discuss plans",
      status: "in_progress",
    },
  ];

  before(function () {
    cy.request("POST", `${baseUrl}/api/auth/login`, {
      email: "test@test.com",
      password: "Test123!",
    }).then((res) => {
      token = res.body.token;

      testTasks.forEach((task) => {
        cy.request({
          method: "POST",
          url: `${baseUrl}/api/tasks`,
          body: task,
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
          createdTasks.push(res.body.task)
        });
      });
    });
  });

  describe("GET /api/tasks - get all tasks", () => {
    it("returns all tasks for authenticated user", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/api/tasks`,
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.tasks).to.be.an("array");
        expect(res.body.tasks.length).to.be.gte(3);
      });
    });

    it("filters tasks by status", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/api/tasks?status=completed`,
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        expect(res.status).to.eq(200);
        res.body.tasks.forEach((task) => {
          expect(task.status).to.eq("completed");
        });
      });
    });

    it("filters tasks by search", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/api/tasks?search=meeting`,
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        expect(res.status).to.eq(200);
        res.body.tasks.forEach((task) => {
          expect(
            task.title.toLowerCase().includes("meeting") ||
              task.description.toLowerCase().includes("meeting"),
          ).to.be.true;
        });
      });
    });

    it("applies pagination", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/api/tasks?page=1&limit=2`,
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.tasks.length).to.be.at.most(2);
      });
    });

    it("returns 401 for unauthenticated request", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/api/tasks`,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });

  describe("GET /api/tasks/{id} - get task by id", () => {
    it("should return 200 and the task if it exists", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/api/tasks/${createdTasks[0]._id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property("status", "success");
        expect(res.body.task).to.have.property("_id", createdTasks[0]._id);
      });
    });

    it("should return 404 if the task does not exist", () => {
      const fakeId = "aaaaaaaaaaaaaaaaaaaaaaaa";

      cy.request({
        method: "GET",
        url: `${baseUrl}/api/tasks/${fakeId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(404);
        expect(res.body).to.have.property("error", "Task with forwarded ID not found");
      });
    });

    it("should return 401 if no token is provided", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/api/tasks/${createdTasks[0]._id}`,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });
});
