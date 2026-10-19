import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("Lab 08 - Reentrancy Exploit & Patch", function () {
  let bank: any;
  let attacker: any;
  let alice: any, bob: any, carol: any, eve: any;

  beforeEach(async function () {
    [alice, bob, carol, eve] = await ethers.getSigners();

    // 1. Triển khai ngân hàng
    bank = await ethers.deployContract("EtherBank");
    await bank.waitForDeployment();

    // 2. Alice, Bob, Carol mỗi người nạp 10 ETH -> Tổng ngân hàng có 30 ETH
    await bank.connect(alice).deposit({ value: ethers.parseEther("10") });
    await bank.connect(bob).deposit({ value: ethers.parseEther("10") });
    await bank.connect(carol).deposit({ value: ethers.parseEther("10") });

    const initialBankBal = await ethers.provider.getBalance(await bank.getAddress());
    expect(initialBankBal).to.equal(ethers.parseEther("30"));

    // 3. Eve triển khai hợp đồng Attacker
    attacker = await ethers.deployContract("Attacker", [await bank.getAddress()], {
      signer: eve,
    });
    await attacker.waitForDeployment();
  });

  it("Lab 08.2: Sau khi vá - Tấn công thất bại (revert) và ngân hàng bảo toàn 30 ETH", async function () {
    // Hardhat 3: Truyền trực tiếp đối tượng ethers vào hàm revert
    await expect(
      attacker.connect(eve).attack({ value: ethers.parseEther("1") })
    ).to.be.revert(ethers);

    // Ngân hàng vẫn giữ nguyên vẹn 30 ETH của 3 người dùng ban đầu
    const bankBalAfter = await ethers.provider.getBalance(await bank.getAddress());
    expect(bankBalAfter).to.equal(ethers.parseEther("30"));
  });
});