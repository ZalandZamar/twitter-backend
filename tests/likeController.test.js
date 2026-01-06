const likeController = require("../controllers/likeController");
const postModel = require("../models/postModel");
const notificationsModel = require("../models/notificitionsModel");

jest.mock("../models/postModel");
jest.mock("../models/notificitionsModel");

describe("test suite: likeController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should like a post", async () => {
    const creatorId = "creatorId";
    const fakeNotificition = {
      recipient: "post.createdBy",
      actor: "fakeUserId",
      type: "like",
      post: "fakePostId",
      read: false,
    };

    postModel.findById.mockResolvedValue({
      _id: "fakePostId",
      createdBy: creatorId,
    });
    postModel.findOneAndUpdate.mockResolvedValue({
      _id: "fakePostId",
      likesCount: 1,
    });
    postModel.findOne.mockResolvedValue(null);
    notificationsModel.create.mockResolvedValue(fakeNotificition);

    const req = {
      user: { userId: "fakeUserId" },
      params: { postId: "fakePostId" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await likeController(req, res);

    expect(postModel.findById).toHaveBeenCalledWith("fakePostId");
    expect(postModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "fakePostId" },
      {
        $inc: { likesCount: 1 },
        $addToSet: { likedBy: "fakeUserId" },
      },
      { new: true }
    );
    expect(postModel.findOne).toHaveBeenCalledWith({
      likedBy: "fakeUserId",
      _id: "fakePostId",
    });
    expect(notificationsModel.create).toHaveBeenCalledWith({
      recipient: "creatorId",
      actor: "fakeUserId",
      type: "like",
      post: "fakePostId",
      read: false,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      post: {
        _id: "fakePostId",
        likesCount: 1,
      },
    });
  });
  it("should unlike a post", async () => {
    const creatorId = "creatorId";
    const fakeNotificition = {
      recipient: "post.createdBy",
      actor: "fakeUserId",
      type: "like",
      post: "fakePostId",
      read: false,
    };

    postModel.findById.mockResolvedValue({
      _id: "fakePostId",
      createdBy: creatorId,
    });
    postModel.findOneAndUpdate.mockResolvedValue({
      _id: "fakePostId",
      likesCount: 0,
    });
    postModel.findOne.mockResolvedValue({
      likedBy: "fakeUserId",
      _id: "fakePostId",
    });
    notificationsModel.create.mockResolvedValue(fakeNotificition);

    const req = {
      user: { userId: "fakeUserId" },
      params: { postId: "fakePostId" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await likeController(req, res);

    expect(postModel.findById).toHaveBeenCalledWith("fakePostId");
    expect(postModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "fakePostId" },
      {
        $inc: { likesCount: -1 },
        $pull: { likedBy: "fakeUserId" },
      },
      { new: true }
    );
    expect(postModel.findOne).toHaveBeenCalledWith({
      likedBy: "fakeUserId",
      _id: "fakePostId",
    });
    expect(notificationsModel.create).toHaveBeenCalledWith({
      recipient: "creatorId",
      actor: "fakeUserId",
      type: "like",
      post: "fakePostId",
      read: false,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      post: {
        _id: "fakePostId",
        likesCount: 0,
      },
    });
  });
});
