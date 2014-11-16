var util;
(function (util) {
    var JsonUtil = (function () {
        function JsonUtil() {
        }
        JsonUtil.formatter = function (json) {
            return this.formatObject(JSON.parse(json));
        };
        JsonUtil.formatObject = function (obj) {
            var indent = "  ";
            return JSON.stringify(obj, null, indent);
        };
        return JsonUtil;
    })();
    util.JsonUtil = JsonUtil;
    var StringUtil = (function () {
        function StringUtil() {
        }
        // "foo" -> "Foo", "Foo -> Foo", "foo_bar" -> "FooBar", "foo bar" -> "FooBar"
        StringUtil.camenize = function (str, isPlural) {
            str = str.trim().replace(/[\s|\_-]+/g, "_").replace(/[\_](\w)/g, function (m) {
                return m[1].toUpperCase();
            });
            if (isPlural) {
                str = str.replace(/(.*)s$/, "$1");
            }
            return str[0].toUpperCase() + str.slice(1, str.length);
        };
        return StringUtil;
    })();
    util.StringUtil = StringUtil;
    var ArrayUtil = (function () {
        function ArrayUtil() {
        }
        ArrayUtil.mkString = function (strings, separator) {
            var res = "";
            for (var i = 0; i < strings.length; i++) {
                if (i != 0) {
                    res += separator;
                }
                res += strings[i];
            }
            return res;
        };
        return ArrayUtil;
    })();
    util.ArrayUtil = ArrayUtil;
})(util || (util = {}));
