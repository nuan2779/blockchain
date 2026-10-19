Q1: Vì sao chainId nằm trong mọi giao dịch được ký (EIP-155)?   
Để chống tấn công phát lại xuyên chuỗi (Replay Attack). Vì cùng một Private Key sẽ sinh ra cùng một địa chỉ trên mọi mạng EVM, nên nếu không có chainId khóa cứng vào chữ ký số, kẻ xấu có thể copy một giao dịch hợp lệ từ testnet rồi phát lại nguyên văn lên mainnet để rút tiền từ ví của mình.   
Q2: Vì sao base fee trên TrustKeys L1 lại đứng ở mức sàn?   
Theo cơ chế EIP-1559, mức gas mục tiêu mỗi block là 15M (50% trần 30M). Do mạng hiện tại rất vắng, lượng gas sử dụng thực tế chỉ chiếm ~2% (thấp hơn nhiều so với mốc 15M), nên thuật toán tự động giảm base fee ở mỗi block tiếp theo (tối đa giảm 12.5%/block). Base fee giảm liên tục qua các block cho đến khi chạm mức sàn tối thiểu của mạng thì dừng lại.   
Q3: Phần tử dư trong baseFeePerGas là gì và ví dùng nó thế nào?   
Phần tử dư ($N+1$): Là baseFee dự đoán cho block tiếp theo (EVM tính trước được ngay khi biết lượng gas đã dùng ở block hiện tại).   
Cách ví sử dụng: Ví (như MetaMask) lấy giá trị dự đoán này nhân với hệ số an toàn (thường là x2) rồi cộng thêm maxPriorityFee để gán vào maxFeePerGas. Cách này giúp giao dịch không bị trượt hay bị kẹt nếu vài block tới base fee bất ngờ tăng vọt.   
Q4: Tăng max base fee nhưng giữ nguyên priority fee thì effectiveGasPrice có đổi không?   
Không đổi. Công thức tính phí thực tế là:
   effectiveGasPrice = baseFee + min(maxPriorityFee, maxFee - baseFee)   
Trong điều kiện bình thường, maxFee bạn đặt luôn thừa để trả, nên biểu thức min(...) luôn lấy đúng giá trị maxPriorityFee. Do đó phí thực tế chỉ phụ thuộc vào baseFee của block và tiền tip bạn trả cho thợ đào, việc tăng trần maxFee chỉ tăng mức chịu chi tối đa chứ không làm tăng phí bị trừ.   
Q5: Con số 21.000 gas từ đâu ra và vì sao giao dịch thất bại vẫn tốn gas?   
21.000 gas: Là chi phí cơ sở tối thiểu (Intrinsic Gas) quy định trong Ethereum Yellow Paper cho một giao dịch chuyển coin thông thường giữa hai ví, dùng để trả cho việc xác thực chữ ký ECDSA, kiểm tra nonce, số dư và cập nhật trạng thái tài khoản.   
Giao dịch thất bại vẫn tốn gas: Vì các node/validator vẫn phải tiêu tốn CPU, RAM để chạy EVM đến điểm bị lỗi và ghi nhận kết quả thất bại vào block. Việc trừ gas vừa để bù đắp tài nguyên cho validator, vừa ngăn chặn kẻ xấu spam giao dịch lỗi làm tê liệt mạng lưới (chống DoS).

Lab 5.4 - Trace a contract interaction on Sepolia Etherscan

### 1. Decoded Input Data (Selector + Arguments)
![Decoded Input Data](./images/input_data.png)

### 2. Event Logs Tab
![Logs Tab](./images/logs.png)

Q6: Bộ điều phối (dispatcher) dùng 4 byte selector thế nào và vì sao Etherscan cần ABI?   
Khi nhận giao dịch, bộ điều phối trong bytecode sẽ cắt 4 byte đầu của calldata rồi so khớp tuần tự để nhảy (JUMP) thẳng tới đúng đoạn code thực thi của hàm đó. Etherscan cần ABI vì phần calldata còn lại chỉ là chuỗi hex thô 32 byte liên tiếp; không có ABI thì explorer không thể biết kiểu dữ liệu và tên biến để dịch ngược lại cho người dùng đọc.