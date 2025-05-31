import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Types "../Types";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Buffer "mo:base/Buffer";

module {

    public class PetManager() {
        let petList = HashMap.HashMap<Nat, Types.Pet>(0, Nat.equal, Hash.hash);

        var nextPetId : Nat = 0;

        func generateIdPet(): Nat {
            nextPetId += 1;
            nextPetId
        };
    
        public func registerPet(caller: Principal, name: Text, age: Nat) {
        let pet: Types.Pet = {
            name = name;
            age = age;
            owner = caller;
            
        };
            petList.put(generateIdPet(), pet);
            
        };
    
        
        public func getPetByOwner(owner: Principal): [Types.Pet] {
            let ownerPets = Buffer.Buffer<Types.Pet>(0);
            for (pet in petList.vals()) {
                if (Principal.equal(pet.owner, owner)) {
                    ownerPets.add(pet);
                };
            };
            Buffer.toArray(ownerPets)
        };


        public func getAllPets(): [Types.Pet] {
            Iter.toArray(petList.vals())
        };
    };

}