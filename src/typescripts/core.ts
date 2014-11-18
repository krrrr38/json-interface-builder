/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./util.ts" />
/// <reference path="./types.ts" />

module core {

  export class JIBExplorer {
    static findObjects(obj: Object): types.JIBObject[] {
      var objects: types.JIBObject[] = []
      var callback = (jibobj: types.JIBObject) => {
        objects.push(jibobj);
      }
      JIBExplorer.dig("Root", obj, callback);
      return objects;
    }

    private static dig(name: string, obj: Object, callback: (JIBObject) => void): types.JIBObject {
      var values: Object = {};
      for (var key in obj) {
        var value = obj[key]
        if (angular.isArray(value)) {
          var head = value[0];
          var singleKey = util.StringUtil.singular(key);
          values[key] =
            new types.JIBArray(JIBExplorer.detectSingleObject(singleKey, head, callback));
        } else {
          values[key] = JIBExplorer.detectSingleObject(key, value, callback);
        }
      }
      var jibobj = new types.JIBObject(util.StringUtil.camenize(name), values);
      callback(jibobj);
      return jibobj;
    }

    private static detectSingleObject(key: string, value: any, callback: (JIBObject) => void): types.JIBAny<any> {
      if(angular.isObject(value)) {
        return JIBExplorer.dig(key, value, callback);
      } else if(angular.isString(value)) {
        return new types.JIBString(value);
      } else if(angular.isNumber(value)) {
        return new types.JIBNumber(value);
      } else if(typeof value === 'boolean') {
        return new types.JIBBoolean(value);
      } else {
        return new types.JIBAnything(value);
      }
    }
  }
}
