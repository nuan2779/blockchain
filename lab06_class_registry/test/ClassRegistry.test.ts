import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("ClassRegistry Contract", function () {
  let registry: any;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    registry = await ethers.deployContract("ClassRegistry");
  });

  it("Khoi tao dung immutable owner", async function () {
    expect(await registry.owner()).to.equal(owner.address);
  });

  it("Dang ky thanh cong va phat ra indexed event", async function () {
    await expect(registry.connect(addr1).register("Nguyen Huu Luan"))
      .to.emit(registry, "StudentRegistered")
      .withArgs(addr1.address, "Nguyen Huu Luan");

    const student = await registry.students(addr1.address);
    expect(student.name).to.equal("Nguyen Huu Luan");
    expect(student.isRegistered).to.be.true;
  });

  it("Revert voi custom error AlreadyRegistered neu dang ky 2 lan", async function () {
    await registry.connect(addr1).register("Nguyen Huu Luan");
    await expect(
      registry.connect(addr1).register("Nguyen Huu Luan")
    ).to.be.revertedWithCustomError(registry, "AlreadyRegistered");
  });

  it("Chi owner moi co quyen xoa sinh vien (revert NotOwner)", async function () {
    await registry.connect(addr1).register("Nguyen Huu Luan");
    await expect(
      registry.connect(addr1).removeStudent(addr1.address)
    ).to.be.revertedWithCustomError(registry, "NotOwner");
  });

  it("Xoa sinh vien bang swap-and-pop chinh xac O(1)", async function () {
    await registry.connect(addr1).register("Student A");
    await registry.connect(addr2).register("Student B");

    // Owner xoa Student A
    await registry.connect(owner).removeStudent(addr1.address);

    const list = await registry.getAllStudents();
    expect(list.length).to.equal(1);
    expect(list[0]).to.equal(addr2.address);
  });
});