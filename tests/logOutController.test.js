const handleLogOut = require("../controllers/logoutController");
const userModel = require("../models/userModel");

jest.mock("../models/userModel");

describe("test suite: logOutController", () => {
  it("should logout the user", async () => {
    const fakeUser = {
      _id: "fakeUserId",
      save: jest.fn().mockResolvedValue(true),
    };

    userModel.findById.mockResolvedValue(fakeUser);

    const req = {
      user: { userId: "fakeUserId" },
    };

    const res = {
      clearCookie: jest.fn().mockResolvedValue(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await handleLogOut(req, res);

    expect(userModel.findById).toHaveBeenCalledWith("fakeUserId");
    expect(fakeUser.save).toHaveBeenCalled();
    expect(res.clearCookie).toHaveBeenCalledWith("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "user logged out" });
  });
});
