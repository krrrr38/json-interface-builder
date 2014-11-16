/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./core.ts" />
/// <reference path="./exporter.ts" />
/// <reference path="./util.ts" />

enum Step {
  Start, Building, Result
}

interface TopScope extends ng.IScope {
  json: string;
  step: number;
  result: string;
  components: core.SearchableObject[];
  targetComponentIndex: number;
  isValidJson: (string) => boolean;
  startBuilding: () => void;
  nextComponent: (name: string) => void;
}

class TopCtrl {
  constructor(private $scope: TopScope) {
    $scope.step = Step.Start;
    $scope.components = [];
    $scope.targetComponentIndex = 0;

    $scope.isValidJson = (json: string) => {
      if (json) {
        try {
          var obj = JSON.parse(json);
          return typeof(obj) === 'object';
        } catch(e) {
          return false;
        }
      } else {
        return false;
      }
    }

    $scope.startBuilding = () => {
      $scope.step = Step.Building;
      this.build($scope.json);
      $scope.json = util.JsonUtil.formatter($scope.json);
    }

    $scope.nextComponent = (name: string) => {
      $scope.components[$scope.targetComponentIndex].name = name;
      if(++$scope.targetComponentIndex >=  $scope.components.length) {
        this.showResult();
      }
    }
  }

  private build = (json: string) => {
    var callback = (obj: core.SearchableObject) => {
      this.$scope.components.push(obj);
    };
    var root = new core.SearchableObject("Root", false, JSON.parse(json), callback);
    this.$scope.components.push(root);
  }

  private showResult = () => {
    this.$scope.step = Step.Result;

    this.$scope.result = "";
    var exp = new exporter.TypeScriptExporter();
    var components = this.$scope.components;
    for(var i = 0; i < components.length; i++) {
      this.$scope.result += exp.run(components[i]) + "\n";
    }
  }
}

interface ComponentBuilderScope extends ng.IScope {
  name: string;
  component: core.SearchableObject;
  submit: (string) => void;
  setName: () => void;
  prettyJson: string;
}

class ComponentBuilder implements ng.IDirective {
  templateUrl = "./public/templates/component-builder.html";
  scope = {
    component: '=',
    submit: '&'
  };
  link = ($scope: ComponentBuilderScope, element: JQuery, attrs: ng.IAttributes) => {
    $scope.name = $scope.component.name;
    $scope.setName = () => {
      $scope.submit({ name: $scope.name });
    }
    $scope.prettyJson = $scope.component.getPrettyJsonString();
  }
}

angular.module('jibApp', [])
  .controller('TopCtrl', ['$scope', TopCtrl])
  .directive('componentBuilder', () => new ComponentBuilder());
