const followerModel = require("../models/followerModel");
const postModel = require("../models/postModel");
const { getFollowingPosts } = require("../controllers/feedController");
const mongoose = require("mongoose");

jest.mock("../models/followerModel");
jest.mock("../models/postModel");

describe("test suite: feedController", () => {
  it("should get posts and retweets the current user follows as the user feed", async () => {
    const fakeFeed = [
      {
        _id: "6959cb591c69fa92edee7e24",
        title: "new post",
        createdBy: "6955eb835ac9756f876f6cf7",
        createdAt: "2026-01-04T02:07:21.783Z",
        type: "post",
      },
      {
        _id: "6957b4291dcbcdbcd4597bde",
        post: "6955f446ea685fd286802437",
        user: "6955eb835ac9756f876f6cf7",
        ReComment: "this is a re comment",
        createdAt: "2026-01-02T12:03:53.767Z",
        type: "retweet",
      },
      {
        _id: "6957b2507a0bf7b54c2effcd",
        createdBy: "6955eb835ac9756f876f6cf7",
        createdAt: "2026-01-02T11:56:00.409Z",
        type: "post",
      },
    ];
    const fakeFollowersDocsArray = [
      {
        follower: "6955eb835ac9756f876f6cf7",
      },
      {
        follower: "6955eb835ac9756f876f6cf7",
      },
    ];

    const fakeFollowingUserIds = fakeFollowersDocsArray.map(
      (doc) => new mongoose.Types.ObjectId(doc.follower)
    );

    fakeFollowingUserIds.push(
      new mongoose.Types.ObjectId("6955eb835ac9756f876f6cf7")
    );

    const mockSelect = jest.fn().mockResolvedValue(fakeFollowersDocsArray);
    followerModel.find.mockReturnValue({ select: mockSelect });
    postModel.aggregate.mockResolvedValue(fakeFeed);

    const req = {
      user: { userId: "6955eb835ac9756f876f6cf7" },
      query: { cursor: "2026-01-02T11:56:00.409Z" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getFollowingPosts(req, res);

    expect(followerModel.find).toHaveBeenCalledWith({
      follower: "6955eb835ac9756f876f6cf7",
    });
    expect(postModel.aggregate).toHaveBeenCalledWith([
      expect.objectContaining({
        $project: expect.any(Object),
      }),
      expect.objectContaining({
        $unionWith: expect.any(Object),
      }),
      expect.objectContaining({
        $match: {
          $or: [
            { createdBy: { $in: expect.any(Array) } },
            { user: { $in: expect.any(Array) } },
          ],
          createdAt: { $lt: expect.any(Date) },
        },
      }),
      { $sort: { createdAt: -1, _id: -1 } },
      { $limit: 3 },
    ]);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      posts: fakeFeed,
      nextCursor:
        fakeFeed.length > 0 ? fakeFeed[fakeFeed.length - 1].createdAt : null,
    });
  });
});
