contract testStorage {
    string[] public cities = ["Memphis", "Rochester"];

    function editCitiesMemory() public view {
        string[] memory s1 = cities;
        s1[0] = "Yeetville";
    }

    // changes the original cities obj as it point to same place
    function editCitiesStorage() public {
        string[] storage s1 = cities;
        s1[0] = "Miki Town";
    }
}
