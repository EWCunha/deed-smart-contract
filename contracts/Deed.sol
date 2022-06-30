// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Deed {
    address public lawyer;
    address payable public beneficiary;
    uint256 public earliest;

    constructor(
        address _lawyer,
        address payable _beneficiary,
        uint256 _fromNow
    ) payable {
        lawyer = _lawyer;
        beneficiary = _beneficiary;
        earliest = block.timestamp + _fromNow;
    }

    function withdraw() public {
        require(msg.sender == lawyer, "lawyer only");
        require(block.timestamp >= earliest, "too early");
        beneficiary.transfer(address(this).balance);
    }
}
