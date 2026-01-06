const {
  getAllNotifictions,
} = require("../controllers/notificationsController");
const notificationsModel = require("../models/notificitionsModel");

jest.mock("../models/notificitionsModel");

describe("test suite: notificitionController", () => {
  it("should find all user notificition", async () => {
    const fakeNotifiction = {
      recipient: "fakeUserId",
      actor: "6955eb835ac9756f876f6cf7",
      type: "comment",
      post: "6957a5b75834121e82ee7bdd",
      read: false,
    };

    notificationsModel.find.mockResolvedValue([fakeNotifiction]);

    const req = {
      user: { userId: "fakeUserId" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAllNotifictions(req, res);

    expect(notificationsModel.find).toHaveBeenCalledWith({
      recipient: "fakeUserId",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      notifications: [fakeNotifiction],
    });
  });
});
