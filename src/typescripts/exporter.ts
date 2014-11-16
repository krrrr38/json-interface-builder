/// <reference path="./util.ts" />
/// <reference path="./core.ts" />

module exporter {
  export class TypeScriptExporter {

    constructor(private indent: string = "  ") {}

    run(component: core.SearchableObject): string {
      var res = "interface " + component.name + " {\n";
      var trees = component.getTrees();
      for(var key in trees) {
        res += this.indent + key + ": " + this.toTSTreeStr(trees[key]) + ";\n";
      }
      return res + "}\n";
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
