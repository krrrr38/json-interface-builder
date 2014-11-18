/// <reference path="./util.ts" />
/// <reference path="./core.ts" />

module exporter {

  interface Exporter {
    run(component: types.JIBObject): string;
  }

  export class TypeScriptExporter implements Exporter {

    constructor(private indent: string = "  ") {}

    run(component: types.JIBObject): string {
      var res = "interface " + component.name + " {\n";
      var values = component.value;
      for(var key in values) {
        res += this.indent + key + ": " + this.toTSType(values[key]) + ";\n";
      }
      return res + "}\n";
    }

    private toTSType(value: types.JIBAny<any>): string {
      switch(value.type) {
      case types.Types.JIBArray:
        return this.toTSType((<types.JIBArray<any>> value).value) + "[]";
      case types.Types.JIBObject:
        return (<types.JIBObject> value).name
      case types.Types.JIBString:
        return "string";
      case types.Types.JIBNumber:
        return "number";
      case types.Types.JIBBoolean:
        return "boolean";
      default:
        return "any";
      }
    }
  }

  export class ScalaExporter implements Exporter {

    constructor() {}

    run(component: types.JIBObject): string {
      var pre = "case class " + component.name + "(";
      var values = component.value;
      var args: string[] = [];
      for(var key in values) {
        args.push(key + ": " + this.toScalaType(values[key]))
      }
      return pre + util.ArrayUtil.mkString(args, ", ") + ")";
    }

    private toScalaType(value: types.JIBAny<any>): string {
      switch(value.type) {
      case types.Types.JIBArray:
        return "Seq[" + this.toScalaType((<types.JIBArray<any>> value).value) + "]";
      case types.Types.JIBObject:
        return (<types.JIBObject> value).name
      case types.Types.JIBString:
        return "String";
      case types.Types.JIBNumber:
        return "Int";
      case types.Types.JIBBoolean:
        return "Boolean";
      default:
        return "Any";
      }
    }
  }
}
