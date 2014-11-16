/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./util.ts" />

module core {
  export interface Tree {
    name: string;
    isArray: boolean;
  }

  export class ConstValue implements Tree {
    name: string;
    isArray: boolean;
    constructor(private value: any, isArray: boolean) {
      this.isArray = isArray;
      if (angular.isUndefined(value)) {
        this.name = "any";
      } else {
        this.name = typeof value;
      }
    }
  }

  /**
   * extend Object for labeling
   */
  export class SearchableObject implements Tree {
    private trees: Object = {};
    name: string;
    isArray: boolean;
    constructor(
      name: string,
      isArray: boolean,
      private obj: Object,
      callback: (SearchableObject) => void
    ) {
      this.name = name;
      this.isArray = isArray;
      for(var key in this.obj) {
        var target = this.obj[key]
        if (angular.isArray(target)) {
          var head = target[0];
          if (head && angular.isObject(head)) {
            var searchableObj = new SearchableObject(util.StringUtil.camenize(key, true), true, head, callback);
            this.trees[key] = searchableObj;
            callback(searchableObj);
          } else {
            this.trees[key] = new ConstValue(head, true);
          }
        } else if (angular.isObject(target)) {
          var searchableObj = new SearchableObject(util.StringUtil.camenize(key, false), false, this.obj[key], callback);
          this.trees[key] = searchableObj;
          callback(searchableObj);
        } else {
          this.trees[key] = new ConstValue(this.obj[key], false);
        }
      }
    }

    getPrettyJsonString(): string {
      return util.JsonUtil.formatObject(this.obj);
    }

    getTrees(): Object {
      return this.trees;
    }
  }
}
