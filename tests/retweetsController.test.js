const {
  getAllPostRetweets,
  createRetweet,
  updateRetweet,
  deleteRetweet,
} = require("../controllers/retweetsController");
const retweetsModel = require("../models/retweetsModel");
const postModel = require("../models/postModel");
const notificitionsModel = require("../models/notificitionsModel");

jest.mock("../models/retweetsModel");
jest.mock("../models/postModel");
jest.mock("../models/notificitionsModel");

describe("test suite: retweetsController", () => {
  it("should get all retweets for a post", async () => {
    const fakeRetweets = [
      {
        post: "6955f446ea685fd286802437",
        user: "6955eb835ac9756f876f6cf7",
        ReComment: "this is a re comment",
      },
    ];

    retweetsModel.find.mockResolvedValue(fakeRetweets);

    const req = {
      params: { postId: "fakePostId" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAllPostRetweets(req, res);

    expect(retweetsModel.find).toHaveBeenCalledWith({ post: "fakePostId" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      retweets: fakeRetweets,
    });
  });

  it("should create a retweet", async () => {
    const fakePost = {
      title: "fakeTitle",
      createdBy: "fakeUserId",
      likesCount: 1,
      likedBy: ["fakeUserId"],
    };
    const fakeRetweet = [
      {
        post: "fakePostId",
        user: "fakeUserId",
        ReComment: "fakeRecomment",
      },
    ];
    const fakeNotifiction = {
      recipient: "findPost.createdBy",
      actor: "userId",
      type: "retweet",
      post: "postId",
      read: false,
    };

    postModel.findOne.mockResolvedValue(fakePost);
    retweetsModel.findOne.mockResolvedValue(null);
    retweetsModel.create.mockResolvedValue(fakeRetweet);
    notificitionsModel.create(fakeNotifiction);

    const req = {
      params: { postId: "fakePostId" },
      user: { userId: "fakeUserId" },
      body: { ReComment: "fakeRecomment" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createRetweet(req, res);

    expect(postModel.findOne).toHaveBeenCalledWith({ _id: "fakePostId" });
    expect(retweetsModel.findOne).toHaveBeenCalledWith({
      user: "fakeUserId",
      post: "fakePostId",
    });
    expect(retweetsModel.create).toHaveBeenCalledWith({
      post: "fakePostId",
      user: "fakeUserId",
      ReComment: "fakeRecomment",
    });
    expect(notificitionsModel.create).toHaveBeenCalledWith({
      recipient: "fakeUserId",
      actor: "fakeUserId",
      type: "retweet",
      post: "fakePostId",
      read: false,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      retweet: fakeRetweet,
    });
  });

  it("should update a retweet", async () => {
    const fakeRetweet = [
      {
        post: "6955f446ea685fd286802437",
        user: "6955eb835ac9756f876f6cf7",
        ReComment: "this is a re comment",
      },
    ];

    retweetsModel.findOne.mockResolvedValue(fakeRetweet);
    retweetsModel.findOneAndUpdate.mockResolvedValue(fakeRetweet);

    const req = {
      body: { ReComment: "fakeRecomment" },
      params: { retweetId: "fakeRetweetId" },
      user: { userId: "fakeUserId" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updateRetweet(req, res);

    expect(retweetsModel.findOne).toHaveBeenCalledWith({
      _id: "fakeRetweetId",
      user: "fakeUserId",
    });
    expect(retweetsModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "fakeRetweetId", user: "fakeUserId" },
      { ReComment: "fakeRecomment" },
      {
        new: true,
        runValidators: true,
      }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      retweet: fakeRetweet,
    });
  });

  it("should delete a retweet", async () => {
    const fakeRetweet = [
      {
        post: "6955f446ea685fd286802437",
        user: "6955eb835ac9756f876f6cf7",
        ReComment: "this is a re comment",
      },
    ];

    retweetsModel.findOne.mockResolvedValue(fakeRetweet);
    retweetsModel.findOneAndDelete(fakeRetweet);

    const req = {
      params: { retweetId: "fakeRetweetId" },
      user: { userId: "fakeUserId" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteRetweet(req, res);

    expect(retweetsModel.findOne).toHaveBeenCalledWith({
      _id: "fakeRetweetId",
      user: "fakeUserId",
    });
    expect(retweetsModel.findOneAndDelete).toHaveBeenCalledWith({
      _id: "fakeRetweetId",
      user: "fakeUserId",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "retweet succefully deleted",
    });
  });
});
