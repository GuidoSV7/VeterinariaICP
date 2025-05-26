import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";

module {
  public type Result<T> = {
      #ok : T;
      #err : Text;
      #notFound;
      #unauthorized;
  };


  public type Nft = {
    name : Text;
    description : Text;
    imageUrl : Text;
    price : Nat;
    owner : Principal;
    artist : Principal;
    forSale : Bool;
  };

  public type User = {
    name : Text;
  };

  public type Pet = {
    name : Text;
    age : Nat;
    owner : Principal;
  }

  
}
