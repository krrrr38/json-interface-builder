/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./core.ts" />
/// <reference path="./exporter.ts" />
/// <reference path="./util.ts" />
var Step;
(function (Step) {
    Step[Step["Start"] = 0] = "Start";
    Step[Step["Building"] = 1] = "Building";
    Step[Step["Result"] = 2] = "Result";
})(Step || (Step = {}));
var TopCtrl = (function () {
    function TopCtrl($scope) {
        var _this = this;
        this.$scope = $scope;
        this.build = function (json) {
            var callback = function (obj) {
                _this.$scope.components.push(obj);
            };
            var root = new core.SearchableObject("Root", false, JSON.parse(json), callback);
            _this.$scope.components.push(root);
        };
        this.showResult = function () {
            _this.$scope.step = 2 /* Result */;
            _this.$scope.result = "";
            var exp = new exporter.TypeScriptExporter();
            var components = _this.$scope.components;
            for (var i = 0; i < components.length; i++) {
                _this.$scope.result += exp.run(components[i]) + "\n";
            }
        };
        $scope.step = 0 /* Start */;
        $scope.components = [];
        $scope.targetComponentIndex = 0;
        $scope.isValidJson = function (json) {
            if (json) {
                try {
                    var obj = JSON.parse(json);
                    return typeof (obj) === 'object';
                }
                catch (e) {
                    return false;
                }
            }
            else {
                return false;
            }
        };
        $scope.startBuilding = function () {
            $scope.step = 1 /* Building */;
            _this.build($scope.json);
            $scope.json = util.JsonUtil.formatter($scope.json);
        };
        $scope.nextComponent = function (name) {
            $scope.components[$scope.targetComponentIndex].name = name;
            if (++$scope.targetComponentIndex >= $scope.components.length) {
                _this.showResult();
            }
        };
    }
    return TopCtrl;
})();
var ComponentBuilder = (function () {
    function ComponentBuilder() {
        this.templateUrl = "./public/templates/component-builder.html";
        this.scope = {
            component: '=',
            submit: '&'
        };
        this.link = function ($scope, element, attrs) {
            $scope.name = $scope.component.name;
            $scope.setName = function () {
                $scope.submit({ name: $scope.name });
            };
            $scope.prettyJson = $scope.component.getPrettyJsonString();
        };
    }
    return ComponentBuilder;
})();
angular.module('jibApp', []).controller('TopCtrl', ['$scope', TopCtrl]).directive('componentBuilder', function () { return new ComponentBuilder(); });
