// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin ERC20 and Ownable contracts
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract CampaignToken is ERC20, Ownable {

    constructor(
        string memory name,
        string memory symbol,
        address owner
    ) ERC20(name, symbol) Ownable(owner) {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

contract TokenRaiseToken is ERC20, Ownable, ERC20Permit, ERC20Votes {

    string tokenName = "TokenRaise";
    string tokenSymbol = "TORAI";
    uint maxSupply = 1000000000 * 10 ** decimals();

    constructor(address initialOwner)
        ERC20(tokenName, tokenSymbol)
        Ownable(initialOwner)
        ERC20Permit(tokenName)
    {
        _mint(msg.sender, 100 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(amount + totalSupply() <= maxSupply);
        _mint(to, amount);
    }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}

contract TokenRaise is Ownable {
    // Structure to represent a campaign
    struct Campaign {
        address payable creator;
        string title;
        string metadataCID; // IPFS CID for campaign metadata
        uint256 fundingGoal;
        uint256 currentFundsRaised;
        uint256 deadline;
        bool active;
        CampaignToken token; // Campaign's ERC20 token
    }

    TokenRaiseToken public tokenRaise;
    mapping(uint256 => Campaign) public campaigns;
    uint256 public totalCampaigns;
    uint256 public minContribution;
    string public ipfsGateway;
    address platformOwner = msg.sender;
    uint256 public royaltyPercentage = 2;
    address public minter;

    // Events
    event CampaignCreated(uint256 indexed campaignId, address indexed creator);
    event FundsContributed(uint256 indexed campaignId, address indexed contributor, uint256 amount, uint256 royalty);
    event CampaignCompleted(uint256 indexed campaignId, address indexed creator, uint256 totalRaised);
    event MetadataUpdated(uint256 indexed campaignId, string newMetadataCID);
    event RoyaltiesWithdrawn(address indexed owner, uint256 amount);
    event TokensApproved(address indexed owner, address indexed spender, uint256 amount);

    constructor(uint256 _minContribution, string memory _ipfsGateway) Ownable(platformOwner) {
        minContribution = _minContribution;
        ipfsGateway = _ipfsGateway;
        minter = address(this);
        tokenRaise = new TokenRaiseToken(address(this));
    }

    // Function to create a new campaign and its associated token
    function createCampaign(
        string memory _title,
        string memory _metadataCID,
        uint256 _fundingGoal,
        uint256 _durationDays,
        string memory _tokenName,
        string memory _tokenSymbol
    ) external {
        require(_fundingGoal > 0, "Funding goal must be greater than zero");
        require(_durationDays > 0, "Duration must be greater than zero");

        // Calculate deadline based on current block timestamp and duration in days
        uint256 deadline = block.timestamp + (_durationDays * 1 days);

        // Create a new ERC20 token for the campaign
        CampaignToken newToken = new CampaignToken(_tokenName, _tokenSymbol, address(this));

        // Increment total campaigns count and create new campaign
        totalCampaigns++;
        campaigns[totalCampaigns] = Campaign(
            payable(msg.sender),
            _title,
            _metadataCID,
            _fundingGoal,
            0,
            deadline,
            true,
            newToken
        );

        emit CampaignCreated(totalCampaigns, msg.sender);
    }

    // Function to retrieve all campaign IDs
    function getAllCampaignIds() public view returns (uint256[] memory) {
        uint256[] memory ids = new uint256[](totalCampaigns);
        for (uint256 i = 1; i <= totalCampaigns; i++) {
            ids[i - 1] = i;
        }
        return ids;
    }

    // Function to retrieve details of a specific campaign by ID
    function getCampaignById(uint256 _campaignId) public view returns (Campaign memory) {
        require(_campaignId > 0 && _campaignId <= totalCampaigns, "Invalid campaign ID");
        return campaigns[_campaignId];
    }

    // Function to contribute funds to a campaign and receive tokens
    function contributeToCampaign(uint256 _campaignId, uint256 _tokenAmount) external {
        Campaign storage campaign = campaigns[_campaignId];
        
        require(campaign.active, "Campaign is not active");
        require(_tokenAmount >= minContribution, "Minimum contribution not met");

        approveTokenSpending(_tokenAmount);
        tokenRaise.transferFrom(msg.sender, address(this), _tokenAmount);

        uint256 royaltyAmount = (_tokenAmount * royaltyPercentage) / 100;
        uint256 contributionMinusRoyalty = _tokenAmount - royaltyAmount;

        tokenRaise.transfer(campaign.creator, contributionMinusRoyalty);

        campaign.currentFundsRaised += contributionMinusRoyalty;

        campaign.token.mint(msg.sender, _tokenAmount);
        emit FundsContributed(_campaignId, msg.sender, _tokenAmount, royaltyAmount);

        checkCampaignCompletion(_campaignId);
    }

    function approveTokenSpending(uint256 _amount) public {
        tokenRaise.approve(address(this), _amount);
        emit TokensApproved(msg.sender, address(this), _amount);
    }

    function withdrawTokenRaiseBalance() external onlyOwner {
        uint256 tokenRaiseBalance = tokenRaise.balanceOf(address(this));
        require(tokenRaiseBalance > 0, "TokenRaise balance is zero");

        tokenRaise.transfer(owner(), tokenRaiseBalance);

        emit RoyaltiesWithdrawn(owner(), tokenRaiseBalance);
    }

    // Function to update metadata CID for a campaign (campaign creator only)
    function updateMetadataCID(uint256 _campaignId, string memory _newMetadataCID) external {
        require(msg.sender == campaigns[_campaignId].creator, "Only campaign creator can update metadata CID");
        campaigns[_campaignId].metadataCID = _newMetadataCID;
        emit MetadataUpdated(_campaignId, _newMetadataCID);
    }

    // Function to set IPFS gateway URL (owner only)
    function setIPFSGateway(string memory _ipfsGateway) external onlyOwner {
        ipfsGateway = _ipfsGateway;
    }

    // Function to get IPFS URL for a specific CID
    function getIPFSUrl(string memory _cid) public view returns (string memory) {
        return string(abi.encodePacked(ipfsGateway, _cid));
    }

    // Internal function to check if a campaign has reached its funding goal or deadline
    function checkCampaignCompletion(uint256 _campaignId) internal {
        if (campaigns[_campaignId].currentFundsRaised >= campaigns[_campaignId].fundingGoal) {
            campaigns[_campaignId].active = false;
            emit CampaignCompleted(_campaignId, campaigns[_campaignId].creator, campaigns[_campaignId].currentFundsRaised);
        } else if (block.timestamp >= campaigns[_campaignId].deadline) {
            campaigns[_campaignId].active = false;
            emit CampaignCompleted(_campaignId, campaigns[_campaignId].creator, campaigns[_campaignId].currentFundsRaised);
        }
    }

    function getAllCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](totalCampaigns);
        for (uint256 i = 1; i <= totalCampaigns; i++) {
            allCampaigns[i - 1] = campaigns[i];
        }
        return allCampaigns;
    }

    function getCampaignsByUser(address user) public view returns (Campaign[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= totalCampaigns; i++) {
            if (campaigns[i].creator == user) {
                count++;
            }
        }

        Campaign[] memory userCampaigns = new Campaign[](count);
        uint256 index = 0;
        for (uint256 j = 1; j <= totalCampaigns; j++) {
            if (campaigns[j].creator == user) {
                userCampaigns[index] = campaigns[j];
                index++;
            }
        }
        return userCampaigns;
    }

}
