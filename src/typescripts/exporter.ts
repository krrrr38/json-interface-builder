/// <reference path="./util.ts" />
/// <reference path="./core.ts" />

module exporter {

  interface Exporter {
    run(component: core.SearchableObject): string;
  }

  export class TypeScriptExporter implements Exporter {

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

  export class ScalaExporter implements Exporter {

    constructor() {}

    run(component: core.SearchableObject): string {
      var pre = "case class " + component.name + "(";
      var trees = component.getTrees();
      var treesArr: string[] = [];
      for(var key in trees) {
        treesArr.push(key + ": " + this.toScalaTreeType(trees[key]))
      }
      return pre + util.ArrayUtil.mkString(treesArr, ", ") + ")";
    }

    private toScalaTreeType(tree: core.Tree): string {
      if (tree.isArray) {
        return "Seq[" + this.toScalaType(tree.name) + "]";
      } else {
        return this.toScalaType(tree.name);
      }
    }

    private toScalaType(name: string): string {
      switch(name) {
      case "string":
        return "String";
      case "number":
        return "Int";
      case "boolean":
        return "Boolean";
      case "any":
        return "Any";
      default:
        return name;
      }
    }
  }
}
