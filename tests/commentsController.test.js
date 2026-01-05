const {
  getAllPostComments,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentsController");
const commentsModel = require("../models/commentsModel");
const postModel = require("../models/postModel");
const notificationsModel = require("../models/notificitionsModel");

jest.mock("../models/commentsModel");
jest.mock("../models/postModel");
jest.mock("../models/notificitionsModel");

describe("test suite: commentsController", () => {
  it("should get all comments of a post", async () => {
    const fakeComment = [
      {
        createdBy: "fakeUserId",
        post: "fakePostId",
      },
    ];
    commentsModel.find.mockResolvedValue(fakeComment);

    const req = {
      user: { userId: "fakeUserId" },
      params: { postId: "fakeUserId" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAllPostComments(req, res);

    expect(commentsModel.find).toHaveBeenCalledWith({
      createdBy: "fakeUserId",
      post: "fakeUserId",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      comments: [
        {
          createdBy: "fakeUserId",
          post: "fakePostId",
        },
      ],
    });
  });

  it("should create a comment", async () => {
    const fakePost = {
      _id: "postId",
      createdBy: "post.createdBy",
    };
    const fakeComment = {
      comment: "fakeComment",
      createdBy: "fakeUserId",
      post: "fakePostId",
    };
    const fakeNotificition = {
      recipient: "postId",
      actor: "fakeUserId",
      type: "comment",
      post: "fakePostId",
      read: false,
    };

    postModel.findOne.mockResolvedValue(fakePost);
    commentsModel.create.mockResolvedValue(fakeComment);
    postModel.findById.mockResolvedValue(fakePost);
    notificationsModel.create.mockResolvedValue(fakeNotificition);

    const req = {
      body: { comment: "fakeComment" },
      user: { userId: "fakeUserId" },
      params: { postId: "fakePostId" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createComment(req, res);

    expect(postModel.findOne).toHaveBeenCalledWith({ _id: "fakePostId" });
    expect(commentsModel.create).toHaveBeenCalledWith({
      comment: "fakeComment",
      createdBy: "fakeUserId",
      post: "fakePostId",
    });
    expect(postModel.findById).toHaveBeenCalledWith("fakePostId");
    expect(notificationsModel.create).toHaveBeenCalledWith({
      recipient: "post.createdBy",
      actor: "fakeUserId",
      type: "comment",
      post: "fakePostId",
      read: false,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      comments: {
        comment: "fakeComment",
        createdBy: "fakeUserId",
        post: "fakePostId",
      },
    });
  });

  it("should update a comment", async () => {
    const fakeComment = {
      comment: "fakeComment",
      _id: "fakeCommentId",
      createdBy: "fakeUserId",
    };

    commentsModel.findOneAndUpdate.mockResolvedValue(fakeComment);

    const req = {
      body: { comment: "fakeComment" },
      params: { commentId: "fakeCommentId" },
      user: { userId: "fakeUserId" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updateComment(req, res);

    expect(commentsModel.findOneAndUpdate).toHaveBeenCalledWith(
      {
        _id: "fakeCommentId",
        createdBy: "fakeUserId",
      },
      { comment: "fakeComment" },
      {
        new: true,
        runValidators: true,
      }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      comments: {
        comment: "fakeComment",
        _id: "fakeCommentId",
        createdBy: "fakeUserId",
      },
    });
  });

  it("should delete a comment", async () => {
    const fakeComment = {
      _id: "fakeCommentId",
      createdBy: "fakeUserId",
    };

    commentsModel.findOneAndDelete.mockResolvedValue(fakeComment);

    const req = {
      params: { commentId: "fakeCommentId" },
      user: { userId: "fakeUserId" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteComment(req, res);

    expect(commentsModel.findOneAndDelete).toHaveBeenCalledWith({
      _id: "fakeCommentId",
      createdBy: "fakeUserId",
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "comment deleted" });
  });
});
