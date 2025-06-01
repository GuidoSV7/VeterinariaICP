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

        let petList : Map.Map<Nat, Types.Pet> = Map.new<Nat, Types.Pet>();

        var nextPetId : Nat = 0;

        func generateIdPet() : Nat {
            nextPetId += 1;
            nextPetId;
        };

        public func registerPet(caller : Principal, name : Text, age : Nat, image : Text) {
            let petId = generateIdPet();
            let pet : Types.Pet = {
                name = name;
                age = age;
                owner = caller;
                image = image;

            };

            ignore Map.put(petList, Map.nhash, petId, pet);

            Debug.print("Mascota Registrada")

        };

        public func getPetByOwner(owner : Principal) : [Types.Pet] {
            let ownerPets = Buffer.Buffer<Types.Pet>(0);

            for (pet in Map.vals(petList)) {
                if (Principal.equal(pet.owner, owner)) {
                    ownerPets.add(pet);
                };
            };

            Buffer.toArray(ownerPets);
        };

        public func getAllPets() : [Types.Pet] {

            Iter.toArray(Map.vals(petList));
        };

        public func deletePet(petId : Nat) : Text {
            switch (Map.get(petList, Map.nhash, petId)) {
                case (?pet) {
                    ignore Map.remove(petList, Map.nhash, petId);
                    "Mascota eliminada correctamente";
                };
                case null {
                    "Mascota no encontrada";
                };
            };
        };

    };

};
