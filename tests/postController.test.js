const {
  getAllPosts,
  getUserAllPosts,
  getUserPost,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const postModel = require("../models/postModel");

jest.mock("../models/postModel");

describe("test suite: postController", () => {
  it("should get all posts in the collectoin", async () => {
    const createdBy = "fakeUser";

    const fakePosts = {
      title: "new post",
      createdBy: "fakeUser",
      likesCount: 1,
      likedBy: ["fakeUser"],
    };

    postModel.find.mockResolvedValue([fakePosts]);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAllPosts(req, res);

    expect(postModel.find).toHaveBeenCalledWith({});
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      post: [fakePosts],
      NbH: [fakePosts].length,
    });
  });

  it("should get all user posts", async () => {
    const fakePosts = {
      title: "new post",
      createdBy: "fakeUserId",
      likesCount: 1,
      likedBy: ["fakeUserId"],
    };

    postModel.find.mockResolvedValue([fakePosts]);

    const req = {
      user: { userId: "fakeUserId" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getUserAllPosts(req, res);

    expect(postModel.find).toHaveBeenCalledWith({ createdBy: "fakeUserId" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      post: [fakePosts],
      nbH: [fakePosts].length,
    });
  });

  it("should get a single post of an user", async () => {
    const fakePost = {
      title: "new post",
      createdBy: "fakeUserId",
      likesCount: 1,
      likedBy: ["fakeUserId"],
    };

    postModel.findOne.mockResolvedValue(fakePost);

    const req = {
      user: { userId: "fakeUserId" },
      params: { postId: "fakePostId" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getUserPost(req, res);

    expect(postModel.findOne).toHaveBeenCalledWith({
      _id: "fakePostId",
      createdBy: "fakeUserId",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      post: fakePost,
    });
  });

  it("should create a post", async () => {
    const fakePost = {
      title: "fakeTitle",
      createdBy: "fakeUserId",
      likesCount: 1,
      likedBy: ["fakeUserId"],
    };

    postModel.create.mockResolvedValue(fakePost);

    const req = {
      user: { userId: "fakeUserId" },
      body: { title: "fakeTitle" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createPost(req, res);

    expect(postModel.create).toHaveBeenCalledWith({
      title: "fakeTitle",
      createdBy: "fakeUserId",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      post: fakePost,
    });
  });

  it("should update a post", async () => {
    const fakePost = {
      title: "fakeTitle",
      createdBy: "fakeUserId",
      likesCount: 1,
      likedBy: ["fakeUserId"],
    };

    postModel.findOneAndUpdate.mockResolvedValue(fakePost);

    const req = {
      body: { title: "fakeTitle" },
      user: { userId: "fakeUserId" },
      params: { postId: "fakePostId" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updatePost(req, res);

    expect(postModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "fakePostId", createdBy: "fakeUserId" },
      { title: "fakeTitle" },
      {
        new: true,
        runValidators: true,
      }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ post: fakePost });
  });

  it("should delete a post", async () => {
    const fakePost = {
      title: "fakeTitle",
      createdBy: "fakeUserId",
      likesCount: 1,
      likedBy: ["fakeUserId"],
    };

    postModel.findOneAndDelete.mockResolvedValue(fakePost);

    const req = {
      user: { userId: "fakeUserId" },
      params: { postId: "fakePostId" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deletePost(req, res);

    expect(postModel.findOneAndDelete).toHaveBeenCalledWith({
      _id: "fakePostId",
      createdBy: "fakeUserId",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      post: fakePost,
    });
  });
});
