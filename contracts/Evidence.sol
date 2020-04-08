pragma solidity > 0.4.0 <= 0.6.0;

contract Evidence{
    
    struct attribute{
        string name;
        string hash;
        address signer;
        string about;
    }
    mapping(uint=>attribute[]) public cases;
    uint private case_num;
    
    constructor()public{
        case_num = 1;
    }
    function add(string memory name, string memory hash, uint num, string memory about) public{
    
        attribute memory temp;
        temp.name = name;
        temp.hash = hash;
        temp.signer = msg.sender;
        temp.about = about;
        
        if(num==0)
        {
            cases[case_num].push(temp);
            case_num++;
        }
        else
        {
            cases[num].push(temp);
        }
    }
    
    function show_case_num()public view returns(uint){
        return case_num;
    }
    
    function show_evi_num(uint num)public view returns(uint){
        return cases[num].length;
    }
    
    function show(uint num, uint item)public view returns(string memory, string memory, address, string memory){
        return (cases[num][item].name, cases[num][item].hash, cases[num][item].signer, cases[num][item].about);
    }
}