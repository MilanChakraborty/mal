const assert = require("node:assert");
const { describe, it } = require("node:test");
const {Reader} = require("../Reader");

describe("Reader", () => {
  it("Should be able to peek the current token", () => {
    const reader = new Reader(["(", "+", "1", "2"]);

    assert.strictEqual(reader.peek(), "(");
  });

  it("Position should move to next element when next is called", () => {
    const reader = new Reader(["(", "+", "1", "2"]);

    assert.strictEqual(reader.next(), "(");
    assert.strictEqual(reader.peek(), "+");
  });
});