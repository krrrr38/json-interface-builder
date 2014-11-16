/// <reference path="./util.ts" />
/// <reference path="./core.ts" />

module exporter {
  export class TypeScriptExporter {

    constructor(private indent: string = "  ") {}

    run(component: core.SearchableObject): string {
      var pre = "interface " + component.name + " {\n  "
      var post = "\n}\n"
      var trees = component.getTrees();
      var treesArr: string[] = [];
      for(var key in trees) {
        treesArr.push(key + ": " + this.toTSTreeStr(trees[key]))
      }
      var separator = ",\n" + this.indent;
      return pre + util.ArrayUtil.mkString(treesArr, separator) + post;
    }

    private toTSTreeStr(tree: core.Tree): string {
      var type = tree.name;
      if (tree.isArray) {
        type += "[]";
      }
      return type;
    }
  }
}
