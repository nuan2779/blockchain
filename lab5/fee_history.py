from web3 import Web3
from web3.middleware import ExtraDataToPOAMiddleware

# 1. Kết nối RPC TrustKeys L1 testnet
rpc_url = "https://l1testnet.trustkeys.network"
w3 = Web3(Web3.HTTPProvider(rpc_url))

# TrustKeys L1 là mạng PoA (clique) với extraData dài 97 bytes nên bắt buộc inject middleware này
w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)

print(f"Đã kết nối: {w3.is_connected()}")
print(f"Chain ID: {w3.eth.chain_id}")

# 2. Lấy block mới nhất và kiểm tra baseFeePerGas
blk = w3.eth.get_block("latest")
print(f"Block mới nhất: #{blk['number']}")
print(f"Gas Limit: {blk['gasLimit']}, Gas Used: {blk['gasUsed']}")
print(f"baseFeePerGas = {blk.get('baseFeePerGas', 0)} wei")

# 3. Lấy lịch sử phí 20 block gần nhất
fh = w3.eth.fee_history(20, "latest", [10, 50, 90])
print("\n--- LỊCH SỬ BASE FEE 20 BLOCK GẦN NHẤT ---")
print("Block | Base Fee (wei) | Base Fee (gwei) | gasUsedRatio")

for i, base in enumerate(fh["baseFeePerGas"][:-1]):
    block_num = fh["oldestBlock"] + i
    ratio = fh["gasUsedRatio"][i]
    print(f"{block_num} | {base:10d} wei | {base / 1e9:.9f} gwei | {ratio*100:.2f}%")

# Phần tử dư cuối cùng trong baseFeePerGas chính là base fee dự đoán của block tiếp theo
next_base_fee = fh["baseFeePerGas"][-1]
avg_ratio = sum(fh["gasUsedRatio"]) / len(fh["gasUsedRatio"])
print(f"\n-> Base fee dự phóng cho block tiếp theo: {next_base_fee} wei ({next_base_fee / 1e9:.9f} gwei)")
print(f"-> Mức sử dụng gas trung bình (gasUsedRatio): {avg_ratio*100:.2f}%")
print("-> Kết luận: Chuỗi đang RẢNH (quiet)" if avg_ratio < 0.5 else "-> Kết luận: Chuỗi đang BẬN (busy)")