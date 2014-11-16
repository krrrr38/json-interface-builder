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
            var pre = "interface " + component.name + " {\n  ";
            var post = "\n}\n";
            var trees = component.getTrees();
            var treesArr = [];
            for (var key in trees) {
                treesArr.push(key + ": " + this.toTSTreeStr(trees[key]));
            }
            var separator = ",\n" + this.indent;
            return pre + util.ArrayUtil.mkString(treesArr, separator) + post;
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
