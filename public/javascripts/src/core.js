/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./util.ts" />
var core;
(function (core) {
    var ConstValue = (function () {
        function ConstValue(value, isArray) {
            this.value = value;
            this.isArray = isArray;
            if (angular.isUndefined(value)) {
                this.name = "any";
            }
            else {
                this.name = typeof value;
            }
        }
        return ConstValue;
    })();
    core.ConstValue = ConstValue;
    /**
     * extend Object for labeling
     */
    var SearchableObject = (function () {
        function SearchableObject(name, isArray, obj, callback) {
            this.obj = obj;
            this.trees = {};
            this.name = name;
            this.isArray = isArray;
            for (var key in this.obj) {
                var target = this.obj[key];
                if (angular.isArray(target)) {
                    var head = target[0];
                    if (head && angular.isObject(head)) {
                        var searchableObj = new SearchableObject(util.StringUtil.camenize(key, true), true, head, callback);
                        this.trees[key] = searchableObj;
                        callback(searchableObj);
                    }
                    else {
                        this.trees[key] = new ConstValue(head, true);
                    }
                }
                else if (angular.isObject(target)) {
                    var searchableObj = new SearchableObject(util.StringUtil.camenize(key, false), false, this.obj[key], callback);
                    this.trees[key] = searchableObj;
                    callback(searchableObj);
                }
                else {
                    this.trees[key] = new ConstValue(this.obj[key], false);
                }
            }
        }
        SearchableObject.prototype.getPrettyJsonString = function () {
            return util.JsonUtil.formatObject(this.obj);
        };
        SearchableObject.prototype.getTrees = function () {
            return this.trees;
        };
        return SearchableObject;
    })();
    core.SearchableObject = SearchableObject;
})(core || (core = {}));
