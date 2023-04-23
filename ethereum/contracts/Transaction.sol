pragma solidity >=0.7.0 <0.9.0;

contract transaction{
    mapping(address => bool) public admin;
    mapping(address => bool) public carDealer;
    mapping(address => bool) public carMaintenance;
    mapping(address => bool) public secondHandCarSale;

    struct transactionDetails{
        string VIN;
        string date;
        string location;
        string details;
    }

    mapping (string => transactionDetails[]) public carHistory;
    transactionDetails[] private allTransactions;

    constructor() {
        admin[msg.sender] = true;
    }

    modifier restricted() {
        require(admin[msg.sender] == true);
        _;
    }

    modifier restrictedToCarDealer(){
        require(carDealer[msg.sender] == true);
        _;
    }

    modifier restrictedToCarMaintenance(){
        require(carMaintenance[msg.sender] == true);
        _;
    }

    modifier restrictedToSecondHandCarSale(){
        require(secondHandCarSale[msg.sender] == true);
        _;
    }

    function addAdmin(address Address) public restricted{
        admin[Address] = true;
    }

    function addCarDealer(address Address) public restricted{
        carDealer[Address] = true;
    }

    function addCarMaintenance(address Address) public restricted{
        carMaintenance[Address] = true;
    }

    function addSecondHandCarSale(address Address) public restricted{
        secondHandCarSale[Address] = true;
    }

    function newCar(string memory Vin, string memory Date, string memory Location, string memory Details) public restrictedToCarDealer {
        transactionDetails memory BD = transactionDetails({
            VIN: Vin,
            date: Date,
            location: Location,
            details: Details
        });
        allTransactions.push(BD);
        carHistory[Vin] = allTransactions;
    }

    function maintenance(string memory Vin, string memory Date, string memory Location, string memory Details) public restrictedToCarMaintenance {
        transactionDetails memory BD = transactionDetails({
            VIN: Vin,
            date: Date,
            location: Location,
            details: Details
        });
        allTransactions.push(BD);
        carHistory[Vin] = allTransactions;
    }

    function changeOwner(string memory Vin, string memory Date, string memory Location, string memory Details) public restrictedToSecondHandCarSale{
        transactionDetails memory BD = transactionDetails({
            VIN: Vin,
            date: Date,
            location: Location,
            details: Details
        });
        allTransactions.push(BD);
        carHistory[Vin] = allTransactions;
    }

    function displayAll(string memory Vin) public view returns (transactionDetails[] memory){
        return carHistory[Vin];
    }

}
