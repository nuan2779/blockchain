import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("ClassBadge (ERC-721)", function () {
  let badge: any;
  let owner: any;
  let alice: any;

  beforeEach(async function () {
    [owner, alice] = await ethers.getSigners();
    badge = await ethers.deployContract("ClassBadge");
    await badge.waitForDeployment();
  });

  it("Chi owner moi mint duoc va revert EmptyName neu ten rong", async function () {
    await expect(
      badge.connect(alice).mint(alice.address, "Alice")
    ).to.be.revertedWithCustomError(badge, "OwnableUnauthorizedAccount");

    await expect(
      badge.mint(alice.address, "")
    ).to.be.revertedWithCustomError(badge, "EmptyName");
  });

  it("Mint thanh cong va giai ma dung metadata JSON on-chain", async function () {
    await badge.mint(alice.address, "Nguyen Huu Luan");

    const uri = await badge.tokenURI(0);
    expect(uri).to.include("data:application/json;base64,");

    // Giai ma Base64 thanh chuoi JSON
    const json = Buffer.from(uri.split(",")[1], "base64").toString("utf8");
    const meta = JSON.parse(json);

    expect(meta.name).to.equal("ClassBadge #0");
    expect(meta.image).to.include("data:image/svg+xml;base64,");

    const studentTrait = meta.attributes.find((a: any) => a.trait_type === "Student");
    expect(studentTrait.value).to.equal("Nguyen Huu Luan");
  });

  it("Truy van tokenURI chua mint se revert ERC721NonexistentToken", async function () {
    await expect(badge.tokenURI(999)).to.be.revertedWithCustomError(
      badge,
      "ERC721NonexistentToken"
    );
  });
});