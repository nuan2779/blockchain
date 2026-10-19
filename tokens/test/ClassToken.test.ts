import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("ClassToken (ERC-20)", function () {
  let token: any;
  let deployer: any;
  let alice: any;
  let bob: any;
  const CAP = ethers.parseEther("1000000"); // 1,000,000 * 10^18[cite: 8]

  beforeEach(async function () {
    [deployer, alice, bob] = await ethers.getSigners();
    token = await ethers.deployContract("ClassToken", [deployer.address]);
    await token.waitForDeployment();
  });

  it("Metadata chuan va cap chinh xac", async function () {
    expect(await token.name()).to.equal("ClassToken");
    expect(await token.symbol()).to.equal("CTK");
    expect(await token.decimals()).to.equal(18n);
    expect(await token.cap()).to.equal(CAP);
  });

  it("totalSupply bang toan bo so du cua deployer", async function () {
    expect(await token.totalSupply()).to.equal(CAP);
    expect(await token.balanceOf(deployer.address)).to.equal(CAP);
  });

  it("Chuyen token cap nhat balance va phat ra event Transfer", async function () {
    const amount = ethers.parseEther("100");
    await expect(token.transfer(alice.address, amount))
      .to.emit(token, "Transfer")
      .withArgs(deployer.address, alice.address, amount);

    expect(await token.balanceOf(alice.address)).to.equal(amount);
  });

  it("Revert voi ERC20InsufficientBalance neu khong du so du", async function () {
    const tooMuch = ethers.parseEther("10");
    await expect(
      token.connect(alice).transfer(bob.address, tooMuch)
    ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
  });

  it("approve -> transferFrom hoat dong va giam allowance", async function () {
    const allowanceAmount = ethers.parseEther("50");
    const spendAmount = ethers.parseEther("30");

    await token.approve(alice.address, allowanceAmount);
    expect(await token.allowance(deployer.address, alice.address)).to.equal(allowanceAmount);

    await token.connect(alice).transferFrom(deployer.address, bob.address, spendAmount);

    expect(await token.balanceOf(bob.address)).to.equal(spendAmount);
    expect(await token.allowance(deployer.address, alice.address)).to.equal(
      allowanceAmount - spendAmount
    );
  });

  it("Vong lap chuyen tien: bao toan tong cung (invariant)", async function () {
    const amounts = [ethers.parseEther("10"), ethers.parseEther("25"), ethers.parseEther("5")];
    let totalSent = 0n;

    for (const amt of amounts) {
      await token.transfer(alice.address, amt);
      totalSent += amt;
    }

    expect(await token.balanceOf(alice.address)).to.equal(totalSent);
    expect(await token.totalSupply()).to.equal(CAP);
  });
});