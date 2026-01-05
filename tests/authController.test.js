const { register, logIn } = require("../controllers/authController");
const userModel = require("../models/userModel");
jest.mock("../models/userModel");

describe("test suite: authController", () => {
  it("should register an user", async () => {
    const fakeUser = {
      name: "trump",
      accessToken: jest.fn().mockReturnValue("Fake-Token"),
    };

    userModel.create.mockReturnValue(fakeUser);

    const req = {
      body: {
        name: "trump",
        email: "trump@gmail.com",
        password: "trump",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await register(req, res);

    expect(userModel.create).toHaveBeenCalledWith({
      name: "trump",
      email: "trump@gmail.com",
      password: "trump",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      user: { name: "trump" },
      token: "Fake-Token",
    });
  });

  it("should login an user", async () => {
    const fakeUser = {
      name: "trump",
      accessToken: jest.fn().mockResolvedValue("fake-access-token"),
      refreshToken: jest.fn().mockReturnValue("fake-refresh-token"),
      comparePassword: jest.fn().mockResolvedValue(true),
      save: jest.fn().mockResolvedValue(true),
    };

    userModel.findOne.mockResolvedValue(fakeUser);

    const req = {
      body: {
        email: "trump@gmail.com",
        password: "trumppassword",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };

    await logIn(req, res);

    expect(userModel.findOne).toHaveBeenCalledWith({
      email: "trump@gmail.com",
    });
    expect(fakeUser.comparePassword).toHaveBeenCalledWith("trumppassword");
    expect(fakeUser.accessToken).toHaveBeenCalled();
    expect(fakeUser.refreshToken).toHaveBeenCalled();
    expect(fakeUser.save).toHaveBeenCalled();
  });
});
