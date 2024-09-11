import sinon from "sinon";
import { expect } from "chai";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { createPost } from "../controllers/feed.js";
import User from "../models/user.js";
import Post from "../models/post.js";

dotenv.config();

describe("Feed Controller - CreatePost", () => {
  before(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
  });

  after(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
  });

  it("should add created a post to the posts of the creator", async () => {
    const user = await User.create({
      name: "tests",
      email: "test@gmail.com",
      password: "testtt",
    });
    const req = {
      userId: user._id,
      file: { path: "test\\test" },
      body: { title: "testt", content: "testt" },
    };
    const res = {
      status() {
        return this;
      },
      json() {},
    };

    await createPost(req, res, () => {});
    const updatedUser = await User.findById(req.userId);

    expect(updatedUser._doc).to.have.property("posts");
    expect(updatedUser.posts).to.have.length(1);
  });
});
