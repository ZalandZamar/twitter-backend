const searchController = require("../controllers/searchController");
const userModel = require("../models/userModel");

jest.mock("../models/userModel");

describe("test suite: searchController", () => {
  it("should return all searches", async () => {
    const fakeResults = [
      {
        _id: "6955eb835ac9756f876f6cf7",
        name: "shrek",
        email: "shrek@gmail.com",
        score: 2.8666666666666667,
      },
    ];

    userModel.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(fakeResults),
      }),
    });

    const req = {
      query: { q: "fakeQuery" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await searchController(req, res);

    expect(userModel.find).toHaveBeenCalledWith(
      { $text: { $search: "fakeQuery" } },
      { name: 1, email: 1, score: { $meta: "textScore" } }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      searcrhResults: fakeResults,
    });
  });
});
