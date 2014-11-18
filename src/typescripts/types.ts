/// <reference path="./util.ts" />

module types {

  export enum Types {
    JIBArray, JIBObject, JIBString, JIBNumber, JIBBoolean, JIBAnything
  }

  export interface JIBAny<A> {
    type: Types;
    value: A;
    getPrettyJsonString(): string;
  }

  export class JIBObject implements JIBAny<Object> {
    type = Types.JIBObject;
    value: Object; // which contains {key : JIBAny<any>,...}
    constructor(public name: string, value: Object) {
      this.value = value;
    }
    getPrettyJsonString(): string {
      var jsonValues: string[] = [];
      for (var key in this.value) {
        var obj = this.value[key];
        if (obj.type === Types.JIBObject) {
          jsonValues.push("\"" + key + "\"" + ":" + "\"<" + (<JIBObject> obj).name + ">\"");
        } else {
          jsonValues.push("\"" + key + "\"" + ":" + obj.getPrettyJsonString())
        }
      }
      return util.JsonUtil.formatter("{" + util.ArrayUtil.mkString(jsonValues, ",") + "}");
    }
  }

  // treat head value for containing type
  export class JIBArray<A extends JIBAny<any>> implements JIBAny<A> {
    type = Types.JIBArray;
    value: A;
    constructor(value: A) {
      this.value = value;
    }
    getPrettyJsonString(): string {
      return util.JsonUtil.formatter("[" + this.value.getPrettyJsonString() + "]");
    }
  }

  export class JIBString implements JIBAny<string> {
    type = Types.JIBString;
    value: string;
    constructor(value: string) {
      this.value = value;
    }
    getPrettyJsonString(): string {
      return "\"" + this.value + "\"";
    }
  }

  export class JIBNumber implements JIBAny<number> {
    type = Types.JIBNumber;
    value: number;
    constructor(value: number) {
      this.value = value;
    }
    getPrettyJsonString(): string {
      return this.value.toString();
    }
  }

  export class JIBBoolean implements JIBAny<boolean> {
    type = Types.JIBBoolean;
    value: boolean;
    constructor(value: boolean) {
      this.value = value;
    }
    getPrettyJsonString(): string {
      return this.value.toString();
    }
  }

  export class JIBAnything implements JIBAny<any> {
    type = Types.JIBAnything;
    value: any;
    constructor(value: any) {
      this.value = value;
    }
    getPrettyJsonString(): string {
      return "";
    }
  }
}
