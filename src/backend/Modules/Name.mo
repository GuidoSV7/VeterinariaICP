import List "mo:base/List";
import Result "mo:base/Result";
import Text "mo:base/Text";

module {
  public type AddNameResult = Result.Result<(), Text>;
  public type GetNamesResult = Result.Result<[Text], Text>;

  public class NameManager() {
    var names: List.List<Text> = List.nil();

    public func addName(name: Text) {
      names := List.push(name, names);
    };

    public func getNames(): [Text] {
      List.toArray(names)
    };
  };
}
