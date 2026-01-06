const refreshTOkenController = require("../controllers/refreshTokenController");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

jest.mock("../models/userModel");
jest.mock("jsonwebtoken");
jest.mock("bcryptjs");

describe("test suite: refreshTokenController", () => {
  it("should return an accessToken", async () => {
    const fakeUser = {
      _id: "fakeId",
      name: "fakeName",
      refreshTokens: "fakeRefreshToken",
    };

    jwt.verify.mockReturnValue({ userId: fakeUser._id });
    userModel.findOne.mockResolvedValue(fakeUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("fakeAccessToken");

    const req = {
      cookies: { refreshToken: "fakeRefreshToken" },
    };

    const res = {
      json: jest.fn(),
    };

    await refreshTOkenController(req, res);

    expect(jwt.verify).toHaveBeenCalledWith(
      "fakeRefreshToken",
      process.env.REFRESH_TOKEN
    );
    expect(userModel.findOne).toHaveBeenCalledWith({ _id: fakeUser._id });
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: fakeUser._id, name: fakeUser.name },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "1d",
      }
    );
    expect(res.json).toHaveBeenCalledWith({
      accessToken: "fakeAccessToken",
    });
  });
});
