from web3 import Web3
from web3.middleware import ExtraDataToPOAMiddleware

w3 = Web3(Web3.HTTPProvider("https://l1testnet.trustkeys.network"))
w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)

# DÁN TX HASH CỦA BẠN VÀO ĐÂY
tx_hash = "0x...thay_tx_hash_cua_ban_o_day..."

# Lấy receipt và thông tin giao dịch, thông tin block
rcpt = w3.eth.get_transaction_receipt(tx_hash)
tx = w3.eth.get_transaction(tx_hash)
blk = w3.eth.get_block(rcpt["blockNumber"])

base_fee = blk["baseFeePerGas"]
gas_used = rcpt["gasUsed"]
eff_price = rcpt["effectiveGasPrice"]

# Tính toán các thành phần phí
paid = gas_used * eff_price
burned = gas_used * base_fee
tip = gas_used * (eff_price - base_fee)

print(f"Transaction: {tx_hash}")
print(f"Gas used: {gas_used}")
print(f"Base fee: {base_fee} wei")
print(f"Effective gas price: {eff_price} wei")
print("--------------------------------------------------")
print(f"Tổng phí trả (paid)   : {paid} wei")
print(f"Phí bị đốt (burned)   : {burned} wei (rời khỏi lưu thông)")
print(f"Phí boa thợ đào (tip) : {tip} wei (trả cho validator)")
print("--------------------------------------------------")
print(f"Kiểm tra đẳng thức: {paid} == {burned} + {tip} ? -> {paid == burned + tip}")