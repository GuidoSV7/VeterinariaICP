
import Types "Types";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Debug "mo:base/Debug";

import Pet "Modules/Pet";
import Name "Modules/Name";
import NFT "Modules/NFT";
import User "Modules/User";
actor {

  //Esto lo entendí como Inyeccion 
  let nameManager = Name.NameManager();
  let userManager = User.UserManager();
  let nftManager = NFT.NFTManager();
  let petManager = Pet.PetManager();

  public shared ({caller}) func addName(name: Text): async Name.AddNameResult {
    if (Principal.isAnonymous(caller)) return #err("You must be authenticated to add a name");
    nameManager.addName(name);
    return #ok();
  };

  public shared query ({caller}) func getNames(): async Name.GetNamesResult {
    if (Principal.isAnonymous(caller)) return #err("You must be authenticated to view names");
    return #ok(nameManager.getNames());
  };

  public shared ({caller}) func registerUser(name: Text) : async () {
    userManager.registerUser(caller, name);
  };

  public query func getUserById(id: Principal.Principal): async ?Types.User {
    
    userManager.getUserById(id);
  };

  public shared ({caller}) func createNFT(name: Text, description: Text, imageUrl: Text, price: Nat) : async () {
    nftManager.createNFT(caller, name, description, imageUrl, price);
  };



  public shared query func getAllPets(): async [Types.Pet] {
    petManager.getAllPets()
  };

  public shared ({caller}) func registerPet(name: Text, age: Nat): async Types.Result<Text> {
    if (Principal.isAnonymous(caller)) {
        return #unauthorized;  
    };
    
    petManager.registerPet(caller, name, age);
    return #ok("Mascota registrada correctamente");
  };
  
  public shared query func getPetByOwner(owner: Principal): async [Types.Pet] {
    if (Principal.isAnonymous(owner)) {
        return [];
    };
    
    return petManager.getPetsByOwner(owner);

    
    
  };

  
}
