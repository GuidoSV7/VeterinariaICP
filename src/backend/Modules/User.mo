import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Types "../Types";
import Hash "mo:base/Hash";

module {
  public class UserManager() {
    let userList = HashMap.HashMap<Principal, Types.User>(0, Principal.equal, Principal.hash);

    public func registerUser(caller: Principal.Principal, name: Text) {
      let user: Types.User = {
        
        name = name;
      };
      userList.put(caller, user);
    };

    public func getUserById(id: Principal.Principal): ?Types.User {
      userList.get(id)
    };
  };
}
