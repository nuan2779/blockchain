Q1: Target có bao nhiêu chữ số hex 0 dẫn đầu? ~2^? work?

Target = 0x342190000000000000000000000000000000000000000. Target phải viết đủ 64 ký tự hex (256 bit), nhưng ta thấy kết quả chỉ có 45 ký tự, từ đó có thể thấy python đã từ xóa 19 chữ số hex 0 dẫn đầu, v nên có 19 số 0  dẫn đầu trước khi gặp chữ số khác 0 đầu tiên (3).

→ Xác suất một hash ngẫu nhiên nhỏ hơn target là target/2^256 ≈ 2^(-76)(dùng lệnh 256 - target.bit_length()). Vậy một header hợp lệ đại diện cho khoảng ~2^76 phép băm thử.

Q2: Tính chất nào của SHA-256 tạo ra bất đối xứng verify (2 lần băm) vs tìm (~10²⁰ H/s × 10 phút)?

Đó là one-wayness: cho trước output (hash < target), không có cách nào tính ngược lại input (nonce/header) nhanh hơn brute-force — không có "công thức đảo". Ngược lại, khi đã có input, tính hash chỉ tốn O(1) (2 lần SHA-256). Đây chính là nền tảng của toàn bộ cơ chế Proof-of-Work: rẻ để kiểm chứng, cực đắt để tìm ra, và không có đường tắt toán học nào để rút ngắn việc tìm.

Q3: 3,600,000 sat/vB 

Đây là block 840,000, đúng ngày halving lần 4 (2024-04-20), đồng thời trùng thời điểm giao thức Runes ra mắt. Rất nhiều người muốn giao dịch của mình được đưa vào chính block halving/khối Rune đầu tiên vì nó mang lại giá trị biểu tượng và cơ hội airdrop, nên xảy ra một cuộc đấu giá phí dữ dội trong mempool, miner ưu tiên xếp tx trả phí cao nhất vào block trước.

→ Bài học: fee rate không cố định, nó là kết quả đấu giá cung/cầu không gian block ,vì block space là tài nguyên khan hiếm, giới hạn ~4M weight units/block. Khi cầu tăng đột biến, fee có thể tăng vọt gấp hàng chục nghìn lần mức bình thường, dù trên lý thuyết không ai ép ta phải trả phí cao , chỉ là ta cạnh tranh với người khác để được include sớm.

Q4: 4,075,061,499 sat coinbase output − 312,500,000 sat subsidy = ?

4,075,061,499 − 312,500,000 = 3,762,561,499 sat. Đây chính là tổng phí giao dịch của tất cả các tx trong block, được cộng dồn vào output coinbase mà miner tự thưởng cho mình (subsidy + fees = tổng phần thưởng miner nhận được).

Q5: Merkle root khớp header chứng minh điều gì?

Việc computed_root == block merkle_root chứng minh rằng toàn bộ danh sách 3,050 giao dịch — đúng nội dung và đúng thứ tự — chính là tập giao dịch đã được commit trong header khi block được đào. Điều này dựa trên tính chất collision resistance của double SHA-256: chỉ cần một tx bị thay đổi (dù 1 bit) hoặc thứ tự các tx bị đảo, root tính ra ở tầng trên cùng sẽ khác hoàn toàn ngay từ bước hash đầu tiên trong cây, khiến việc khớp root gần như không thể xảy ra bằng tình cờ hay giả mạo — đây cũng là cơ sở toán học cho Merkle proof (SPV) mà không cần tải lại toàn bộ block.