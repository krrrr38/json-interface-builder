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
})(exporter || (exporter = {}));
