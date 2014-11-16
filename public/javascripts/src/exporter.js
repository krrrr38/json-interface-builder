/// <reference path="./util.ts" />
/// <reference path="./core.ts" />
var exporter;
(function (exporter) {
    var TypeScriptExporter = (function () {
        function TypeScriptExporter(indent) {
            if (indent === void 0) { indent = "  "; }
            this.indent = indent;
        }
        TypeScriptExporter.prototype.run = function (component) {
            var res = "interface " + component.name + " {\n";
            var trees = component.getTrees();
            for (var key in trees) {
                res += this.indent + key + ": " + this.toTSTreeStr(trees[key]) + ";\n";
            }
            return res + "}\n";
        };
        TypeScriptExporter.prototype.toTSTreeStr = function (tree) {
            var type = tree.name;
            if (tree.isArray) {
                type += "[]";
            }
            return type;
        };
        return TypeScriptExporter;
    })();
    exporter.TypeScriptExporter = TypeScriptExporter;
    var ScalaExporter = (function () {
        function ScalaExporter() {
        }
        ScalaExporter.prototype.run = function (component) {
            var pre = "case class " + component.name + "(";
            var trees = component.getTrees();
            var treesArr = [];
            for (var key in trees) {
                treesArr.push(key + ": " + this.toScalaTreeType(trees[key]));
            }
            return pre + util.ArrayUtil.mkString(treesArr, ", ") + ")";
        };
        ScalaExporter.prototype.toScalaTreeType = function (tree) {
            if (tree.isArray) {
                return "Seq[" + this.toScalaType(tree.name) + "]";
            }
            else {
                return this.toScalaType(tree.name);
            }
        };
        ScalaExporter.prototype.toScalaType = function (name) {
            switch (name) {
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
        };
        return ScalaExporter;
    })();
    exporter.ScalaExporter = ScalaExporter;
})(exporter || (exporter = {}));
