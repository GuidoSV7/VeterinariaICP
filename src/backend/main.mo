import Name "Modules/Name";
import NFT "Modules/NFT";
import User "Modules/User";
import Types "Types";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

actor {

  //Esto lo entendí como Inyeccion 
  let nameManager = Name.NameManager();
  let userManager = User.UserManager();
  let nftManager = NFT.NFTManager();

  public shared ({caller}) func addName(name: Text): async Name.AddNameResult {
    if (Principal.isAnonymous(caller)) return #err("You must be authenticated to add a name");
    nameManager.addName(name);
    return #ok();
  };

  public shared query ({caller}) func getNames(): async Name.GetNamesResult {
    if (Principal.isAnonymous(caller)) return #err("You must be authenticated to view names");
    return #ok(nameManager.getNames());
  };

  public shared ({caller}) func registerUser(name: Text, isArtist: Bool) : async () {
    userManager.registerUser(caller, name, isArtist);
  };

  public query func getUserById(id: Principal.Principal): async ?Types.User {
    userManager.getUserById(id);
  };

  public shared ({caller}) func createNFT(name: Text, description: Text, imageUrl: Text, price: Nat) : async () {
    nftManager.createNFT(caller, name, description, imageUrl, price);
  };

  public query func getNFTById(id: Nat): async ?Types.Nft {
    nftManager.getNFTById(id);
  };

  public query func getAllNFfts(): async [Types.Nft] {
    nftManager.getAllNFTs();
  };

  public func updatedOwner(id: Nat, newOwner: Principal.Principal) : async () {
    nftManager.updatedOwner(id, newOwner);
  };
}
