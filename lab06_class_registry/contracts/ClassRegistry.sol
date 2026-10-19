// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ClassRegistry {
    // 1. Immutable owner
    address public immutable owner;

    // 2. Custom errors (tiết kiệm gas)
    error NotOwner();
    error AlreadyRegistered();
    error NotRegistered();
    error InvalidName();

    // 3. Mapping + Struct kết hợp address[]
    struct Student {
        string name;
        uint256 index; // Vị trí trong mảng để thực hiện swap-and-pop O(1)
        bool isRegistered;
    }

    mapping(address => Student) public students;
    address[] public studentAddresses;

    // 4. Indexed Events
    event StudentRegistered(address indexed studentAddress, string name);
    event StudentRemoved(address indexed studentAddress);

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Đăng ký tên của sinh viên
    function register(string calldata _name) external {
        if (bytes(_name).length == 0) revert InvalidName();
        if (students[msg.sender].isRegistered) revert AlreadyRegistered();

        studentAddresses.push(msg.sender);
        students[msg.sender] = Student({
            name: _name,
            index: studentAddresses.length - 1,
            isRegistered: true
        });

        emit StudentRegistered(msg.sender, _name);
    }

    // Kỹ thuật swap-and-pop để xóa sinh viên với chi phí O(1) gas
    function removeStudent(address _student) external onlyOwner {
        if (!students[_student].isRegistered) revert NotRegistered();

        uint256 indexToRemove = students[_student].index;
        uint256 lastIndex = studentAddresses.length - 1;

        // Nếu phần tử cần xóa không ở cuối, đưa phần tử cuối lên thay thế
        if (indexToRemove != lastIndex) {
            address lastStudent = studentAddresses[lastIndex];
            studentAddresses[indexToRemove] = lastStudent;
            students[lastStudent].index = indexToRemove;
        }

        // Xóa phần tử ở đuôi mảng
        studentAddresses.pop();
        delete students[_student];

        emit StudentRemoved(_student);
    }

    // Lấy toàn bộ danh sách địa chỉ sinh viên
    function getAllStudents() external view returns (address[] memory) {
        return studentAddresses;
    }
}