
import Types "Types";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Debug "mo:base/Debug";

import Pet "Modules/Pet";

import NFT "Modules/NFT";


actor class Backend(){

  //Esto lo entendí como Inyeccion 
  let nftManager = NFT.NFTManager();
  let petManager = Pet.PetManager();


 

  // public shared ({caller}) func createNFT(name: Text, description: Text, imageUrl: Text, price: Nat) : async () {
  //   nftManager.createNFT(caller, name, description, imageUrl, price);
  // };



  public shared query func getAllPets(): async [Types.Pet] {
    petManager.getAllPets()
  };

  public shared ({caller}) func registerPet(name: Text, age: Nat, image: Text): async Types.Result<Text> {
    if (Principal.isAnonymous(caller)) {
        return #unauthorized;  
    };
    
    petManager.registerPet(caller, name, age, image);
    return #ok("Mascota registrada correctamente");
  };
  
  public shared query func getPetByOwner(owner: Principal): async [Types.Pet] {
    if (Principal.isAnonymous(owner)) {
        return [];
    };
    
    return petManager.getPetByOwner(owner);

  
  };

  
}
