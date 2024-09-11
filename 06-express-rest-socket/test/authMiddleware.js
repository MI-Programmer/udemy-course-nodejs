import { expect } from "chai";
import jwt from "jsonwebtoken";
import sinon from "sinon";

import isAuth from "../middleware/isAuth.js";

describe("Auth middleware", () => {
  it("should throw an error if no authorization header is present", () => {
    const req = { get: (headerName) => null };

    expect(isAuth.bind(this, req, {}, () => {})).to.throw("Not authenticated.");
  });

  it("should throw an error if the authorization header is only one string", () => {
    const req = { get: (headerName) => "xyz" };

    expect(isAuth.bind(this, req, {}, () => {})).to.throw();
  });

  it("should yield a userId after decoding the token", () => {
    const req = { get: (headerName) => "Bearer xyzhdjwdjhwhdj" };

    sinon.stub(jwt, "verify");
    jwt.verify.returns({ userId: "abc" });
    isAuth(req, {}, () => {});
    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId", "abc");
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  });

  it("should throw an error if the token cannot be verified", () => {
    const req = { get: (headerName) => "Bearer xyz" };

    expect(isAuth.bind(this, req, {}, () => {})).to.throw("Not authenticated.");
  });
});
