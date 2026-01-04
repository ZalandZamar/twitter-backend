const { StatusCodes } = require("http-status-codes");
const followerModel = require("../models/followerModel");
const postModel = require("../models/postModel");
const mongoose = require("mongoose");
const getFollowingPosts = async (req, res) => {
  const {
    user: { userId },
    query: { cursor },
  } = req;

  // get the array of users the current user follows
  const followingDocsArray = await followerModel
    .find({ follower: userId })
    .select("following");

  // get the ids of the users the current user follows
  const followingUserIds = followingDocsArray.map(
    (doc) => new mongoose.Types.ObjectId(doc.following)
  );

  // you can push the id of the current logged user's id into the array as well
  followingUserIds.push(new mongoose.Types.ObjectId(userId));

  //create the query
  // const query = {
  //   createdBy: { $in: followingUserIds },
  // };

  // // check if cursor is being sent by the frontEnd
  // if (cursor) {
  //   query.createdAt = { $lt: new Date(cursor) };
  // }

  // const followingFeed = await postModel
  //    {
  //        createdBy: { $in: followingUserIds },
  //      }
  //   .find(query)
  //   .sort({ createdAt: -1 })
  //   .limit(3);

  console.log("Following users:", followingUserIds);
  console.log("Cursor:", cursor);
  const feed = await postModel.aggregate([
    // 1. Label and project initial posts
    {
      $project: {
        type: { $literal: "post" },
        title: 1,
        createdBy: 1,
        createdAt: 1,
      },
    },

    // 2. Join retweets without filtering yet
    {
      $unionWith: {
        coll: "retweets",
        pipeline: [
          {
            $project: {
              type: { $literal: "retweet" },
              user: 1,
              post: 1,
              ReComment: 1,
              createdAt: 1,
            },
          },
        ],
      },
    },

    // 3. APPLY GLOBAL FILTERING HERE
    {
      $match: {
        // Logic: Item must belong to followed users
        $or: [
          { createdBy: { $in: followingUserIds } },
          { user: { $in: followingUserIds } },
        ],
        // CURSOR LOGIC: If cursor exists, find items older than it
        ...(cursor ? { createdAt: { $lt: new Date(cursor) } } : {}),
      },
    },

    // 4. Global Sort and Limit
    { $sort: { createdAt: -1, _id: -1 } }, // Added _id to ensure stable tie-breaking
    { $limit: 3 },
  ]);

  res.status(StatusCodes.OK).json({
    posts: feed,
    nextCursor: feed.length > 0 ? feed[feed.length - 1].createdAt : null,
  });
};

module.exports = { getFollowingPosts };
