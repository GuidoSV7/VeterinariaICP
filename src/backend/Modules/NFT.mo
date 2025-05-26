import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Hash "mo:base/Hash";
import Types "../Types";


module {
  public class NFTManager() {
    let nftList = HashMap.HashMap<Nat, Types.Nft>(0, Nat.equal, Hash.hash);

    var nextNftId : Nat = 0;

    func generateIdNft(): Nat {
      nextNftId += 1;
      nextNftId
    };

    public func createNFT(caller: Principal, name: Text, description: Text, imageUrl: Text, price: Nat) {
      let nft: Types.Nft = {
        name = name;
        description = description;
        imageUrl = imageUrl;
        price = price;
        owner = caller;
        artist = caller;
        forSale = true;
      };
      nftList.put(generateIdNft(), nft);
    };

    public func getNFTById(id: Nat): ?Types.Nft {
      nftList.get(id)
    };

    public func getAllNFTs(): [Types.Nft] {
      Iter.toArray(nftList.vals())
    };

    public func updatedOwner(id: Nat, newOwner: Principal) {
      switch (nftList.get(id)) {
        case null {
          Debug.print("Nft not found");
        };
        case (?currentNft) {
          let updatedNft: Types.Nft = {
            name = currentNft.name;
            description = currentNft.description;
            imageUrl = currentNft.imageUrl;
            price = currentNft.price;
            owner = newOwner;
            artist = currentNft.artist;
            forSale = currentNft.forSale;
          };
          nftList.put(id, updatedNft);
        };
      }
    };
  };
}
