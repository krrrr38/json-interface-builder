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
  language: string;
  components: types.JIBObject[];
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
    $scope.language = "ts";

    $scope.isValidJson = (json: string) => {
      if (json) {
        try {
          var obj = JSON.parse(json);
          return angular.isObject(obj) && !angular.isArray(obj);
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

    $scope.$watch('language', (newLang) => {
      if($scope.step === Step.Result) {
        this.loadResult(newLang);
      }
    });
  }

  private build = (json: string) => {
    this.$scope.components = core.JIBExplorer.findObjects(JSON.parse(json));
  }

  private showResult = () => {
    this.$scope.step = Step.Result;
    this.loadResult(this.$scope.language);
  }

  private loadResult = (lang: string) => {
    this.$scope.result = "";
    var exp;
    switch (lang) {
    case "scala":
      exp = new exporter.ScalaExporter();
      break;
    case "go":
      exp = new exporter.GoExporter();
      break;
    default:
      exp = new exporter.TypeScriptExporter();
    }
    var components = this.$scope.components;
    for(var i = 0; i < components.length; i++) {
      this.$scope.result += exp.run(components[i]) + "\n";
    }
  }
}

interface ComponentBuilderScope extends ng.IScope {
  name: string;
  component: types.JIBObject;
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
