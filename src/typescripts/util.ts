module util {
  export class JsonUtil {
    static formatter(json: string): string {
      return this.formatObject(JSON.parse(json));
    }

    static formatObject(obj: Object): string {
      var indent = "  ";
      return JSON.stringify(obj, null, indent);
    }
  }

  export class StringUtil {
    // "foo" -> "Foo", "Foo -> Foo", "foo_bar" -> "FooBar", "foo bar" -> "FooBar"
    static camenize(str: string): string {
      str = str.trim().replace(/[\s|\_-]+/g, "_")
        .replace(/[\_](\w)/g, function(m){
          return m[1].toUpperCase();
        });
      return str[0].toUpperCase() + str.slice(1, str.length);
    }

    static singular(str: string): string {
      return str.replace(/(.*)s$/, "$1");
    }
  }

  export class ArrayUtil {
    static mkString(strings: string[], separator: string): string {
      var res = "";
      for(var i = 0; i < strings.length; i++) {
        if (i != 0) {
          res += separator;
        }
        res += strings[i];
      }
      return res;
    }
  }
}
