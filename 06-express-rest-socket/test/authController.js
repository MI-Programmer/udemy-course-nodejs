import sinon from "sinon";
import { expect } from "chai";
import dotenv from "dotenv";
import mongoose from "mongoose";

import User from "../models/user.js";
import { login, getStatus } from "../controllers/auth.js";

dotenv.config();

describe("Auth Controller - GetStatus", () => {
  before(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
  });

  after(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should send a response with a valid user status for an existing user", async () => {
    const user = await User.create({
      name: "test",
      email: "test@gmail.com",
      password: "testtt",
    });

    const req = { userId: user._id };
    const res = {
      statusCode: 500,
      userStatus: "",
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.userStatus = data.status;
      },
    };

    await getStatus(req, res, () => {});

    expect(res.statusCode).to.be.equal(200);
    expect(res.userStatus).to.be.equal(user.status);
  });
});

describe("Auth Controller - Login", () => {
  it("should call next func and pass error object if accessing database fails", (done) => {
    const req = { body: { email: "test@gmail.com", password: "test" } };
    const next = sinon.spy();

    sinon.stub(User, "findOne").throws();
    login(req, {}, next).then((result) => {
      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.an("error");

      //   expect(result).to.be.an("error");
      //   expect(result).to.have.property("statusCode", 500);
      done();
    });
    User.findOne.restore();
  });
});
