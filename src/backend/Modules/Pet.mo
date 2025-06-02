import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Types "../Types";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import Map "mo:map/Map";

module {

    public class PetManager() {

        public type ImageObject = [Nat8];

        let petList : Map.Map<Text, Types.Pet> = Map.new<Text, Types.Pet>();
        var nextPetId : Nat = 0;

        func generateIdPet() : Nat {
            nextPetId += 1;
            return nextPetId;
        };

        public func registerPet(caller : Principal, name : Text, age : Nat, image : Text) {
            let petId = generateIdPet();
            let pet : Types.Pet = {
                name = name;
                age = age;
                owner = caller;
                image = image;
            };

            ignore Map.put(petList, Map.thash, Nat.toText(petId), pet);
            Debug.print("Mascota Registrada con ID: " # Nat.toText(petId));
        };

        public func getPetByOwner(owner : Principal) : [(Text, Types.Pet)] {
            let ownerPets = Buffer.Buffer<(Text, Types.Pet)>(0);
            
            for ((id, pet) in Map.entries(petList)) {
                if (Principal.equal(pet.owner, owner)) {
                    ownerPets.add((id, pet));
                };
            };
            
            Buffer.toArray(ownerPets);
        };

        public func getAllPets() : [(Text, Types.Pet)] {
            Iter.toArray(Map.entries(petList));
        };

        public func deletePet(petId : Text) {
            switch (Map.get(petList, Map.thash, petId)) {
                case (?pet) {
                    ignore Map.remove(petList, Map.thash, petId);
                    Debug.print("Mascota eliminada correctamente");
                };
                case null {
                    Debug.print("Mascota no encontrada");
                };
            };
        };

        public func getPetById(petId : Text) : ?Types.Pet {
            Map.get(petList, Map.thash, petId);
        };
    };
};
