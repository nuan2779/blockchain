import requests
import hashlib
import sys

OFFLINE = "--offline" in sys.argv
BASE_URL = "https://blockstream.info/api"
PINNED_HEIGHT = 840000  # anchor block

def dsha256(b: bytes) -> bytes:
    return hashlib.sha256(hashlib.sha256(b).digest()).digest()

def get(path):
    return requests.get(BASE_URL + path).json()

def get_raw(path):
    return requests.get(BASE_URL + path).content

#Get block hash , metadata
block_hash = requests.get(f"{BASE_URL}/block-height/{PINNED_HEIGHT}").text
block = get(f"/block/{block_hash}")
print("Block hash:", block_hash)
print("Bits:", hex(block['bits']))
print("Merkle root (header):", block['merkle_root'])

#TODO1

def bits_to_target(bits: int) -> int:
    exponent = bits >> 24
    mantissa = bits & 0xFFFFFF
    return mantissa * (256 ** (exponent - 3))

target = bits_to_target(block['bits'])
print("Target:", hex(target))

header_raw = get_raw(f"/block/{block_hash}/raw")[:80]
h = dsha256(header_raw)[::-1]
h_int = int.from_bytes(h, 'big')

assert h_int < target, "PoW check failed"
assert h.hex() == block_hash, "Hash mismatch"
print("CHECK PoW ... OK")

#TODO2
txids = get(f"/block/{block_hash}/txids")
first_tx_id = txids[1]  # bỏ qua coinbase ở index 0
tx = get(f"/tx/{first_tx_id}")

fee = tx['fee']  # sat
vsize = -(-tx['weight'] // 4)  # ceil(weight/4)
rate = fee / vsize

print(f"Fee: {fee} sat, vsize: {vsize} vB, rate: {rate:.0f} sat/vB")
print("CHECK fee_rate ... OK")

#TODO3
def merkle_root(txid_list):
    level = [bytes.fromhex(t)[::-1] for t in txid_list]
    while len(level) > 1:
        if len(level) % 2 == 1:
            level.append(level[-1])
        level = [dsha256(level[i] + level[i+1]) for i in range(0, len(level), 2)]
    return level[0][::-1].hex()

computed_root = merkle_root(txids)
assert computed_root == block['merkle_root'], "Merkle root mismatch"
print("CHECK merkle_root ... OK")