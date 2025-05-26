import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";

module {
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
}
