const followerModel = require("../models/followerModel");
const {
  getAllUserFollowers,
  createFollower,
  deleteFollower,
} = require("../controllers/followerController");
const userModel = require("../models/userModel");
const notificationsModel = require("../models/notificitionsModel");
const { json } = require("express");

jest.mock("../models/followerModel");
jest.mock("../models/userModel");
jest.mock("../models/notificitionsModel");

describe("test suite: followerController", () => {
  it("should get all user followers", async () => {
    const fakeFollower = [
      {
        following: "fakeUserId",
        follower: {
          _id: "6957ae29e05fe2cc549f2a13",
          name: "hheee",
          email: "fhdhd@gmail.com",
        },
      },
    ];

    const mockPopulate = jest.fn().mockResolvedValue(fakeFollower);
    followerModel.find.mockReturnValue({ populate: mockPopulate });

    const followersList = fakeFollower.map((doc) => doc.follower);

    const req = {
      user: { userId: "fakeUserId" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAllUserFollowers(req, res);

    expect(followerModel.find).toHaveBeenCalledWith({
      following: "fakeUserId",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      followers: [
        {
          _id: "6957ae29e05fe2cc549f2a13",
          name: "hheee",
          email: "fhdhd@gmail.com",
        },
      ],
    });
  });

  it("should create a follower", async () => {
    const fakeFollower = {
      following: "fakeId",
      follower: "fakeUserId",
    };

    const fakeNotificition = {
      recipient: "post.createdBy",
      actor: "fakeUserId",
      type: "follow",
      read: false,
    };

    followerModel.findOne.mockResolvedValue(null);
    userModel.findOne.mockResolvedValue({ _id: "fakeId" });
    followerModel.create.mockResolvedValue(fakeFollower);
    userModel.findById.mockResolvedValue({ _id: "fakeId" });
    notificationsModel.create.mockReturnValue(fakeNotificition);

    const req = {
      params: { id: "fakeId" },
      user: { userId: "fakeUserId" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createFollower(req, res);

    expect(followerModel.findOne).toHaveBeenCalledWith({
      following: "fakeId",
      follower: "fakeUserId",
    });
    expect(userModel.findOne).toHaveBeenCalledWith({ _id: "fakeId" });
    expect(followerModel.create).toHaveBeenCalledWith({
      following: "fakeId",
      follower: "fakeUserId",
    });
    expect(userModel.findById).toHaveBeenCalledWith("fakeId");
    expect(notificationsModel.create).toHaveBeenCalledWith({
      recipient: "fakeId",
      actor: "fakeUserId",
      type: "follow",
      read: false,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      follower: {
        following: "fakeId",
        follower: "fakeUserId",
      },
    });
  });

  it("should delete a follower(unfollow)", async () => {
    const fakeFollower = {
      following: "fakeId",
      follower: "fakeUserId",
    };

    followerModel.findOneAndDelete.mockResolvedValue(fakeFollower);

    const req = {
      params: { id: "fakeId" },
      user: { userId: "fakeUserId" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteFollower(req, res);

    expect(followerModel.findOneAndDelete).toHaveBeenCalledWith({
      following: "fakeId",
      follower: "fakeUserId",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      follower: {
        following: "fakeId",
        follower: "fakeUserId",
      },
    });
  });
});
