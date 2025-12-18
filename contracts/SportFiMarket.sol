// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, ebool, euint8, euint64, externalEuint8, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";

import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract SportFiMarket is ZamaEthereumConfig {
    enum Outcome {
        None,
        Home,
        Draw,
        Away
    }

    struct Market {
        string description;
        uint256 lockTimestamp;
        Outcome result;
        uint64 odds; // 2 = 2x, 3 = 3x
        bool settled;
    }

    struct EncryptedBet {
        euint8 outcome;
        euint64 amount;
        bool exists;
        bool claimed;
    }

    address public owner;
    address public oracle;

    uint256 public marketCount;
    uint64 public constant INITIAL_POINTS = 1_000_000;

    mapping(address => bool) public registered;
    mapping(address => euint64) private balances;
    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => EncryptedBet)) private bets;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyOracle() {
        require(msg.sender == oracle, "Not oracle");
        _;
    }

    constructor(address _oracle) {
        owner = msg.sender;
        oracle = _oracle;
    }

    /*━━━━━━━━━━ USER ━━━━━━━━━━*/

    function register() external {
        require(!registered[msg.sender], "Already registered");
        registered[msg.sender] = true;

        euint64 bal = FHE.asEuint64(INITIAL_POINTS);
        balances[msg.sender] = bal;

        FHE.allowThis(bal);
        FHE.allow(bal, msg.sender);
    }

    function placeBet(
        uint256 marketId,
        externalEuint8 outcomeHandle,
        externalEuint64 amountHandle,
        bytes calldata proof
    ) external {
        require(registered[msg.sender], "Not registered");

        Market storage m = markets[marketId];
        require(block.timestamp < m.lockTimestamp, "Market locked");
        require(!m.settled, "Market settled");

        EncryptedBet storage b = bets[marketId][msg.sender];
        require(!b.exists, "Already bet");

        euint8 outcome = FHE.fromExternal(outcomeHandle, proof);
        euint64 amount = FHE.fromExternal(amountHandle, proof);

        // 防止负余额（FHE-safe）
        euint64 bal = balances[msg.sender];
        ebool enough = FHE.ge(bal, amount);

        euint64 spend = FHE.select(enough, amount, FHE.asEuint64(0));

        euint64 newBal = FHE.sub(bal, spend);
        balances[msg.sender] = newBal;

        FHE.allow(newBal, msg.sender);

        b.outcome = outcome;
        b.amount = spend;
        b.exists = true;

        FHE.allow(outcome, msg.sender);
        FHE.allow(spend, msg.sender);
    }

    /*━━━━━━━━━━ ADMIN ━━━━━━━━━━*/

    function createMarket(
        string calldata description,
        uint256 lockTimestamp,
        uint64 odds // 2 = 2x
    ) external onlyOwner {
        require(lockTimestamp > block.timestamp, "Invalid lock");
        require(odds >= 1, "Invalid odds");

        markets[marketCount++] = Market({
            description: description,
            lockTimestamp: lockTimestamp,
            result: Outcome.None,
            odds: odds,
            settled: false
        });
    }

    function settleMarket(uint256 marketId, Outcome result) external onlyOracle {
        Market storage m = markets[marketId];
        require(block.timestamp >= m.lockTimestamp, "Too early");
        require(!m.settled, "Already settled");
        require(result != Outcome.None, "Invalid result");

        m.result = result;
        m.settled = true;
    }

    /*━━━━━━━━━━ CLAIM ━━━━━━━━━━*/

    function claim(uint256 marketId) external {
        Market storage m = markets[marketId];
        require(m.settled, "Not settled");

        EncryptedBet storage b = bets[marketId][msg.sender];
        require(b.exists && !b.claimed, "Nothing to claim");

        ebool win = FHE.eq(b.outcome, FHE.asEuint8(uint8(m.result)));

        // ? 修复点：无除法，仅整数倍
        euint64 reward = FHE.mul(b.amount, FHE.asEuint64(m.odds));

        euint64 bal = balances[msg.sender];
        euint64 finalBal = FHE.select(win, FHE.add(bal, reward), bal);

        balances[msg.sender] = finalBal;
        b.claimed = true;

        FHE.allow(finalBal, msg.sender);
    }

    /*━━━━━━━━━━ VIEW ━━━━━━━━━━*/

    function getEncryptedBalance(address user) external view returns (euint64) {
        return balances[user];
    }
}
