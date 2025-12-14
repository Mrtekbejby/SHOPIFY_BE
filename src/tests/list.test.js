import request from "supertest";
import { jest } from "@jest/globals";

// MOCK AUTH 
await jest.unstable_mockModule("../middleware/auth.js", () => ({
  requireProfile: () => (req, res, next) => {
    req.user = { id: "user123" };
    next();
  },
  signToken: jest.fn(() => "fake-token")
}));

// MOCK DB MODEL
await jest.unstable_mockModule("../models/listModel.js", () => ({
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndDelete: jest.fn()
  }
}));

const { default: app } = await import("../server.js");
const { default: List } = await import("../models/listModel.js");

describe("GET /list/get", () => {
  // Returns all shopping lists owned by the logged-in user

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("happy day – returns list of lists", async () => {
    List.find.mockResolvedValue([
      { name: "My list 1" },
      { name: "My list 2" }
    ]);

    const res = await request(app).get("/list/get");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it("DB error – returns 500", async () => {
    List.find.mockRejectedValue(new Error("DB error"));

    const res = await request(app).get("/list/get");

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Failed to load lists");
  });
});

describe("POST /list/create", () => {
  // Creates a new shopping list for the logged-in user

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("happy day – creates new list", async () => {
    List.findOne.mockResolvedValue(null);
    List.create.mockResolvedValue({ name: "New list" });

    const res = await request(app)
      .post("/list/create")
      .send({ name: "New list" });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("New list");
  });

  it("missing name – returns 400", async () => {
    const res = await request(app)
      .post("/list/create")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Name is required");
  });
});

describe("GET /list/get/:id", () => {
  // Returns single shopping list by id

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("happy day – returns list", async () => {
    List.findById.mockResolvedValue({ name: "My list" });

    const res = await request(app).get("/list/get/123");

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("My list");
  });

  it("list not found – returns 404", async () => {
    List.findById.mockResolvedValue(null);

    const res = await request(app).get("/list/get/123");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("List not found");
  });
});

describe("POST /list/update/:id", () => {
  // Updates shopping list name

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("happy day – updates list name", async () => {
    const list = {
      ownerId: "user123",
      name: "Old name",
      save: jest.fn()
    };

    List.findById.mockResolvedValue(list);
    List.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post("/list/update/123")
      .send({ name: "New name" });

    expect(res.status).toBe(200);
    expect(list.name).toBe("New name");
  });

  it("forbidden – not owner", async () => {
    List.findById.mockResolvedValue({ ownerId: "otherUser" });

    const res = await request(app)
      .post("/list/update/123")
      .send({ name: "New name" });

    expect(res.status).toBe(403);
  });
}); 
describe("DELETE /list/delete/:id", () => {
  // Deletes shopping list

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("happy day – deletes list", async () => {
    List.findById.mockResolvedValue({ ownerId: "user123" });
    List.findByIdAndDelete.mockResolvedValue(true);

    const res = await request(app).delete("/list/delete/123");

    expect(res.status).toBe(204);
  });

  it("list not found – returns 404", async () => {
    List.findById.mockResolvedValue(null);

    const res = await request(app).delete("/list/delete/123");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("List not found");
  });
});
