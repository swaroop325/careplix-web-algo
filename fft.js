(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw ((a.code = "MODULE_NOT_FOUND"), a);
        }
        var p = (n[i] = { exports: {} });
        e[i][0].call(
          p.exports,
          function (r) {
            var n = e[i][1][r];
            return o(n || r);
          },
          p,
          p.exports,
          r,
          e,
          n,
          t
        );
      }
      return n[i].exports;
    }
    for (
      var u = "function" == typeof require && require, i = 0;
      i < t.length;
      i++
    )
      o(t[i]);
    return o;
  }
  return r;
})()(
  {
    1: [function (require, module, exports) {}, {}],
    2: [
      function (require, module, exports) {
        (function (process) {
          function normalizeArray(parts, allowAboveRoot) {
            var up = 0;
            for (var i = parts.length - 1; i >= 0; i--) {
              var last = parts[i];
              if (last === ".") {
                parts.splice(i, 1);
              } else if (last === "..") {
                parts.splice(i, 1);
                up++;
              } else if (up) {
                parts.splice(i, 1);
                up--;
              }
            }
            if (allowAboveRoot) {
              for (; up--; up) {
                parts.unshift("..");
              }
            }

            return parts;
          }
          exports.resolve = function () {
            var resolvedPath = "",
              resolvedAbsolute = false;

            for (
              var i = arguments.length - 1;
              i >= -1 && !resolvedAbsolute;
              i--
            ) {
              var path = i >= 0 ? arguments[i] : process.cwd();
              if (typeof path !== "string") {
                throw new TypeError(
                  "Arguments to path.resolve must be strings"
                );
              } else if (!path) {
                continue;
              }

              resolvedPath = path + "/" + resolvedPath;
              resolvedAbsolute = path.charAt(0) === "/";
            }
            resolvedPath = normalizeArray(
              filter(resolvedPath.split("/"), function (p) {
                return !!p;
              }),
              !resolvedAbsolute
            ).join("/");

            return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
          };
          exports.normalize = function (path) {
            var isAbsolute = exports.isAbsolute(path),
              trailingSlash = substr(path, -1) === "/";
            path = normalizeArray(
              filter(path.split("/"), function (p) {
                return !!p;
              }),
              !isAbsolute
            ).join("/");

            if (!path && !isAbsolute) {
              path = ".";
            }
            if (path && trailingSlash) {
              path += "/";
            }

            return (isAbsolute ? "/" : "") + path;
          };
          exports.isAbsolute = function (path) {
            return path.charAt(0) === "/";
          };
          exports.join = function () {
            var paths = Array.prototype.slice.call(arguments, 0);
            return exports.normalize(
              filter(paths, function (p, index) {
                if (typeof p !== "string") {
                  throw new TypeError("Arguments to path.join must be strings");
                }
                return p;
              }).join("/")
            );
          };
          exports.relative = function (from, to) {
            from = exports.resolve(from).substr(1);
            to = exports.resolve(to).substr(1);
            function trim(arr) {
              var start = 0;
              for (; start < arr.length; start++) {
                if (arr[start] !== "") break;
              }
              var end = arr.length - 1;
              for (; end >= 0; end--) {
                if (arr[end] !== "") break;
              }
              if (start > end) return [];
              return arr.slice(start, end - start + 1);
            }
            var fromParts = trim(from.split("/"));
            var toParts = trim(to.split("/"));
            var length = Math.min(fromParts.length, toParts.length);
            var samePartsLength = length;
            for (var i = 0; i < length; i++) {
              if (fromParts[i] !== toParts[i]) {
                samePartsLength = i;
                break;
              }
            }
            var outputParts = [];
            for (var i = samePartsLength; i < fromParts.length; i++) {
              outputParts.push("..");
            }
            outputParts = outputParts.concat(toParts.slice(samePartsLength));
            return outputParts.join("/");
          };
          exports.sep = "/";
          exports.delimiter = ":";
          exports.dirname = function (path) {
            if (typeof path !== "string") path = path + "";
            if (path.length === 0) return ".";
            var code = path.charCodeAt(0);
            var hasRoot = code === 47; /*/*/
            var end = -1;
            var matchedSlash = true;
            for (var i = path.length - 1; i >= 1; --i) {
              code = path.charCodeAt(i);
              if (code === 47 /*/*/) {
                if (!matchedSlash) {
                  end = i;
                  break;
                }
              } else {
                matchedSlash = false;
              }
            }
            if (end === -1) return hasRoot ? "/" : ".";
            if (hasRoot && end === 1) {
              return "/";
            }
            return path.slice(0, end);
          };
          function basename(path) {
            if (typeof path !== "string") path = path + "";
            var start = 0;
            var end = -1;
            var matchedSlash = true;
            var i;
            for (i = path.length - 1; i >= 0; --i) {
              if (path.charCodeAt(i) === 47 /*/*/) {
                if (!matchedSlash) {
                  start = i + 1;
                  break;
                }
              } else if (end === -1) {
                matchedSlash = false;
                end = i + 1;
              }
            }
            if (end === -1) return "";
            return path.slice(start, end);
          }
          exports.basename = function (path, ext) {
            var f = basename(path);
            if (ext && f.substr(-1 * ext.length) === ext) {
              f = f.substr(0, f.length - ext.length);
            }
            return f;
          };
          exports.extname = function (path) {
            if (typeof path !== "string") path = path + "";
            var startDot = -1;
            var startPart = 0;
            var end = -1;
            var matchedSlash = true;
            var preDotState = 0;
            for (var i = path.length - 1; i >= 0; --i) {
              var code = path.charCodeAt(i);
              if (code === 47 /*/*/) {
                if (!matchedSlash) {
                  startPart = i + 1;
                  break;
                }
                continue;
              }
              if (end === -1) {
                matchedSlash = false;
                end = i + 1;
              }
              if (code === 46 /*.*/) {
                if (startDot === -1) startDot = i;
                else if (preDotState !== 1) preDotState = 1;
              } else if (startDot !== -1) {
                preDotState = -1;
              }
            }
            if (
              startDot === -1 ||
              end === -1 ||
              preDotState === 0 ||
              (preDotState === 1 &&
                startDot === end - 1 &&
                startDot === startPart + 1)
            ) {
              return "";
            }
            return path.slice(startDot, end);
          };
          function filter(xs, f) {
            if (xs.filter) return xs.filter(f);
            var res = [];
            for (var i = 0; i < xs.length; i++) {
              if (f(xs[i], i, xs)) res.push(xs[i]);
            }
            return res;
          }
          var substr =
            "ab".substr(-1) === "b"
              ? function (str, start, len) {
                  return str.substr(start, len);
                }
              : function (str, start, len) {
                  if (start < 0) start = str.length + start;
                  return str.substr(start, len);
                };
        }.call(this, require("_process")));
      },
      { _process: 3 },
    ],
    3: [
      function (require, module, exports) {
        var process = (module.exports = {});
        var cachedSetTimeout;
        var cachedClearTimeout;
        function defaultSetTimout() {
          throw new Error("setTimeout has not been defined");
        }
        function defaultClearTimeout() {
          throw new Error("clearTimeout has not been defined");
        }
        (function () {
          try {
            if (typeof setTimeout === "function") {
              cachedSetTimeout = setTimeout;
            } else {
              cachedSetTimeout = defaultSetTimout;
            }
          } catch (e) {
            cachedSetTimeout = defaultSetTimout;
          }
          try {
            if (typeof clearTimeout === "function") {
              cachedClearTimeout = clearTimeout;
            } else {
              cachedClearTimeout = defaultClearTimeout;
            }
          } catch (e) {
            cachedClearTimeout = defaultClearTimeout;
          }
        })();
        function runTimeout(fun) {
          if (cachedSetTimeout === setTimeout) {
            return setTimeout(fun, 0);
          }
          if (
            (cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) &&
            setTimeout
          ) {
            cachedSetTimeout = setTimeout;
            return setTimeout(fun, 0);
          }
          try {
            return cachedSetTimeout(fun, 0);
          } catch (e) {
            try {
              return cachedSetTimeout.call(null, fun, 0);
            } catch (e) {
              return cachedSetTimeout.call(this, fun, 0);
            }
          }
        }
        function runClearTimeout(marker) {
          if (cachedClearTimeout === clearTimeout) {
            return clearTimeout(marker);
          }
          if (
            (cachedClearTimeout === defaultClearTimeout ||
              !cachedClearTimeout) &&
            clearTimeout
          ) {
            cachedClearTimeout = clearTimeout;
            return clearTimeout(marker);
          }
          try {
            return cachedClearTimeout(marker);
          } catch (e) {
            try {
              return cachedClearTimeout.call(null, marker);
            } catch (e) {
              return cachedClearTimeout.call(this, marker);
            }
          }
        }
        var queue = [];
        var draining = false;
        var currentQueue;
        var queueIndex = -1;
        function cleanUpNextTick() {
          if (!draining || !currentQueue) {
            return;
          }
          draining = false;
          if (currentQueue.length) {
            queue = currentQueue.concat(queue);
          } else {
            queueIndex = -1;
          }
          if (queue.length) {
            drainQueue();
          }
        }
        function drainQueue() {
          if (draining) {
            return;
          }
          var timeout = runTimeout(cleanUpNextTick);
          draining = true;
          var len = queue.length;
          while (len) {
            currentQueue = queue;
            queue = [];
            while (++queueIndex < len) {
              if (currentQueue) {
                currentQueue[queueIndex].run();
              }
            }
            queueIndex = -1;
            len = queue.length;
          }
          currentQueue = null;
          draining = false;
          runClearTimeout(timeout);
        }
        process.nextTick = function (fun) {
          var args = new Array(arguments.length - 1);
          if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
              args[i - 1] = arguments[i];
            }
          }
          queue.push(new Item(fun, args));
          if (queue.length === 1 && !draining) {
            runTimeout(drainQueue);
          }
        };
        function Item(fun, array) {
          this.fun = fun;
          this.array = array;
        }
        Item.prototype.run = function () {
          this.fun.apply(null, this.array);
        };
        process.title = "browser";
        process.browser = true;
        process.env = {};
        process.argv = [];
        process.version = "";
        process.versions = {};
        function noop() {}
        process.on = noop;
        process.addListener = noop;
        process.once = noop;
        process.off = noop;
        process.removeListener = noop;
        process.removeAllListeners = noop;
        process.emit = noop;
        process.prependListener = noop;
        process.prependOnceListener = noop;
        process.listeners = function (name) {
          return [];
        };
        process.binding = function (name) {
          throw new Error("process.binding is not supported");
        };
        process.cwd = function () {
          return "/";
        };
        process.chdir = function (dir) {
          throw new Error("process.chdir is not supported");
        };
        process.umask = function () {
          return 0;
        };
      },
      {},
    ],
    4: [
      function (require, module, exports) {
        var yt = require("kissfft-js");
        window.kiss = require("kissfft-js");
        console.log(yt);
      },
      { "kissfft-js": 6 },
    ],
    5: [
      function (require, module, exports) {
        (function (process) {
          var KissFFTModule = function (KissFFTModule) {
            KissFFTModule = KissFFTModule || {};
            var Module = KissFFTModule;

            var Module;
            if (!Module)
              Module =
                (typeof KissFFTModule !== "undefined" ? KissFFTModule : null) ||
                {};
            var moduleOverrides = {};
            for (var key in Module) {
              if (Module.hasOwnProperty(key)) {
                moduleOverrides[key] = Module[key];
              }
            }
            var ENVIRONMENT_IS_WEB = false;
            var ENVIRONMENT_IS_WORKER = false;
            var ENVIRONMENT_IS_NODE = false;
            var ENVIRONMENT_IS_SHELL = false;
            if (Module["ENVIRONMENT"]) {
              if (Module["ENVIRONMENT"] === "WEB") {
                ENVIRONMENT_IS_WEB = true;
              } else if (Module["ENVIRONMENT"] === "WORKER") {
                ENVIRONMENT_IS_WORKER = true;
              } else if (Module["ENVIRONMENT"] === "NODE") {
                ENVIRONMENT_IS_NODE = true;
              } else if (Module["ENVIRONMENT"] === "SHELL") {
                ENVIRONMENT_IS_SHELL = true;
              } else {
                throw new Error(
                  "The provided Module['ENVIRONMENT'] value is not valid. It must be one of: WEB|WORKER|NODE|SHELL."
                );
              }
            } else {
              ENVIRONMENT_IS_WEB = typeof window === "object";
              ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
              ENVIRONMENT_IS_NODE =
                typeof process === "object" &&
                typeof require === "function" &&
                !ENVIRONMENT_IS_WEB &&
                !ENVIRONMENT_IS_WORKER;
              ENVIRONMENT_IS_SHELL =
                !ENVIRONMENT_IS_WEB &&
                !ENVIRONMENT_IS_NODE &&
                !ENVIRONMENT_IS_WORKER;
            }
            if (ENVIRONMENT_IS_NODE) {
              if (!Module["print"]) Module["print"] = console.log;
              if (!Module["printErr"]) Module["printErr"] = console.warn;
              var nodeFS;
              var nodePath;
              Module["read"] = function shell_read(filename, binary) {
                if (!nodeFS) nodeFS = require("fs");
                if (!nodePath) nodePath = require("path");
                filename = nodePath["normalize"](filename);
                var ret = nodeFS["readFileSync"](filename);
                return binary ? ret : ret.toString();
              };
              Module["readBinary"] = function readBinary(filename) {
                var ret = Module["read"](filename, true);
                if (!ret.buffer) {
                  ret = new Uint8Array(ret);
                }
                assert(ret.buffer);
                return ret;
              };
              Module["load"] = function load(f) {
                globalEval(read(f));
              };
              if (!Module["thisProgram"]) {
                if (process["argv"].length > 1) {
                  Module["thisProgram"] = process["argv"][1].replace(
                    /\\/g,
                    "/"
                  );
                } else {
                  Module["thisProgram"] = "unknown-program";
                }
              }
              Module["arguments"] = process["argv"].slice(2);
              process["on"]("uncaughtException", function (ex) {
                if (!(ex instanceof ExitStatus)) {
                  throw ex;
                }
              });
              Module["inspect"] = function () {
                return "[Emscripten Module object]";
              };
            } else if (ENVIRONMENT_IS_SHELL) {
              if (!Module["print"]) Module["print"] = print;
              if (typeof printErr != "undefined") Module["printErr"] = printErr;
              if (typeof read != "undefined") {
                Module["read"] = read;
              } else {
                Module["read"] = function shell_read() {
                  throw "no read() available";
                };
              }
              Module["readBinary"] = function readBinary(f) {
                if (typeof readbuffer === "function") {
                  return new Uint8Array(readbuffer(f));
                }
                var data = read(f, "binary");
                assert(typeof data === "object");
                return data;
              };
              if (typeof scriptArgs != "undefined") {
                Module["arguments"] = scriptArgs;
              } else if (typeof arguments != "undefined") {
                Module["arguments"] = arguments;
              }
              if (typeof quit === "function") {
                Module["quit"] = function (status, toThrow) {
                  quit(status);
                };
              }
            } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
              Module["read"] = function shell_read(url) {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url, false);
                xhr.send(null);
                return xhr.responseText;
              };
              if (ENVIRONMENT_IS_WORKER) {
                Module["readBinary"] = function readBinary(url) {
                  var xhr = new XMLHttpRequest();
                  xhr.open("GET", url, false);
                  xhr.responseType = "arraybuffer";
                  xhr.send(null);
                  return new Uint8Array(xhr.response);
                };
              }
              Module["readAsync"] = function readAsync(url, onload, onerror) {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url, true);
                xhr.responseType = "arraybuffer";
                xhr.onload = function xhr_onload() {
                  if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
                    onload(xhr.response);
                  } else {
                    onerror();
                  }
                };
                xhr.onerror = onerror;
                xhr.send(null);
              };
              if (typeof arguments != "undefined") {
                Module["arguments"] = arguments;
              }
              if (typeof console !== "undefined") {
                if (!Module["print"])
                  Module["print"] = function shell_print(x) {
                    console.log(x);
                  };
                if (!Module["printErr"])
                  Module["printErr"] = function shell_printErr(x) {
                    console.warn(x);
                  };
              } else {
                var TRY_USE_DUMP = false;
                if (!Module["print"])
                  Module["print"] =
                    TRY_USE_DUMP && typeof dump !== "undefined"
                      ? function (x) {
                          dump(x);
                        }
                      : function (x) {};
              }
              if (ENVIRONMENT_IS_WORKER) {
                Module["load"] = importScripts;
              }
              if (typeof Module["setWindowTitle"] === "undefined") {
                Module["setWindowTitle"] = function (title) {
                  document.title = title;
                };
              }
            } else {
              throw "Unknown runtime environment. Where are we?";
            }
            function globalEval(x) {
              eval.call(null, x);
            }
            if (!Module["load"] && Module["read"]) {
              Module["load"] = function load(f) {
                globalEval(Module["read"](f));
              };
            }
            if (!Module["print"]) {
              Module["print"] = function () {};
            }
            if (!Module["printErr"]) {
              Module["printErr"] = Module["print"];
            }
            if (!Module["arguments"]) {
              Module["arguments"] = [];
            }
            if (!Module["thisProgram"]) {
              Module["thisProgram"] = "./this.program";
            }
            if (!Module["quit"]) {
              Module["quit"] = function (status, toThrow) {
                throw toThrow;
              };
            }
            Module.print = Module["print"];
            Module.printErr = Module["printErr"];
            Module["preRun"] = [];
            Module["postRun"] = [];
            for (var key in moduleOverrides) {
              if (moduleOverrides.hasOwnProperty(key)) {
                Module[key] = moduleOverrides[key];
              }
            }
            moduleOverrides = undefined;
            var Runtime = {
              setTempRet0: function (value) {
                tempRet0 = value;
                return value;
              },
              getTempRet0: function () {
                return tempRet0;
              },
              stackSave: function () {
                return STACKTOP;
              },
              stackRestore: function (stackTop) {
                STACKTOP = stackTop;
              },
              getNativeTypeSize: function (type) {
                switch (type) {
                  case "i1":
                  case "i8":
                    return 1;
                  case "i16":
                    return 2;
                  case "i32":
                    return 4;
                  case "i64":
                    return 8;
                  case "float":
                    return 4;
                  case "double":
                    return 8;
                  default: {
                    if (type[type.length - 1] === "*") {
                      return Runtime.QUANTUM_SIZE;
                    } else if (type[0] === "i") {
                      var bits = parseInt(type.substr(1));
                      assert(bits % 8 === 0);
                      return bits / 8;
                    } else {
                      return 0;
                    }
                  }
                }
              },
              getNativeFieldSize: function (type) {
                return Math.max(
                  Runtime.getNativeTypeSize(type),
                  Runtime.QUANTUM_SIZE
                );
              },
              STACK_ALIGN: 16,
              prepVararg: function (ptr, type) {
                if (type === "double" || type === "i64") {
                  if (ptr & 7) {
                    assert((ptr & 7) === 4);
                    ptr += 4;
                  }
                } else {
                  assert((ptr & 3) === 0);
                }
                return ptr;
              },
              getAlignSize: function (type, size, vararg) {
                if (!vararg && (type == "i64" || type == "double")) return 8;
                if (!type) return Math.min(size, 8);
                return Math.min(
                  size || (type ? Runtime.getNativeFieldSize(type) : 0),
                  Runtime.QUANTUM_SIZE
                );
              },
              dynCall: function (sig, ptr, args) {
                if (args && args.length) {
                  return Module["dynCall_" + sig].apply(
                    null,
                    [ptr].concat(args)
                  );
                } else {
                  return Module["dynCall_" + sig].call(null, ptr);
                }
              },
              functionPointers: [],
              addFunction: function (func) {
                for (var i = 0; i < Runtime.functionPointers.length; i++) {
                  if (!Runtime.functionPointers[i]) {
                    Runtime.functionPointers[i] = func;
                    return 2 * (1 + i);
                  }
                }
                throw "Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.";
              },
              removeFunction: function (index) {
                Runtime.functionPointers[(index - 2) / 2] = null;
              },
              warnOnce: function (text) {
                if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
                if (!Runtime.warnOnce.shown[text]) {
                  Runtime.warnOnce.shown[text] = 1;
                  Module.printErr(text);
                }
              },
              funcWrappers: {},
              getFuncWrapper: function (func, sig) {
                if (!func) return;
                assert(sig);
                if (!Runtime.funcWrappers[sig]) {
                  Runtime.funcWrappers[sig] = {};
                }
                var sigCache = Runtime.funcWrappers[sig];
                if (!sigCache[func]) {
                  if (sig.length === 1) {
                    sigCache[func] = function dynCall_wrapper() {
                      return Runtime.dynCall(sig, func);
                    };
                  } else if (sig.length === 2) {
                    sigCache[func] = function dynCall_wrapper(arg) {
                      return Runtime.dynCall(sig, func, [arg]);
                    };
                  } else {
                    sigCache[func] = function dynCall_wrapper() {
                      return Runtime.dynCall(
                        sig,
                        func,
                        Array.prototype.slice.call(arguments)
                      );
                    };
                  }
                }
                return sigCache[func];
              },
              getCompilerSetting: function (name) {
                throw "You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work";
              },
              stackAlloc: function (size) {
                var ret = STACKTOP;
                STACKTOP = (STACKTOP + size) | 0;
                STACKTOP = (STACKTOP + 15) & -16;
                return ret;
              },
              staticAlloc: function (size) {
                var ret = STATICTOP;
                STATICTOP = (STATICTOP + size) | 0;
                STATICTOP = (STATICTOP + 15) & -16;
                return ret;
              },
              dynamicAlloc: function (size) {
                var ret = HEAP32[DYNAMICTOP_PTR >> 2];
                var end = ((ret + size + 15) | 0) & -16;
                HEAP32[DYNAMICTOP_PTR >> 2] = end;
                if (end >= TOTAL_MEMORY) {
                  var success = enlargeMemory();
                  if (!success) {
                    HEAP32[DYNAMICTOP_PTR >> 2] = ret;
                    return 0;
                  }
                }
                return ret;
              },
              alignMemory: function (size, quantum) {
                var ret = (size =
                  Math.ceil(size / (quantum ? quantum : 16)) *
                  (quantum ? quantum : 16));
                return ret;
              },
              makeBigInt: function (low, high, unsigned) {
                var ret = unsigned
                  ? +(low >>> 0) + +(high >>> 0) * +4294967296
                  : +(low >>> 0) + +(high | 0) * +4294967296;
                return ret;
              },
              GLOBAL_BASE: 8,
              QUANTUM_SIZE: 4,
              __dummy__: 0,
            };
            Module["Runtime"] = Runtime;
            var ABORT = 0;
            var EXITSTATUS = 0;
            function assert(condition, text) {
              if (!condition) {
                abort("Assertion failed: " + text);
              }
            }
            function getCFunc(ident) {
              var func = Module["_" + ident];
              if (!func) {
                try {
                  func = eval("_" + ident);
                } catch (e) {}
              }
              assert(
                func,
                "Cannot call unknown function " +
                  ident +
                  " (perhaps LLVM optimizations or closure removed it?)"
              );
              return func;
            }
            var cwrap, ccall;
            (function () {
              var JSfuncs = {
                stackSave: function () {
                  Runtime.stackSave();
                },
                stackRestore: function () {
                  Runtime.stackRestore();
                },
                arrayToC: function (arr) {
                  var ret = Runtime.stackAlloc(arr.length);
                  writeArrayToMemory(arr, ret);
                  return ret;
                },
                stringToC: function (str) {
                  var ret = 0;
                  if (str !== null && str !== undefined && str !== 0) {
                    var len = (str.length << 2) + 1;
                    ret = Runtime.stackAlloc(len);
                    stringToUTF8(str, ret, len);
                  }
                  return ret;
                },
              };
              var toC = {
                string: JSfuncs["stringToC"],
                array: JSfuncs["arrayToC"],
              };
              ccall = function ccallFunc(
                ident,
                returnType,
                argTypes,
                args,
                opts
              ) {
                var func = getCFunc(ident);
                var cArgs = [];
                var stack = 0;
                if (args) {
                  for (var i = 0; i < args.length; i++) {
                    var converter = toC[argTypes[i]];
                    if (converter) {
                      if (stack === 0) stack = Runtime.stackSave();
                      cArgs[i] = converter(args[i]);
                    } else {
                      cArgs[i] = args[i];
                    }
                  }
                }
                var ret = func.apply(null, cArgs);
                if (returnType === "string") ret = Pointer_stringify(ret);
                if (stack !== 0) {
                  if (opts && opts.async) {
                    EmterpreterAsync.asyncFinalizers.push(function () {
                      Runtime.stackRestore(stack);
                    });
                    return;
                  }
                  Runtime.stackRestore(stack);
                }
                return ret;
              };
              var sourceRegex =
                /^function\s*[a-zA-Z$_0-9]*\s*\(([^)]*)\)\s*{\s*([^*]*?)[\s;]*(?:return\s*(.*?)[;\s]*)?}$/;
              function parseJSFunc(jsfunc) {
                var parsed = jsfunc.toString().match(sourceRegex).slice(1);
                return {
                  arguments: parsed[0],
                  body: parsed[1],
                  returnValue: parsed[2],
                };
              }
              var JSsource = null;
              function ensureJSsource() {
                if (!JSsource) {
                  JSsource = {};
                  for (var fun in JSfuncs) {
                    if (JSfuncs.hasOwnProperty(fun)) {
                      JSsource[fun] = parseJSFunc(JSfuncs[fun]);
                    }
                  }
                }
              }
              cwrap = function cwrap(ident, returnType, argTypes) {
                argTypes = argTypes || [];
                var cfunc = getCFunc(ident);
                var numericArgs = argTypes.every(function (type) {
                  return type === "number";
                });
                var numericRet = returnType !== "string";
                if (numericRet && numericArgs) {
                  return cfunc;
                }
                var argNames = argTypes.map(function (x, i) {
                  return "$" + i;
                });
                var funcstr = "(function(" + argNames.join(",") + ") {";
                var nargs = argTypes.length;
                if (!numericArgs) {
                  ensureJSsource();
                  funcstr += "var stack = " + JSsource["stackSave"].body + ";";
                  for (var i = 0; i < nargs; i++) {
                    var arg = argNames[i],
                      type = argTypes[i];
                    if (type === "number") continue;
                    var convertCode = JSsource[type + "ToC"];
                    funcstr +=
                      "var " + convertCode.arguments + " = " + arg + ";";
                    funcstr += convertCode.body + ";";
                    funcstr += arg + "=(" + convertCode.returnValue + ");";
                  }
                }
                var cfuncname = parseJSFunc(function () {
                  return cfunc;
                }).returnValue;
                funcstr +=
                  "var ret = " + cfuncname + "(" + argNames.join(",") + ");";
                if (!numericRet) {
                  var strgfy = parseJSFunc(function () {
                    return Pointer_stringify;
                  }).returnValue;
                  funcstr += "ret = " + strgfy + "(ret);";
                }
                if (!numericArgs) {
                  ensureJSsource();
                  funcstr +=
                    JSsource["stackRestore"].body.replace("()", "(stack)") +
                    ";";
                }
                funcstr += "return ret})";
                return eval(funcstr);
              };
            })();
            Module["ccall"] = ccall;
            Module["cwrap"] = cwrap;
            function setValue(ptr, value, type, noSafe) {
              type = type || "i8";
              if (type.charAt(type.length - 1) === "*") type = "i32";
              switch (type) {
                case "i1":
                  HEAP8[ptr >> 0] = value;
                  break;
                case "i8":
                  HEAP8[ptr >> 0] = value;
                  break;
                case "i16":
                  HEAP16[ptr >> 1] = value;
                  break;
                case "i32":
                  HEAP32[ptr >> 2] = value;
                  break;
                case "i64":
                  (tempI64 = [
                    value >>> 0,
                    ((tempDouble = value),
                    +Math_abs(tempDouble) >= +1
                      ? tempDouble > +0
                        ? (Math_min(
                            +Math_floor(tempDouble / +4294967296),
                            +4294967295
                          ) |
                            0) >>>
                          0
                        : ~~+Math_ceil(
                            (tempDouble - +(~~tempDouble >>> 0)) / +4294967296
                          ) >>> 0
                      : 0),
                  ]),
                    (HEAP32[ptr >> 2] = tempI64[0]),
                    (HEAP32[(ptr + 4) >> 2] = tempI64[1]);
                  break;
                case "float":
                  HEAPF32[ptr >> 2] = value;
                  break;
                case "double":
                  HEAPF64[ptr >> 3] = value;
                  break;
                default:
                  abort("invalid type for setValue: " + type);
              }
            }
            Module["setValue"] = setValue;
            function getValue(ptr, type, noSafe) {
              type = type || "i8";
              if (type.charAt(type.length - 1) === "*") type = "i32";
              switch (type) {
                case "i1":
                  return HEAP8[ptr >> 0];
                case "i8":
                  return HEAP8[ptr >> 0];
                case "i16":
                  return HEAP16[ptr >> 1];
                case "i32":
                  return HEAP32[ptr >> 2];
                case "i64":
                  return HEAP32[ptr >> 2];
                case "float":
                  return HEAPF32[ptr >> 2];
                case "double":
                  return HEAPF64[ptr >> 3];
                default:
                  abort("invalid type for setValue: " + type);
              }
              return null;
            }
            Module["getValue"] = getValue;
            var ALLOC_NORMAL = 0;
            var ALLOC_STACK = 1;
            var ALLOC_STATIC = 2;
            var ALLOC_DYNAMIC = 3;
            var ALLOC_NONE = 4;
            Module["ALLOC_NORMAL"] = ALLOC_NORMAL;
            Module["ALLOC_STACK"] = ALLOC_STACK;
            Module["ALLOC_STATIC"] = ALLOC_STATIC;
            Module["ALLOC_DYNAMIC"] = ALLOC_DYNAMIC;
            Module["ALLOC_NONE"] = ALLOC_NONE;
            function allocate(slab, types, allocator, ptr) {
              var zeroinit, size;
              if (typeof slab === "number") {
                zeroinit = true;
                size = slab;
              } else {
                zeroinit = false;
                size = slab.length;
              }
              var singleType = typeof types === "string" ? types : null;
              var ret;
              if (allocator == ALLOC_NONE) {
                ret = ptr;
              } else {
                ret = [
                  typeof _malloc === "function" ? _malloc : Runtime.staticAlloc,
                  Runtime.stackAlloc,
                  Runtime.staticAlloc,
                  Runtime.dynamicAlloc,
                ][allocator === undefined ? ALLOC_STATIC : allocator](
                  Math.max(size, singleType ? 1 : types.length)
                );
              }
              if (zeroinit) {
                var ptr = ret,
                  stop;
                assert((ret & 3) == 0);
                stop = ret + (size & ~3);
                for (; ptr < stop; ptr += 4) {
                  HEAP32[ptr >> 2] = 0;
                }
                stop = ret + size;
                while (ptr < stop) {
                  HEAP8[ptr++ >> 0] = 0;
                }
                return ret;
              }
              if (singleType === "i8") {
                if (slab.subarray || slab.slice) {
                  HEAPU8.set(slab, ret);
                } else {
                  HEAPU8.set(new Uint8Array(slab), ret);
                }
                return ret;
              }
              var i = 0,
                type,
                typeSize,
                previousType;
              while (i < size) {
                var curr = slab[i];
                if (typeof curr === "function") {
                  curr = Runtime.getFunctionIndex(curr);
                }
                type = singleType || types[i];
                if (type === 0) {
                  i++;
                  continue;
                }
                if (type == "i64") type = "i32";
                setValue(ret + i, curr, type);
                if (previousType !== type) {
                  typeSize = Runtime.getNativeTypeSize(type);
                  previousType = type;
                }
                i += typeSize;
              }
              return ret;
            }
            Module["allocate"] = allocate;
            function getMemory(size) {
              if (!staticSealed) return Runtime.staticAlloc(size);
              if (!runtimeInitialized) return Runtime.dynamicAlloc(size);
              return _malloc(size);
            }
            Module["getMemory"] = getMemory;
            function Pointer_stringify(ptr, length) {
              if (length === 0 || !ptr) return "";
              var hasUtf = 0;
              var t;
              var i = 0;
              while (1) {
                t = HEAPU8[(ptr + i) >> 0];
                hasUtf |= t;
                if (t == 0 && !length) break;
                i++;
                if (length && i == length) break;
              }
              if (!length) length = i;
              var ret = "";
              if (hasUtf < 128) {
                var MAX_CHUNK = 1024;
                var curr;
                while (length > 0) {
                  curr = String.fromCharCode.apply(
                    String,
                    HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK))
                  );
                  ret = ret ? ret + curr : curr;
                  ptr += MAX_CHUNK;
                  length -= MAX_CHUNK;
                }
                return ret;
              }
              return Module["UTF8ToString"](ptr);
            }
            Module["Pointer_stringify"] = Pointer_stringify;
            function AsciiToString(ptr) {
              var str = "";
              while (1) {
                var ch = HEAP8[ptr++ >> 0];
                if (!ch) return str;
                str += String.fromCharCode(ch);
              }
            }
            Module["AsciiToString"] = AsciiToString;
            function stringToAscii(str, outPtr) {
              return writeAsciiToMemory(str, outPtr, false);
            }
            Module["stringToAscii"] = stringToAscii;
            var UTF8Decoder =
              typeof TextDecoder !== "undefined"
                ? new TextDecoder("utf8")
                : undefined;
            function UTF8ArrayToString(u8Array, idx) {
              var endPtr = idx;
              while (u8Array[endPtr]) ++endPtr;
              if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
                return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
              } else {
                var u0, u1, u2, u3, u4, u5;
                var str = "";
                while (1) {
                  u0 = u8Array[idx++];
                  if (!u0) return str;
                  if (!(u0 & 128)) {
                    str += String.fromCharCode(u0);
                    continue;
                  }
                  u1 = u8Array[idx++] & 63;
                  if ((u0 & 224) == 192) {
                    str += String.fromCharCode(((u0 & 31) << 6) | u1);
                    continue;
                  }
                  u2 = u8Array[idx++] & 63;
                  if ((u0 & 240) == 224) {
                    u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
                  } else {
                    u3 = u8Array[idx++] & 63;
                    if ((u0 & 248) == 240) {
                      u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | u3;
                    } else {
                      u4 = u8Array[idx++] & 63;
                      if ((u0 & 252) == 248) {
                        u0 =
                          ((u0 & 3) << 24) |
                          (u1 << 18) |
                          (u2 << 12) |
                          (u3 << 6) |
                          u4;
                      } else {
                        u5 = u8Array[idx++] & 63;
                        u0 =
                          ((u0 & 1) << 30) |
                          (u1 << 24) |
                          (u2 << 18) |
                          (u3 << 12) |
                          (u4 << 6) |
                          u5;
                      }
                    }
                  }
                  if (u0 < 65536) {
                    str += String.fromCharCode(u0);
                  } else {
                    var ch = u0 - 65536;
                    str += String.fromCharCode(
                      55296 | (ch >> 10),
                      56320 | (ch & 1023)
                    );
                  }
                }
              }
            }
            Module["UTF8ArrayToString"] = UTF8ArrayToString;
            function UTF8ToString(ptr) {
              return UTF8ArrayToString(HEAPU8, ptr);
            }
            Module["UTF8ToString"] = UTF8ToString;
            function stringToUTF8Array(
              str,
              outU8Array,
              outIdx,
              maxBytesToWrite
            ) {
              if (!(maxBytesToWrite > 0)) return 0;
              var startIdx = outIdx;
              var endIdx = outIdx + maxBytesToWrite - 1;
              for (var i = 0; i < str.length; ++i) {
                var u = str.charCodeAt(i);
                if (u >= 55296 && u <= 57343)
                  u =
                    (65536 + ((u & 1023) << 10)) | (str.charCodeAt(++i) & 1023);
                if (u <= 127) {
                  if (outIdx >= endIdx) break;
                  outU8Array[outIdx++] = u;
                } else if (u <= 2047) {
                  if (outIdx + 1 >= endIdx) break;
                  outU8Array[outIdx++] = 192 | (u >> 6);
                  outU8Array[outIdx++] = 128 | (u & 63);
                } else if (u <= 65535) {
                  if (outIdx + 2 >= endIdx) break;
                  outU8Array[outIdx++] = 224 | (u >> 12);
                  outU8Array[outIdx++] = 128 | ((u >> 6) & 63);
                  outU8Array[outIdx++] = 128 | (u & 63);
                } else if (u <= 2097151) {
                  if (outIdx + 3 >= endIdx) break;
                  outU8Array[outIdx++] = 240 | (u >> 18);
                  outU8Array[outIdx++] = 128 | ((u >> 12) & 63);
                  outU8Array[outIdx++] = 128 | ((u >> 6) & 63);
                  outU8Array[outIdx++] = 128 | (u & 63);
                } else if (u <= 67108863) {
                  if (outIdx + 4 >= endIdx) break;
                  outU8Array[outIdx++] = 248 | (u >> 24);
                  outU8Array[outIdx++] = 128 | ((u >> 18) & 63);
                  outU8Array[outIdx++] = 128 | ((u >> 12) & 63);
                  outU8Array[outIdx++] = 128 | ((u >> 6) & 63);
                  outU8Array[outIdx++] = 128 | (u & 63);
                } else {
                  if (outIdx + 5 >= endIdx) break;
                  outU8Array[outIdx++] = 252 | (u >> 30);
                  outU8Array[outIdx++] = 128 | ((u >> 24) & 63);
                  outU8Array[outIdx++] = 128 | ((u >> 18) & 63);
                  outU8Array[outIdx++] = 128 | ((u >> 12) & 63);
                  outU8Array[outIdx++] = 128 | ((u >> 6) & 63);
                  outU8Array[outIdx++] = 128 | (u & 63);
                }
              }
              outU8Array[outIdx] = 0;
              return outIdx - startIdx;
            }
            Module["stringToUTF8Array"] = stringToUTF8Array;
            function stringToUTF8(str, outPtr, maxBytesToWrite) {
              return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
            }
            Module["stringToUTF8"] = stringToUTF8;
            function lengthBytesUTF8(str) {
              var len = 0;
              for (var i = 0; i < str.length; ++i) {
                var u = str.charCodeAt(i);
                if (u >= 55296 && u <= 57343)
                  u =
                    (65536 + ((u & 1023) << 10)) | (str.charCodeAt(++i) & 1023);
                if (u <= 127) {
                  ++len;
                } else if (u <= 2047) {
                  len += 2;
                } else if (u <= 65535) {
                  len += 3;
                } else if (u <= 2097151) {
                  len += 4;
                } else if (u <= 67108863) {
                  len += 5;
                } else {
                  len += 6;
                }
              }
              return len;
            }
            Module["lengthBytesUTF8"] = lengthBytesUTF8;
            var UTF16Decoder =
              typeof TextDecoder !== "undefined"
                ? new TextDecoder("utf-16le")
                : undefined;
            function demangle(func) {
              var __cxa_demangle_func =
                Module["___cxa_demangle"] || Module["__cxa_demangle"];
              if (__cxa_demangle_func) {
                try {
                  var s = func.substr(1);
                  var len = lengthBytesUTF8(s) + 1;
                  var buf = _malloc(len);
                  stringToUTF8(s, buf, len);
                  var status = _malloc(4);
                  var ret = __cxa_demangle_func(buf, 0, 0, status);
                  if (getValue(status, "i32") === 0 && ret) {
                    return Pointer_stringify(ret);
                  }
                } catch (e) {
                } finally {
                  if (buf) _free(buf);
                  if (status) _free(status);
                  if (ret) _free(ret);
                }
                return func;
              }
              Runtime.warnOnce(
                "warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling"
              );
              return func;
            }
            function demangleAll(text) {
              var regex = /__Z[\w\d_]+/g;
              return text.replace(regex, function (x) {
                var y = demangle(x);
                return x === y ? x : x + " [" + y + "]";
              });
            }
            function jsStackTrace() {
              var err = new Error();
              if (!err.stack) {
                try {
                  throw new Error(0);
                } catch (e) {
                  err = e;
                }
                if (!err.stack) {
                  return "(no stack trace available)";
                }
              }
              return err.stack.toString();
            }
            function stackTrace() {
              var js = jsStackTrace();
              if (Module["extraStackTrace"])
                js += "\n" + Module["extraStackTrace"]();
              return demangleAll(js);
            }
            Module["stackTrace"] = stackTrace;
            var HEAP,
              buffer,
              HEAP8,
              HEAPU8,
              HEAP16,
              HEAPU16,
              HEAP32,
              HEAPU32,
              HEAPF32,
              HEAPF64;
            function updateGlobalBufferViews() {
              Module["HEAP8"] = HEAP8 = new Int8Array(buffer);
              Module["HEAP16"] = HEAP16 = new Int16Array(buffer);
              Module["HEAP32"] = HEAP32 = new Int32Array(buffer);
              Module["HEAPU8"] = HEAPU8 = new Uint8Array(buffer);
              Module["HEAPU16"] = HEAPU16 = new Uint16Array(buffer);
              Module["HEAPU32"] = HEAPU32 = new Uint32Array(buffer);
              Module["HEAPF32"] = HEAPF32 = new Float32Array(buffer);
              Module["HEAPF64"] = HEAPF64 = new Float64Array(buffer);
            }
            var STATIC_BASE, STATICTOP, staticSealed;
            var STACK_BASE, STACKTOP, STACK_MAX;
            var DYNAMIC_BASE, DYNAMICTOP_PTR;
            STATIC_BASE =
              STATICTOP =
              STACK_BASE =
              STACKTOP =
              STACK_MAX =
              DYNAMIC_BASE =
              DYNAMICTOP_PTR =
                0;
            staticSealed = false;
            function abortOnCannotGrowMemory() {
              abort(
                "Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value " +
                  TOTAL_MEMORY +
                  ", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime but prevents some optimizations, (3) set Module.TOTAL_MEMORY to a higher value before the program runs, or (4) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 "
              );
            }
            function enlargeMemory() {
              abortOnCannotGrowMemory();
            }
            var TOTAL_STACK = Module["TOTAL_STACK"] || 5242880;
            var TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 16777216;
            if (TOTAL_MEMORY < TOTAL_STACK)
              Module.printErr(
                "TOTAL_MEMORY should be larger than TOTAL_STACK, was " +
                  TOTAL_MEMORY +
                  "! (TOTAL_STACK=" +
                  TOTAL_STACK +
                  ")"
              );
            if (Module["buffer"]) {
              buffer = Module["buffer"];
            } else {
              {
                buffer = new ArrayBuffer(TOTAL_MEMORY);
              }
            }
            updateGlobalBufferViews();
            function getTotalMemory() {
              return TOTAL_MEMORY;
            }
            HEAP32[0] = 1668509029;
            HEAP16[1] = 25459;
            if (HEAPU8[2] !== 115 || HEAPU8[3] !== 99)
              throw "Runtime error: expected the system to be little-endian!";
            Module["HEAP"] = HEAP;
            Module["buffer"] = buffer;
            Module["HEAP8"] = HEAP8;
            Module["HEAP16"] = HEAP16;
            Module["HEAP32"] = HEAP32;
            Module["HEAPU8"] = HEAPU8;
            Module["HEAPU16"] = HEAPU16;
            Module["HEAPU32"] = HEAPU32;
            Module["HEAPF32"] = HEAPF32;
            Module["HEAPF64"] = HEAPF64;
            function callRuntimeCallbacks(callbacks) {
              while (callbacks.length > 0) {
                var callback = callbacks.shift();
                if (typeof callback == "function") {
                  callback();
                  continue;
                }
                var func = callback.func;
                if (typeof func === "number") {
                  if (callback.arg === undefined) {
                    Module["dynCall_v"](func);
                  } else {
                    Module["dynCall_vi"](func, callback.arg);
                  }
                } else {
                  func(callback.arg === undefined ? null : callback.arg);
                }
              }
            }
            var __ATPRERUN__ = [];
            var __ATINIT__ = [];
            var __ATMAIN__ = [];
            var __ATEXIT__ = [];
            var __ATPOSTRUN__ = [];
            var runtimeInitialized = false;
            var runtimeExited = false;
            function preRun() {
              if (Module["preRun"]) {
                if (typeof Module["preRun"] == "function")
                  Module["preRun"] = [Module["preRun"]];
                while (Module["preRun"].length) {
                  addOnPreRun(Module["preRun"].shift());
                }
              }
              callRuntimeCallbacks(__ATPRERUN__);
            }
            function ensureInitRuntime() {
              if (runtimeInitialized) return;
              runtimeInitialized = true;
              callRuntimeCallbacks(__ATINIT__);
            }
            function preMain() {
              callRuntimeCallbacks(__ATMAIN__);
            }
            function exitRuntime() {
              callRuntimeCallbacks(__ATEXIT__);
              runtimeExited = true;
            }
            function postRun() {
              if (Module["postRun"]) {
                if (typeof Module["postRun"] == "function")
                  Module["postRun"] = [Module["postRun"]];
                while (Module["postRun"].length) {
                  addOnPostRun(Module["postRun"].shift());
                }
              }
              callRuntimeCallbacks(__ATPOSTRUN__);
            }
            function addOnPreRun(cb) {
              __ATPRERUN__.unshift(cb);
            }
            Module["addOnPreRun"] = addOnPreRun;
            function addOnInit(cb) {
              __ATINIT__.unshift(cb);
            }
            Module["addOnInit"] = addOnInit;
            function addOnPreMain(cb) {
              __ATMAIN__.unshift(cb);
            }
            Module["addOnPreMain"] = addOnPreMain;
            function addOnExit(cb) {
              __ATEXIT__.unshift(cb);
            }
            Module["addOnExit"] = addOnExit;
            function addOnPostRun(cb) {
              __ATPOSTRUN__.unshift(cb);
            }
            Module["addOnPostRun"] = addOnPostRun;
            function intArrayFromString(stringy, dontAddNull, length) {
              var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
              var u8array = new Array(len);
              var numBytesWritten = stringToUTF8Array(
                stringy,
                u8array,
                0,
                u8array.length
              );
              if (dontAddNull) u8array.length = numBytesWritten;
              return u8array;
            }
            Module["intArrayFromString"] = intArrayFromString;
            function intArrayToString(array) {
              var ret = [];
              for (var i = 0; i < array.length; i++) {
                var chr = array[i];
                if (chr > 255) {
                  chr &= 255;
                }
                ret.push(String.fromCharCode(chr));
              }
              return ret.join("");
            }
            Module["intArrayToString"] = intArrayToString;
            function writeStringToMemory(string, buffer, dontAddNull) {
              Runtime.warnOnce(
                "writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!"
              );
              var lastChar, end;
              if (dontAddNull) {
                end = buffer + lengthBytesUTF8(string);
                lastChar = HEAP8[end];
              }
              stringToUTF8(string, buffer, Infinity);
              if (dontAddNull) HEAP8[end] = lastChar;
            }
            Module["writeStringToMemory"] = writeStringToMemory;
            function writeArrayToMemory(array, buffer) {
              HEAP8.set(array, buffer);
            }
            Module["writeArrayToMemory"] = writeArrayToMemory;
            function writeAsciiToMemory(str, buffer, dontAddNull) {
              for (var i = 0; i < str.length; ++i) {
                HEAP8[buffer++ >> 0] = str.charCodeAt(i);
              }
              if (!dontAddNull) HEAP8[buffer >> 0] = 0;
            }
            Module["writeAsciiToMemory"] = writeAsciiToMemory;
            if (!Math["imul"] || Math["imul"](4294967295, 5) !== -5)
              Math["imul"] = function imul(a, b) {
                var ah = a >>> 16;
                var al = a & 65535;
                var bh = b >>> 16;
                var bl = b & 65535;
                return (al * bl + ((ah * bl + al * bh) << 16)) | 0;
              };
            Math.imul = Math["imul"];
            if (!Math["fround"]) {
              var froundBuffer = new Float32Array(1);
              Math["fround"] = function (x) {
                froundBuffer[0] = x;
                return froundBuffer[0];
              };
            }
            Math.fround = Math["fround"];
            if (!Math["clz32"])
              Math["clz32"] = function (x) {
                x = x >>> 0;
                for (var i = 0; i < 32; i++) {
                  if (x & (1 << (31 - i))) return i;
                }
                return 32;
              };
            Math.clz32 = Math["clz32"];
            if (!Math["trunc"])
              Math["trunc"] = function (x) {
                return x < 0 ? Math.ceil(x) : Math.floor(x);
              };
            Math.trunc = Math["trunc"];
            var Math_abs = Math.abs;
            var Math_cos = Math.cos;
            var Math_sin = Math.sin;
            var Math_tan = Math.tan;
            var Math_acos = Math.acos;
            var Math_asin = Math.asin;
            var Math_atan = Math.atan;
            var Math_atan2 = Math.atan2;
            var Math_exp = Math.exp;
            var Math_log = Math.log;
            var Math_sqrt = Math.sqrt;
            var Math_ceil = Math.ceil;
            var Math_floor = Math.floor;
            var Math_pow = Math.pow;
            var Math_imul = Math.imul;
            var Math_fround = Math.fround;
            var Math_round = Math.round;
            var Math_min = Math.min;
            var Math_clz32 = Math.clz32;
            var Math_trunc = Math.trunc;
            var runDependencies = 0;
            var runDependencyWatcher = null;
            var dependenciesFulfilled = null;
            function addRunDependency(id) {
              runDependencies++;
              if (Module["monitorRunDependencies"]) {
                Module["monitorRunDependencies"](runDependencies);
              }
            }
            Module["addRunDependency"] = addRunDependency;
            function removeRunDependency(id) {
              runDependencies--;
              if (Module["monitorRunDependencies"]) {
                Module["monitorRunDependencies"](runDependencies);
              }
              if (runDependencies == 0) {
                if (runDependencyWatcher !== null) {
                  clearInterval(runDependencyWatcher);
                  runDependencyWatcher = null;
                }
                if (dependenciesFulfilled) {
                  var callback = dependenciesFulfilled;
                  dependenciesFulfilled = null;
                  callback();
                }
              }
            }
            Module["removeRunDependency"] = removeRunDependency;
            Module["preloadedImages"] = {};
            Module["preloadedAudios"] = {};
            var ASM_CONSTS = [];
            STATIC_BASE = Runtime.GLOBAL_BASE;
            STATICTOP = STATIC_BASE + 1024;
            __ATINIT__.push();
            allocate(
              [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 224,
                3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 5, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 4,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 82, 101,
                97, 108, 32, 70, 70, 84, 32, 111, 112, 116, 105, 109, 105, 122,
                97, 116, 105, 111, 110, 32, 109, 117, 115, 116, 32, 98, 101, 32,
                101, 118, 101, 110, 46, 10, 0, 107, 105, 115, 115, 32, 102, 102,
                116, 32, 117, 115, 97, 103, 101, 32, 101, 114, 114, 111, 114,
                58, 32, 105, 109, 112, 114, 111, 112, 101, 114, 32, 97, 108,
                108, 111, 99, 10, 0,
              ],
              "i8",
              ALLOC_NONE,
              Runtime.GLOBAL_BASE
            );
            var tempDoublePtr = STATICTOP;
            STATICTOP += 16;
            function ___setErrNo(value) {
              if (Module["___errno_location"])
                HEAP32[Module["___errno_location"]() >> 2] = value;
              return value;
            }
            function __exit(status) {
              Module["exit"](status);
            }
            function _exit(status) {
              __exit(status);
            }
            var SYSCALLS = {
              varargs: 0,
              get: function (varargs) {
                SYSCALLS.varargs += 4;
                var ret = HEAP32[(SYSCALLS.varargs - 4) >> 2];
                return ret;
              },
              getStr: function () {
                var ret = Pointer_stringify(SYSCALLS.get());
                return ret;
              },
              get64: function () {
                var low = SYSCALLS.get(),
                  high = SYSCALLS.get();
                if (low >= 0) assert(high === 0);
                else assert(high === -1);
                return low;
              },
              getZero: function () {
                assert(SYSCALLS.get() === 0);
              },
            };
            function ___syscall140(which, varargs) {
              SYSCALLS.varargs = varargs;
              try {
                var stream = SYSCALLS.getStreamFromFD(),
                  offset_high = SYSCALLS.get(),
                  offset_low = SYSCALLS.get(),
                  result = SYSCALLS.get(),
                  whence = SYSCALLS.get();
                var offset = offset_low;
                FS.llseek(stream, offset, whence);
                HEAP32[result >> 2] = stream.position;
                if (stream.getdents && offset === 0 && whence === 0)
                  stream.getdents = null;
                return 0;
              } catch (e) {
                if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
                  abort(e);
                return -e.errno;
              }
            }
            function ___syscall146(which, varargs) {
              SYSCALLS.varargs = varargs;
              try {
                var stream = SYSCALLS.get(),
                  iov = SYSCALLS.get(),
                  iovcnt = SYSCALLS.get();
                var ret = 0;
                if (!___syscall146.buffer) {
                  ___syscall146.buffers = [null, [], []];
                  ___syscall146.printChar = function (stream, curr) {
                    var buffer = ___syscall146.buffers[stream];
                    assert(buffer);
                    if (curr === 0 || curr === 10) {
                      (stream === 1 ? Module["print"] : Module["printErr"])(
                        UTF8ArrayToString(buffer, 0)
                      );
                      buffer.length = 0;
                    } else {
                      buffer.push(curr);
                    }
                  };
                }
                for (var i = 0; i < iovcnt; i++) {
                  var ptr = HEAP32[(iov + i * 8) >> 2];
                  var len = HEAP32[(iov + (i * 8 + 4)) >> 2];
                  for (var j = 0; j < len; j++) {
                    ___syscall146.printChar(stream, HEAPU8[ptr + j]);
                  }
                  ret += len;
                }
                return ret;
              } catch (e) {
                if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
                  abort(e);
                return -e.errno;
              }
            }
            function _emscripten_memcpy_big(dest, src, num) {
              HEAPU8.set(HEAPU8.subarray(src, src + num), dest);
              return dest;
            }
            function ___syscall6(which, varargs) {
              SYSCALLS.varargs = varargs;
              try {
                var stream = SYSCALLS.getStreamFromFD();
                FS.close(stream);
                return 0;
              } catch (e) {
                if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
                  abort(e);
                return -e.errno;
              }
            }
            __ATEXIT__.push(function () {
              var fflush = Module["_fflush"];
              if (fflush) fflush(0);
              var printChar = ___syscall146.printChar;
              if (!printChar) return;
              var buffers = ___syscall146.buffers;
              if (buffers[1].length) printChar(1, 10);
              if (buffers[2].length) printChar(2, 10);
            });
            DYNAMICTOP_PTR = allocate(1, "i32", ALLOC_STATIC);
            STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);
            STACK_MAX = STACK_BASE + TOTAL_STACK;
            DYNAMIC_BASE = Runtime.alignMemory(STACK_MAX);
            HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;
            staticSealed = true;
            function invoke_ii(index, a1) {
              try {
                return Module["dynCall_ii"](index, a1);
              } catch (e) {
                if (typeof e !== "number" && e !== "longjmp") throw e;
                Module["setThrew"](1, 0);
              }
            }
            function invoke_iiii(index, a1, a2, a3) {
              try {
                return Module["dynCall_iiii"](index, a1, a2, a3);
              } catch (e) {
                if (typeof e !== "number" && e !== "longjmp") throw e;
                Module["setThrew"](1, 0);
              }
            }
            Module.asmGlobalArg = {
              Math: Math,
              Int8Array: Int8Array,
              Int16Array: Int16Array,
              Int32Array: Int32Array,
              Uint8Array: Uint8Array,
              Uint16Array: Uint16Array,
              Uint32Array: Uint32Array,
              Float32Array: Float32Array,
              Float64Array: Float64Array,
              NaN: NaN,
              Infinity: Infinity,
            };
            Module.asmLibraryArg = {
              abort: abort,
              assert: assert,
              enlargeMemory: enlargeMemory,
              getTotalMemory: getTotalMemory,
              abortOnCannotGrowMemory: abortOnCannotGrowMemory,
              invoke_ii: invoke_ii,
              invoke_iiii: invoke_iiii,
              ___syscall6: ___syscall6,
              ___setErrNo: ___setErrNo,
              _emscripten_memcpy_big: _emscripten_memcpy_big,
              ___syscall140: ___syscall140,
              _exit: _exit,
              __exit: __exit,
              ___syscall146: ___syscall146,
              DYNAMICTOP_PTR: DYNAMICTOP_PTR,
              tempDoublePtr: tempDoublePtr,
              ABORT: ABORT,
              STACKTOP: STACKTOP,
              STACK_MAX: STACK_MAX,
            }; // EMSCRIPTEN_START_ASM
            var asm = (function (global, env, buffer) {
              "use asm";
              var a = new global.Int8Array(buffer);
              var b = new global.Int16Array(buffer);
              var c = new global.Int32Array(buffer);
              var d = new global.Uint8Array(buffer);
              var e = new global.Uint16Array(buffer);
              var f = new global.Uint32Array(buffer);
              var g = new global.Float32Array(buffer);
              var h = new global.Float64Array(buffer);
              var i = env.DYNAMICTOP_PTR | 0;
              var j = env.tempDoublePtr | 0;
              var k = env.ABORT | 0;
              var l = env.STACKTOP | 0;
              var m = env.STACK_MAX | 0;
              var n = 0;
              var o = 0;
              var p = 0;
              var q = 0;
              var r = global.NaN,
                s = global.Infinity;
              var t = 0,
                u = 0,
                v = 0,
                w = 0,
                x = 0.0;
              var y = 0;
              var z = global.Math.floor;
              var A = global.Math.abs;
              var B = global.Math.sqrt;
              var C = global.Math.pow;
              var D = global.Math.cos;
              var E = global.Math.sin;
              var F = global.Math.tan;
              var G = global.Math.acos;
              var H = global.Math.asin;
              var I = global.Math.atan;
              var J = global.Math.atan2;
              var K = global.Math.exp;
              var L = global.Math.log;
              var M = global.Math.ceil;
              var N = global.Math.imul;
              var O = global.Math.min;
              var P = global.Math.max;
              var Q = global.Math.clz32;
              var R = global.Math.fround;
              var S = env.abort;
              var T = env.assert;
              var U = env.enlargeMemory;
              var V = env.getTotalMemory;
              var W = env.abortOnCannotGrowMemory;
              var X = env.invoke_ii;
              var Y = env.invoke_iiii;
              var Z = env.___syscall6;
              var _ = env.___setErrNo;
              var $ = env._emscripten_memcpy_big;
              var aa = env.___syscall140;
              var ba = env._exit;
              var ca = env.__exit;
              var da = env.___syscall146;
              var ea = R(0);
              const fa = R(0);
              // EMSCRIPTEN_START_FUNCS
              function ia(a) {
                a = a | 0;
                var b = 0;
                b = l;
                l = (l + a) | 0;
                l = (l + 15) & -16;
                return b | 0;
              }
              function ja() {
                return l | 0;
              }
              function ka(a) {
                a = a | 0;
                l = a;
              }
              function la(a, b) {
                a = a | 0;
                b = b | 0;
                l = a;
                m = b;
              }
              function ma(a, b) {
                a = a | 0;
                b = b | 0;
                if (!n) {
                  n = a;
                  o = b;
                }
              }
              function na(a) {
                a = a | 0;
                y = a;
              }
              function oa() {
                return y | 0;
              }
              function pa(a) {
                a = a | 0;
                ya(a);
                return;
              }
              function qa(a, b, d, e) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0,
                  h = 0.0,
                  i = 0.0;
                f = ((a << 3) + 264) | 0;
                if (!e) f = xa(f) | 0;
                else {
                  if (!d) d = 0;
                  else d = (c[e >> 2] | 0) >>> 0 < f >>> 0 ? 0 : d;
                  c[e >> 2] = f;
                  f = d;
                }
                if (!f) return f | 0;
                c[f >> 2] = a;
                e = (f + 4) | 0;
                c[e >> 2] = b;
                h = +(a | 0);
                a: do
                  if ((a | 0) > 0) {
                    d = 0;
                    while (1) {
                      i = (+(d | 0) * -6.283185307179586) / h;
                      i = (b | 0) == 0 ? i : -i;
                      g[(f + 264 + (d << 3)) >> 2] = R(+D(+i));
                      g[(f + 264 + (d << 3) + 4) >> 2] = R(+E(+i));
                      d = (d + 1) | 0;
                      if ((d | 0) == (a | 0)) break a;
                      b = c[e >> 2] | 0;
                    }
                  }
                while (0);
                h = +z(+(+B(+h)));
                b = a;
                d = 4;
                e = (f + 8) | 0;
                while (1) {
                  b: do
                    if ((b | 0) % (d | 0) | 0)
                      while (1) {
                        switch (d | 0) {
                          case 4: {
                            d = 2;
                            break;
                          }
                          case 2: {
                            d = 3;
                            break;
                          }
                          default:
                            d = (d + 2) | 0;
                        }
                        d = +(d | 0) > h ? b : d;
                        if (!((b | 0) % (d | 0) | 0)) break b;
                      }
                  while (0);
                  b = ((b | 0) / (d | 0)) | 0;
                  c[e >> 2] = d;
                  c[(e + 4) >> 2] = b;
                  if ((b | 0) <= 1) break;
                  else e = (e + 8) | 0;
                }
                return f | 0;
              }
              function ra(a, b, d, e, f, h) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                h = h | 0;
                var i = 0,
                  k = 0,
                  l = 0,
                  m = fa,
                  n = 0,
                  o = fa,
                  p = fa,
                  q = fa,
                  r = 0,
                  s = 0,
                  t = 0,
                  u = 0,
                  v = 0,
                  w = 0,
                  x = 0,
                  y = fa,
                  z = fa,
                  A = fa,
                  B = fa,
                  C = 0,
                  D = fa,
                  E = fa,
                  F = fa,
                  G = fa,
                  H = fa,
                  I = fa,
                  J = fa,
                  K = fa,
                  L = fa,
                  M = fa;
                w = c[f >> 2] | 0;
                n = (f + 8) | 0;
                x = c[(f + 4) >> 2] | 0;
                r = (a + ((N(x, w) | 0) << 3)) | 0;
                if ((x | 0) == 1) {
                  k = N(e, d) | 0;
                  i = a;
                  f = b;
                  while (1) {
                    t = f;
                    u = c[(t + 4) >> 2] | 0;
                    v = i;
                    c[v >> 2] = c[t >> 2];
                    c[(v + 4) >> 2] = u;
                    i = (i + 8) | 0;
                    if ((i | 0) == (r | 0)) break;
                    else f = (f + (k << 3)) | 0;
                  }
                } else {
                  k = N(w, d) | 0;
                  l = N(e, d) | 0;
                  i = a;
                  f = b;
                  while (1) {
                    ra(i, f, k, e, n, h);
                    i = (i + (x << 3)) | 0;
                    if ((i | 0) == (r | 0)) break;
                    else f = (f + (l << 3)) | 0;
                  }
                }
                switch (w | 0) {
                  case 2: {
                    k = a;
                    l = x;
                    i = (h + 264) | 0;
                    f = (a + (x << 3)) | 0;
                    while (1) {
                      o = R(g[f >> 2]);
                      y = R(g[i >> 2]);
                      p = R(o * y);
                      a = (f + 4) | 0;
                      m = R(g[a >> 2]);
                      q = R(g[(i + 4) >> 2]);
                      p = R(p - R(m * q));
                      q = R(R(y * m) + R(o * q));
                      g[f >> 2] = R(R(g[k >> 2]) - p);
                      x = (k + 4) | 0;
                      g[a >> 2] = R(R(g[x >> 2]) - q);
                      g[k >> 2] = R(p + R(g[k >> 2]));
                      g[x >> 2] = R(q + R(g[x >> 2]));
                      l = (l + -1) | 0;
                      if (!l) break;
                      else {
                        k = (k + 8) | 0;
                        i = (i + (d << 3)) | 0;
                        f = (f + 8) | 0;
                      }
                    }
                    return;
                  }
                  case 3: {
                    n = x << 1;
                    m = R(g[(h + 264 + ((N(x, d) | 0) << 3) + 4) >> 2]);
                    l = (h + 264) | 0;
                    e = d << 1;
                    f = a;
                    i = x;
                    k = l;
                    while (1) {
                      h = (f + (x << 3)) | 0;
                      o = R(g[h >> 2]);
                      y = R(g[k >> 2]);
                      A = R(o * y);
                      a = (f + (x << 3) + 4) | 0;
                      B = R(g[a >> 2]);
                      z = R(g[(k + 4) >> 2]);
                      A = R(A - R(B * z));
                      z = R(R(y * B) + R(o * z));
                      v = (f + (n << 3)) | 0;
                      o = R(g[v >> 2]);
                      B = R(g[l >> 2]);
                      y = R(o * B);
                      w = (f + (n << 3) + 4) | 0;
                      p = R(g[w >> 2]);
                      q = R(g[(l + 4) >> 2]);
                      y = R(y - R(p * q));
                      q = R(R(B * p) + R(o * q));
                      o = R(A + y);
                      p = R(z + q);
                      y = R(A - y);
                      q = R(z - q);
                      g[h >> 2] = R(+R(g[f >> 2]) - +o * 0.5);
                      u = (f + 4) | 0;
                      g[a >> 2] = R(+R(g[u >> 2]) - +p * 0.5);
                      y = R(m * y);
                      q = R(m * q);
                      g[f >> 2] = R(o + R(g[f >> 2]));
                      g[u >> 2] = R(p + R(g[u >> 2]));
                      g[v >> 2] = R(q + R(g[h >> 2]));
                      g[w >> 2] = R(R(g[a >> 2]) - y);
                      g[h >> 2] = R(R(g[h >> 2]) - q);
                      g[a >> 2] = R(y + R(g[a >> 2]));
                      i = (i + -1) | 0;
                      if (!i) break;
                      else {
                        f = (f + 8) | 0;
                        k = (k + (d << 3)) | 0;
                        l = (l + (e << 3)) | 0;
                      }
                    }
                    return;
                  }
                  case 4: {
                    n = x << 1;
                    b = (x * 3) | 0;
                    f = (h + 264) | 0;
                    r = d << 1;
                    s = (d * 3) | 0;
                    if (!(c[(h + 4) >> 2] | 0)) {
                      i = a;
                      k = f;
                      l = x;
                      e = f;
                      while (1) {
                        v = (i + (x << 3)) | 0;
                        m = R(g[v >> 2]);
                        B = R(g[k >> 2]);
                        E = R(m * B);
                        w = (i + (x << 3) + 4) | 0;
                        z = R(g[w >> 2]);
                        D = R(g[(k + 4) >> 2]);
                        E = R(E - R(z * D));
                        D = R(R(B * z) + R(m * D));
                        C = (i + (n << 3)) | 0;
                        m = R(g[C >> 2]);
                        z = R(g[e >> 2]);
                        B = R(m * z);
                        t = (i + (n << 3) + 4) | 0;
                        o = R(g[t >> 2]);
                        p = R(g[(e + 4) >> 2]);
                        B = R(B - R(o * p));
                        p = R(R(z * o) + R(m * p));
                        h = (i + (b << 3)) | 0;
                        m = R(g[h >> 2]);
                        o = R(g[f >> 2]);
                        z = R(m * o);
                        a = (i + (b << 3) + 4) | 0;
                        q = R(g[a >> 2]);
                        y = R(g[(f + 4) >> 2]);
                        z = R(z - R(q * y));
                        y = R(R(o * q) + R(m * y));
                        m = R(g[i >> 2]);
                        q = R(m - B);
                        u = (i + 4) | 0;
                        o = R(g[u >> 2]);
                        A = R(o - p);
                        m = R(B + m);
                        g[i >> 2] = m;
                        o = R(p + o);
                        g[u >> 2] = o;
                        p = R(E + z);
                        B = R(D + y);
                        z = R(E - z);
                        y = R(D - y);
                        g[C >> 2] = R(m - p);
                        g[t >> 2] = R(o - B);
                        g[i >> 2] = R(p + R(g[i >> 2]));
                        g[u >> 2] = R(B + R(g[u >> 2]));
                        B = R(A + z);
                        z = R(A - z);
                        A = R(q - y);
                        g[v >> 2] = R(q + y);
                        g[w >> 2] = z;
                        g[h >> 2] = A;
                        g[a >> 2] = B;
                        l = (l + -1) | 0;
                        if (!l) break;
                        else {
                          i = (i + 8) | 0;
                          k = (k + (d << 3)) | 0;
                          e = (e + (r << 3)) | 0;
                          f = (f + (s << 3)) | 0;
                        }
                      }
                      return;
                    } else {
                      i = a;
                      k = f;
                      l = x;
                      e = f;
                      while (1) {
                        w = (i + (x << 3)) | 0;
                        p = R(g[w >> 2]);
                        B = R(g[k >> 2]);
                        m = R(p * B);
                        h = (i + (x << 3) + 4) | 0;
                        E = R(g[h >> 2]);
                        o = R(g[(k + 4) >> 2]);
                        m = R(m - R(E * o));
                        o = R(R(B * E) + R(p * o));
                        t = (i + (n << 3)) | 0;
                        p = R(g[t >> 2]);
                        E = R(g[e >> 2]);
                        B = R(p * E);
                        u = (i + (n << 3) + 4) | 0;
                        q = R(g[u >> 2]);
                        y = R(g[(e + 4) >> 2]);
                        B = R(B - R(q * y));
                        y = R(R(E * q) + R(p * y));
                        a = (i + (b << 3)) | 0;
                        p = R(g[a >> 2]);
                        q = R(g[f >> 2]);
                        E = R(p * q);
                        C = (i + (b << 3) + 4) | 0;
                        z = R(g[C >> 2]);
                        A = R(g[(f + 4) >> 2]);
                        E = R(E - R(z * A));
                        A = R(R(q * z) + R(p * A));
                        p = R(g[i >> 2]);
                        z = R(p - B);
                        v = (i + 4) | 0;
                        q = R(g[v >> 2]);
                        D = R(q - y);
                        p = R(B + p);
                        g[i >> 2] = p;
                        q = R(y + q);
                        g[v >> 2] = q;
                        y = R(m + E);
                        B = R(o + A);
                        E = R(m - E);
                        A = R(o - A);
                        g[t >> 2] = R(p - y);
                        g[u >> 2] = R(q - B);
                        g[i >> 2] = R(y + R(g[i >> 2]));
                        g[v >> 2] = R(B + R(g[v >> 2]));
                        B = R(D + E);
                        E = R(D - E);
                        D = R(z + A);
                        g[w >> 2] = R(z - A);
                        g[h >> 2] = B;
                        g[a >> 2] = D;
                        g[C >> 2] = E;
                        l = (l + -1) | 0;
                        if (!l) break;
                        else {
                          i = (i + 8) | 0;
                          k = (k + (d << 3)) | 0;
                          e = (e + (r << 3)) | 0;
                          f = (f + (s << 3)) | 0;
                        }
                      }
                      return;
                    }
                  }
                  case 5: {
                    C = N(x, d) | 0;
                    o = R(g[(h + 264 + (C << 3)) >> 2]);
                    q = R(g[(h + 264 + (C << 3) + 4) >> 2]);
                    C = N(x, d << 1) | 0;
                    m = R(g[(h + 264 + (C << 3)) >> 2]);
                    p = R(g[(h + 264 + (C << 3) + 4) >> 2]);
                    if ((x | 0) <= 0) return;
                    b = (d * 3) | 0;
                    i = (a + (x << 3)) | 0;
                    k = (a + ((x << 1) << 3)) | 0;
                    l = (a + ((x * 3) << 3)) | 0;
                    e = (a + ((x << 2) << 3)) | 0;
                    n = 0;
                    f = a;
                    while (1) {
                      H = R(g[f >> 2]);
                      u = (f + 4) | 0;
                      F = R(g[u >> 2]);
                      A = R(g[i >> 2]);
                      t = N(n, d) | 0;
                      J = R(g[(h + 264 + (t << 3)) >> 2]);
                      G = R(A * J);
                      v = (i + 4) | 0;
                      E = R(g[v >> 2]);
                      I = R(g[(h + 264 + (t << 3) + 4) >> 2]);
                      G = R(G - R(E * I));
                      I = R(R(J * E) + R(A * I));
                      A = R(g[k >> 2]);
                      t = N(n << 1, d) | 0;
                      E = R(g[(h + 264 + (t << 3)) >> 2]);
                      J = R(A * E);
                      a = (k + 4) | 0;
                      z = R(g[a >> 2]);
                      L = R(g[(h + 264 + (t << 3) + 4) >> 2]);
                      J = R(J - R(z * L));
                      L = R(R(E * z) + R(A * L));
                      A = R(g[l >> 2]);
                      t = N(b, n) | 0;
                      z = R(g[(h + 264 + (t << 3)) >> 2]);
                      E = R(A * z);
                      C = (l + 4) | 0;
                      M = R(g[C >> 2]);
                      y = R(g[(h + 264 + (t << 3) + 4) >> 2]);
                      E = R(E - R(M * y));
                      y = R(R(z * M) + R(A * y));
                      A = R(g[e >> 2]);
                      t = N(n << 2, d) | 0;
                      M = R(g[(h + 264 + (t << 3)) >> 2]);
                      z = R(A * M);
                      w = (e + 4) | 0;
                      D = R(g[w >> 2]);
                      B = R(g[(h + 264 + (t << 3) + 4) >> 2]);
                      z = R(z - R(D * B));
                      B = R(R(M * D) + R(A * B));
                      A = R(G + z);
                      D = R(I + B);
                      z = R(G - z);
                      B = R(I - B);
                      I = R(J + E);
                      G = R(L + y);
                      E = R(J - E);
                      y = R(L - y);
                      g[f >> 2] = R(H + R(I + A));
                      g[u >> 2] = R(F + R(G + D));
                      L = R(R(m * I) + R(H + R(o * A)));
                      J = R(R(m * G) + R(F + R(o * D)));
                      M = R(R(p * y) + R(q * B));
                      K = R(R(-R(q * z)) - R(p * E));
                      g[i >> 2] = R(L - M);
                      g[v >> 2] = R(J - K);
                      g[e >> 2] = R(M + L);
                      g[w >> 2] = R(K + J);
                      A = R(R(o * I) + R(H + R(m * A)));
                      D = R(R(o * G) + R(F + R(m * D)));
                      B = R(R(q * y) - R(p * B));
                      E = R(R(p * z) - R(q * E));
                      g[k >> 2] = R(B + A);
                      g[a >> 2] = R(E + D);
                      g[l >> 2] = R(A - B);
                      g[C >> 2] = R(D - E);
                      n = (n + 1) | 0;
                      if ((n | 0) == (x | 0)) break;
                      else {
                        i = (i + 8) | 0;
                        k = (k + 8) | 0;
                        l = (l + 8) | 0;
                        e = (e + 8) | 0;
                        f = (f + 8) | 0;
                      }
                    }
                    return;
                  }
                  default: {
                    u = c[h >> 2] | 0;
                    v = xa(w << 3) | 0;
                    do
                      if ((x | 0) > 0 ? (w | 0) > 0 : 0) {
                        if ((w | 0) == 1) {
                          f = 0;
                          do {
                            k = (a + (f << 3)) | 0;
                            i = c[k >> 2] | 0;
                            k = c[(k + 4) >> 2] | 0;
                            C = (a + (f << 3)) | 0;
                            c[C >> 2] = i;
                            c[(C + 4) >> 2] = k;
                            f = (f + 1) | 0;
                          } while ((f | 0) != (x | 0));
                          C = v;
                          c[C >> 2] = i;
                          c[(C + 4) >> 2] = k;
                          break;
                        } else t = 0;
                        do {
                          f = t;
                          i = 0;
                          while (1) {
                            r = (a + (f << 3)) | 0;
                            s = c[(r + 4) >> 2] | 0;
                            C = (v + (i << 3)) | 0;
                            c[C >> 2] = c[r >> 2];
                            c[(C + 4) >> 2] = s;
                            i = (i + 1) | 0;
                            if ((i | 0) == (w | 0)) break;
                            else f = (f + x) | 0;
                          }
                          n = v;
                          e = c[n >> 2] | 0;
                          n = c[(n + 4) >> 2] | 0;
                          m = ((c[j >> 2] = e), R(g[j >> 2]));
                          k = t;
                          l = 0;
                          while (1) {
                            b = (a + (k << 3)) | 0;
                            r = b;
                            c[r >> 2] = e;
                            c[(r + 4) >> 2] = n;
                            r = N(k, d) | 0;
                            s = (a + (k << 3) + 4) | 0;
                            f = 1;
                            i = 0;
                            o = m;
                            p = R(g[s >> 2]);
                            do {
                              C = (i + r) | 0;
                              i = (C - ((C | 0) < (u | 0) ? 0 : u)) | 0;
                              M = R(g[(v + (f << 3)) >> 2]);
                              I = R(g[(h + 264 + (i << 3)) >> 2]);
                              J = R(M * I);
                              K = R(g[(v + (f << 3) + 4) >> 2]);
                              L = R(g[(h + 264 + (i << 3) + 4) >> 2]);
                              M = R(R(I * K) + R(M * L));
                              o = R(o + R(J - R(K * L)));
                              g[b >> 2] = o;
                              p = R(p + M);
                              g[s >> 2] = p;
                              f = (f + 1) | 0;
                            } while ((f | 0) != (w | 0));
                            l = (l + 1) | 0;
                            if ((l | 0) == (w | 0)) break;
                            else k = (k + x) | 0;
                          }
                          t = (t + 1) | 0;
                        } while ((t | 0) != (x | 0));
                      }
                    while (0);
                    ya(v);
                    return;
                  }
                }
              }
              function sa(a, b, d) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                if ((b | 0) == (d | 0)) {
                  d = xa(c[a >> 2] << 3) | 0;
                  ra(d, b, 1, 1, (a + 8) | 0, a);
                  Qa(b | 0, d | 0, (c[a >> 2] << 3) | 0) | 0;
                  ya(d);
                  return;
                } else {
                  ra(d, b, 1, 1, (a + 8) | 0, a);
                  return;
                }
              }
              function ta(a) {
                a = a | 0;
                ya(a);
                return;
              }
              function ua(a, b, d, e) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0.0,
                  h = 0,
                  i = 0,
                  j = 0,
                  k = 0,
                  m = 0,
                  n = 0.0;
                k = l;
                l = (l + 16) | 0;
                i = k;
                if ((a & 1) | 0) {
                  Ma(380, 36, 1, c[63] | 0) | 0;
                  b = 0;
                  l = k;
                  return b | 0;
                }
                j = a >> 1;
                qa(j, b, 0, i) | 0;
                h = c[i >> 2] | 0;
                a = ((((((j * 3) | 0) / 2) | 0) << 3) + 12 + h) | 0;
                if (e) {
                  m = (c[e >> 2] | 0) >>> 0 < a >>> 0;
                  c[e >> 2] = a;
                  if (m) {
                    m = 0;
                    l = k;
                    return m | 0;
                  }
                } else d = xa(a) | 0;
                if (!d) {
                  m = 0;
                  l = k;
                  return m | 0;
                }
                m = (d + 12) | 0;
                c[d >> 2] = m;
                h = (m + h) | 0;
                c[(d + 4) >> 2] = h;
                a = (d + 8) | 0;
                c[a >> 2] = h + (j << 3);
                qa(j, b, m, i) | 0;
                h = ((j | 0) / 2) | 0;
                if ((j | 0) <= 1) {
                  m = d;
                  l = k;
                  return m | 0;
                }
                f = +(j | 0);
                e = c[a >> 2] | 0;
                if (!b) {
                  a = 0;
                  do {
                    m = a;
                    a = (a + 1) | 0;
                    n = (+(a | 0) / f + 0.5) * -3.141592653589793;
                    g[(e + (m << 3)) >> 2] = R(+D(+n));
                    g[(e + (m << 3) + 4) >> 2] = R(+E(+n));
                  } while ((a | 0) < (h | 0));
                  l = k;
                  return d | 0;
                } else {
                  a = 0;
                  do {
                    m = a;
                    a = (a + 1) | 0;
                    n = (+(a | 0) / f + 0.5) * -3.141592653589793;
                    g[(e + (m << 3)) >> 2] = R(+D(+n));
                    g[(e + (m << 3) + 4) >> 2] = R(+E(+-n));
                  } while ((a | 0) < (h | 0));
                  l = k;
                  return d | 0;
                }
                return 0;
              }
              function va(a, b, d) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                var e = 0,
                  f = 0,
                  h = 0,
                  i = 0,
                  j = fa,
                  k = fa,
                  l = fa,
                  m = fa,
                  n = fa,
                  o = fa,
                  p = fa,
                  q = 0;
                e = c[a >> 2] | 0;
                if (c[(e + 4) >> 2] | 0) {
                  Ma(417, 37, 1, c[63] | 0) | 0;
                  ba(1);
                }
                i = c[e >> 2] | 0;
                f = (a + 4) | 0;
                sa(e, b, c[f >> 2] | 0);
                f = c[f >> 2] | 0;
                k = R(g[f >> 2]);
                j = R(g[(f + 4) >> 2]);
                g[d >> 2] = R(k + j);
                g[(d + (i << 3)) >> 2] = R(k - j);
                g[(d + 4) >> 2] = R(0.0);
                g[(d + (i << 3) + 4) >> 2] = R(0.0);
                h = ((i | 0) / 2) | 0;
                if ((i | 0) < 2) return;
                e = c[(a + 8) >> 2] | 0;
                b = 1;
                while (1) {
                  l = R(g[(f + (b << 3)) >> 2]);
                  o = R(g[(f + (b << 3) + 4) >> 2]);
                  a = (i - b) | 0;
                  n = R(g[(f + (a << 3)) >> 2]);
                  p = R(g[(f + (a << 3) + 4) >> 2]);
                  m = R(l + n);
                  k = R(o - p);
                  n = R(l - n);
                  p = R(o + p);
                  q = (b + -1) | 0;
                  o = R(g[(e + (q << 3)) >> 2]);
                  l = R(n * o);
                  j = R(g[(e + (q << 3) + 4) >> 2]);
                  l = R(l - R(p * j));
                  j = R(R(p * o) + R(n * j));
                  g[(d + (b << 3)) >> 2] = R(R(m + l) * R(0.5));
                  g[(d + (b << 3) + 4) >> 2] = R(R(k + j) * R(0.5));
                  g[(d + (a << 3)) >> 2] = R(R(m - l) * R(0.5));
                  g[(d + (a << 3) + 4) >> 2] = R(R(j - k) * R(0.5));
                  if ((b | 0) < (h | 0)) b = (b + 1) | 0;
                  else break;
                }
                return;
              }
              function wa(a, b, d) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                var e = 0,
                  f = 0,
                  h = 0,
                  i = 0,
                  j = 0,
                  k = fa,
                  l = 0,
                  m = fa,
                  n = fa,
                  o = fa,
                  p = fa,
                  q = fa,
                  r = fa,
                  s = 0;
                i = c[a >> 2] | 0;
                if (!(c[(i + 4) >> 2] | 0)) {
                  Ma(417, 37, 1, c[63] | 0) | 0;
                  ba(1);
                }
                j = c[i >> 2] | 0;
                k = R(g[b >> 2]);
                h = (b + (j << 3)) | 0;
                k = R(k + R(g[h >> 2]));
                f = c[(a + 4) >> 2] | 0;
                g[f >> 2] = k;
                k = R(g[b >> 2]);
                g[(f + 4) >> 2] = R(k - R(g[h >> 2]));
                h = ((j | 0) / 2) | 0;
                if ((j | 0) < 2) {
                  sa(i, f, d);
                  return;
                }
                e = c[(a + 8) >> 2] | 0;
                a = 1;
                while (1) {
                  n = R(g[(b + (a << 3)) >> 2]);
                  q = R(g[(b + (a << 3) + 4) >> 2]);
                  l = (j - a) | 0;
                  p = R(g[(b + (l << 3)) >> 2]);
                  r = R(g[(b + (l << 3) + 4) >> 2]);
                  o = R(n + p);
                  m = R(q - r);
                  p = R(n - p);
                  r = R(q + r);
                  s = (a + -1) | 0;
                  q = R(g[(e + (s << 3)) >> 2]);
                  n = R(p * q);
                  k = R(g[(e + (s << 3) + 4) >> 2]);
                  n = R(n - R(r * k));
                  k = R(R(r * q) + R(p * k));
                  g[(f + (a << 3)) >> 2] = R(o + n);
                  g[(f + (a << 3) + 4) >> 2] = R(m + k);
                  g[(f + (l << 3)) >> 2] = R(o - n);
                  g[(f + (l << 3) + 4) >> 2] = R(-R(m - k));
                  if ((a | 0) < (h | 0)) a = (a + 1) | 0;
                  else break;
                }
                sa(i, f, d);
                return;
              }
              function xa(a) {
                a = a | 0;
                var b = 0,
                  d = 0,
                  e = 0,
                  f = 0,
                  g = 0,
                  h = 0,
                  i = 0,
                  j = 0,
                  k = 0,
                  m = 0,
                  n = 0,
                  o = 0,
                  p = 0,
                  q = 0,
                  r = 0,
                  s = 0,
                  t = 0,
                  u = 0,
                  v = 0,
                  w = 0,
                  x = 0;
                x = l;
                l = (l + 16) | 0;
                o = x;
                do
                  if (a >>> 0 < 245) {
                    k = a >>> 0 < 11 ? 16 : (a + 11) & -8;
                    a = k >>> 3;
                    n = c[114] | 0;
                    d = n >>> a;
                    if ((d & 3) | 0) {
                      b = (((d & 1) ^ 1) + a) | 0;
                      a = (496 + ((b << 1) << 2)) | 0;
                      d = (a + 8) | 0;
                      e = c[d >> 2] | 0;
                      f = (e + 8) | 0;
                      g = c[f >> 2] | 0;
                      if ((a | 0) == (g | 0)) c[114] = n & ~(1 << b);
                      else {
                        c[(g + 12) >> 2] = a;
                        c[d >> 2] = g;
                      }
                      w = b << 3;
                      c[(e + 4) >> 2] = w | 3;
                      w = (e + w + 4) | 0;
                      c[w >> 2] = c[w >> 2] | 1;
                      w = f;
                      l = x;
                      return w | 0;
                    }
                    m = c[116] | 0;
                    if (k >>> 0 > m >>> 0) {
                      if (d | 0) {
                        b = 2 << a;
                        b = (d << a) & (b | (0 - b));
                        b = ((b & (0 - b)) + -1) | 0;
                        h = (b >>> 12) & 16;
                        b = b >>> h;
                        d = (b >>> 5) & 8;
                        b = b >>> d;
                        f = (b >>> 2) & 4;
                        b = b >>> f;
                        a = (b >>> 1) & 2;
                        b = b >>> a;
                        e = (b >>> 1) & 1;
                        e = ((d | h | f | a | e) + (b >>> e)) | 0;
                        b = (496 + ((e << 1) << 2)) | 0;
                        a = (b + 8) | 0;
                        f = c[a >> 2] | 0;
                        h = (f + 8) | 0;
                        d = c[h >> 2] | 0;
                        if ((b | 0) == (d | 0)) {
                          a = n & ~(1 << e);
                          c[114] = a;
                        } else {
                          c[(d + 12) >> 2] = b;
                          c[a >> 2] = d;
                          a = n;
                        }
                        g = ((e << 3) - k) | 0;
                        c[(f + 4) >> 2] = k | 3;
                        e = (f + k) | 0;
                        c[(e + 4) >> 2] = g | 1;
                        c[(e + g) >> 2] = g;
                        if (m | 0) {
                          f = c[119] | 0;
                          b = m >>> 3;
                          d = (496 + ((b << 1) << 2)) | 0;
                          b = 1 << b;
                          if (!(a & b)) {
                            c[114] = a | b;
                            b = d;
                            a = (d + 8) | 0;
                          } else {
                            a = (d + 8) | 0;
                            b = c[a >> 2] | 0;
                          }
                          c[a >> 2] = f;
                          c[(b + 12) >> 2] = f;
                          c[(f + 8) >> 2] = b;
                          c[(f + 12) >> 2] = d;
                        }
                        c[116] = g;
                        c[119] = e;
                        w = h;
                        l = x;
                        return w | 0;
                      }
                      i = c[115] | 0;
                      if (i) {
                        d = ((i & (0 - i)) + -1) | 0;
                        h = (d >>> 12) & 16;
                        d = d >>> h;
                        g = (d >>> 5) & 8;
                        d = d >>> g;
                        j = (d >>> 2) & 4;
                        d = d >>> j;
                        e = (d >>> 1) & 2;
                        d = d >>> e;
                        a = (d >>> 1) & 1;
                        a =
                          c[
                            (760 + (((g | h | j | e | a) + (d >>> a)) << 2)) >>
                              2
                          ] | 0;
                        d = ((c[(a + 4) >> 2] & -8) - k) | 0;
                        e =
                          c[
                            (a +
                              16 +
                              ((((c[(a + 16) >> 2] | 0) == 0) & 1) << 2)) >>
                              2
                          ] | 0;
                        if (!e) {
                          j = a;
                          g = d;
                        } else {
                          do {
                            h = ((c[(e + 4) >> 2] & -8) - k) | 0;
                            j = h >>> 0 < d >>> 0;
                            d = j ? h : d;
                            a = j ? e : a;
                            e =
                              c[
                                (e +
                                  16 +
                                  ((((c[(e + 16) >> 2] | 0) == 0) & 1) << 2)) >>
                                  2
                              ] | 0;
                          } while ((e | 0) != 0);
                          j = a;
                          g = d;
                        }
                        h = (j + k) | 0;
                        if (j >>> 0 < h >>> 0) {
                          f = c[(j + 24) >> 2] | 0;
                          b = c[(j + 12) >> 2] | 0;
                          do
                            if ((b | 0) == (j | 0)) {
                              a = (j + 20) | 0;
                              b = c[a >> 2] | 0;
                              if (!b) {
                                a = (j + 16) | 0;
                                b = c[a >> 2] | 0;
                                if (!b) {
                                  d = 0;
                                  break;
                                }
                              }
                              while (1) {
                                d = (b + 20) | 0;
                                e = c[d >> 2] | 0;
                                if (e | 0) {
                                  b = e;
                                  a = d;
                                  continue;
                                }
                                d = (b + 16) | 0;
                                e = c[d >> 2] | 0;
                                if (!e) break;
                                else {
                                  b = e;
                                  a = d;
                                }
                              }
                              c[a >> 2] = 0;
                              d = b;
                            } else {
                              d = c[(j + 8) >> 2] | 0;
                              c[(d + 12) >> 2] = b;
                              c[(b + 8) >> 2] = d;
                              d = b;
                            }
                          while (0);
                          do
                            if (f | 0) {
                              b = c[(j + 28) >> 2] | 0;
                              a = (760 + (b << 2)) | 0;
                              if ((j | 0) == (c[a >> 2] | 0)) {
                                c[a >> 2] = d;
                                if (!d) {
                                  c[115] = i & ~(1 << b);
                                  break;
                                }
                              } else {
                                c[
                                  (f +
                                    16 +
                                    ((((c[(f + 16) >> 2] | 0) != (j | 0)) &
                                      1) <<
                                      2)) >>
                                    2
                                ] = d;
                                if (!d) break;
                              }
                              c[(d + 24) >> 2] = f;
                              b = c[(j + 16) >> 2] | 0;
                              if (b | 0) {
                                c[(d + 16) >> 2] = b;
                                c[(b + 24) >> 2] = d;
                              }
                              b = c[(j + 20) >> 2] | 0;
                              if (b | 0) {
                                c[(d + 20) >> 2] = b;
                                c[(b + 24) >> 2] = d;
                              }
                            }
                          while (0);
                          if (g >>> 0 < 16) {
                            w = (g + k) | 0;
                            c[(j + 4) >> 2] = w | 3;
                            w = (j + w + 4) | 0;
                            c[w >> 2] = c[w >> 2] | 1;
                          } else {
                            c[(j + 4) >> 2] = k | 3;
                            c[(h + 4) >> 2] = g | 1;
                            c[(h + g) >> 2] = g;
                            if (m | 0) {
                              e = c[119] | 0;
                              b = m >>> 3;
                              d = (496 + ((b << 1) << 2)) | 0;
                              b = 1 << b;
                              if (!(n & b)) {
                                c[114] = n | b;
                                b = d;
                                a = (d + 8) | 0;
                              } else {
                                a = (d + 8) | 0;
                                b = c[a >> 2] | 0;
                              }
                              c[a >> 2] = e;
                              c[(b + 12) >> 2] = e;
                              c[(e + 8) >> 2] = b;
                              c[(e + 12) >> 2] = d;
                            }
                            c[116] = g;
                            c[119] = h;
                          }
                          w = (j + 8) | 0;
                          l = x;
                          return w | 0;
                        } else n = k;
                      } else n = k;
                    } else n = k;
                  } else if (a >>> 0 <= 4294967231) {
                    a = (a + 11) | 0;
                    k = a & -8;
                    j = c[115] | 0;
                    if (j) {
                      e = (0 - k) | 0;
                      a = a >>> 8;
                      if (a)
                        if (k >>> 0 > 16777215) i = 31;
                        else {
                          n = (((a + 1048320) | 0) >>> 16) & 8;
                          v = a << n;
                          m = (((v + 520192) | 0) >>> 16) & 4;
                          v = v << m;
                          i = (((v + 245760) | 0) >>> 16) & 2;
                          i = (14 - (m | n | i) + ((v << i) >>> 15)) | 0;
                          i = ((k >>> ((i + 7) | 0)) & 1) | (i << 1);
                        }
                      else i = 0;
                      d = c[(760 + (i << 2)) >> 2] | 0;
                      a: do
                        if (!d) {
                          d = 0;
                          a = 0;
                          v = 57;
                        } else {
                          a = 0;
                          h = k << ((i | 0) == 31 ? 0 : (25 - (i >>> 1)) | 0);
                          g = 0;
                          while (1) {
                            f = ((c[(d + 4) >> 2] & -8) - k) | 0;
                            if (f >>> 0 < e >>> 0)
                              if (!f) {
                                a = d;
                                e = 0;
                                f = d;
                                v = 61;
                                break a;
                              } else {
                                a = d;
                                e = f;
                              }
                            f = c[(d + 20) >> 2] | 0;
                            d = c[(d + 16 + ((h >>> 31) << 2)) >> 2] | 0;
                            g = ((f | 0) == 0) | ((f | 0) == (d | 0)) ? g : f;
                            f = (d | 0) == 0;
                            if (f) {
                              d = g;
                              v = 57;
                              break;
                            } else h = h << ((f ^ 1) & 1);
                          }
                        }
                      while (0);
                      if ((v | 0) == 57) {
                        if (((d | 0) == 0) & ((a | 0) == 0)) {
                          a = 2 << i;
                          a = j & (a | (0 - a));
                          if (!a) {
                            n = k;
                            break;
                          }
                          n = ((a & (0 - a)) + -1) | 0;
                          h = (n >>> 12) & 16;
                          n = n >>> h;
                          g = (n >>> 5) & 8;
                          n = n >>> g;
                          i = (n >>> 2) & 4;
                          n = n >>> i;
                          m = (n >>> 1) & 2;
                          n = n >>> m;
                          d = (n >>> 1) & 1;
                          a = 0;
                          d =
                            c[
                              (760 +
                                (((g | h | i | m | d) + (n >>> d)) << 2)) >>
                                2
                            ] | 0;
                        }
                        if (!d) {
                          i = a;
                          h = e;
                        } else {
                          f = d;
                          v = 61;
                        }
                      }
                      if ((v | 0) == 61)
                        while (1) {
                          v = 0;
                          d = ((c[(f + 4) >> 2] & -8) - k) | 0;
                          n = d >>> 0 < e >>> 0;
                          d = n ? d : e;
                          a = n ? f : a;
                          f =
                            c[
                              (f +
                                16 +
                                ((((c[(f + 16) >> 2] | 0) == 0) & 1) << 2)) >>
                                2
                            ] | 0;
                          if (!f) {
                            i = a;
                            h = d;
                            break;
                          } else {
                            e = d;
                            v = 61;
                          }
                        }
                      if (
                        (i | 0) != 0
                          ? h >>> 0 < (((c[116] | 0) - k) | 0) >>> 0
                          : 0
                      ) {
                        g = (i + k) | 0;
                        if (i >>> 0 >= g >>> 0) {
                          w = 0;
                          l = x;
                          return w | 0;
                        }
                        f = c[(i + 24) >> 2] | 0;
                        b = c[(i + 12) >> 2] | 0;
                        do
                          if ((b | 0) == (i | 0)) {
                            a = (i + 20) | 0;
                            b = c[a >> 2] | 0;
                            if (!b) {
                              a = (i + 16) | 0;
                              b = c[a >> 2] | 0;
                              if (!b) {
                                b = 0;
                                break;
                              }
                            }
                            while (1) {
                              d = (b + 20) | 0;
                              e = c[d >> 2] | 0;
                              if (e | 0) {
                                b = e;
                                a = d;
                                continue;
                              }
                              d = (b + 16) | 0;
                              e = c[d >> 2] | 0;
                              if (!e) break;
                              else {
                                b = e;
                                a = d;
                              }
                            }
                            c[a >> 2] = 0;
                          } else {
                            w = c[(i + 8) >> 2] | 0;
                            c[(w + 12) >> 2] = b;
                            c[(b + 8) >> 2] = w;
                          }
                        while (0);
                        do
                          if (f) {
                            a = c[(i + 28) >> 2] | 0;
                            d = (760 + (a << 2)) | 0;
                            if ((i | 0) == (c[d >> 2] | 0)) {
                              c[d >> 2] = b;
                              if (!b) {
                                e = j & ~(1 << a);
                                c[115] = e;
                                break;
                              }
                            } else {
                              c[
                                (f +
                                  16 +
                                  ((((c[(f + 16) >> 2] | 0) != (i | 0)) & 1) <<
                                    2)) >>
                                  2
                              ] = b;
                              if (!b) {
                                e = j;
                                break;
                              }
                            }
                            c[(b + 24) >> 2] = f;
                            a = c[(i + 16) >> 2] | 0;
                            if (a | 0) {
                              c[(b + 16) >> 2] = a;
                              c[(a + 24) >> 2] = b;
                            }
                            a = c[(i + 20) >> 2] | 0;
                            if (a) {
                              c[(b + 20) >> 2] = a;
                              c[(a + 24) >> 2] = b;
                              e = j;
                            } else e = j;
                          } else e = j;
                        while (0);
                        do
                          if (h >>> 0 >= 16) {
                            c[(i + 4) >> 2] = k | 3;
                            c[(g + 4) >> 2] = h | 1;
                            c[(g + h) >> 2] = h;
                            b = h >>> 3;
                            if (h >>> 0 < 256) {
                              d = (496 + ((b << 1) << 2)) | 0;
                              a = c[114] | 0;
                              b = 1 << b;
                              if (!(a & b)) {
                                c[114] = a | b;
                                b = d;
                                a = (d + 8) | 0;
                              } else {
                                a = (d + 8) | 0;
                                b = c[a >> 2] | 0;
                              }
                              c[a >> 2] = g;
                              c[(b + 12) >> 2] = g;
                              c[(g + 8) >> 2] = b;
                              c[(g + 12) >> 2] = d;
                              break;
                            }
                            b = h >>> 8;
                            if (b)
                              if (h >>> 0 > 16777215) b = 31;
                              else {
                                v = (((b + 1048320) | 0) >>> 16) & 8;
                                w = b << v;
                                u = (((w + 520192) | 0) >>> 16) & 4;
                                w = w << u;
                                b = (((w + 245760) | 0) >>> 16) & 2;
                                b = (14 - (u | v | b) + ((w << b) >>> 15)) | 0;
                                b = ((h >>> ((b + 7) | 0)) & 1) | (b << 1);
                              }
                            else b = 0;
                            d = (760 + (b << 2)) | 0;
                            c[(g + 28) >> 2] = b;
                            a = (g + 16) | 0;
                            c[(a + 4) >> 2] = 0;
                            c[a >> 2] = 0;
                            a = 1 << b;
                            if (!(e & a)) {
                              c[115] = e | a;
                              c[d >> 2] = g;
                              c[(g + 24) >> 2] = d;
                              c[(g + 12) >> 2] = g;
                              c[(g + 8) >> 2] = g;
                              break;
                            }
                            a = h << ((b | 0) == 31 ? 0 : (25 - (b >>> 1)) | 0);
                            d = c[d >> 2] | 0;
                            while (1) {
                              if (((c[(d + 4) >> 2] & -8) | 0) == (h | 0)) {
                                v = 97;
                                break;
                              }
                              e = (d + 16 + ((a >>> 31) << 2)) | 0;
                              b = c[e >> 2] | 0;
                              if (!b) {
                                v = 96;
                                break;
                              } else {
                                a = a << 1;
                                d = b;
                              }
                            }
                            if ((v | 0) == 96) {
                              c[e >> 2] = g;
                              c[(g + 24) >> 2] = d;
                              c[(g + 12) >> 2] = g;
                              c[(g + 8) >> 2] = g;
                              break;
                            } else if ((v | 0) == 97) {
                              v = (d + 8) | 0;
                              w = c[v >> 2] | 0;
                              c[(w + 12) >> 2] = g;
                              c[v >> 2] = g;
                              c[(g + 8) >> 2] = w;
                              c[(g + 12) >> 2] = d;
                              c[(g + 24) >> 2] = 0;
                              break;
                            }
                          } else {
                            w = (h + k) | 0;
                            c[(i + 4) >> 2] = w | 3;
                            w = (i + w + 4) | 0;
                            c[w >> 2] = c[w >> 2] | 1;
                          }
                        while (0);
                        w = (i + 8) | 0;
                        l = x;
                        return w | 0;
                      } else n = k;
                    } else n = k;
                  } else n = -1;
                while (0);
                d = c[116] | 0;
                if (d >>> 0 >= n >>> 0) {
                  b = (d - n) | 0;
                  a = c[119] | 0;
                  if (b >>> 0 > 15) {
                    w = (a + n) | 0;
                    c[119] = w;
                    c[116] = b;
                    c[(w + 4) >> 2] = b | 1;
                    c[(w + b) >> 2] = b;
                    c[(a + 4) >> 2] = n | 3;
                  } else {
                    c[116] = 0;
                    c[119] = 0;
                    c[(a + 4) >> 2] = d | 3;
                    w = (a + d + 4) | 0;
                    c[w >> 2] = c[w >> 2] | 1;
                  }
                  w = (a + 8) | 0;
                  l = x;
                  return w | 0;
                }
                h = c[117] | 0;
                if (h >>> 0 > n >>> 0) {
                  u = (h - n) | 0;
                  c[117] = u;
                  w = c[120] | 0;
                  v = (w + n) | 0;
                  c[120] = v;
                  c[(v + 4) >> 2] = u | 1;
                  c[(w + 4) >> 2] = n | 3;
                  w = (w + 8) | 0;
                  l = x;
                  return w | 0;
                }
                if (!(c[232] | 0)) {
                  c[234] = 4096;
                  c[233] = 4096;
                  c[235] = -1;
                  c[236] = -1;
                  c[237] = 0;
                  c[225] = 0;
                  a = (o & -16) ^ 1431655768;
                  c[o >> 2] = a;
                  c[232] = a;
                  a = 4096;
                } else a = c[234] | 0;
                i = (n + 48) | 0;
                j = (n + 47) | 0;
                g = (a + j) | 0;
                f = (0 - a) | 0;
                k = g & f;
                if (k >>> 0 <= n >>> 0) {
                  w = 0;
                  l = x;
                  return w | 0;
                }
                a = c[224] | 0;
                if (
                  a | 0
                    ? ((m = c[222] | 0),
                      (o = (m + k) | 0),
                      (o >>> 0 <= m >>> 0) | (o >>> 0 > a >>> 0))
                    : 0
                ) {
                  w = 0;
                  l = x;
                  return w | 0;
                }
                b: do
                  if (!(c[225] & 4)) {
                    d = c[120] | 0;
                    c: do
                      if (d) {
                        e = 904;
                        while (1) {
                          a = c[e >> 2] | 0;
                          if (
                            a >>> 0 <= d >>> 0
                              ? ((r = (e + 4) | 0),
                                ((a + (c[r >> 2] | 0)) | 0) >>> 0 > d >>> 0)
                              : 0
                          )
                            break;
                          a = c[(e + 8) >> 2] | 0;
                          if (!a) {
                            v = 118;
                            break c;
                          } else e = a;
                        }
                        b = (g - h) & f;
                        if (b >>> 0 < 2147483647) {
                          a = Oa(b | 0) | 0;
                          if (
                            (a | 0) ==
                            (((c[e >> 2] | 0) + (c[r >> 2] | 0)) | 0)
                          ) {
                            if ((a | 0) != (-1 | 0)) {
                              h = b;
                              g = a;
                              v = 135;
                              break b;
                            }
                          } else {
                            e = a;
                            v = 126;
                          }
                        } else b = 0;
                      } else v = 118;
                    while (0);
                    do
                      if ((v | 0) == 118) {
                        d = Oa(0) | 0;
                        if (
                          (d | 0) != (-1 | 0)
                            ? ((b = d),
                              (p = c[233] | 0),
                              (q = (p + -1) | 0),
                              (b =
                                ((((q & b) | 0) == 0
                                  ? 0
                                  : (((q + b) & (0 - p)) - b) | 0) +
                                  k) |
                                0),
                              (p = c[222] | 0),
                              (q = (b + p) | 0),
                              (b >>> 0 > n >>> 0) & (b >>> 0 < 2147483647))
                            : 0
                        ) {
                          r = c[224] | 0;
                          if (
                            r | 0
                              ? (q >>> 0 <= p >>> 0) | (q >>> 0 > r >>> 0)
                              : 0
                          ) {
                            b = 0;
                            break;
                          }
                          a = Oa(b | 0) | 0;
                          if ((a | 0) == (d | 0)) {
                            h = b;
                            g = d;
                            v = 135;
                            break b;
                          } else {
                            e = a;
                            v = 126;
                          }
                        } else b = 0;
                      }
                    while (0);
                    do
                      if ((v | 0) == 126) {
                        d = (0 - b) | 0;
                        if (
                          !(
                            (i >>> 0 > b >>> 0) &
                            ((b >>> 0 < 2147483647) & ((e | 0) != (-1 | 0)))
                          )
                        )
                          if ((e | 0) == (-1 | 0)) {
                            b = 0;
                            break;
                          } else {
                            h = b;
                            g = e;
                            v = 135;
                            break b;
                          }
                        a = c[234] | 0;
                        a = (j - b + a) & (0 - a);
                        if (a >>> 0 >= 2147483647) {
                          h = b;
                          g = e;
                          v = 135;
                          break b;
                        }
                        if ((Oa(a | 0) | 0) == (-1 | 0)) {
                          Oa(d | 0) | 0;
                          b = 0;
                          break;
                        } else {
                          h = (a + b) | 0;
                          g = e;
                          v = 135;
                          break b;
                        }
                      }
                    while (0);
                    c[225] = c[225] | 4;
                    v = 133;
                  } else {
                    b = 0;
                    v = 133;
                  }
                while (0);
                if (
                  ((v | 0) == 133 ? k >>> 0 < 2147483647 : 0)
                    ? ((u = Oa(k | 0) | 0),
                      (r = Oa(0) | 0),
                      (s = (r - u) | 0),
                      (t = s >>> 0 > ((n + 40) | 0) >>> 0),
                      !(
                        ((u | 0) == (-1 | 0)) |
                        (t ^ 1) |
                        (((u >>> 0 < r >>> 0) &
                          (((u | 0) != (-1 | 0)) & ((r | 0) != (-1 | 0)))) ^
                          1)
                      ))
                    : 0
                ) {
                  h = t ? s : b;
                  g = u;
                  v = 135;
                }
                if ((v | 0) == 135) {
                  b = ((c[222] | 0) + h) | 0;
                  c[222] = b;
                  if (b >>> 0 > (c[223] | 0) >>> 0) c[223] = b;
                  j = c[120] | 0;
                  do
                    if (j) {
                      b = 904;
                      while (1) {
                        a = c[b >> 2] | 0;
                        d = (b + 4) | 0;
                        e = c[d >> 2] | 0;
                        if ((g | 0) == ((a + e) | 0)) {
                          v = 145;
                          break;
                        }
                        f = c[(b + 8) >> 2] | 0;
                        if (!f) break;
                        else b = f;
                      }
                      if (
                        ((v | 0) == 145 ? ((c[(b + 12) >> 2] & 8) | 0) == 0 : 0)
                          ? (j >>> 0 < g >>> 0) & (j >>> 0 >= a >>> 0)
                          : 0
                      ) {
                        c[d >> 2] = e + h;
                        w = (j + 8) | 0;
                        w = ((w & 7) | 0) == 0 ? 0 : (0 - w) & 7;
                        v = (j + w) | 0;
                        w = ((c[117] | 0) + (h - w)) | 0;
                        c[120] = v;
                        c[117] = w;
                        c[(v + 4) >> 2] = w | 1;
                        c[(v + w + 4) >> 2] = 40;
                        c[121] = c[236];
                        break;
                      }
                      if (g >>> 0 < (c[118] | 0) >>> 0) c[118] = g;
                      d = (g + h) | 0;
                      b = 904;
                      while (1) {
                        if ((c[b >> 2] | 0) == (d | 0)) {
                          v = 153;
                          break;
                        }
                        a = c[(b + 8) >> 2] | 0;
                        if (!a) break;
                        else b = a;
                      }
                      if (
                        (v | 0) == 153 ? ((c[(b + 12) >> 2] & 8) | 0) == 0 : 0
                      ) {
                        c[b >> 2] = g;
                        m = (b + 4) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + h;
                        m = (g + 8) | 0;
                        m = (g + (((m & 7) | 0) == 0 ? 0 : (0 - m) & 7)) | 0;
                        b = (d + 8) | 0;
                        b = (d + (((b & 7) | 0) == 0 ? 0 : (0 - b) & 7)) | 0;
                        k = (m + n) | 0;
                        i = (b - m - n) | 0;
                        c[(m + 4) >> 2] = n | 3;
                        do
                          if ((b | 0) != (j | 0)) {
                            if ((b | 0) == (c[119] | 0)) {
                              w = ((c[116] | 0) + i) | 0;
                              c[116] = w;
                              c[119] = k;
                              c[(k + 4) >> 2] = w | 1;
                              c[(k + w) >> 2] = w;
                              break;
                            }
                            a = c[(b + 4) >> 2] | 0;
                            if (((a & 3) | 0) == 1) {
                              h = a & -8;
                              e = a >>> 3;
                              d: do
                                if (a >>> 0 < 256) {
                                  a = c[(b + 8) >> 2] | 0;
                                  d = c[(b + 12) >> 2] | 0;
                                  if ((d | 0) == (a | 0)) {
                                    c[114] = c[114] & ~(1 << e);
                                    break;
                                  } else {
                                    c[(a + 12) >> 2] = d;
                                    c[(d + 8) >> 2] = a;
                                    break;
                                  }
                                } else {
                                  g = c[(b + 24) >> 2] | 0;
                                  a = c[(b + 12) >> 2] | 0;
                                  do
                                    if ((a | 0) == (b | 0)) {
                                      e = (b + 16) | 0;
                                      d = (e + 4) | 0;
                                      a = c[d >> 2] | 0;
                                      if (!a) {
                                        a = c[e >> 2] | 0;
                                        if (!a) {
                                          a = 0;
                                          break;
                                        } else d = e;
                                      }
                                      while (1) {
                                        e = (a + 20) | 0;
                                        f = c[e >> 2] | 0;
                                        if (f | 0) {
                                          a = f;
                                          d = e;
                                          continue;
                                        }
                                        e = (a + 16) | 0;
                                        f = c[e >> 2] | 0;
                                        if (!f) break;
                                        else {
                                          a = f;
                                          d = e;
                                        }
                                      }
                                      c[d >> 2] = 0;
                                    } else {
                                      w = c[(b + 8) >> 2] | 0;
                                      c[(w + 12) >> 2] = a;
                                      c[(a + 8) >> 2] = w;
                                    }
                                  while (0);
                                  if (!g) break;
                                  d = c[(b + 28) >> 2] | 0;
                                  e = (760 + (d << 2)) | 0;
                                  do
                                    if ((b | 0) != (c[e >> 2] | 0)) {
                                      c[
                                        (g +
                                          16 +
                                          ((((c[(g + 16) >> 2] | 0) !=
                                            (b | 0)) &
                                            1) <<
                                            2)) >>
                                          2
                                      ] = a;
                                      if (!a) break d;
                                    } else {
                                      c[e >> 2] = a;
                                      if (a | 0) break;
                                      c[115] = c[115] & ~(1 << d);
                                      break d;
                                    }
                                  while (0);
                                  c[(a + 24) >> 2] = g;
                                  d = (b + 16) | 0;
                                  e = c[d >> 2] | 0;
                                  if (e | 0) {
                                    c[(a + 16) >> 2] = e;
                                    c[(e + 24) >> 2] = a;
                                  }
                                  d = c[(d + 4) >> 2] | 0;
                                  if (!d) break;
                                  c[(a + 20) >> 2] = d;
                                  c[(d + 24) >> 2] = a;
                                }
                              while (0);
                              b = (b + h) | 0;
                              f = (h + i) | 0;
                            } else f = i;
                            b = (b + 4) | 0;
                            c[b >> 2] = c[b >> 2] & -2;
                            c[(k + 4) >> 2] = f | 1;
                            c[(k + f) >> 2] = f;
                            b = f >>> 3;
                            if (f >>> 0 < 256) {
                              d = (496 + ((b << 1) << 2)) | 0;
                              a = c[114] | 0;
                              b = 1 << b;
                              if (!(a & b)) {
                                c[114] = a | b;
                                b = d;
                                a = (d + 8) | 0;
                              } else {
                                a = (d + 8) | 0;
                                b = c[a >> 2] | 0;
                              }
                              c[a >> 2] = k;
                              c[(b + 12) >> 2] = k;
                              c[(k + 8) >> 2] = b;
                              c[(k + 12) >> 2] = d;
                              break;
                            }
                            b = f >>> 8;
                            do
                              if (!b) b = 0;
                              else {
                                if (f >>> 0 > 16777215) {
                                  b = 31;
                                  break;
                                }
                                v = (((b + 1048320) | 0) >>> 16) & 8;
                                w = b << v;
                                u = (((w + 520192) | 0) >>> 16) & 4;
                                w = w << u;
                                b = (((w + 245760) | 0) >>> 16) & 2;
                                b = (14 - (u | v | b) + ((w << b) >>> 15)) | 0;
                                b = ((f >>> ((b + 7) | 0)) & 1) | (b << 1);
                              }
                            while (0);
                            e = (760 + (b << 2)) | 0;
                            c[(k + 28) >> 2] = b;
                            a = (k + 16) | 0;
                            c[(a + 4) >> 2] = 0;
                            c[a >> 2] = 0;
                            a = c[115] | 0;
                            d = 1 << b;
                            if (!(a & d)) {
                              c[115] = a | d;
                              c[e >> 2] = k;
                              c[(k + 24) >> 2] = e;
                              c[(k + 12) >> 2] = k;
                              c[(k + 8) >> 2] = k;
                              break;
                            }
                            a = f << ((b | 0) == 31 ? 0 : (25 - (b >>> 1)) | 0);
                            d = c[e >> 2] | 0;
                            while (1) {
                              if (((c[(d + 4) >> 2] & -8) | 0) == (f | 0)) {
                                v = 194;
                                break;
                              }
                              e = (d + 16 + ((a >>> 31) << 2)) | 0;
                              b = c[e >> 2] | 0;
                              if (!b) {
                                v = 193;
                                break;
                              } else {
                                a = a << 1;
                                d = b;
                              }
                            }
                            if ((v | 0) == 193) {
                              c[e >> 2] = k;
                              c[(k + 24) >> 2] = d;
                              c[(k + 12) >> 2] = k;
                              c[(k + 8) >> 2] = k;
                              break;
                            } else if ((v | 0) == 194) {
                              v = (d + 8) | 0;
                              w = c[v >> 2] | 0;
                              c[(w + 12) >> 2] = k;
                              c[v >> 2] = k;
                              c[(k + 8) >> 2] = w;
                              c[(k + 12) >> 2] = d;
                              c[(k + 24) >> 2] = 0;
                              break;
                            }
                          } else {
                            w = ((c[117] | 0) + i) | 0;
                            c[117] = w;
                            c[120] = k;
                            c[(k + 4) >> 2] = w | 1;
                          }
                        while (0);
                        w = (m + 8) | 0;
                        l = x;
                        return w | 0;
                      }
                      b = 904;
                      while (1) {
                        a = c[b >> 2] | 0;
                        if (
                          a >>> 0 <= j >>> 0
                            ? ((w = (a + (c[(b + 4) >> 2] | 0)) | 0),
                              w >>> 0 > j >>> 0)
                            : 0
                        )
                          break;
                        b = c[(b + 8) >> 2] | 0;
                      }
                      f = (w + -47) | 0;
                      a = (f + 8) | 0;
                      a = (f + (((a & 7) | 0) == 0 ? 0 : (0 - a) & 7)) | 0;
                      f = (j + 16) | 0;
                      a = a >>> 0 < f >>> 0 ? j : a;
                      b = (a + 8) | 0;
                      d = (g + 8) | 0;
                      d = ((d & 7) | 0) == 0 ? 0 : (0 - d) & 7;
                      v = (g + d) | 0;
                      d = (h + -40 - d) | 0;
                      c[120] = v;
                      c[117] = d;
                      c[(v + 4) >> 2] = d | 1;
                      c[(v + d + 4) >> 2] = 40;
                      c[121] = c[236];
                      d = (a + 4) | 0;
                      c[d >> 2] = 27;
                      c[b >> 2] = c[226];
                      c[(b + 4) >> 2] = c[227];
                      c[(b + 8) >> 2] = c[228];
                      c[(b + 12) >> 2] = c[229];
                      c[226] = g;
                      c[227] = h;
                      c[229] = 0;
                      c[228] = b;
                      b = (a + 24) | 0;
                      do {
                        v = b;
                        b = (b + 4) | 0;
                        c[b >> 2] = 7;
                      } while (((v + 8) | 0) >>> 0 < w >>> 0);
                      if ((a | 0) != (j | 0)) {
                        g = (a - j) | 0;
                        c[d >> 2] = c[d >> 2] & -2;
                        c[(j + 4) >> 2] = g | 1;
                        c[a >> 2] = g;
                        b = g >>> 3;
                        if (g >>> 0 < 256) {
                          d = (496 + ((b << 1) << 2)) | 0;
                          a = c[114] | 0;
                          b = 1 << b;
                          if (!(a & b)) {
                            c[114] = a | b;
                            b = d;
                            a = (d + 8) | 0;
                          } else {
                            a = (d + 8) | 0;
                            b = c[a >> 2] | 0;
                          }
                          c[a >> 2] = j;
                          c[(b + 12) >> 2] = j;
                          c[(j + 8) >> 2] = b;
                          c[(j + 12) >> 2] = d;
                          break;
                        }
                        b = g >>> 8;
                        if (b)
                          if (g >>> 0 > 16777215) d = 31;
                          else {
                            v = (((b + 1048320) | 0) >>> 16) & 8;
                            w = b << v;
                            u = (((w + 520192) | 0) >>> 16) & 4;
                            w = w << u;
                            d = (((w + 245760) | 0) >>> 16) & 2;
                            d = (14 - (u | v | d) + ((w << d) >>> 15)) | 0;
                            d = ((g >>> ((d + 7) | 0)) & 1) | (d << 1);
                          }
                        else d = 0;
                        e = (760 + (d << 2)) | 0;
                        c[(j + 28) >> 2] = d;
                        c[(j + 20) >> 2] = 0;
                        c[f >> 2] = 0;
                        b = c[115] | 0;
                        a = 1 << d;
                        if (!(b & a)) {
                          c[115] = b | a;
                          c[e >> 2] = j;
                          c[(j + 24) >> 2] = e;
                          c[(j + 12) >> 2] = j;
                          c[(j + 8) >> 2] = j;
                          break;
                        }
                        a = g << ((d | 0) == 31 ? 0 : (25 - (d >>> 1)) | 0);
                        d = c[e >> 2] | 0;
                        while (1) {
                          if (((c[(d + 4) >> 2] & -8) | 0) == (g | 0)) {
                            v = 216;
                            break;
                          }
                          e = (d + 16 + ((a >>> 31) << 2)) | 0;
                          b = c[e >> 2] | 0;
                          if (!b) {
                            v = 215;
                            break;
                          } else {
                            a = a << 1;
                            d = b;
                          }
                        }
                        if ((v | 0) == 215) {
                          c[e >> 2] = j;
                          c[(j + 24) >> 2] = d;
                          c[(j + 12) >> 2] = j;
                          c[(j + 8) >> 2] = j;
                          break;
                        } else if ((v | 0) == 216) {
                          v = (d + 8) | 0;
                          w = c[v >> 2] | 0;
                          c[(w + 12) >> 2] = j;
                          c[v >> 2] = j;
                          c[(j + 8) >> 2] = w;
                          c[(j + 12) >> 2] = d;
                          c[(j + 24) >> 2] = 0;
                          break;
                        }
                      }
                    } else {
                      w = c[118] | 0;
                      if (((w | 0) == 0) | (g >>> 0 < w >>> 0)) c[118] = g;
                      c[226] = g;
                      c[227] = h;
                      c[229] = 0;
                      c[123] = c[232];
                      c[122] = -1;
                      b = 0;
                      do {
                        w = (496 + ((b << 1) << 2)) | 0;
                        c[(w + 12) >> 2] = w;
                        c[(w + 8) >> 2] = w;
                        b = (b + 1) | 0;
                      } while ((b | 0) != 32);
                      w = (g + 8) | 0;
                      w = ((w & 7) | 0) == 0 ? 0 : (0 - w) & 7;
                      v = (g + w) | 0;
                      w = (h + -40 - w) | 0;
                      c[120] = v;
                      c[117] = w;
                      c[(v + 4) >> 2] = w | 1;
                      c[(v + w + 4) >> 2] = 40;
                      c[121] = c[236];
                    }
                  while (0);
                  b = c[117] | 0;
                  if (b >>> 0 > n >>> 0) {
                    u = (b - n) | 0;
                    c[117] = u;
                    w = c[120] | 0;
                    v = (w + n) | 0;
                    c[120] = v;
                    c[(v + 4) >> 2] = u | 1;
                    c[(w + 4) >> 2] = n | 3;
                    w = (w + 8) | 0;
                    l = x;
                    return w | 0;
                  }
                }
                c[(Ca() | 0) >> 2] = 12;
                w = 0;
                l = x;
                return w | 0;
              }
              function ya(a) {
                a = a | 0;
                var b = 0,
                  d = 0,
                  e = 0,
                  f = 0,
                  g = 0,
                  h = 0,
                  i = 0,
                  j = 0;
                if (!a) return;
                d = (a + -8) | 0;
                f = c[118] | 0;
                a = c[(a + -4) >> 2] | 0;
                b = a & -8;
                j = (d + b) | 0;
                do
                  if (!(a & 1)) {
                    e = c[d >> 2] | 0;
                    if (!(a & 3)) return;
                    h = (d + (0 - e)) | 0;
                    g = (e + b) | 0;
                    if (h >>> 0 < f >>> 0) return;
                    if ((h | 0) == (c[119] | 0)) {
                      a = (j + 4) | 0;
                      b = c[a >> 2] | 0;
                      if (((b & 3) | 0) != 3) {
                        i = h;
                        b = g;
                        break;
                      }
                      c[116] = g;
                      c[a >> 2] = b & -2;
                      c[(h + 4) >> 2] = g | 1;
                      c[(h + g) >> 2] = g;
                      return;
                    }
                    d = e >>> 3;
                    if (e >>> 0 < 256) {
                      a = c[(h + 8) >> 2] | 0;
                      b = c[(h + 12) >> 2] | 0;
                      if ((b | 0) == (a | 0)) {
                        c[114] = c[114] & ~(1 << d);
                        i = h;
                        b = g;
                        break;
                      } else {
                        c[(a + 12) >> 2] = b;
                        c[(b + 8) >> 2] = a;
                        i = h;
                        b = g;
                        break;
                      }
                    }
                    f = c[(h + 24) >> 2] | 0;
                    a = c[(h + 12) >> 2] | 0;
                    do
                      if ((a | 0) == (h | 0)) {
                        d = (h + 16) | 0;
                        b = (d + 4) | 0;
                        a = c[b >> 2] | 0;
                        if (!a) {
                          a = c[d >> 2] | 0;
                          if (!a) {
                            a = 0;
                            break;
                          } else b = d;
                        }
                        while (1) {
                          d = (a + 20) | 0;
                          e = c[d >> 2] | 0;
                          if (e | 0) {
                            a = e;
                            b = d;
                            continue;
                          }
                          d = (a + 16) | 0;
                          e = c[d >> 2] | 0;
                          if (!e) break;
                          else {
                            a = e;
                            b = d;
                          }
                        }
                        c[b >> 2] = 0;
                      } else {
                        i = c[(h + 8) >> 2] | 0;
                        c[(i + 12) >> 2] = a;
                        c[(a + 8) >> 2] = i;
                      }
                    while (0);
                    if (f) {
                      b = c[(h + 28) >> 2] | 0;
                      d = (760 + (b << 2)) | 0;
                      if ((h | 0) == (c[d >> 2] | 0)) {
                        c[d >> 2] = a;
                        if (!a) {
                          c[115] = c[115] & ~(1 << b);
                          i = h;
                          b = g;
                          break;
                        }
                      } else {
                        c[
                          (f +
                            16 +
                            ((((c[(f + 16) >> 2] | 0) != (h | 0)) & 1) << 2)) >>
                            2
                        ] = a;
                        if (!a) {
                          i = h;
                          b = g;
                          break;
                        }
                      }
                      c[(a + 24) >> 2] = f;
                      b = (h + 16) | 0;
                      d = c[b >> 2] | 0;
                      if (d | 0) {
                        c[(a + 16) >> 2] = d;
                        c[(d + 24) >> 2] = a;
                      }
                      b = c[(b + 4) >> 2] | 0;
                      if (b) {
                        c[(a + 20) >> 2] = b;
                        c[(b + 24) >> 2] = a;
                        i = h;
                        b = g;
                      } else {
                        i = h;
                        b = g;
                      }
                    } else {
                      i = h;
                      b = g;
                    }
                  } else {
                    i = d;
                    h = d;
                  }
                while (0);
                if (h >>> 0 >= j >>> 0) return;
                a = (j + 4) | 0;
                e = c[a >> 2] | 0;
                if (!(e & 1)) return;
                if (!(e & 2)) {
                  a = c[119] | 0;
                  if ((j | 0) == (c[120] | 0)) {
                    j = ((c[117] | 0) + b) | 0;
                    c[117] = j;
                    c[120] = i;
                    c[(i + 4) >> 2] = j | 1;
                    if ((i | 0) != (a | 0)) return;
                    c[119] = 0;
                    c[116] = 0;
                    return;
                  }
                  if ((j | 0) == (a | 0)) {
                    j = ((c[116] | 0) + b) | 0;
                    c[116] = j;
                    c[119] = h;
                    c[(i + 4) >> 2] = j | 1;
                    c[(h + j) >> 2] = j;
                    return;
                  }
                  f = ((e & -8) + b) | 0;
                  d = e >>> 3;
                  do
                    if (e >>> 0 < 256) {
                      b = c[(j + 8) >> 2] | 0;
                      a = c[(j + 12) >> 2] | 0;
                      if ((a | 0) == (b | 0)) {
                        c[114] = c[114] & ~(1 << d);
                        break;
                      } else {
                        c[(b + 12) >> 2] = a;
                        c[(a + 8) >> 2] = b;
                        break;
                      }
                    } else {
                      g = c[(j + 24) >> 2] | 0;
                      a = c[(j + 12) >> 2] | 0;
                      do
                        if ((a | 0) == (j | 0)) {
                          d = (j + 16) | 0;
                          b = (d + 4) | 0;
                          a = c[b >> 2] | 0;
                          if (!a) {
                            a = c[d >> 2] | 0;
                            if (!a) {
                              d = 0;
                              break;
                            } else b = d;
                          }
                          while (1) {
                            d = (a + 20) | 0;
                            e = c[d >> 2] | 0;
                            if (e | 0) {
                              a = e;
                              b = d;
                              continue;
                            }
                            d = (a + 16) | 0;
                            e = c[d >> 2] | 0;
                            if (!e) break;
                            else {
                              a = e;
                              b = d;
                            }
                          }
                          c[b >> 2] = 0;
                          d = a;
                        } else {
                          d = c[(j + 8) >> 2] | 0;
                          c[(d + 12) >> 2] = a;
                          c[(a + 8) >> 2] = d;
                          d = a;
                        }
                      while (0);
                      if (g | 0) {
                        a = c[(j + 28) >> 2] | 0;
                        b = (760 + (a << 2)) | 0;
                        if ((j | 0) == (c[b >> 2] | 0)) {
                          c[b >> 2] = d;
                          if (!d) {
                            c[115] = c[115] & ~(1 << a);
                            break;
                          }
                        } else {
                          c[
                            (g +
                              16 +
                              ((((c[(g + 16) >> 2] | 0) != (j | 0)) & 1) <<
                                2)) >>
                              2
                          ] = d;
                          if (!d) break;
                        }
                        c[(d + 24) >> 2] = g;
                        a = (j + 16) | 0;
                        b = c[a >> 2] | 0;
                        if (b | 0) {
                          c[(d + 16) >> 2] = b;
                          c[(b + 24) >> 2] = d;
                        }
                        a = c[(a + 4) >> 2] | 0;
                        if (a | 0) {
                          c[(d + 20) >> 2] = a;
                          c[(a + 24) >> 2] = d;
                        }
                      }
                    }
                  while (0);
                  c[(i + 4) >> 2] = f | 1;
                  c[(h + f) >> 2] = f;
                  if ((i | 0) == (c[119] | 0)) {
                    c[116] = f;
                    return;
                  }
                } else {
                  c[a >> 2] = e & -2;
                  c[(i + 4) >> 2] = b | 1;
                  c[(h + b) >> 2] = b;
                  f = b;
                }
                a = f >>> 3;
                if (f >>> 0 < 256) {
                  d = (496 + ((a << 1) << 2)) | 0;
                  b = c[114] | 0;
                  a = 1 << a;
                  if (!(b & a)) {
                    c[114] = b | a;
                    a = d;
                    b = (d + 8) | 0;
                  } else {
                    b = (d + 8) | 0;
                    a = c[b >> 2] | 0;
                  }
                  c[b >> 2] = i;
                  c[(a + 12) >> 2] = i;
                  c[(i + 8) >> 2] = a;
                  c[(i + 12) >> 2] = d;
                  return;
                }
                a = f >>> 8;
                if (a)
                  if (f >>> 0 > 16777215) a = 31;
                  else {
                    h = (((a + 1048320) | 0) >>> 16) & 8;
                    j = a << h;
                    g = (((j + 520192) | 0) >>> 16) & 4;
                    j = j << g;
                    a = (((j + 245760) | 0) >>> 16) & 2;
                    a = (14 - (g | h | a) + ((j << a) >>> 15)) | 0;
                    a = ((f >>> ((a + 7) | 0)) & 1) | (a << 1);
                  }
                else a = 0;
                e = (760 + (a << 2)) | 0;
                c[(i + 28) >> 2] = a;
                c[(i + 20) >> 2] = 0;
                c[(i + 16) >> 2] = 0;
                b = c[115] | 0;
                d = 1 << a;
                do
                  if (b & d) {
                    b = f << ((a | 0) == 31 ? 0 : (25 - (a >>> 1)) | 0);
                    d = c[e >> 2] | 0;
                    while (1) {
                      if (((c[(d + 4) >> 2] & -8) | 0) == (f | 0)) {
                        a = 73;
                        break;
                      }
                      e = (d + 16 + ((b >>> 31) << 2)) | 0;
                      a = c[e >> 2] | 0;
                      if (!a) {
                        a = 72;
                        break;
                      } else {
                        b = b << 1;
                        d = a;
                      }
                    }
                    if ((a | 0) == 72) {
                      c[e >> 2] = i;
                      c[(i + 24) >> 2] = d;
                      c[(i + 12) >> 2] = i;
                      c[(i + 8) >> 2] = i;
                      break;
                    } else if ((a | 0) == 73) {
                      h = (d + 8) | 0;
                      j = c[h >> 2] | 0;
                      c[(j + 12) >> 2] = i;
                      c[h >> 2] = i;
                      c[(i + 8) >> 2] = j;
                      c[(i + 12) >> 2] = d;
                      c[(i + 24) >> 2] = 0;
                      break;
                    }
                  } else {
                    c[115] = b | d;
                    c[e >> 2] = i;
                    c[(i + 24) >> 2] = e;
                    c[(i + 12) >> 2] = i;
                    c[(i + 8) >> 2] = i;
                  }
                while (0);
                j = ((c[122] | 0) + -1) | 0;
                c[122] = j;
                if (!j) a = 912;
                else return;
                while (1) {
                  a = c[a >> 2] | 0;
                  if (!a) break;
                  else a = (a + 8) | 0;
                }
                c[122] = -1;
                return;
              }
              function za(a) {
                a = a | 0;
                var b = 0,
                  d = 0;
                b = l;
                l = (l + 16) | 0;
                d = b;
                c[d >> 2] = Fa(c[(a + 60) >> 2] | 0) | 0;
                a = Ba(Z(6, d | 0) | 0) | 0;
                l = b;
                return a | 0;
              }
              function Aa(a, b, d) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                var e = 0,
                  f = 0,
                  g = 0;
                f = l;
                l = (l + 32) | 0;
                g = f;
                e = (f + 20) | 0;
                c[g >> 2] = c[(a + 60) >> 2];
                c[(g + 4) >> 2] = 0;
                c[(g + 8) >> 2] = b;
                c[(g + 12) >> 2] = e;
                c[(g + 16) >> 2] = d;
                if ((Ba(aa(140, g | 0) | 0) | 0) < 0) {
                  c[e >> 2] = -1;
                  a = -1;
                } else a = c[e >> 2] | 0;
                l = f;
                return a | 0;
              }
              function Ba(a) {
                a = a | 0;
                if (a >>> 0 > 4294963200) {
                  c[(Ca() | 0) >> 2] = 0 - a;
                  a = -1;
                }
                return a | 0;
              }
              function Ca() {
                return ((Da() | 0) + 64) | 0;
              }
              function Da() {
                return Ea() | 0;
              }
              function Ea() {
                return 8;
              }
              function Fa(a) {
                a = a | 0;
                return a | 0;
              }
              function Ga(a, b, d) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                var e = 0,
                  f = 0,
                  g = 0,
                  h = 0,
                  i = 0,
                  j = 0,
                  k = 0,
                  m = 0,
                  n = 0,
                  o = 0,
                  p = 0;
                n = l;
                l = (l + 48) | 0;
                k = (n + 16) | 0;
                g = n;
                f = (n + 32) | 0;
                i = (a + 28) | 0;
                e = c[i >> 2] | 0;
                c[f >> 2] = e;
                j = (a + 20) | 0;
                e = ((c[j >> 2] | 0) - e) | 0;
                c[(f + 4) >> 2] = e;
                c[(f + 8) >> 2] = b;
                c[(f + 12) >> 2] = d;
                e = (e + d) | 0;
                h = (a + 60) | 0;
                c[g >> 2] = c[h >> 2];
                c[(g + 4) >> 2] = f;
                c[(g + 8) >> 2] = 2;
                g = Ba(da(146, g | 0) | 0) | 0;
                a: do
                  if ((e | 0) != (g | 0)) {
                    b = 2;
                    while (1) {
                      if ((g | 0) < 0) break;
                      e = (e - g) | 0;
                      p = c[(f + 4) >> 2] | 0;
                      o = g >>> 0 > p >>> 0;
                      f = o ? (f + 8) | 0 : f;
                      b = (((o << 31) >> 31) + b) | 0;
                      p = (g - (o ? p : 0)) | 0;
                      c[f >> 2] = (c[f >> 2] | 0) + p;
                      o = (f + 4) | 0;
                      c[o >> 2] = (c[o >> 2] | 0) - p;
                      c[k >> 2] = c[h >> 2];
                      c[(k + 4) >> 2] = f;
                      c[(k + 8) >> 2] = b;
                      g = Ba(da(146, k | 0) | 0) | 0;
                      if ((e | 0) == (g | 0)) {
                        m = 3;
                        break a;
                      }
                    }
                    c[(a + 16) >> 2] = 0;
                    c[i >> 2] = 0;
                    c[j >> 2] = 0;
                    c[a >> 2] = c[a >> 2] | 32;
                    if ((b | 0) == 2) d = 0;
                    else d = (d - (c[(f + 4) >> 2] | 0)) | 0;
                  } else m = 3;
                while (0);
                if ((m | 0) == 3) {
                  p = c[(a + 44) >> 2] | 0;
                  c[(a + 16) >> 2] = p + (c[(a + 48) >> 2] | 0);
                  c[i >> 2] = p;
                  c[j >> 2] = p;
                }
                l = n;
                return d | 0;
              }
              function Ha() {
                return 952;
              }
              function Ia(a) {
                a = a | 0;
                return 0;
              }
              function Ja(a) {
                a = a | 0;
                return;
              }
              function Ka(b, d, e) {
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0,
                  g = 0,
                  h = 0,
                  i = 0,
                  j = 0;
                f = (e + 16) | 0;
                g = c[f >> 2] | 0;
                if (!g)
                  if (!(La(e) | 0)) {
                    g = c[f >> 2] | 0;
                    h = 5;
                  } else f = 0;
                else h = 5;
                a: do
                  if ((h | 0) == 5) {
                    j = (e + 20) | 0;
                    i = c[j >> 2] | 0;
                    f = i;
                    if (((g - i) | 0) >>> 0 < d >>> 0) {
                      f = ha[c[(e + 36) >> 2] & 3](e, b, d) | 0;
                      break;
                    }
                    b: do
                      if ((a[(e + 75) >> 0] | 0) > -1) {
                        i = d;
                        while (1) {
                          if (!i) {
                            h = 0;
                            g = b;
                            break b;
                          }
                          g = (i + -1) | 0;
                          if ((a[(b + g) >> 0] | 0) == 10) break;
                          else i = g;
                        }
                        f = ha[c[(e + 36) >> 2] & 3](e, b, i) | 0;
                        if (f >>> 0 < i >>> 0) break a;
                        h = i;
                        g = (b + i) | 0;
                        d = (d - i) | 0;
                        f = c[j >> 2] | 0;
                      } else {
                        h = 0;
                        g = b;
                      }
                    while (0);
                    Qa(f | 0, g | 0, d | 0) | 0;
                    c[j >> 2] = (c[j >> 2] | 0) + d;
                    f = (h + d) | 0;
                  }
                while (0);
                return f | 0;
              }
              function La(b) {
                b = b | 0;
                var d = 0,
                  e = 0;
                d = (b + 74) | 0;
                e = a[d >> 0] | 0;
                a[d >> 0] = (e + 255) | e;
                d = c[b >> 2] | 0;
                if (!(d & 8)) {
                  c[(b + 8) >> 2] = 0;
                  c[(b + 4) >> 2] = 0;
                  e = c[(b + 44) >> 2] | 0;
                  c[(b + 28) >> 2] = e;
                  c[(b + 20) >> 2] = e;
                  c[(b + 16) >> 2] = e + (c[(b + 48) >> 2] | 0);
                  b = 0;
                } else {
                  c[b >> 2] = d | 32;
                  b = -1;
                }
                return b | 0;
              }
              function Ma(a, b, d, e) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0,
                  g = 0;
                f = N(d, b) | 0;
                d = (b | 0) == 0 ? 0 : d;
                if ((c[(e + 76) >> 2] | 0) > -1) {
                  g = (Ia(e) | 0) == 0;
                  a = Ka(a, f, e) | 0;
                  if (!g) Ja(e);
                } else a = Ka(a, f, e) | 0;
                if ((a | 0) != (f | 0)) d = ((a >>> 0) / (b >>> 0)) | 0;
                return d | 0;
              }
              function Na() {}
              function Oa(a) {
                a = a | 0;
                var b = 0,
                  d = 0;
                d = ((a + 15) & -16) | 0;
                b = c[i >> 2] | 0;
                a = (b + d) | 0;
                if ((((d | 0) > 0) & ((a | 0) < (b | 0))) | ((a | 0) < 0)) {
                  W() | 0;
                  _(12);
                  return -1;
                }
                c[i >> 2] = a;
                if ((a | 0) > (V() | 0) ? (U() | 0) == 0 : 0) {
                  c[i >> 2] = b;
                  _(12);
                  return -1;
                }
                return b | 0;
              }
              function Pa(b, d, e) {
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0,
                  g = 0,
                  h = 0,
                  i = 0;
                h = (b + e) | 0;
                d = d & 255;
                if ((e | 0) >= 67) {
                  while (b & 3) {
                    a[b >> 0] = d;
                    b = (b + 1) | 0;
                  }
                  f = (h & -4) | 0;
                  g = (f - 64) | 0;
                  i = d | (d << 8) | (d << 16) | (d << 24);
                  while ((b | 0) <= (g | 0)) {
                    c[b >> 2] = i;
                    c[(b + 4) >> 2] = i;
                    c[(b + 8) >> 2] = i;
                    c[(b + 12) >> 2] = i;
                    c[(b + 16) >> 2] = i;
                    c[(b + 20) >> 2] = i;
                    c[(b + 24) >> 2] = i;
                    c[(b + 28) >> 2] = i;
                    c[(b + 32) >> 2] = i;
                    c[(b + 36) >> 2] = i;
                    c[(b + 40) >> 2] = i;
                    c[(b + 44) >> 2] = i;
                    c[(b + 48) >> 2] = i;
                    c[(b + 52) >> 2] = i;
                    c[(b + 56) >> 2] = i;
                    c[(b + 60) >> 2] = i;
                    b = (b + 64) | 0;
                  }
                  while ((b | 0) < (f | 0)) {
                    c[b >> 2] = i;
                    b = (b + 4) | 0;
                  }
                }
                while ((b | 0) < (h | 0)) {
                  a[b >> 0] = d;
                  b = (b + 1) | 0;
                }
                return (h - e) | 0;
              }
              function Qa(b, d, e) {
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0,
                  g = 0,
                  h = 0;
                if ((e | 0) >= 8192) return $(b | 0, d | 0, e | 0) | 0;
                h = b | 0;
                g = (b + e) | 0;
                if ((b & 3) == (d & 3)) {
                  while (b & 3) {
                    if (!e) return h | 0;
                    a[b >> 0] = a[d >> 0] | 0;
                    b = (b + 1) | 0;
                    d = (d + 1) | 0;
                    e = (e - 1) | 0;
                  }
                  e = (g & -4) | 0;
                  f = (e - 64) | 0;
                  while ((b | 0) <= (f | 0)) {
                    c[b >> 2] = c[d >> 2];
                    c[(b + 4) >> 2] = c[(d + 4) >> 2];
                    c[(b + 8) >> 2] = c[(d + 8) >> 2];
                    c[(b + 12) >> 2] = c[(d + 12) >> 2];
                    c[(b + 16) >> 2] = c[(d + 16) >> 2];
                    c[(b + 20) >> 2] = c[(d + 20) >> 2];
                    c[(b + 24) >> 2] = c[(d + 24) >> 2];
                    c[(b + 28) >> 2] = c[(d + 28) >> 2];
                    c[(b + 32) >> 2] = c[(d + 32) >> 2];
                    c[(b + 36) >> 2] = c[(d + 36) >> 2];
                    c[(b + 40) >> 2] = c[(d + 40) >> 2];
                    c[(b + 44) >> 2] = c[(d + 44) >> 2];
                    c[(b + 48) >> 2] = c[(d + 48) >> 2];
                    c[(b + 52) >> 2] = c[(d + 52) >> 2];
                    c[(b + 56) >> 2] = c[(d + 56) >> 2];
                    c[(b + 60) >> 2] = c[(d + 60) >> 2];
                    b = (b + 64) | 0;
                    d = (d + 64) | 0;
                  }
                  while ((b | 0) < (e | 0)) {
                    c[b >> 2] = c[d >> 2];
                    b = (b + 4) | 0;
                    d = (d + 4) | 0;
                  }
                } else {
                  e = (g - 4) | 0;
                  while ((b | 0) < (e | 0)) {
                    a[b >> 0] = a[d >> 0] | 0;
                    a[(b + 1) >> 0] = a[(d + 1) >> 0] | 0;
                    a[(b + 2) >> 0] = a[(d + 2) >> 0] | 0;
                    a[(b + 3) >> 0] = a[(d + 3) >> 0] | 0;
                    b = (b + 4) | 0;
                    d = (d + 4) | 0;
                  }
                }
                while ((b | 0) < (g | 0)) {
                  a[b >> 0] = a[d >> 0] | 0;
                  b = (b + 1) | 0;
                  d = (d + 1) | 0;
                }
                return h | 0;
              }
              function Ra(a, b) {
                a = a | 0;
                b = b | 0;
                return ga[a & 1](b | 0) | 0;
              }
              function Sa(a, b, c, d) {
                a = a | 0;
                b = b | 0;
                c = c | 0;
                d = d | 0;
                return ha[a & 3](b | 0, c | 0, d | 0) | 0;
              }
              function Ta(a) {
                a = a | 0;
                S(0);
                return 0;
              }
              function Ua(a, b, c) {
                a = a | 0;
                b = b | 0;
                c = c | 0;
                S(1);
                return 0;
              }

              // EMSCRIPTEN_END_FUNCS
              var ga = [Ta, za];
              var ha = [Ua, Ga, Aa, Ua];
              return {
                _kiss_fftr_alloc: ua,
                _kiss_fftri: wa,
                _memset: Pa,
                setThrew: ma,
                _kiss_fftr: va,
                _kiss_fft_alloc: qa,
                _sbrk: Oa,
                _memcpy: Qa,
                stackAlloc: ia,
                getTempRet0: oa,
                setTempRet0: na,
                _kiss_fftr_free: ta,
                dynCall_iiii: Sa,
                _kiss_fft: sa,
                _emscripten_get_global_libc: Ha,
                dynCall_ii: Ra,
                stackSave: ja,
                _free: ya,
                runPostSets: Na,
                establishStackSpace: la,
                stackRestore: ka,
                _malloc: xa,
                _kiss_fft_free: pa,
              };
            })(
              // EMSCRIPTEN_END_ASM
              Module.asmGlobalArg,
              Module.asmLibraryArg,
              buffer
            );
            var _kiss_fftr = (Module["_kiss_fftr"] = asm["_kiss_fftr"]);
            var getTempRet0 = (Module["getTempRet0"] = asm["getTempRet0"]);
            var _free = (Module["_free"] = asm["_free"]);
            var runPostSets = (Module["runPostSets"] = asm["runPostSets"]);
            var setTempRet0 = (Module["setTempRet0"] = asm["setTempRet0"]);
            var _kiss_fftr_alloc = (Module["_kiss_fftr_alloc"] =
              asm["_kiss_fftr_alloc"]);
            var _kiss_fftr_free = (Module["_kiss_fftr_free"] =
              asm["_kiss_fftr_free"]);
            var _kiss_fft_free = (Module["_kiss_fft_free"] =
              asm["_kiss_fft_free"]);
            var _kiss_fftri = (Module["_kiss_fftri"] = asm["_kiss_fftri"]);
            var _kiss_fft_alloc = (Module["_kiss_fft_alloc"] =
              asm["_kiss_fft_alloc"]);
            var _memset = (Module["_memset"] = asm["_memset"]);
            var _malloc = (Module["_malloc"] = asm["_malloc"]);
            var _kiss_fft = (Module["_kiss_fft"] = asm["_kiss_fft"]);
            var _emscripten_get_global_libc = (Module[
              "_emscripten_get_global_libc"
            ] = asm["_emscripten_get_global_libc"]);
            var _memcpy = (Module["_memcpy"] = asm["_memcpy"]);
            var stackAlloc = (Module["stackAlloc"] = asm["stackAlloc"]);
            var setThrew = (Module["setThrew"] = asm["setThrew"]);
            var _sbrk = (Module["_sbrk"] = asm["_sbrk"]);
            var stackRestore = (Module["stackRestore"] = asm["stackRestore"]);
            var establishStackSpace = (Module["establishStackSpace"] =
              asm["establishStackSpace"]);
            var stackSave = (Module["stackSave"] = asm["stackSave"]);
            var dynCall_ii = (Module["dynCall_ii"] = asm["dynCall_ii"]);
            var dynCall_iiii = (Module["dynCall_iiii"] = asm["dynCall_iiii"]);
            Runtime.stackAlloc = Module["stackAlloc"];
            Runtime.stackSave = Module["stackSave"];
            Runtime.stackRestore = Module["stackRestore"];
            Runtime.establishStackSpace = Module["establishStackSpace"];
            Runtime.setTempRet0 = Module["setTempRet0"];
            Runtime.getTempRet0 = Module["getTempRet0"];
            Module["asm"] = asm;
            Module["then"] = function (func) {
              if (Module["calledRun"]) {
                func(Module);
              } else {
                var old = Module["onRuntimeInitialized"];
                Module["onRuntimeInitialized"] = function () {
                  if (old) old();
                  func(Module);
                };
              }
              return Module;
            };
            function ExitStatus(status) {
              this.name = "ExitStatus";
              this.message = "Program terminated with exit(" + status + ")";
              this.status = status;
            }
            ExitStatus.prototype = new Error();
            ExitStatus.prototype.constructor = ExitStatus;
            var initialStackTop;
            var preloadStartTime = null;
            var calledMain = false;
            dependenciesFulfilled = function runCaller() {
              if (!Module["calledRun"]) run();
              if (!Module["calledRun"]) dependenciesFulfilled = runCaller;
            };
            Module["callMain"] = Module.callMain = function callMain(args) {
              args = args || [];
              ensureInitRuntime();
              var argc = args.length + 1;
              function pad() {
                for (var i = 0; i < 4 - 1; i++) {
                  argv.push(0);
                }
              }
              var argv = [
                allocate(
                  intArrayFromString(Module["thisProgram"]),
                  "i8",
                  ALLOC_NORMAL
                ),
              ];
              pad();
              for (var i = 0; i < argc - 1; i = i + 1) {
                argv.push(
                  allocate(intArrayFromString(args[i]), "i8", ALLOC_NORMAL)
                );
                pad();
              }
              argv.push(0);
              argv = allocate(argv, "i32", ALLOC_NORMAL);
              try {
                var ret = Module["_main"](argc, argv, 0);
                exit(ret, true);
              } catch (e) {
                if (e instanceof ExitStatus) {
                  return;
                } else if (e == "SimulateInfiniteLoop") {
                  Module["noExitRuntime"] = true;
                  return;
                } else {
                  var toLog = e;
                  if (e && typeof e === "object" && e.stack) {
                    toLog = [e, e.stack];
                  }
                  Module.printErr("exception thrown: " + toLog);
                  Module["quit"](1, e);
                }
              } finally {
                calledMain = true;
              }
            };
            function run(args) {
              args = args || Module["arguments"];
              if (preloadStartTime === null) preloadStartTime = Date.now();
              if (runDependencies > 0) {
                return;
              }
              preRun();
              if (runDependencies > 0) return;
              if (Module["calledRun"]) return;
              function doRun() {
                if (Module["calledRun"]) return;
                Module["calledRun"] = true;
                if (ABORT) return;
                ensureInitRuntime();
                preMain();
                if (Module["onRuntimeInitialized"])
                  Module["onRuntimeInitialized"]();
                if (Module["_main"] && shouldRunNow) Module["callMain"](args);
                postRun();
              }
              if (Module["setStatus"]) {
                Module["setStatus"]("Running...");
                setTimeout(function () {
                  setTimeout(function () {
                    Module["setStatus"]("");
                  }, 1);
                  doRun();
                }, 1);
              } else {
                doRun();
              }
            }
            Module["run"] = Module.run = run;
            function exit(status, implicit) {
              if (implicit && Module["noExitRuntime"]) {
                return;
              }
              if (Module["noExitRuntime"]) {
              } else {
                ABORT = true;
                EXITSTATUS = status;
                STACKTOP = initialStackTop;
                exitRuntime();
                if (Module["onExit"]) Module["onExit"](status);
              }
              if (ENVIRONMENT_IS_NODE) {
                process["exit"](status);
              }
              Module["quit"](status, new ExitStatus(status));
            }
            Module["exit"] = Module.exit = exit;
            var abortDecorators = [];
            function abort(what) {
              if (Module["onAbort"]) {
                Module["onAbort"](what);
              }
              if (what !== undefined) {
                Module.print(what);
                Module.printErr(what);
                what = JSON.stringify(what);
              } else {
                what = "";
              }
              ABORT = true;
              EXITSTATUS = 1;
              var extra =
                "\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.";
              var output = "abort(" + what + ") at " + stackTrace() + extra;
              if (abortDecorators) {
                abortDecorators.forEach(function (decorator) {
                  output = decorator(output, what);
                });
              }
              throw output;
            }
            Module["abort"] = Module.abort = abort;
            if (Module["preInit"]) {
              if (typeof Module["preInit"] == "function")
                Module["preInit"] = [Module["preInit"]];
              while (Module["preInit"].length > 0) {
                Module["preInit"].pop()();
              }
            }
            var shouldRunNow = true;
            if (Module["noInitialRun"]) {
              shouldRunNow = false;
            }
            run();

            return KissFFTModule;
          };
          if (typeof module === "object" && module.exports) {
            module["exports"] = KissFFTModule;
          }
        }.call(this, require("_process")));
      },
      { _process: 3, fs: 1, path: 2 },
    ],
    6: [
      function (require, module, exports) {
        "use strict";

        var KissFFTModule = require("./KissFFT");

        var kissFFTModule = KissFFTModule({});

        var kiss_fftr_alloc = kissFFTModule.cwrap("kiss_fftr_alloc", "number", [
          "number",
          "number",
          "number",
          "number",
        ]);

        var kiss_fftr = kissFFTModule.cwrap("kiss_fftr", "void", [
          "number",
          "number",
          "number",
        ]);

        var kiss_fftri = kissFFTModule.cwrap("kiss_fftri", "void", [
          "number",
          "number",
          "number",
        ]);

        var kiss_fftr_free = kissFFTModule.cwrap("kiss_fftr_free", "void", [
          "number",
        ]);

        var kiss_fft_alloc = kissFFTModule.cwrap("kiss_fft_alloc", "number", [
          "number",
          "number",
          "number",
          "number",
        ]);

        var kiss_fft = kissFFTModule.cwrap("kiss_fft", "void", [
          "number",
          "number",
          "number",
        ]);

        var kiss_fft_free = kissFFTModule.cwrap("kiss_fft_free", "void", [
          "number",
        ]);

        var FFT = function (size) {
          this.size = size;
          this.fcfg = kiss_fft_alloc(size, false);
          this.icfg = kiss_fft_alloc(size, true);

          this.inptr = kissFFTModule._malloc(size * 8 + size * 8);
          this.outptr = this.inptr + size * 8;

          this.cin = new Float32Array(
            kissFFTModule.HEAPU8.buffer,
            this.inptr,
            size * 2
          );
          this.cout = new Float32Array(
            kissFFTModule.HEAPU8.buffer,
            this.outptr,
            size * 2
          );

          this.forward = function (cin) {
            this.cin.set(cin);
            kiss_fft(this.fcfg, this.inptr, this.outptr);
            return new Float32Array(
              kissFFTModule.HEAPU8.buffer,
              this.outptr,
              this.size * 2
            );
          };

          this.inverse = function (cin) {
            this.cin.set(cpx);
            kiss_fft(this.icfg, this.inptr, this.outptr);
            return new Float32Array(
              kissFFTModule.HEAPU8.buffer,
              this.outptr,
              this.size * 2
            );
          };

          this.dispose = function () {
            kissFFTModule._free(this.inptr);
            kiss_fft_free(this.fcfg);
            kiss_fft_free(this.icfg);
          };
        };

        var FFTR = function (size) {
          this.size = size;
          this.fcfg = kiss_fftr_alloc(size, false);
          this.icfg = kiss_fftr_alloc(size, true);

          this.rptr = kissFFTModule._malloc(size * 4 + (size + 2) * 4);
          this.cptr = this.rptr + size * 4;

          this.ri = new Float32Array(
            kissFFTModule.HEAPU8.buffer,
            this.rptr,
            size
          );
          this.ci = new Float32Array(
            kissFFTModule.HEAPU8.buffer,
            this.cptr,
            size + 2
          );

          this.forward = function (real) {
            this.ri.set(real);
            kiss_fftr(this.fcfg, this.rptr, this.cptr);
            return new Float32Array(
              kissFFTModule.HEAPU8.buffer,
              this.cptr,
              this.size + 2
            );
          };

          this.inverse = function (cpx) {
            this.ci.set(cpx);
            kiss_fftri(this.icfg, this.cptr, this.rptr);
            return new Float32Array(
              kissFFTModule.HEAPU8.buffer,
              this.rptr,
              this.size
            );
          };

          this.dispose = function () {
            kissFFTModule._free(this.rptr);
            kiss_fftr_free(this.fcfg);
            kiss_fftr_free(this.icfg);
          };
        };

        module.exports = {
          FFT: FFT,
          FFTR: FFTR,
        };
      },
      { "./KissFFT": 5 },
    ],
  },
  {},
  [4]
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTIuMi4wL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLm52bS92ZXJzaW9ucy9ub2RlL3YxMi4yLjAvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L2xpYi9fZW1wdHkuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi8ubnZtL3ZlcnNpb25zL25vZGUvdjEyLjIuMC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3BhdGgtYnJvd3NlcmlmeS9pbmRleC5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTIuMi4wL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibWFpbi5qcyIsIm5vZGVfbW9kdWxlcy9raXNzZmZ0LWpzL3NyYy9LaXNzRkZULmpzIiwibm9kZV9tb2R1bGVzL2tpc3NmZnQtanMvc3JjL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDOVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeExBO0FBQ0E7QUFDQTtBQUNBOzs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIiLCIvLyAuZGlybmFtZSwgLmJhc2VuYW1lLCBhbmQgLmV4dG5hbWUgbWV0aG9kcyBhcmUgZXh0cmFjdGVkIGZyb20gTm9kZS5qcyB2OC4xMS4xLFxuLy8gYmFja3BvcnRlZCBhbmQgdHJhbnNwbGl0ZWQgd2l0aCBCYWJlbCwgd2l0aCBiYWNrd2FyZHMtY29tcGF0IGZpeGVzXG5cbi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyByZXNvbHZlcyAuIGFuZCAuLiBlbGVtZW50cyBpbiBhIHBhdGggYXJyYXkgd2l0aCBkaXJlY3RvcnkgbmFtZXMgdGhlcmVcbi8vIG11c3QgYmUgbm8gc2xhc2hlcywgZW1wdHkgZWxlbWVudHMsIG9yIGRldmljZSBuYW1lcyAoYzpcXCkgaW4gdGhlIGFycmF5XG4vLyAoc28gYWxzbyBubyBsZWFkaW5nIGFuZCB0cmFpbGluZyBzbGFzaGVzIC0gaXQgZG9lcyBub3QgZGlzdGluZ3Vpc2hcbi8vIHJlbGF0aXZlIGFuZCBhYnNvbHV0ZSBwYXRocylcbmZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5KHBhcnRzLCBhbGxvd0Fib3ZlUm9vdCkge1xuICAvLyBpZiB0aGUgcGF0aCB0cmllcyB0byBnbyBhYm92ZSB0aGUgcm9vdCwgYHVwYCBlbmRzIHVwID4gMFxuICB2YXIgdXAgPSAwO1xuICBmb3IgKHZhciBpID0gcGFydHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICB2YXIgbGFzdCA9IHBhcnRzW2ldO1xuICAgIGlmIChsYXN0ID09PSAnLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICB9IGVsc2UgaWYgKGxhc3QgPT09ICcuLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCkge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXAtLTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiB0aGUgcGF0aCBpcyBhbGxvd2VkIHRvIGdvIGFib3ZlIHRoZSByb290LCByZXN0b3JlIGxlYWRpbmcgLi5zXG4gIGlmIChhbGxvd0Fib3ZlUm9vdCkge1xuICAgIGZvciAoOyB1cC0tOyB1cCkge1xuICAgICAgcGFydHMudW5zaGlmdCgnLi4nKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcGFydHM7XG59XG5cbi8vIHBhdGgucmVzb2x2ZShbZnJvbSAuLi5dLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVzb2x2ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzb2x2ZWRQYXRoID0gJycsXG4gICAgICByZXNvbHZlZEFic29sdXRlID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IC0xICYmICFyZXNvbHZlZEFic29sdXRlOyBpLS0pIHtcbiAgICB2YXIgcGF0aCA9IChpID49IDApID8gYXJndW1lbnRzW2ldIDogcHJvY2Vzcy5jd2QoKTtcblxuICAgIC8vIFNraXAgZW1wdHkgYW5kIGludmFsaWQgZW50cmllc1xuICAgIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLnJlc29sdmUgbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfSBlbHNlIGlmICghcGF0aCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgcmVzb2x2ZWRQYXRoID0gcGF0aCArICcvJyArIHJlc29sdmVkUGF0aDtcbiAgICByZXNvbHZlZEFic29sdXRlID0gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbiAgfVxuXG4gIC8vIEF0IHRoaXMgcG9pbnQgdGhlIHBhdGggc2hvdWxkIGJlIHJlc29sdmVkIHRvIGEgZnVsbCBhYnNvbHV0ZSBwYXRoLCBidXRcbiAgLy8gaGFuZGxlIHJlbGF0aXZlIHBhdGhzIHRvIGJlIHNhZmUgKG1pZ2h0IGhhcHBlbiB3aGVuIHByb2Nlc3MuY3dkKCkgZmFpbHMpXG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHJlc29sdmVkUGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihyZXNvbHZlZFBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhcmVzb2x2ZWRBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIHJldHVybiAoKHJlc29sdmVkQWJzb2x1dGUgPyAnLycgOiAnJykgKyByZXNvbHZlZFBhdGgpIHx8ICcuJztcbn07XG5cbi8vIHBhdGgubm9ybWFsaXplKHBhdGgpXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIGlzQWJzb2x1dGUgPSBleHBvcnRzLmlzQWJzb2x1dGUocGF0aCksXG4gICAgICB0cmFpbGluZ1NsYXNoID0gc3Vic3RyKHBhdGgsIC0xKSA9PT0gJy8nO1xuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICBwYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhaXNBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIGlmICghcGF0aCAmJiAhaXNBYnNvbHV0ZSkge1xuICAgIHBhdGggPSAnLic7XG4gIH1cbiAgaWYgKHBhdGggJiYgdHJhaWxpbmdTbGFzaCkge1xuICAgIHBhdGggKz0gJy8nO1xuICB9XG5cbiAgcmV0dXJuIChpc0Fic29sdXRlID8gJy8nIDogJycpICsgcGF0aDtcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuaXNBYnNvbHV0ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIHBhdGguY2hhckF0KDApID09PSAnLyc7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmpvaW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHBhdGhzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgcmV0dXJuIGV4cG9ydHMubm9ybWFsaXplKGZpbHRlcihwYXRocywgZnVuY3Rpb24ocCwgaW5kZXgpIHtcbiAgICBpZiAodHlwZW9mIHAgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5qb2luIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH1cbiAgICByZXR1cm4gcDtcbiAgfSkuam9pbignLycpKTtcbn07XG5cblxuLy8gcGF0aC5yZWxhdGl2ZShmcm9tLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVsYXRpdmUgPSBmdW5jdGlvbihmcm9tLCB0bykge1xuICBmcm9tID0gZXhwb3J0cy5yZXNvbHZlKGZyb20pLnN1YnN0cigxKTtcbiAgdG8gPSBleHBvcnRzLnJlc29sdmUodG8pLnN1YnN0cigxKTtcblxuICBmdW5jdGlvbiB0cmltKGFycikge1xuICAgIHZhciBzdGFydCA9IDA7XG4gICAgZm9yICg7IHN0YXJ0IDwgYXJyLmxlbmd0aDsgc3RhcnQrKykge1xuICAgICAgaWYgKGFycltzdGFydF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICB2YXIgZW5kID0gYXJyLmxlbmd0aCAtIDE7XG4gICAgZm9yICg7IGVuZCA+PSAwOyBlbmQtLSkge1xuICAgICAgaWYgKGFycltlbmRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0ID4gZW5kKSByZXR1cm4gW107XG4gICAgcmV0dXJuIGFyci5zbGljZShzdGFydCwgZW5kIC0gc3RhcnQgKyAxKTtcbiAgfVxuXG4gIHZhciBmcm9tUGFydHMgPSB0cmltKGZyb20uc3BsaXQoJy8nKSk7XG4gIHZhciB0b1BhcnRzID0gdHJpbSh0by5zcGxpdCgnLycpKTtcblxuICB2YXIgbGVuZ3RoID0gTWF0aC5taW4oZnJvbVBhcnRzLmxlbmd0aCwgdG9QYXJ0cy5sZW5ndGgpO1xuICB2YXIgc2FtZVBhcnRzTGVuZ3RoID0gbGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGZyb21QYXJ0c1tpXSAhPT0gdG9QYXJ0c1tpXSkge1xuICAgICAgc2FtZVBhcnRzTGVuZ3RoID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHZhciBvdXRwdXRQYXJ0cyA9IFtdO1xuICBmb3IgKHZhciBpID0gc2FtZVBhcnRzTGVuZ3RoOyBpIDwgZnJvbVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgb3V0cHV0UGFydHMucHVzaCgnLi4nKTtcbiAgfVxuXG4gIG91dHB1dFBhcnRzID0gb3V0cHV0UGFydHMuY29uY2F0KHRvUGFydHMuc2xpY2Uoc2FtZVBhcnRzTGVuZ3RoKSk7XG5cbiAgcmV0dXJuIG91dHB1dFBhcnRzLmpvaW4oJy8nKTtcbn07XG5cbmV4cG9ydHMuc2VwID0gJy8nO1xuZXhwb3J0cy5kZWxpbWl0ZXIgPSAnOic7XG5cbmV4cG9ydHMuZGlybmFtZSA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHBhdGggPSBwYXRoICsgJyc7XG4gIGlmIChwYXRoLmxlbmd0aCA9PT0gMCkgcmV0dXJuICcuJztcbiAgdmFyIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoMCk7XG4gIHZhciBoYXNSb290ID0gY29kZSA9PT0gNDcgLyovKi87XG4gIHZhciBlbmQgPSAtMTtcbiAgdmFyIG1hdGNoZWRTbGFzaCA9IHRydWU7XG4gIGZvciAodmFyIGkgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPj0gMTsgLS1pKSB7XG4gICAgY29kZSA9IHBhdGguY2hhckNvZGVBdChpKTtcbiAgICBpZiAoY29kZSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgaWYgKCFtYXRjaGVkU2xhc2gpIHtcbiAgICAgICAgICBlbmQgPSBpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgLy8gV2Ugc2F3IHRoZSBmaXJzdCBub24tcGF0aCBzZXBhcmF0b3JcbiAgICAgIG1hdGNoZWRTbGFzaCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGlmIChlbmQgPT09IC0xKSByZXR1cm4gaGFzUm9vdCA/ICcvJyA6ICcuJztcbiAgaWYgKGhhc1Jvb3QgJiYgZW5kID09PSAxKSB7XG4gICAgLy8gcmV0dXJuICcvLyc7XG4gICAgLy8gQmFja3dhcmRzLWNvbXBhdCBmaXg6XG4gICAgcmV0dXJuICcvJztcbiAgfVxuICByZXR1cm4gcGF0aC5zbGljZSgwLCBlbmQpO1xufTtcblxuZnVuY3Rpb24gYmFzZW5hbWUocGF0aCkge1xuICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSBwYXRoID0gcGF0aCArICcnO1xuXG4gIHZhciBzdGFydCA9IDA7XG4gIHZhciBlbmQgPSAtMTtcbiAgdmFyIG1hdGNoZWRTbGFzaCA9IHRydWU7XG4gIHZhciBpO1xuXG4gIGZvciAoaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICBpZiAocGF0aC5jaGFyQ29kZUF0KGkpID09PSA0NyAvKi8qLykge1xuICAgICAgICAvLyBJZiB3ZSByZWFjaGVkIGEgcGF0aCBzZXBhcmF0b3IgdGhhdCB3YXMgbm90IHBhcnQgb2YgYSBzZXQgb2YgcGF0aFxuICAgICAgICAvLyBzZXBhcmF0b3JzIGF0IHRoZSBlbmQgb2YgdGhlIHN0cmluZywgc3RvcCBub3dcbiAgICAgICAgaWYgKCFtYXRjaGVkU2xhc2gpIHtcbiAgICAgICAgICBzdGFydCA9IGkgKyAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGVuZCA9PT0gLTEpIHtcbiAgICAgIC8vIFdlIHNhdyB0aGUgZmlyc3Qgbm9uLXBhdGggc2VwYXJhdG9yLCBtYXJrIHRoaXMgYXMgdGhlIGVuZCBvZiBvdXJcbiAgICAgIC8vIHBhdGggY29tcG9uZW50XG4gICAgICBtYXRjaGVkU2xhc2ggPSBmYWxzZTtcbiAgICAgIGVuZCA9IGkgKyAxO1xuICAgIH1cbiAgfVxuXG4gIGlmIChlbmQgPT09IC0xKSByZXR1cm4gJyc7XG4gIHJldHVybiBwYXRoLnNsaWNlKHN0YXJ0LCBlbmQpO1xufVxuXG4vLyBVc2VzIGEgbWl4ZWQgYXBwcm9hY2ggZm9yIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5LCBhcyBleHQgYmVoYXZpb3IgY2hhbmdlZFxuLy8gaW4gbmV3IE5vZGUuanMgdmVyc2lvbnMsIHNvIG9ubHkgYmFzZW5hbWUoKSBhYm92ZSBpcyBiYWNrcG9ydGVkIGhlcmVcbmV4cG9ydHMuYmFzZW5hbWUgPSBmdW5jdGlvbiAocGF0aCwgZXh0KSB7XG4gIHZhciBmID0gYmFzZW5hbWUocGF0aCk7XG4gIGlmIChleHQgJiYgZi5zdWJzdHIoLTEgKiBleHQubGVuZ3RoKSA9PT0gZXh0KSB7XG4gICAgZiA9IGYuc3Vic3RyKDAsIGYubGVuZ3RoIC0gZXh0Lmxlbmd0aCk7XG4gIH1cbiAgcmV0dXJuIGY7XG59O1xuXG5leHBvcnRzLmV4dG5hbWUgPSBmdW5jdGlvbiAocGF0aCkge1xuICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSBwYXRoID0gcGF0aCArICcnO1xuICB2YXIgc3RhcnREb3QgPSAtMTtcbiAgdmFyIHN0YXJ0UGFydCA9IDA7XG4gIHZhciBlbmQgPSAtMTtcbiAgdmFyIG1hdGNoZWRTbGFzaCA9IHRydWU7XG4gIC8vIFRyYWNrIHRoZSBzdGF0ZSBvZiBjaGFyYWN0ZXJzIChpZiBhbnkpIHdlIHNlZSBiZWZvcmUgb3VyIGZpcnN0IGRvdCBhbmRcbiAgLy8gYWZ0ZXIgYW55IHBhdGggc2VwYXJhdG9yIHdlIGZpbmRcbiAgdmFyIHByZURvdFN0YXRlID0gMDtcbiAgZm9yICh2YXIgaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICB2YXIgY29kZSA9IHBhdGguY2hhckNvZGVBdChpKTtcbiAgICBpZiAoY29kZSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgLy8gSWYgd2UgcmVhY2hlZCBhIHBhdGggc2VwYXJhdG9yIHRoYXQgd2FzIG5vdCBwYXJ0IG9mIGEgc2V0IG9mIHBhdGhcbiAgICAgICAgLy8gc2VwYXJhdG9ycyBhdCB0aGUgZW5kIG9mIHRoZSBzdHJpbmcsIHN0b3Agbm93XG4gICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XG4gICAgICAgICAgc3RhcnRQYXJ0ID0gaSArIDE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgaWYgKGVuZCA9PT0gLTEpIHtcbiAgICAgIC8vIFdlIHNhdyB0aGUgZmlyc3Qgbm9uLXBhdGggc2VwYXJhdG9yLCBtYXJrIHRoaXMgYXMgdGhlIGVuZCBvZiBvdXJcbiAgICAgIC8vIGV4dGVuc2lvblxuICAgICAgbWF0Y2hlZFNsYXNoID0gZmFsc2U7XG4gICAgICBlbmQgPSBpICsgMTtcbiAgICB9XG4gICAgaWYgKGNvZGUgPT09IDQ2IC8qLiovKSB7XG4gICAgICAgIC8vIElmIHRoaXMgaXMgb3VyIGZpcnN0IGRvdCwgbWFyayBpdCBhcyB0aGUgc3RhcnQgb2Ygb3VyIGV4dGVuc2lvblxuICAgICAgICBpZiAoc3RhcnREb3QgPT09IC0xKVxuICAgICAgICAgIHN0YXJ0RG90ID0gaTtcbiAgICAgICAgZWxzZSBpZiAocHJlRG90U3RhdGUgIT09IDEpXG4gICAgICAgICAgcHJlRG90U3RhdGUgPSAxO1xuICAgIH0gZWxzZSBpZiAoc3RhcnREb3QgIT09IC0xKSB7XG4gICAgICAvLyBXZSBzYXcgYSBub24tZG90IGFuZCBub24tcGF0aCBzZXBhcmF0b3IgYmVmb3JlIG91ciBkb3QsIHNvIHdlIHNob3VsZFxuICAgICAgLy8gaGF2ZSBhIGdvb2QgY2hhbmNlIGF0IGhhdmluZyBhIG5vbi1lbXB0eSBleHRlbnNpb25cbiAgICAgIHByZURvdFN0YXRlID0gLTE7XG4gICAgfVxuICB9XG5cbiAgaWYgKHN0YXJ0RG90ID09PSAtMSB8fCBlbmQgPT09IC0xIHx8XG4gICAgICAvLyBXZSBzYXcgYSBub24tZG90IGNoYXJhY3RlciBpbW1lZGlhdGVseSBiZWZvcmUgdGhlIGRvdFxuICAgICAgcHJlRG90U3RhdGUgPT09IDAgfHxcbiAgICAgIC8vIFRoZSAocmlnaHQtbW9zdCkgdHJpbW1lZCBwYXRoIGNvbXBvbmVudCBpcyBleGFjdGx5ICcuLidcbiAgICAgIHByZURvdFN0YXRlID09PSAxICYmIHN0YXJ0RG90ID09PSBlbmQgLSAxICYmIHN0YXJ0RG90ID09PSBzdGFydFBhcnQgKyAxKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIHJldHVybiBwYXRoLnNsaWNlKHN0YXJ0RG90LCBlbmQpO1xufTtcblxuZnVuY3Rpb24gZmlsdGVyICh4cywgZikge1xuICAgIGlmICh4cy5maWx0ZXIpIHJldHVybiB4cy5maWx0ZXIoZik7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGYoeHNbaV0sIGksIHhzKSkgcmVzLnB1c2goeHNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG4vLyBTdHJpbmcucHJvdG90eXBlLnN1YnN0ciAtIG5lZ2F0aXZlIGluZGV4IGRvbid0IHdvcmsgaW4gSUU4XG52YXIgc3Vic3RyID0gJ2FiJy5zdWJzdHIoLTEpID09PSAnYidcbiAgICA/IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHsgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbikgfVxuICAgIDogZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IHN0ci5sZW5ndGggKyBzdGFydDtcbiAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbik7XG4gICAgfVxuO1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsInZhciB5dCA9IHJlcXVpcmUoJ2tpc3NmZnQtanMnKTtcbndpbmRvdy5raXNzID1yZXF1aXJlKCdraXNzZmZ0LWpzJyk7IFxuY29uc29sZS5sb2coeXQpO1xuIiwidmFyIEtpc3NGRlRNb2R1bGUgPSBmdW5jdGlvbihLaXNzRkZUTW9kdWxlKSB7XG4gIEtpc3NGRlRNb2R1bGUgPSBLaXNzRkZUTW9kdWxlIHx8IHt9O1xuICB2YXIgTW9kdWxlID0gS2lzc0ZGVE1vZHVsZTtcblxudmFyIE1vZHVsZTtpZighTW9kdWxlKU1vZHVsZT0odHlwZW9mIEtpc3NGRlRNb2R1bGUhPT1cInVuZGVmaW5lZFwiP0tpc3NGRlRNb2R1bGU6bnVsbCl8fHt9O3ZhciBtb2R1bGVPdmVycmlkZXM9e307Zm9yKHZhciBrZXkgaW4gTW9kdWxlKXtpZihNb2R1bGUuaGFzT3duUHJvcGVydHkoa2V5KSl7bW9kdWxlT3ZlcnJpZGVzW2tleV09TW9kdWxlW2tleV19fXZhciBFTlZJUk9OTUVOVF9JU19XRUI9ZmFsc2U7dmFyIEVOVklST05NRU5UX0lTX1dPUktFUj1mYWxzZTt2YXIgRU5WSVJPTk1FTlRfSVNfTk9ERT1mYWxzZTt2YXIgRU5WSVJPTk1FTlRfSVNfU0hFTEw9ZmFsc2U7aWYoTW9kdWxlW1wiRU5WSVJPTk1FTlRcIl0pe2lmKE1vZHVsZVtcIkVOVklST05NRU5UXCJdPT09XCJXRUJcIil7RU5WSVJPTk1FTlRfSVNfV0VCPXRydWV9ZWxzZSBpZihNb2R1bGVbXCJFTlZJUk9OTUVOVFwiXT09PVwiV09SS0VSXCIpe0VOVklST05NRU5UX0lTX1dPUktFUj10cnVlfWVsc2UgaWYoTW9kdWxlW1wiRU5WSVJPTk1FTlRcIl09PT1cIk5PREVcIil7RU5WSVJPTk1FTlRfSVNfTk9ERT10cnVlfWVsc2UgaWYoTW9kdWxlW1wiRU5WSVJPTk1FTlRcIl09PT1cIlNIRUxMXCIpe0VOVklST05NRU5UX0lTX1NIRUxMPXRydWV9ZWxzZXt0aHJvdyBuZXcgRXJyb3IoXCJUaGUgcHJvdmlkZWQgTW9kdWxlWydFTlZJUk9OTUVOVCddIHZhbHVlIGlzIG5vdCB2YWxpZC4gSXQgbXVzdCBiZSBvbmUgb2Y6IFdFQnxXT1JLRVJ8Tk9ERXxTSEVMTC5cIil9fWVsc2V7RU5WSVJPTk1FTlRfSVNfV0VCPXR5cGVvZiB3aW5kb3c9PT1cIm9iamVjdFwiO0VOVklST05NRU5UX0lTX1dPUktFUj10eXBlb2YgaW1wb3J0U2NyaXB0cz09PVwiZnVuY3Rpb25cIjtFTlZJUk9OTUVOVF9JU19OT0RFPXR5cGVvZiBwcm9jZXNzPT09XCJvYmplY3RcIiYmdHlwZW9mIHJlcXVpcmU9PT1cImZ1bmN0aW9uXCImJiFFTlZJUk9OTUVOVF9JU19XRUImJiFFTlZJUk9OTUVOVF9JU19XT1JLRVI7RU5WSVJPTk1FTlRfSVNfU0hFTEw9IUVOVklST05NRU5UX0lTX1dFQiYmIUVOVklST05NRU5UX0lTX05PREUmJiFFTlZJUk9OTUVOVF9JU19XT1JLRVJ9aWYoRU5WSVJPTk1FTlRfSVNfTk9ERSl7aWYoIU1vZHVsZVtcInByaW50XCJdKU1vZHVsZVtcInByaW50XCJdPWNvbnNvbGUubG9nO2lmKCFNb2R1bGVbXCJwcmludEVyclwiXSlNb2R1bGVbXCJwcmludEVyclwiXT1jb25zb2xlLndhcm47dmFyIG5vZGVGUzt2YXIgbm9kZVBhdGg7TW9kdWxlW1wicmVhZFwiXT1mdW5jdGlvbiBzaGVsbF9yZWFkKGZpbGVuYW1lLGJpbmFyeSl7aWYoIW5vZGVGUylub2RlRlM9cmVxdWlyZShcImZzXCIpO2lmKCFub2RlUGF0aClub2RlUGF0aD1yZXF1aXJlKFwicGF0aFwiKTtmaWxlbmFtZT1ub2RlUGF0aFtcIm5vcm1hbGl6ZVwiXShmaWxlbmFtZSk7dmFyIHJldD1ub2RlRlNbXCJyZWFkRmlsZVN5bmNcIl0oZmlsZW5hbWUpO3JldHVybiBiaW5hcnk/cmV0OnJldC50b1N0cmluZygpfTtNb2R1bGVbXCJyZWFkQmluYXJ5XCJdPWZ1bmN0aW9uIHJlYWRCaW5hcnkoZmlsZW5hbWUpe3ZhciByZXQ9TW9kdWxlW1wicmVhZFwiXShmaWxlbmFtZSx0cnVlKTtpZighcmV0LmJ1ZmZlcil7cmV0PW5ldyBVaW50OEFycmF5KHJldCl9YXNzZXJ0KHJldC5idWZmZXIpO3JldHVybiByZXR9O01vZHVsZVtcImxvYWRcIl09ZnVuY3Rpb24gbG9hZChmKXtnbG9iYWxFdmFsKHJlYWQoZikpfTtpZighTW9kdWxlW1widGhpc1Byb2dyYW1cIl0pe2lmKHByb2Nlc3NbXCJhcmd2XCJdLmxlbmd0aD4xKXtNb2R1bGVbXCJ0aGlzUHJvZ3JhbVwiXT1wcm9jZXNzW1wiYXJndlwiXVsxXS5yZXBsYWNlKC9cXFxcL2csXCIvXCIpfWVsc2V7TW9kdWxlW1widGhpc1Byb2dyYW1cIl09XCJ1bmtub3duLXByb2dyYW1cIn19TW9kdWxlW1wiYXJndW1lbnRzXCJdPXByb2Nlc3NbXCJhcmd2XCJdLnNsaWNlKDIpO3Byb2Nlc3NbXCJvblwiXShcInVuY2F1Z2h0RXhjZXB0aW9uXCIsKGZ1bmN0aW9uKGV4KXtpZighKGV4IGluc3RhbmNlb2YgRXhpdFN0YXR1cykpe3Rocm93IGV4fX0pKTtNb2R1bGVbXCJpbnNwZWN0XCJdPShmdW5jdGlvbigpe3JldHVyblwiW0Vtc2NyaXB0ZW4gTW9kdWxlIG9iamVjdF1cIn0pfWVsc2UgaWYoRU5WSVJPTk1FTlRfSVNfU0hFTEwpe2lmKCFNb2R1bGVbXCJwcmludFwiXSlNb2R1bGVbXCJwcmludFwiXT1wcmludDtpZih0eXBlb2YgcHJpbnRFcnIhPVwidW5kZWZpbmVkXCIpTW9kdWxlW1wicHJpbnRFcnJcIl09cHJpbnRFcnI7aWYodHlwZW9mIHJlYWQhPVwidW5kZWZpbmVkXCIpe01vZHVsZVtcInJlYWRcIl09cmVhZH1lbHNle01vZHVsZVtcInJlYWRcIl09ZnVuY3Rpb24gc2hlbGxfcmVhZCgpe3Rocm93XCJubyByZWFkKCkgYXZhaWxhYmxlXCJ9fU1vZHVsZVtcInJlYWRCaW5hcnlcIl09ZnVuY3Rpb24gcmVhZEJpbmFyeShmKXtpZih0eXBlb2YgcmVhZGJ1ZmZlcj09PVwiZnVuY3Rpb25cIil7cmV0dXJuIG5ldyBVaW50OEFycmF5KHJlYWRidWZmZXIoZikpfXZhciBkYXRhPXJlYWQoZixcImJpbmFyeVwiKTthc3NlcnQodHlwZW9mIGRhdGE9PT1cIm9iamVjdFwiKTtyZXR1cm4gZGF0YX07aWYodHlwZW9mIHNjcmlwdEFyZ3MhPVwidW5kZWZpbmVkXCIpe01vZHVsZVtcImFyZ3VtZW50c1wiXT1zY3JpcHRBcmdzfWVsc2UgaWYodHlwZW9mIGFyZ3VtZW50cyE9XCJ1bmRlZmluZWRcIil7TW9kdWxlW1wiYXJndW1lbnRzXCJdPWFyZ3VtZW50c31pZih0eXBlb2YgcXVpdD09PVwiZnVuY3Rpb25cIil7TW9kdWxlW1wicXVpdFwiXT0oZnVuY3Rpb24oc3RhdHVzLHRvVGhyb3cpe3F1aXQoc3RhdHVzKX0pfX1lbHNlIGlmKEVOVklST05NRU5UX0lTX1dFQnx8RU5WSVJPTk1FTlRfSVNfV09SS0VSKXtNb2R1bGVbXCJyZWFkXCJdPWZ1bmN0aW9uIHNoZWxsX3JlYWQodXJsKXt2YXIgeGhyPW5ldyBYTUxIdHRwUmVxdWVzdDt4aHIub3BlbihcIkdFVFwiLHVybCxmYWxzZSk7eGhyLnNlbmQobnVsbCk7cmV0dXJuIHhoci5yZXNwb25zZVRleHR9O2lmKEVOVklST05NRU5UX0lTX1dPUktFUil7TW9kdWxlW1wicmVhZEJpbmFyeVwiXT1mdW5jdGlvbiByZWFkQmluYXJ5KHVybCl7dmFyIHhocj1uZXcgWE1MSHR0cFJlcXVlc3Q7eGhyLm9wZW4oXCJHRVRcIix1cmwsZmFsc2UpO3hoci5yZXNwb25zZVR5cGU9XCJhcnJheWJ1ZmZlclwiO3hoci5zZW5kKG51bGwpO3JldHVybiBuZXcgVWludDhBcnJheSh4aHIucmVzcG9uc2UpfX1Nb2R1bGVbXCJyZWFkQXN5bmNcIl09ZnVuY3Rpb24gcmVhZEFzeW5jKHVybCxvbmxvYWQsb25lcnJvcil7dmFyIHhocj1uZXcgWE1MSHR0cFJlcXVlc3Q7eGhyLm9wZW4oXCJHRVRcIix1cmwsdHJ1ZSk7eGhyLnJlc3BvbnNlVHlwZT1cImFycmF5YnVmZmVyXCI7eGhyLm9ubG9hZD1mdW5jdGlvbiB4aHJfb25sb2FkKCl7aWYoeGhyLnN0YXR1cz09MjAwfHx4aHIuc3RhdHVzPT0wJiZ4aHIucmVzcG9uc2Upe29ubG9hZCh4aHIucmVzcG9uc2UpfWVsc2V7b25lcnJvcigpfX07eGhyLm9uZXJyb3I9b25lcnJvcjt4aHIuc2VuZChudWxsKX07aWYodHlwZW9mIGFyZ3VtZW50cyE9XCJ1bmRlZmluZWRcIil7TW9kdWxlW1wiYXJndW1lbnRzXCJdPWFyZ3VtZW50c31pZih0eXBlb2YgY29uc29sZSE9PVwidW5kZWZpbmVkXCIpe2lmKCFNb2R1bGVbXCJwcmludFwiXSlNb2R1bGVbXCJwcmludFwiXT1mdW5jdGlvbiBzaGVsbF9wcmludCh4KXtjb25zb2xlLmxvZyh4KX07aWYoIU1vZHVsZVtcInByaW50RXJyXCJdKU1vZHVsZVtcInByaW50RXJyXCJdPWZ1bmN0aW9uIHNoZWxsX3ByaW50RXJyKHgpe2NvbnNvbGUud2Fybih4KX19ZWxzZXt2YXIgVFJZX1VTRV9EVU1QPWZhbHNlO2lmKCFNb2R1bGVbXCJwcmludFwiXSlNb2R1bGVbXCJwcmludFwiXT1UUllfVVNFX0RVTVAmJnR5cGVvZiBkdW1wIT09XCJ1bmRlZmluZWRcIj8oZnVuY3Rpb24oeCl7ZHVtcCh4KX0pOihmdW5jdGlvbih4KXt9KX1pZihFTlZJUk9OTUVOVF9JU19XT1JLRVIpe01vZHVsZVtcImxvYWRcIl09aW1wb3J0U2NyaXB0c31pZih0eXBlb2YgTW9kdWxlW1wic2V0V2luZG93VGl0bGVcIl09PT1cInVuZGVmaW5lZFwiKXtNb2R1bGVbXCJzZXRXaW5kb3dUaXRsZVwiXT0oZnVuY3Rpb24odGl0bGUpe2RvY3VtZW50LnRpdGxlPXRpdGxlfSl9fWVsc2V7dGhyb3dcIlVua25vd24gcnVudGltZSBlbnZpcm9ubWVudC4gV2hlcmUgYXJlIHdlP1wifWZ1bmN0aW9uIGdsb2JhbEV2YWwoeCl7ZXZhbC5jYWxsKG51bGwseCl9aWYoIU1vZHVsZVtcImxvYWRcIl0mJk1vZHVsZVtcInJlYWRcIl0pe01vZHVsZVtcImxvYWRcIl09ZnVuY3Rpb24gbG9hZChmKXtnbG9iYWxFdmFsKE1vZHVsZVtcInJlYWRcIl0oZikpfX1pZighTW9kdWxlW1wicHJpbnRcIl0pe01vZHVsZVtcInByaW50XCJdPShmdW5jdGlvbigpe30pfWlmKCFNb2R1bGVbXCJwcmludEVyclwiXSl7TW9kdWxlW1wicHJpbnRFcnJcIl09TW9kdWxlW1wicHJpbnRcIl19aWYoIU1vZHVsZVtcImFyZ3VtZW50c1wiXSl7TW9kdWxlW1wiYXJndW1lbnRzXCJdPVtdfWlmKCFNb2R1bGVbXCJ0aGlzUHJvZ3JhbVwiXSl7TW9kdWxlW1widGhpc1Byb2dyYW1cIl09XCIuL3RoaXMucHJvZ3JhbVwifWlmKCFNb2R1bGVbXCJxdWl0XCJdKXtNb2R1bGVbXCJxdWl0XCJdPShmdW5jdGlvbihzdGF0dXMsdG9UaHJvdyl7dGhyb3cgdG9UaHJvd30pfU1vZHVsZS5wcmludD1Nb2R1bGVbXCJwcmludFwiXTtNb2R1bGUucHJpbnRFcnI9TW9kdWxlW1wicHJpbnRFcnJcIl07TW9kdWxlW1wicHJlUnVuXCJdPVtdO01vZHVsZVtcInBvc3RSdW5cIl09W107Zm9yKHZhciBrZXkgaW4gbW9kdWxlT3ZlcnJpZGVzKXtpZihtb2R1bGVPdmVycmlkZXMuaGFzT3duUHJvcGVydHkoa2V5KSl7TW9kdWxlW2tleV09bW9kdWxlT3ZlcnJpZGVzW2tleV19fW1vZHVsZU92ZXJyaWRlcz11bmRlZmluZWQ7dmFyIFJ1bnRpbWU9e3NldFRlbXBSZXQwOihmdW5jdGlvbih2YWx1ZSl7dGVtcFJldDA9dmFsdWU7cmV0dXJuIHZhbHVlfSksZ2V0VGVtcFJldDA6KGZ1bmN0aW9uKCl7cmV0dXJuIHRlbXBSZXQwfSksc3RhY2tTYXZlOihmdW5jdGlvbigpe3JldHVybiBTVEFDS1RPUH0pLHN0YWNrUmVzdG9yZTooZnVuY3Rpb24oc3RhY2tUb3Ape1NUQUNLVE9QPXN0YWNrVG9wfSksZ2V0TmF0aXZlVHlwZVNpemU6KGZ1bmN0aW9uKHR5cGUpe3N3aXRjaCh0eXBlKXtjYXNlXCJpMVwiOmNhc2VcImk4XCI6cmV0dXJuIDE7Y2FzZVwiaTE2XCI6cmV0dXJuIDI7Y2FzZVwiaTMyXCI6cmV0dXJuIDQ7Y2FzZVwiaTY0XCI6cmV0dXJuIDg7Y2FzZVwiZmxvYXRcIjpyZXR1cm4gNDtjYXNlXCJkb3VibGVcIjpyZXR1cm4gODtkZWZhdWx0OntpZih0eXBlW3R5cGUubGVuZ3RoLTFdPT09XCIqXCIpe3JldHVybiBSdW50aW1lLlFVQU5UVU1fU0laRX1lbHNlIGlmKHR5cGVbMF09PT1cImlcIil7dmFyIGJpdHM9cGFyc2VJbnQodHlwZS5zdWJzdHIoMSkpO2Fzc2VydChiaXRzJTg9PT0wKTtyZXR1cm4gYml0cy84fWVsc2V7cmV0dXJuIDB9fX19KSxnZXROYXRpdmVGaWVsZFNpemU6KGZ1bmN0aW9uKHR5cGUpe3JldHVybiBNYXRoLm1heChSdW50aW1lLmdldE5hdGl2ZVR5cGVTaXplKHR5cGUpLFJ1bnRpbWUuUVVBTlRVTV9TSVpFKX0pLFNUQUNLX0FMSUdOOjE2LHByZXBWYXJhcmc6KGZ1bmN0aW9uKHB0cix0eXBlKXtpZih0eXBlPT09XCJkb3VibGVcInx8dHlwZT09PVwiaTY0XCIpe2lmKHB0ciY3KXthc3NlcnQoKHB0ciY3KT09PTQpO3B0cis9NH19ZWxzZXthc3NlcnQoKHB0ciYzKT09PTApfXJldHVybiBwdHJ9KSxnZXRBbGlnblNpemU6KGZ1bmN0aW9uKHR5cGUsc2l6ZSx2YXJhcmcpe2lmKCF2YXJhcmcmJih0eXBlPT1cImk2NFwifHx0eXBlPT1cImRvdWJsZVwiKSlyZXR1cm4gODtpZighdHlwZSlyZXR1cm4gTWF0aC5taW4oc2l6ZSw4KTtyZXR1cm4gTWF0aC5taW4oc2l6ZXx8KHR5cGU/UnVudGltZS5nZXROYXRpdmVGaWVsZFNpemUodHlwZSk6MCksUnVudGltZS5RVUFOVFVNX1NJWkUpfSksZHluQ2FsbDooZnVuY3Rpb24oc2lnLHB0cixhcmdzKXtpZihhcmdzJiZhcmdzLmxlbmd0aCl7cmV0dXJuIE1vZHVsZVtcImR5bkNhbGxfXCIrc2lnXS5hcHBseShudWxsLFtwdHJdLmNvbmNhdChhcmdzKSl9ZWxzZXtyZXR1cm4gTW9kdWxlW1wiZHluQ2FsbF9cIitzaWddLmNhbGwobnVsbCxwdHIpfX0pLGZ1bmN0aW9uUG9pbnRlcnM6W10sYWRkRnVuY3Rpb246KGZ1bmN0aW9uKGZ1bmMpe2Zvcih2YXIgaT0wO2k8UnVudGltZS5mdW5jdGlvblBvaW50ZXJzLmxlbmd0aDtpKyspe2lmKCFSdW50aW1lLmZ1bmN0aW9uUG9pbnRlcnNbaV0pe1J1bnRpbWUuZnVuY3Rpb25Qb2ludGVyc1tpXT1mdW5jO3JldHVybiAyKigxK2kpfX10aHJvd1wiRmluaXNoZWQgdXAgYWxsIHJlc2VydmVkIGZ1bmN0aW9uIHBvaW50ZXJzLiBVc2UgYSBoaWdoZXIgdmFsdWUgZm9yIFJFU0VSVkVEX0ZVTkNUSU9OX1BPSU5URVJTLlwifSkscmVtb3ZlRnVuY3Rpb246KGZ1bmN0aW9uKGluZGV4KXtSdW50aW1lLmZ1bmN0aW9uUG9pbnRlcnNbKGluZGV4LTIpLzJdPW51bGx9KSx3YXJuT25jZTooZnVuY3Rpb24odGV4dCl7aWYoIVJ1bnRpbWUud2Fybk9uY2Uuc2hvd24pUnVudGltZS53YXJuT25jZS5zaG93bj17fTtpZighUnVudGltZS53YXJuT25jZS5zaG93blt0ZXh0XSl7UnVudGltZS53YXJuT25jZS5zaG93blt0ZXh0XT0xO01vZHVsZS5wcmludEVycih0ZXh0KX19KSxmdW5jV3JhcHBlcnM6e30sZ2V0RnVuY1dyYXBwZXI6KGZ1bmN0aW9uKGZ1bmMsc2lnKXtpZighZnVuYylyZXR1cm47YXNzZXJ0KHNpZyk7aWYoIVJ1bnRpbWUuZnVuY1dyYXBwZXJzW3NpZ10pe1J1bnRpbWUuZnVuY1dyYXBwZXJzW3NpZ109e319dmFyIHNpZ0NhY2hlPVJ1bnRpbWUuZnVuY1dyYXBwZXJzW3NpZ107aWYoIXNpZ0NhY2hlW2Z1bmNdKXtpZihzaWcubGVuZ3RoPT09MSl7c2lnQ2FjaGVbZnVuY109ZnVuY3Rpb24gZHluQ2FsbF93cmFwcGVyKCl7cmV0dXJuIFJ1bnRpbWUuZHluQ2FsbChzaWcsZnVuYyl9fWVsc2UgaWYoc2lnLmxlbmd0aD09PTIpe3NpZ0NhY2hlW2Z1bmNdPWZ1bmN0aW9uIGR5bkNhbGxfd3JhcHBlcihhcmcpe3JldHVybiBSdW50aW1lLmR5bkNhbGwoc2lnLGZ1bmMsW2FyZ10pfX1lbHNle3NpZ0NhY2hlW2Z1bmNdPWZ1bmN0aW9uIGR5bkNhbGxfd3JhcHBlcigpe3JldHVybiBSdW50aW1lLmR5bkNhbGwoc2lnLGZ1bmMsQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSl9fX1yZXR1cm4gc2lnQ2FjaGVbZnVuY119KSxnZXRDb21waWxlclNldHRpbmc6KGZ1bmN0aW9uKG5hbWUpe3Rocm93XCJZb3UgbXVzdCBidWlsZCB3aXRoIC1zIFJFVEFJTl9DT01QSUxFUl9TRVRUSU5HUz0xIGZvciBSdW50aW1lLmdldENvbXBpbGVyU2V0dGluZyBvciBlbXNjcmlwdGVuX2dldF9jb21waWxlcl9zZXR0aW5nIHRvIHdvcmtcIn0pLHN0YWNrQWxsb2M6KGZ1bmN0aW9uKHNpemUpe3ZhciByZXQ9U1RBQ0tUT1A7U1RBQ0tUT1A9U1RBQ0tUT1Arc2l6ZXwwO1NUQUNLVE9QPVNUQUNLVE9QKzE1Ji0xNjtyZXR1cm4gcmV0fSksc3RhdGljQWxsb2M6KGZ1bmN0aW9uKHNpemUpe3ZhciByZXQ9U1RBVElDVE9QO1NUQVRJQ1RPUD1TVEFUSUNUT1Arc2l6ZXwwO1NUQVRJQ1RPUD1TVEFUSUNUT1ArMTUmLTE2O3JldHVybiByZXR9KSxkeW5hbWljQWxsb2M6KGZ1bmN0aW9uKHNpemUpe3ZhciByZXQ9SEVBUDMyW0RZTkFNSUNUT1BfUFRSPj4yXTt2YXIgZW5kPShyZXQrc2l6ZSsxNXwwKSYtMTY7SEVBUDMyW0RZTkFNSUNUT1BfUFRSPj4yXT1lbmQ7aWYoZW5kPj1UT1RBTF9NRU1PUlkpe3ZhciBzdWNjZXNzPWVubGFyZ2VNZW1vcnkoKTtpZighc3VjY2Vzcyl7SEVBUDMyW0RZTkFNSUNUT1BfUFRSPj4yXT1yZXQ7cmV0dXJuIDB9fXJldHVybiByZXR9KSxhbGlnbk1lbW9yeTooZnVuY3Rpb24oc2l6ZSxxdWFudHVtKXt2YXIgcmV0PXNpemU9TWF0aC5jZWlsKHNpemUvKHF1YW50dW0/cXVhbnR1bToxNikpKihxdWFudHVtP3F1YW50dW06MTYpO3JldHVybiByZXR9KSxtYWtlQmlnSW50OihmdW5jdGlvbihsb3csaGlnaCx1bnNpZ25lZCl7dmFyIHJldD11bnNpZ25lZD8rKGxvdz4+PjApKyArKGhpZ2g+Pj4wKSorNDI5NDk2NzI5NjorKGxvdz4+PjApKyArKGhpZ2h8MCkqKzQyOTQ5NjcyOTY7cmV0dXJuIHJldH0pLEdMT0JBTF9CQVNFOjgsUVVBTlRVTV9TSVpFOjQsX19kdW1teV9fOjB9O01vZHVsZVtcIlJ1bnRpbWVcIl09UnVudGltZTt2YXIgQUJPUlQ9MDt2YXIgRVhJVFNUQVRVUz0wO2Z1bmN0aW9uIGFzc2VydChjb25kaXRpb24sdGV4dCl7aWYoIWNvbmRpdGlvbil7YWJvcnQoXCJBc3NlcnRpb24gZmFpbGVkOiBcIit0ZXh0KX19ZnVuY3Rpb24gZ2V0Q0Z1bmMoaWRlbnQpe3ZhciBmdW5jPU1vZHVsZVtcIl9cIitpZGVudF07aWYoIWZ1bmMpe3RyeXtmdW5jPWV2YWwoXCJfXCIraWRlbnQpfWNhdGNoKGUpe319YXNzZXJ0KGZ1bmMsXCJDYW5ub3QgY2FsbCB1bmtub3duIGZ1bmN0aW9uIFwiK2lkZW50K1wiIChwZXJoYXBzIExMVk0gb3B0aW1pemF0aW9ucyBvciBjbG9zdXJlIHJlbW92ZWQgaXQ/KVwiKTtyZXR1cm4gZnVuY312YXIgY3dyYXAsY2NhbGw7KChmdW5jdGlvbigpe3ZhciBKU2Z1bmNzPXtcInN0YWNrU2F2ZVwiOihmdW5jdGlvbigpe1J1bnRpbWUuc3RhY2tTYXZlKCl9KSxcInN0YWNrUmVzdG9yZVwiOihmdW5jdGlvbigpe1J1bnRpbWUuc3RhY2tSZXN0b3JlKCl9KSxcImFycmF5VG9DXCI6KGZ1bmN0aW9uKGFycil7dmFyIHJldD1SdW50aW1lLnN0YWNrQWxsb2MoYXJyLmxlbmd0aCk7d3JpdGVBcnJheVRvTWVtb3J5KGFycixyZXQpO3JldHVybiByZXR9KSxcInN0cmluZ1RvQ1wiOihmdW5jdGlvbihzdHIpe3ZhciByZXQ9MDtpZihzdHIhPT1udWxsJiZzdHIhPT11bmRlZmluZWQmJnN0ciE9PTApe3ZhciBsZW49KHN0ci5sZW5ndGg8PDIpKzE7cmV0PVJ1bnRpbWUuc3RhY2tBbGxvYyhsZW4pO3N0cmluZ1RvVVRGOChzdHIscmV0LGxlbil9cmV0dXJuIHJldH0pfTt2YXIgdG9DPXtcInN0cmluZ1wiOkpTZnVuY3NbXCJzdHJpbmdUb0NcIl0sXCJhcnJheVwiOkpTZnVuY3NbXCJhcnJheVRvQ1wiXX07Y2NhbGw9ZnVuY3Rpb24gY2NhbGxGdW5jKGlkZW50LHJldHVyblR5cGUsYXJnVHlwZXMsYXJncyxvcHRzKXt2YXIgZnVuYz1nZXRDRnVuYyhpZGVudCk7dmFyIGNBcmdzPVtdO3ZhciBzdGFjaz0wO2lmKGFyZ3Mpe2Zvcih2YXIgaT0wO2k8YXJncy5sZW5ndGg7aSsrKXt2YXIgY29udmVydGVyPXRvQ1thcmdUeXBlc1tpXV07aWYoY29udmVydGVyKXtpZihzdGFjaz09PTApc3RhY2s9UnVudGltZS5zdGFja1NhdmUoKTtjQXJnc1tpXT1jb252ZXJ0ZXIoYXJnc1tpXSl9ZWxzZXtjQXJnc1tpXT1hcmdzW2ldfX19dmFyIHJldD1mdW5jLmFwcGx5KG51bGwsY0FyZ3MpO2lmKHJldHVyblR5cGU9PT1cInN0cmluZ1wiKXJldD1Qb2ludGVyX3N0cmluZ2lmeShyZXQpO2lmKHN0YWNrIT09MCl7aWYob3B0cyYmb3B0cy5hc3luYyl7RW10ZXJwcmV0ZXJBc3luYy5hc3luY0ZpbmFsaXplcnMucHVzaCgoZnVuY3Rpb24oKXtSdW50aW1lLnN0YWNrUmVzdG9yZShzdGFjayl9KSk7cmV0dXJufVJ1bnRpbWUuc3RhY2tSZXN0b3JlKHN0YWNrKX1yZXR1cm4gcmV0fTt2YXIgc291cmNlUmVnZXg9L15mdW5jdGlvblxccypbYS16QS1aJF8wLTldKlxccypcXCgoW14pXSopXFwpXFxzKntcXHMqKFteKl0qPylbXFxzO10qKD86cmV0dXJuXFxzKiguKj8pWztcXHNdKik/fSQvO2Z1bmN0aW9uIHBhcnNlSlNGdW5jKGpzZnVuYyl7dmFyIHBhcnNlZD1qc2Z1bmMudG9TdHJpbmcoKS5tYXRjaChzb3VyY2VSZWdleCkuc2xpY2UoMSk7cmV0dXJue2FyZ3VtZW50czpwYXJzZWRbMF0sYm9keTpwYXJzZWRbMV0scmV0dXJuVmFsdWU6cGFyc2VkWzJdfX12YXIgSlNzb3VyY2U9bnVsbDtmdW5jdGlvbiBlbnN1cmVKU3NvdXJjZSgpe2lmKCFKU3NvdXJjZSl7SlNzb3VyY2U9e307Zm9yKHZhciBmdW4gaW4gSlNmdW5jcyl7aWYoSlNmdW5jcy5oYXNPd25Qcm9wZXJ0eShmdW4pKXtKU3NvdXJjZVtmdW5dPXBhcnNlSlNGdW5jKEpTZnVuY3NbZnVuXSl9fX19Y3dyYXA9ZnVuY3Rpb24gY3dyYXAoaWRlbnQscmV0dXJuVHlwZSxhcmdUeXBlcyl7YXJnVHlwZXM9YXJnVHlwZXN8fFtdO3ZhciBjZnVuYz1nZXRDRnVuYyhpZGVudCk7dmFyIG51bWVyaWNBcmdzPWFyZ1R5cGVzLmV2ZXJ5KChmdW5jdGlvbih0eXBlKXtyZXR1cm4gdHlwZT09PVwibnVtYmVyXCJ9KSk7dmFyIG51bWVyaWNSZXQ9cmV0dXJuVHlwZSE9PVwic3RyaW5nXCI7aWYobnVtZXJpY1JldCYmbnVtZXJpY0FyZ3Mpe3JldHVybiBjZnVuY312YXIgYXJnTmFtZXM9YXJnVHlwZXMubWFwKChmdW5jdGlvbih4LGkpe3JldHVyblwiJFwiK2l9KSk7dmFyIGZ1bmNzdHI9XCIoZnVuY3Rpb24oXCIrYXJnTmFtZXMuam9pbihcIixcIikrXCIpIHtcIjt2YXIgbmFyZ3M9YXJnVHlwZXMubGVuZ3RoO2lmKCFudW1lcmljQXJncyl7ZW5zdXJlSlNzb3VyY2UoKTtmdW5jc3RyKz1cInZhciBzdGFjayA9IFwiK0pTc291cmNlW1wic3RhY2tTYXZlXCJdLmJvZHkrXCI7XCI7Zm9yKHZhciBpPTA7aTxuYXJncztpKyspe3ZhciBhcmc9YXJnTmFtZXNbaV0sdHlwZT1hcmdUeXBlc1tpXTtpZih0eXBlPT09XCJudW1iZXJcIiljb250aW51ZTt2YXIgY29udmVydENvZGU9SlNzb3VyY2VbdHlwZStcIlRvQ1wiXTtmdW5jc3RyKz1cInZhciBcIitjb252ZXJ0Q29kZS5hcmd1bWVudHMrXCIgPSBcIithcmcrXCI7XCI7ZnVuY3N0cis9Y29udmVydENvZGUuYm9keStcIjtcIjtmdW5jc3RyKz1hcmcrXCI9KFwiK2NvbnZlcnRDb2RlLnJldHVyblZhbHVlK1wiKTtcIn19dmFyIGNmdW5jbmFtZT1wYXJzZUpTRnVuYygoZnVuY3Rpb24oKXtyZXR1cm4gY2Z1bmN9KSkucmV0dXJuVmFsdWU7ZnVuY3N0cis9XCJ2YXIgcmV0ID0gXCIrY2Z1bmNuYW1lK1wiKFwiK2FyZ05hbWVzLmpvaW4oXCIsXCIpK1wiKTtcIjtpZighbnVtZXJpY1JldCl7dmFyIHN0cmdmeT1wYXJzZUpTRnVuYygoZnVuY3Rpb24oKXtyZXR1cm4gUG9pbnRlcl9zdHJpbmdpZnl9KSkucmV0dXJuVmFsdWU7ZnVuY3N0cis9XCJyZXQgPSBcIitzdHJnZnkrXCIocmV0KTtcIn1pZighbnVtZXJpY0FyZ3Mpe2Vuc3VyZUpTc291cmNlKCk7ZnVuY3N0cis9SlNzb3VyY2VbXCJzdGFja1Jlc3RvcmVcIl0uYm9keS5yZXBsYWNlKFwiKClcIixcIihzdGFjaylcIikrXCI7XCJ9ZnVuY3N0cis9XCJyZXR1cm4gcmV0fSlcIjtyZXR1cm4gZXZhbChmdW5jc3RyKX19KSkoKTtNb2R1bGVbXCJjY2FsbFwiXT1jY2FsbDtNb2R1bGVbXCJjd3JhcFwiXT1jd3JhcDtmdW5jdGlvbiBzZXRWYWx1ZShwdHIsdmFsdWUsdHlwZSxub1NhZmUpe3R5cGU9dHlwZXx8XCJpOFwiO2lmKHR5cGUuY2hhckF0KHR5cGUubGVuZ3RoLTEpPT09XCIqXCIpdHlwZT1cImkzMlwiO3N3aXRjaCh0eXBlKXtjYXNlXCJpMVwiOkhFQVA4W3B0cj4+MF09dmFsdWU7YnJlYWs7Y2FzZVwiaThcIjpIRUFQOFtwdHI+PjBdPXZhbHVlO2JyZWFrO2Nhc2VcImkxNlwiOkhFQVAxNltwdHI+PjFdPXZhbHVlO2JyZWFrO2Nhc2VcImkzMlwiOkhFQVAzMltwdHI+PjJdPXZhbHVlO2JyZWFrO2Nhc2VcImk2NFwiOnRlbXBJNjQ9W3ZhbHVlPj4+MCwodGVtcERvdWJsZT12YWx1ZSwrTWF0aF9hYnModGVtcERvdWJsZSk+PSsxP3RlbXBEb3VibGU+KzA/KE1hdGhfbWluKCtNYXRoX2Zsb29yKHRlbXBEb3VibGUvKzQyOTQ5NjcyOTYpLCs0Mjk0OTY3Mjk1KXwwKT4+PjA6fn4rTWF0aF9jZWlsKCh0ZW1wRG91YmxlLSArKH5+dGVtcERvdWJsZT4+PjApKS8rNDI5NDk2NzI5Nik+Pj4wOjApXSxIRUFQMzJbcHRyPj4yXT10ZW1wSTY0WzBdLEhFQVAzMltwdHIrND4+Ml09dGVtcEk2NFsxXTticmVhaztjYXNlXCJmbG9hdFwiOkhFQVBGMzJbcHRyPj4yXT12YWx1ZTticmVhaztjYXNlXCJkb3VibGVcIjpIRUFQRjY0W3B0cj4+M109dmFsdWU7YnJlYWs7ZGVmYXVsdDphYm9ydChcImludmFsaWQgdHlwZSBmb3Igc2V0VmFsdWU6IFwiK3R5cGUpfX1Nb2R1bGVbXCJzZXRWYWx1ZVwiXT1zZXRWYWx1ZTtmdW5jdGlvbiBnZXRWYWx1ZShwdHIsdHlwZSxub1NhZmUpe3R5cGU9dHlwZXx8XCJpOFwiO2lmKHR5cGUuY2hhckF0KHR5cGUubGVuZ3RoLTEpPT09XCIqXCIpdHlwZT1cImkzMlwiO3N3aXRjaCh0eXBlKXtjYXNlXCJpMVwiOnJldHVybiBIRUFQOFtwdHI+PjBdO2Nhc2VcImk4XCI6cmV0dXJuIEhFQVA4W3B0cj4+MF07Y2FzZVwiaTE2XCI6cmV0dXJuIEhFQVAxNltwdHI+PjFdO2Nhc2VcImkzMlwiOnJldHVybiBIRUFQMzJbcHRyPj4yXTtjYXNlXCJpNjRcIjpyZXR1cm4gSEVBUDMyW3B0cj4+Ml07Y2FzZVwiZmxvYXRcIjpyZXR1cm4gSEVBUEYzMltwdHI+PjJdO2Nhc2VcImRvdWJsZVwiOnJldHVybiBIRUFQRjY0W3B0cj4+M107ZGVmYXVsdDphYm9ydChcImludmFsaWQgdHlwZSBmb3Igc2V0VmFsdWU6IFwiK3R5cGUpfXJldHVybiBudWxsfU1vZHVsZVtcImdldFZhbHVlXCJdPWdldFZhbHVlO3ZhciBBTExPQ19OT1JNQUw9MDt2YXIgQUxMT0NfU1RBQ0s9MTt2YXIgQUxMT0NfU1RBVElDPTI7dmFyIEFMTE9DX0RZTkFNSUM9Mzt2YXIgQUxMT0NfTk9ORT00O01vZHVsZVtcIkFMTE9DX05PUk1BTFwiXT1BTExPQ19OT1JNQUw7TW9kdWxlW1wiQUxMT0NfU1RBQ0tcIl09QUxMT0NfU1RBQ0s7TW9kdWxlW1wiQUxMT0NfU1RBVElDXCJdPUFMTE9DX1NUQVRJQztNb2R1bGVbXCJBTExPQ19EWU5BTUlDXCJdPUFMTE9DX0RZTkFNSUM7TW9kdWxlW1wiQUxMT0NfTk9ORVwiXT1BTExPQ19OT05FO2Z1bmN0aW9uIGFsbG9jYXRlKHNsYWIsdHlwZXMsYWxsb2NhdG9yLHB0cil7dmFyIHplcm9pbml0LHNpemU7aWYodHlwZW9mIHNsYWI9PT1cIm51bWJlclwiKXt6ZXJvaW5pdD10cnVlO3NpemU9c2xhYn1lbHNle3plcm9pbml0PWZhbHNlO3NpemU9c2xhYi5sZW5ndGh9dmFyIHNpbmdsZVR5cGU9dHlwZW9mIHR5cGVzPT09XCJzdHJpbmdcIj90eXBlczpudWxsO3ZhciByZXQ7aWYoYWxsb2NhdG9yPT1BTExPQ19OT05FKXtyZXQ9cHRyfWVsc2V7cmV0PVt0eXBlb2YgX21hbGxvYz09PVwiZnVuY3Rpb25cIj9fbWFsbG9jOlJ1bnRpbWUuc3RhdGljQWxsb2MsUnVudGltZS5zdGFja0FsbG9jLFJ1bnRpbWUuc3RhdGljQWxsb2MsUnVudGltZS5keW5hbWljQWxsb2NdW2FsbG9jYXRvcj09PXVuZGVmaW5lZD9BTExPQ19TVEFUSUM6YWxsb2NhdG9yXShNYXRoLm1heChzaXplLHNpbmdsZVR5cGU/MTp0eXBlcy5sZW5ndGgpKX1pZih6ZXJvaW5pdCl7dmFyIHB0cj1yZXQsc3RvcDthc3NlcnQoKHJldCYzKT09MCk7c3RvcD1yZXQrKHNpemUmfjMpO2Zvcig7cHRyPHN0b3A7cHRyKz00KXtIRUFQMzJbcHRyPj4yXT0wfXN0b3A9cmV0K3NpemU7d2hpbGUocHRyPHN0b3Ape0hFQVA4W3B0cisrPj4wXT0wfXJldHVybiByZXR9aWYoc2luZ2xlVHlwZT09PVwiaThcIil7aWYoc2xhYi5zdWJhcnJheXx8c2xhYi5zbGljZSl7SEVBUFU4LnNldChzbGFiLHJldCl9ZWxzZXtIRUFQVTguc2V0KG5ldyBVaW50OEFycmF5KHNsYWIpLHJldCl9cmV0dXJuIHJldH12YXIgaT0wLHR5cGUsdHlwZVNpemUscHJldmlvdXNUeXBlO3doaWxlKGk8c2l6ZSl7dmFyIGN1cnI9c2xhYltpXTtpZih0eXBlb2YgY3Vycj09PVwiZnVuY3Rpb25cIil7Y3Vycj1SdW50aW1lLmdldEZ1bmN0aW9uSW5kZXgoY3Vycil9dHlwZT1zaW5nbGVUeXBlfHx0eXBlc1tpXTtpZih0eXBlPT09MCl7aSsrO2NvbnRpbnVlfWlmKHR5cGU9PVwiaTY0XCIpdHlwZT1cImkzMlwiO3NldFZhbHVlKHJldCtpLGN1cnIsdHlwZSk7aWYocHJldmlvdXNUeXBlIT09dHlwZSl7dHlwZVNpemU9UnVudGltZS5nZXROYXRpdmVUeXBlU2l6ZSh0eXBlKTtwcmV2aW91c1R5cGU9dHlwZX1pKz10eXBlU2l6ZX1yZXR1cm4gcmV0fU1vZHVsZVtcImFsbG9jYXRlXCJdPWFsbG9jYXRlO2Z1bmN0aW9uIGdldE1lbW9yeShzaXplKXtpZighc3RhdGljU2VhbGVkKXJldHVybiBSdW50aW1lLnN0YXRpY0FsbG9jKHNpemUpO2lmKCFydW50aW1lSW5pdGlhbGl6ZWQpcmV0dXJuIFJ1bnRpbWUuZHluYW1pY0FsbG9jKHNpemUpO3JldHVybiBfbWFsbG9jKHNpemUpfU1vZHVsZVtcImdldE1lbW9yeVwiXT1nZXRNZW1vcnk7ZnVuY3Rpb24gUG9pbnRlcl9zdHJpbmdpZnkocHRyLGxlbmd0aCl7aWYobGVuZ3RoPT09MHx8IXB0cilyZXR1cm5cIlwiO3ZhciBoYXNVdGY9MDt2YXIgdDt2YXIgaT0wO3doaWxlKDEpe3Q9SEVBUFU4W3B0citpPj4wXTtoYXNVdGZ8PXQ7aWYodD09MCYmIWxlbmd0aClicmVhaztpKys7aWYobGVuZ3RoJiZpPT1sZW5ndGgpYnJlYWt9aWYoIWxlbmd0aClsZW5ndGg9aTt2YXIgcmV0PVwiXCI7aWYoaGFzVXRmPDEyOCl7dmFyIE1BWF9DSFVOSz0xMDI0O3ZhciBjdXJyO3doaWxlKGxlbmd0aD4wKXtjdXJyPVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLEhFQVBVOC5zdWJhcnJheShwdHIscHRyK01hdGgubWluKGxlbmd0aCxNQVhfQ0hVTkspKSk7cmV0PXJldD9yZXQrY3VycjpjdXJyO3B0cis9TUFYX0NIVU5LO2xlbmd0aC09TUFYX0NIVU5LfXJldHVybiByZXR9cmV0dXJuIE1vZHVsZVtcIlVURjhUb1N0cmluZ1wiXShwdHIpfU1vZHVsZVtcIlBvaW50ZXJfc3RyaW5naWZ5XCJdPVBvaW50ZXJfc3RyaW5naWZ5O2Z1bmN0aW9uIEFzY2lpVG9TdHJpbmcocHRyKXt2YXIgc3RyPVwiXCI7d2hpbGUoMSl7dmFyIGNoPUhFQVA4W3B0cisrPj4wXTtpZighY2gpcmV0dXJuIHN0cjtzdHIrPVN0cmluZy5mcm9tQ2hhckNvZGUoY2gpfX1Nb2R1bGVbXCJBc2NpaVRvU3RyaW5nXCJdPUFzY2lpVG9TdHJpbmc7ZnVuY3Rpb24gc3RyaW5nVG9Bc2NpaShzdHIsb3V0UHRyKXtyZXR1cm4gd3JpdGVBc2NpaVRvTWVtb3J5KHN0cixvdXRQdHIsZmFsc2UpfU1vZHVsZVtcInN0cmluZ1RvQXNjaWlcIl09c3RyaW5nVG9Bc2NpaTt2YXIgVVRGOERlY29kZXI9dHlwZW9mIFRleHREZWNvZGVyIT09XCJ1bmRlZmluZWRcIj9uZXcgVGV4dERlY29kZXIoXCJ1dGY4XCIpOnVuZGVmaW5lZDtmdW5jdGlvbiBVVEY4QXJyYXlUb1N0cmluZyh1OEFycmF5LGlkeCl7dmFyIGVuZFB0cj1pZHg7d2hpbGUodThBcnJheVtlbmRQdHJdKSsrZW5kUHRyO2lmKGVuZFB0ci1pZHg+MTYmJnU4QXJyYXkuc3ViYXJyYXkmJlVURjhEZWNvZGVyKXtyZXR1cm4gVVRGOERlY29kZXIuZGVjb2RlKHU4QXJyYXkuc3ViYXJyYXkoaWR4LGVuZFB0cikpfWVsc2V7dmFyIHUwLHUxLHUyLHUzLHU0LHU1O3ZhciBzdHI9XCJcIjt3aGlsZSgxKXt1MD11OEFycmF5W2lkeCsrXTtpZighdTApcmV0dXJuIHN0cjtpZighKHUwJjEyOCkpe3N0cis9U3RyaW5nLmZyb21DaGFyQ29kZSh1MCk7Y29udGludWV9dTE9dThBcnJheVtpZHgrK10mNjM7aWYoKHUwJjIyNCk9PTE5Mil7c3RyKz1TdHJpbmcuZnJvbUNoYXJDb2RlKCh1MCYzMSk8PDZ8dTEpO2NvbnRpbnVlfXUyPXU4QXJyYXlbaWR4KytdJjYzO2lmKCh1MCYyNDApPT0yMjQpe3UwPSh1MCYxNSk8PDEyfHUxPDw2fHUyfWVsc2V7dTM9dThBcnJheVtpZHgrK10mNjM7aWYoKHUwJjI0OCk9PTI0MCl7dTA9KHUwJjcpPDwxOHx1MTw8MTJ8dTI8PDZ8dTN9ZWxzZXt1ND11OEFycmF5W2lkeCsrXSY2MztpZigodTAmMjUyKT09MjQ4KXt1MD0odTAmMyk8PDI0fHUxPDwxOHx1Mjw8MTJ8dTM8PDZ8dTR9ZWxzZXt1NT11OEFycmF5W2lkeCsrXSY2Mzt1MD0odTAmMSk8PDMwfHUxPDwyNHx1Mjw8MTh8dTM8PDEyfHU0PDw2fHU1fX19aWYodTA8NjU1MzYpe3N0cis9U3RyaW5nLmZyb21DaGFyQ29kZSh1MCl9ZWxzZXt2YXIgY2g9dTAtNjU1MzY7c3RyKz1TdHJpbmcuZnJvbUNoYXJDb2RlKDU1Mjk2fGNoPj4xMCw1NjMyMHxjaCYxMDIzKX19fX1Nb2R1bGVbXCJVVEY4QXJyYXlUb1N0cmluZ1wiXT1VVEY4QXJyYXlUb1N0cmluZztmdW5jdGlvbiBVVEY4VG9TdHJpbmcocHRyKXtyZXR1cm4gVVRGOEFycmF5VG9TdHJpbmcoSEVBUFU4LHB0cil9TW9kdWxlW1wiVVRGOFRvU3RyaW5nXCJdPVVURjhUb1N0cmluZztmdW5jdGlvbiBzdHJpbmdUb1VURjhBcnJheShzdHIsb3V0VThBcnJheSxvdXRJZHgsbWF4Qnl0ZXNUb1dyaXRlKXtpZighKG1heEJ5dGVzVG9Xcml0ZT4wKSlyZXR1cm4gMDt2YXIgc3RhcnRJZHg9b3V0SWR4O3ZhciBlbmRJZHg9b3V0SWR4K21heEJ5dGVzVG9Xcml0ZS0xO2Zvcih2YXIgaT0wO2k8c3RyLmxlbmd0aDsrK2kpe3ZhciB1PXN0ci5jaGFyQ29kZUF0KGkpO2lmKHU+PTU1Mjk2JiZ1PD01NzM0Myl1PTY1NTM2KygodSYxMDIzKTw8MTApfHN0ci5jaGFyQ29kZUF0KCsraSkmMTAyMztpZih1PD0xMjcpe2lmKG91dElkeD49ZW5kSWR4KWJyZWFrO291dFU4QXJyYXlbb3V0SWR4KytdPXV9ZWxzZSBpZih1PD0yMDQ3KXtpZihvdXRJZHgrMT49ZW5kSWR4KWJyZWFrO291dFU4QXJyYXlbb3V0SWR4KytdPTE5Mnx1Pj42O291dFU4QXJyYXlbb3V0SWR4KytdPTEyOHx1JjYzfWVsc2UgaWYodTw9NjU1MzUpe2lmKG91dElkeCsyPj1lbmRJZHgpYnJlYWs7b3V0VThBcnJheVtvdXRJZHgrK109MjI0fHU+PjEyO291dFU4QXJyYXlbb3V0SWR4KytdPTEyOHx1Pj42JjYzO291dFU4QXJyYXlbb3V0SWR4KytdPTEyOHx1JjYzfWVsc2UgaWYodTw9MjA5NzE1MSl7aWYob3V0SWR4KzM+PWVuZElkeClicmVhaztvdXRVOEFycmF5W291dElkeCsrXT0yNDB8dT4+MTg7b3V0VThBcnJheVtvdXRJZHgrK109MTI4fHU+PjEyJjYzO291dFU4QXJyYXlbb3V0SWR4KytdPTEyOHx1Pj42JjYzO291dFU4QXJyYXlbb3V0SWR4KytdPTEyOHx1JjYzfWVsc2UgaWYodTw9NjcxMDg4NjMpe2lmKG91dElkeCs0Pj1lbmRJZHgpYnJlYWs7b3V0VThBcnJheVtvdXRJZHgrK109MjQ4fHU+PjI0O291dFU4QXJyYXlbb3V0SWR4KytdPTEyOHx1Pj4xOCY2MztvdXRVOEFycmF5W291dElkeCsrXT0xMjh8dT4+MTImNjM7b3V0VThBcnJheVtvdXRJZHgrK109MTI4fHU+PjYmNjM7b3V0VThBcnJheVtvdXRJZHgrK109MTI4fHUmNjN9ZWxzZXtpZihvdXRJZHgrNT49ZW5kSWR4KWJyZWFrO291dFU4QXJyYXlbb3V0SWR4KytdPTI1Mnx1Pj4zMDtvdXRVOEFycmF5W291dElkeCsrXT0xMjh8dT4+MjQmNjM7b3V0VThBcnJheVtvdXRJZHgrK109MTI4fHU+PjE4JjYzO291dFU4QXJyYXlbb3V0SWR4KytdPTEyOHx1Pj4xMiY2MztvdXRVOEFycmF5W291dElkeCsrXT0xMjh8dT4+NiY2MztvdXRVOEFycmF5W291dElkeCsrXT0xMjh8dSY2M319b3V0VThBcnJheVtvdXRJZHhdPTA7cmV0dXJuIG91dElkeC1zdGFydElkeH1Nb2R1bGVbXCJzdHJpbmdUb1VURjhBcnJheVwiXT1zdHJpbmdUb1VURjhBcnJheTtmdW5jdGlvbiBzdHJpbmdUb1VURjgoc3RyLG91dFB0cixtYXhCeXRlc1RvV3JpdGUpe3JldHVybiBzdHJpbmdUb1VURjhBcnJheShzdHIsSEVBUFU4LG91dFB0cixtYXhCeXRlc1RvV3JpdGUpfU1vZHVsZVtcInN0cmluZ1RvVVRGOFwiXT1zdHJpbmdUb1VURjg7ZnVuY3Rpb24gbGVuZ3RoQnl0ZXNVVEY4KHN0cil7dmFyIGxlbj0wO2Zvcih2YXIgaT0wO2k8c3RyLmxlbmd0aDsrK2kpe3ZhciB1PXN0ci5jaGFyQ29kZUF0KGkpO2lmKHU+PTU1Mjk2JiZ1PD01NzM0Myl1PTY1NTM2KygodSYxMDIzKTw8MTApfHN0ci5jaGFyQ29kZUF0KCsraSkmMTAyMztpZih1PD0xMjcpeysrbGVufWVsc2UgaWYodTw9MjA0Nyl7bGVuKz0yfWVsc2UgaWYodTw9NjU1MzUpe2xlbis9M31lbHNlIGlmKHU8PTIwOTcxNTEpe2xlbis9NH1lbHNlIGlmKHU8PTY3MTA4ODYzKXtsZW4rPTV9ZWxzZXtsZW4rPTZ9fXJldHVybiBsZW59TW9kdWxlW1wibGVuZ3RoQnl0ZXNVVEY4XCJdPWxlbmd0aEJ5dGVzVVRGODt2YXIgVVRGMTZEZWNvZGVyPXR5cGVvZiBUZXh0RGVjb2RlciE9PVwidW5kZWZpbmVkXCI/bmV3IFRleHREZWNvZGVyKFwidXRmLTE2bGVcIik6dW5kZWZpbmVkO2Z1bmN0aW9uIGRlbWFuZ2xlKGZ1bmMpe3ZhciBfX2N4YV9kZW1hbmdsZV9mdW5jPU1vZHVsZVtcIl9fX2N4YV9kZW1hbmdsZVwiXXx8TW9kdWxlW1wiX19jeGFfZGVtYW5nbGVcIl07aWYoX19jeGFfZGVtYW5nbGVfZnVuYyl7dHJ5e3ZhciBzPWZ1bmMuc3Vic3RyKDEpO3ZhciBsZW49bGVuZ3RoQnl0ZXNVVEY4KHMpKzE7dmFyIGJ1Zj1fbWFsbG9jKGxlbik7c3RyaW5nVG9VVEY4KHMsYnVmLGxlbik7dmFyIHN0YXR1cz1fbWFsbG9jKDQpO3ZhciByZXQ9X19jeGFfZGVtYW5nbGVfZnVuYyhidWYsMCwwLHN0YXR1cyk7aWYoZ2V0VmFsdWUoc3RhdHVzLFwiaTMyXCIpPT09MCYmcmV0KXtyZXR1cm4gUG9pbnRlcl9zdHJpbmdpZnkocmV0KX19Y2F0Y2goZSl7fWZpbmFsbHl7aWYoYnVmKV9mcmVlKGJ1Zik7aWYoc3RhdHVzKV9mcmVlKHN0YXR1cyk7aWYocmV0KV9mcmVlKHJldCl9cmV0dXJuIGZ1bmN9UnVudGltZS53YXJuT25jZShcIndhcm5pbmc6IGJ1aWxkIHdpdGggIC1zIERFTUFOR0xFX1NVUFBPUlQ9MSAgdG8gbGluayBpbiBsaWJjeHhhYmkgZGVtYW5nbGluZ1wiKTtyZXR1cm4gZnVuY31mdW5jdGlvbiBkZW1hbmdsZUFsbCh0ZXh0KXt2YXIgcmVnZXg9L19fWltcXHdcXGRfXSsvZztyZXR1cm4gdGV4dC5yZXBsYWNlKHJlZ2V4LChmdW5jdGlvbih4KXt2YXIgeT1kZW1hbmdsZSh4KTtyZXR1cm4geD09PXk/eDp4K1wiIFtcIit5K1wiXVwifSkpfWZ1bmN0aW9uIGpzU3RhY2tUcmFjZSgpe3ZhciBlcnI9bmV3IEVycm9yO2lmKCFlcnIuc3RhY2spe3RyeXt0aHJvdyBuZXcgRXJyb3IoMCl9Y2F0Y2goZSl7ZXJyPWV9aWYoIWVyci5zdGFjayl7cmV0dXJuXCIobm8gc3RhY2sgdHJhY2UgYXZhaWxhYmxlKVwifX1yZXR1cm4gZXJyLnN0YWNrLnRvU3RyaW5nKCl9ZnVuY3Rpb24gc3RhY2tUcmFjZSgpe3ZhciBqcz1qc1N0YWNrVHJhY2UoKTtpZihNb2R1bGVbXCJleHRyYVN0YWNrVHJhY2VcIl0panMrPVwiXFxuXCIrTW9kdWxlW1wiZXh0cmFTdGFja1RyYWNlXCJdKCk7cmV0dXJuIGRlbWFuZ2xlQWxsKGpzKX1Nb2R1bGVbXCJzdGFja1RyYWNlXCJdPXN0YWNrVHJhY2U7dmFyIEhFQVAsYnVmZmVyLEhFQVA4LEhFQVBVOCxIRUFQMTYsSEVBUFUxNixIRUFQMzIsSEVBUFUzMixIRUFQRjMyLEhFQVBGNjQ7ZnVuY3Rpb24gdXBkYXRlR2xvYmFsQnVmZmVyVmlld3MoKXtNb2R1bGVbXCJIRUFQOFwiXT1IRUFQOD1uZXcgSW50OEFycmF5KGJ1ZmZlcik7TW9kdWxlW1wiSEVBUDE2XCJdPUhFQVAxNj1uZXcgSW50MTZBcnJheShidWZmZXIpO01vZHVsZVtcIkhFQVAzMlwiXT1IRUFQMzI9bmV3IEludDMyQXJyYXkoYnVmZmVyKTtNb2R1bGVbXCJIRUFQVThcIl09SEVBUFU4PW5ldyBVaW50OEFycmF5KGJ1ZmZlcik7TW9kdWxlW1wiSEVBUFUxNlwiXT1IRUFQVTE2PW5ldyBVaW50MTZBcnJheShidWZmZXIpO01vZHVsZVtcIkhFQVBVMzJcIl09SEVBUFUzMj1uZXcgVWludDMyQXJyYXkoYnVmZmVyKTtNb2R1bGVbXCJIRUFQRjMyXCJdPUhFQVBGMzI9bmV3IEZsb2F0MzJBcnJheShidWZmZXIpO01vZHVsZVtcIkhFQVBGNjRcIl09SEVBUEY2ND1uZXcgRmxvYXQ2NEFycmF5KGJ1ZmZlcil9dmFyIFNUQVRJQ19CQVNFLFNUQVRJQ1RPUCxzdGF0aWNTZWFsZWQ7dmFyIFNUQUNLX0JBU0UsU1RBQ0tUT1AsU1RBQ0tfTUFYO3ZhciBEWU5BTUlDX0JBU0UsRFlOQU1JQ1RPUF9QVFI7U1RBVElDX0JBU0U9U1RBVElDVE9QPVNUQUNLX0JBU0U9U1RBQ0tUT1A9U1RBQ0tfTUFYPURZTkFNSUNfQkFTRT1EWU5BTUlDVE9QX1BUUj0wO3N0YXRpY1NlYWxlZD1mYWxzZTtmdW5jdGlvbiBhYm9ydE9uQ2Fubm90R3Jvd01lbW9yeSgpe2Fib3J0KFwiQ2Fubm90IGVubGFyZ2UgbWVtb3J5IGFycmF5cy4gRWl0aGVyICgxKSBjb21waWxlIHdpdGggIC1zIFRPVEFMX01FTU9SWT1YICB3aXRoIFggaGlnaGVyIHRoYW4gdGhlIGN1cnJlbnQgdmFsdWUgXCIrVE9UQUxfTUVNT1JZK1wiLCAoMikgY29tcGlsZSB3aXRoICAtcyBBTExPV19NRU1PUllfR1JPV1RIPTEgIHdoaWNoIGFsbG93cyBpbmNyZWFzaW5nIHRoZSBzaXplIGF0IHJ1bnRpbWUgYnV0IHByZXZlbnRzIHNvbWUgb3B0aW1pemF0aW9ucywgKDMpIHNldCBNb2R1bGUuVE9UQUxfTUVNT1JZIHRvIGEgaGlnaGVyIHZhbHVlIGJlZm9yZSB0aGUgcHJvZ3JhbSBydW5zLCBvciAoNCkgaWYgeW91IHdhbnQgbWFsbG9jIHRvIHJldHVybiBOVUxMICgwKSBpbnN0ZWFkIG9mIHRoaXMgYWJvcnQsIGNvbXBpbGUgd2l0aCAgLXMgQUJPUlRJTkdfTUFMTE9DPTAgXCIpfWZ1bmN0aW9uIGVubGFyZ2VNZW1vcnkoKXthYm9ydE9uQ2Fubm90R3Jvd01lbW9yeSgpfXZhciBUT1RBTF9TVEFDSz1Nb2R1bGVbXCJUT1RBTF9TVEFDS1wiXXx8NTI0Mjg4MDt2YXIgVE9UQUxfTUVNT1JZPU1vZHVsZVtcIlRPVEFMX01FTU9SWVwiXXx8MTY3NzcyMTY7aWYoVE9UQUxfTUVNT1JZPFRPVEFMX1NUQUNLKU1vZHVsZS5wcmludEVycihcIlRPVEFMX01FTU9SWSBzaG91bGQgYmUgbGFyZ2VyIHRoYW4gVE9UQUxfU1RBQ0ssIHdhcyBcIitUT1RBTF9NRU1PUlkrXCIhIChUT1RBTF9TVEFDSz1cIitUT1RBTF9TVEFDSytcIilcIik7aWYoTW9kdWxlW1wiYnVmZmVyXCJdKXtidWZmZXI9TW9kdWxlW1wiYnVmZmVyXCJdfWVsc2V7e2J1ZmZlcj1uZXcgQXJyYXlCdWZmZXIoVE9UQUxfTUVNT1JZKX19dXBkYXRlR2xvYmFsQnVmZmVyVmlld3MoKTtmdW5jdGlvbiBnZXRUb3RhbE1lbW9yeSgpe3JldHVybiBUT1RBTF9NRU1PUll9SEVBUDMyWzBdPTE2Njg1MDkwMjk7SEVBUDE2WzFdPTI1NDU5O2lmKEhFQVBVOFsyXSE9PTExNXx8SEVBUFU4WzNdIT09OTkpdGhyb3dcIlJ1bnRpbWUgZXJyb3I6IGV4cGVjdGVkIHRoZSBzeXN0ZW0gdG8gYmUgbGl0dGxlLWVuZGlhbiFcIjtNb2R1bGVbXCJIRUFQXCJdPUhFQVA7TW9kdWxlW1wiYnVmZmVyXCJdPWJ1ZmZlcjtNb2R1bGVbXCJIRUFQOFwiXT1IRUFQODtNb2R1bGVbXCJIRUFQMTZcIl09SEVBUDE2O01vZHVsZVtcIkhFQVAzMlwiXT1IRUFQMzI7TW9kdWxlW1wiSEVBUFU4XCJdPUhFQVBVODtNb2R1bGVbXCJIRUFQVTE2XCJdPUhFQVBVMTY7TW9kdWxlW1wiSEVBUFUzMlwiXT1IRUFQVTMyO01vZHVsZVtcIkhFQVBGMzJcIl09SEVBUEYzMjtNb2R1bGVbXCJIRUFQRjY0XCJdPUhFQVBGNjQ7ZnVuY3Rpb24gY2FsbFJ1bnRpbWVDYWxsYmFja3MoY2FsbGJhY2tzKXt3aGlsZShjYWxsYmFja3MubGVuZ3RoPjApe3ZhciBjYWxsYmFjaz1jYWxsYmFja3Muc2hpZnQoKTtpZih0eXBlb2YgY2FsbGJhY2s9PVwiZnVuY3Rpb25cIil7Y2FsbGJhY2soKTtjb250aW51ZX12YXIgZnVuYz1jYWxsYmFjay5mdW5jO2lmKHR5cGVvZiBmdW5jPT09XCJudW1iZXJcIil7aWYoY2FsbGJhY2suYXJnPT09dW5kZWZpbmVkKXtNb2R1bGVbXCJkeW5DYWxsX3ZcIl0oZnVuYyl9ZWxzZXtNb2R1bGVbXCJkeW5DYWxsX3ZpXCJdKGZ1bmMsY2FsbGJhY2suYXJnKX19ZWxzZXtmdW5jKGNhbGxiYWNrLmFyZz09PXVuZGVmaW5lZD9udWxsOmNhbGxiYWNrLmFyZyl9fX12YXIgX19BVFBSRVJVTl9fPVtdO3ZhciBfX0FUSU5JVF9fPVtdO3ZhciBfX0FUTUFJTl9fPVtdO3ZhciBfX0FURVhJVF9fPVtdO3ZhciBfX0FUUE9TVFJVTl9fPVtdO3ZhciBydW50aW1lSW5pdGlhbGl6ZWQ9ZmFsc2U7dmFyIHJ1bnRpbWVFeGl0ZWQ9ZmFsc2U7ZnVuY3Rpb24gcHJlUnVuKCl7aWYoTW9kdWxlW1wicHJlUnVuXCJdKXtpZih0eXBlb2YgTW9kdWxlW1wicHJlUnVuXCJdPT1cImZ1bmN0aW9uXCIpTW9kdWxlW1wicHJlUnVuXCJdPVtNb2R1bGVbXCJwcmVSdW5cIl1dO3doaWxlKE1vZHVsZVtcInByZVJ1blwiXS5sZW5ndGgpe2FkZE9uUHJlUnVuKE1vZHVsZVtcInByZVJ1blwiXS5zaGlmdCgpKX19Y2FsbFJ1bnRpbWVDYWxsYmFja3MoX19BVFBSRVJVTl9fKX1mdW5jdGlvbiBlbnN1cmVJbml0UnVudGltZSgpe2lmKHJ1bnRpbWVJbml0aWFsaXplZClyZXR1cm47cnVudGltZUluaXRpYWxpemVkPXRydWU7Y2FsbFJ1bnRpbWVDYWxsYmFja3MoX19BVElOSVRfXyl9ZnVuY3Rpb24gcHJlTWFpbigpe2NhbGxSdW50aW1lQ2FsbGJhY2tzKF9fQVRNQUlOX18pfWZ1bmN0aW9uIGV4aXRSdW50aW1lKCl7Y2FsbFJ1bnRpbWVDYWxsYmFja3MoX19BVEVYSVRfXyk7cnVudGltZUV4aXRlZD10cnVlfWZ1bmN0aW9uIHBvc3RSdW4oKXtpZihNb2R1bGVbXCJwb3N0UnVuXCJdKXtpZih0eXBlb2YgTW9kdWxlW1wicG9zdFJ1blwiXT09XCJmdW5jdGlvblwiKU1vZHVsZVtcInBvc3RSdW5cIl09W01vZHVsZVtcInBvc3RSdW5cIl1dO3doaWxlKE1vZHVsZVtcInBvc3RSdW5cIl0ubGVuZ3RoKXthZGRPblBvc3RSdW4oTW9kdWxlW1wicG9zdFJ1blwiXS5zaGlmdCgpKX19Y2FsbFJ1bnRpbWVDYWxsYmFja3MoX19BVFBPU1RSVU5fXyl9ZnVuY3Rpb24gYWRkT25QcmVSdW4oY2Ipe19fQVRQUkVSVU5fXy51bnNoaWZ0KGNiKX1Nb2R1bGVbXCJhZGRPblByZVJ1blwiXT1hZGRPblByZVJ1bjtmdW5jdGlvbiBhZGRPbkluaXQoY2Ipe19fQVRJTklUX18udW5zaGlmdChjYil9TW9kdWxlW1wiYWRkT25Jbml0XCJdPWFkZE9uSW5pdDtmdW5jdGlvbiBhZGRPblByZU1haW4oY2Ipe19fQVRNQUlOX18udW5zaGlmdChjYil9TW9kdWxlW1wiYWRkT25QcmVNYWluXCJdPWFkZE9uUHJlTWFpbjtmdW5jdGlvbiBhZGRPbkV4aXQoY2Ipe19fQVRFWElUX18udW5zaGlmdChjYil9TW9kdWxlW1wiYWRkT25FeGl0XCJdPWFkZE9uRXhpdDtmdW5jdGlvbiBhZGRPblBvc3RSdW4oY2Ipe19fQVRQT1NUUlVOX18udW5zaGlmdChjYil9TW9kdWxlW1wiYWRkT25Qb3N0UnVuXCJdPWFkZE9uUG9zdFJ1bjtmdW5jdGlvbiBpbnRBcnJheUZyb21TdHJpbmcoc3RyaW5neSxkb250QWRkTnVsbCxsZW5ndGgpe3ZhciBsZW49bGVuZ3RoPjA/bGVuZ3RoOmxlbmd0aEJ5dGVzVVRGOChzdHJpbmd5KSsxO3ZhciB1OGFycmF5PW5ldyBBcnJheShsZW4pO3ZhciBudW1CeXRlc1dyaXR0ZW49c3RyaW5nVG9VVEY4QXJyYXkoc3RyaW5neSx1OGFycmF5LDAsdThhcnJheS5sZW5ndGgpO2lmKGRvbnRBZGROdWxsKXU4YXJyYXkubGVuZ3RoPW51bUJ5dGVzV3JpdHRlbjtyZXR1cm4gdThhcnJheX1Nb2R1bGVbXCJpbnRBcnJheUZyb21TdHJpbmdcIl09aW50QXJyYXlGcm9tU3RyaW5nO2Z1bmN0aW9uIGludEFycmF5VG9TdHJpbmcoYXJyYXkpe3ZhciByZXQ9W107Zm9yKHZhciBpPTA7aTxhcnJheS5sZW5ndGg7aSsrKXt2YXIgY2hyPWFycmF5W2ldO2lmKGNocj4yNTUpe2NociY9MjU1fXJldC5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUoY2hyKSl9cmV0dXJuIHJldC5qb2luKFwiXCIpfU1vZHVsZVtcImludEFycmF5VG9TdHJpbmdcIl09aW50QXJyYXlUb1N0cmluZztmdW5jdGlvbiB3cml0ZVN0cmluZ1RvTWVtb3J5KHN0cmluZyxidWZmZXIsZG9udEFkZE51bGwpe1J1bnRpbWUud2Fybk9uY2UoXCJ3cml0ZVN0cmluZ1RvTWVtb3J5IGlzIGRlcHJlY2F0ZWQgYW5kIHNob3VsZCBub3QgYmUgY2FsbGVkISBVc2Ugc3RyaW5nVG9VVEY4KCkgaW5zdGVhZCFcIik7dmFyIGxhc3RDaGFyLGVuZDtpZihkb250QWRkTnVsbCl7ZW5kPWJ1ZmZlcitsZW5ndGhCeXRlc1VURjgoc3RyaW5nKTtsYXN0Q2hhcj1IRUFQOFtlbmRdfXN0cmluZ1RvVVRGOChzdHJpbmcsYnVmZmVyLEluZmluaXR5KTtpZihkb250QWRkTnVsbClIRUFQOFtlbmRdPWxhc3RDaGFyfU1vZHVsZVtcIndyaXRlU3RyaW5nVG9NZW1vcnlcIl09d3JpdGVTdHJpbmdUb01lbW9yeTtmdW5jdGlvbiB3cml0ZUFycmF5VG9NZW1vcnkoYXJyYXksYnVmZmVyKXtIRUFQOC5zZXQoYXJyYXksYnVmZmVyKX1Nb2R1bGVbXCJ3cml0ZUFycmF5VG9NZW1vcnlcIl09d3JpdGVBcnJheVRvTWVtb3J5O2Z1bmN0aW9uIHdyaXRlQXNjaWlUb01lbW9yeShzdHIsYnVmZmVyLGRvbnRBZGROdWxsKXtmb3IodmFyIGk9MDtpPHN0ci5sZW5ndGg7KytpKXtIRUFQOFtidWZmZXIrKz4+MF09c3RyLmNoYXJDb2RlQXQoaSl9aWYoIWRvbnRBZGROdWxsKUhFQVA4W2J1ZmZlcj4+MF09MH1Nb2R1bGVbXCJ3cml0ZUFzY2lpVG9NZW1vcnlcIl09d3JpdGVBc2NpaVRvTWVtb3J5O2lmKCFNYXRoW1wiaW11bFwiXXx8TWF0aFtcImltdWxcIl0oNDI5NDk2NzI5NSw1KSE9PS01KU1hdGhbXCJpbXVsXCJdPWZ1bmN0aW9uIGltdWwoYSxiKXt2YXIgYWg9YT4+PjE2O3ZhciBhbD1hJjY1NTM1O3ZhciBiaD1iPj4+MTY7dmFyIGJsPWImNjU1MzU7cmV0dXJuIGFsKmJsKyhhaCpibCthbCpiaDw8MTYpfDB9O01hdGguaW11bD1NYXRoW1wiaW11bFwiXTtpZighTWF0aFtcImZyb3VuZFwiXSl7dmFyIGZyb3VuZEJ1ZmZlcj1uZXcgRmxvYXQzMkFycmF5KDEpO01hdGhbXCJmcm91bmRcIl09KGZ1bmN0aW9uKHgpe2Zyb3VuZEJ1ZmZlclswXT14O3JldHVybiBmcm91bmRCdWZmZXJbMF19KX1NYXRoLmZyb3VuZD1NYXRoW1wiZnJvdW5kXCJdO2lmKCFNYXRoW1wiY2x6MzJcIl0pTWF0aFtcImNsejMyXCJdPShmdW5jdGlvbih4KXt4PXg+Pj4wO2Zvcih2YXIgaT0wO2k8MzI7aSsrKXtpZih4JjE8PDMxLWkpcmV0dXJuIGl9cmV0dXJuIDMyfSk7TWF0aC5jbHozMj1NYXRoW1wiY2x6MzJcIl07aWYoIU1hdGhbXCJ0cnVuY1wiXSlNYXRoW1widHJ1bmNcIl09KGZ1bmN0aW9uKHgpe3JldHVybiB4PDA/TWF0aC5jZWlsKHgpOk1hdGguZmxvb3IoeCl9KTtNYXRoLnRydW5jPU1hdGhbXCJ0cnVuY1wiXTt2YXIgTWF0aF9hYnM9TWF0aC5hYnM7dmFyIE1hdGhfY29zPU1hdGguY29zO3ZhciBNYXRoX3Npbj1NYXRoLnNpbjt2YXIgTWF0aF90YW49TWF0aC50YW47dmFyIE1hdGhfYWNvcz1NYXRoLmFjb3M7dmFyIE1hdGhfYXNpbj1NYXRoLmFzaW47dmFyIE1hdGhfYXRhbj1NYXRoLmF0YW47dmFyIE1hdGhfYXRhbjI9TWF0aC5hdGFuMjt2YXIgTWF0aF9leHA9TWF0aC5leHA7dmFyIE1hdGhfbG9nPU1hdGgubG9nO3ZhciBNYXRoX3NxcnQ9TWF0aC5zcXJ0O3ZhciBNYXRoX2NlaWw9TWF0aC5jZWlsO3ZhciBNYXRoX2Zsb29yPU1hdGguZmxvb3I7dmFyIE1hdGhfcG93PU1hdGgucG93O3ZhciBNYXRoX2ltdWw9TWF0aC5pbXVsO3ZhciBNYXRoX2Zyb3VuZD1NYXRoLmZyb3VuZDt2YXIgTWF0aF9yb3VuZD1NYXRoLnJvdW5kO3ZhciBNYXRoX21pbj1NYXRoLm1pbjt2YXIgTWF0aF9jbHozMj1NYXRoLmNsejMyO3ZhciBNYXRoX3RydW5jPU1hdGgudHJ1bmM7dmFyIHJ1bkRlcGVuZGVuY2llcz0wO3ZhciBydW5EZXBlbmRlbmN5V2F0Y2hlcj1udWxsO3ZhciBkZXBlbmRlbmNpZXNGdWxmaWxsZWQ9bnVsbDtmdW5jdGlvbiBhZGRSdW5EZXBlbmRlbmN5KGlkKXtydW5EZXBlbmRlbmNpZXMrKztpZihNb2R1bGVbXCJtb25pdG9yUnVuRGVwZW5kZW5jaWVzXCJdKXtNb2R1bGVbXCJtb25pdG9yUnVuRGVwZW5kZW5jaWVzXCJdKHJ1bkRlcGVuZGVuY2llcyl9fU1vZHVsZVtcImFkZFJ1bkRlcGVuZGVuY3lcIl09YWRkUnVuRGVwZW5kZW5jeTtmdW5jdGlvbiByZW1vdmVSdW5EZXBlbmRlbmN5KGlkKXtydW5EZXBlbmRlbmNpZXMtLTtpZihNb2R1bGVbXCJtb25pdG9yUnVuRGVwZW5kZW5jaWVzXCJdKXtNb2R1bGVbXCJtb25pdG9yUnVuRGVwZW5kZW5jaWVzXCJdKHJ1bkRlcGVuZGVuY2llcyl9aWYocnVuRGVwZW5kZW5jaWVzPT0wKXtpZihydW5EZXBlbmRlbmN5V2F0Y2hlciE9PW51bGwpe2NsZWFySW50ZXJ2YWwocnVuRGVwZW5kZW5jeVdhdGNoZXIpO3J1bkRlcGVuZGVuY3lXYXRjaGVyPW51bGx9aWYoZGVwZW5kZW5jaWVzRnVsZmlsbGVkKXt2YXIgY2FsbGJhY2s9ZGVwZW5kZW5jaWVzRnVsZmlsbGVkO2RlcGVuZGVuY2llc0Z1bGZpbGxlZD1udWxsO2NhbGxiYWNrKCl9fX1Nb2R1bGVbXCJyZW1vdmVSdW5EZXBlbmRlbmN5XCJdPXJlbW92ZVJ1bkRlcGVuZGVuY3k7TW9kdWxlW1wicHJlbG9hZGVkSW1hZ2VzXCJdPXt9O01vZHVsZVtcInByZWxvYWRlZEF1ZGlvc1wiXT17fTt2YXIgQVNNX0NPTlNUUz1bXTtTVEFUSUNfQkFTRT1SdW50aW1lLkdMT0JBTF9CQVNFO1NUQVRJQ1RPUD1TVEFUSUNfQkFTRSsxMDI0O19fQVRJTklUX18ucHVzaCgpO2FsbG9jYXRlKFswLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMjI0LDMsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwxLDAsMCw1LDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwxLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwxLDAsMCwwLDIsMCwwLDAsMCw0LDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwyLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwyNTUsMjU1LDI1NSwyNTUsMjU1LDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCw4MiwxMDEsOTcsMTA4LDMyLDcwLDcwLDg0LDMyLDExMSwxMTIsMTE2LDEwNSwxMDksMTA1LDEyMiw5NywxMTYsMTA1LDExMSwxMTAsMzIsMTA5LDExNywxMTUsMTE2LDMyLDk4LDEwMSwzMiwxMDEsMTE4LDEwMSwxMTAsNDYsMTAsMCwxMDcsMTA1LDExNSwxMTUsMzIsMTAyLDEwMiwxMTYsMzIsMTE3LDExNSw5NywxMDMsMTAxLDMyLDEwMSwxMTQsMTE0LDExMSwxMTQsNTgsMzIsMTA1LDEwOSwxMTIsMTE0LDExMSwxMTIsMTAxLDExNCwzMiw5NywxMDgsMTA4LDExMSw5OSwxMCwwXSxcImk4XCIsQUxMT0NfTk9ORSxSdW50aW1lLkdMT0JBTF9CQVNFKTt2YXIgdGVtcERvdWJsZVB0cj1TVEFUSUNUT1A7U1RBVElDVE9QKz0xNjtmdW5jdGlvbiBfX19zZXRFcnJObyh2YWx1ZSl7aWYoTW9kdWxlW1wiX19fZXJybm9fbG9jYXRpb25cIl0pSEVBUDMyW01vZHVsZVtcIl9fX2Vycm5vX2xvY2F0aW9uXCJdKCk+PjJdPXZhbHVlO3JldHVybiB2YWx1ZX1mdW5jdGlvbiBfX2V4aXQoc3RhdHVzKXtNb2R1bGVbXCJleGl0XCJdKHN0YXR1cyl9ZnVuY3Rpb24gX2V4aXQoc3RhdHVzKXtfX2V4aXQoc3RhdHVzKX12YXIgU1lTQ0FMTFM9e3ZhcmFyZ3M6MCxnZXQ6KGZ1bmN0aW9uKHZhcmFyZ3Mpe1NZU0NBTExTLnZhcmFyZ3MrPTQ7dmFyIHJldD1IRUFQMzJbU1lTQ0FMTFMudmFyYXJncy00Pj4yXTtyZXR1cm4gcmV0fSksZ2V0U3RyOihmdW5jdGlvbigpe3ZhciByZXQ9UG9pbnRlcl9zdHJpbmdpZnkoU1lTQ0FMTFMuZ2V0KCkpO3JldHVybiByZXR9KSxnZXQ2NDooZnVuY3Rpb24oKXt2YXIgbG93PVNZU0NBTExTLmdldCgpLGhpZ2g9U1lTQ0FMTFMuZ2V0KCk7aWYobG93Pj0wKWFzc2VydChoaWdoPT09MCk7ZWxzZSBhc3NlcnQoaGlnaD09PS0xKTtyZXR1cm4gbG93fSksZ2V0WmVybzooZnVuY3Rpb24oKXthc3NlcnQoU1lTQ0FMTFMuZ2V0KCk9PT0wKX0pfTtmdW5jdGlvbiBfX19zeXNjYWxsMTQwKHdoaWNoLHZhcmFyZ3Mpe1NZU0NBTExTLnZhcmFyZ3M9dmFyYXJnczt0cnl7dmFyIHN0cmVhbT1TWVNDQUxMUy5nZXRTdHJlYW1Gcm9tRkQoKSxvZmZzZXRfaGlnaD1TWVNDQUxMUy5nZXQoKSxvZmZzZXRfbG93PVNZU0NBTExTLmdldCgpLHJlc3VsdD1TWVNDQUxMUy5nZXQoKSx3aGVuY2U9U1lTQ0FMTFMuZ2V0KCk7dmFyIG9mZnNldD1vZmZzZXRfbG93O0ZTLmxsc2VlayhzdHJlYW0sb2Zmc2V0LHdoZW5jZSk7SEVBUDMyW3Jlc3VsdD4+Ml09c3RyZWFtLnBvc2l0aW9uO2lmKHN0cmVhbS5nZXRkZW50cyYmb2Zmc2V0PT09MCYmd2hlbmNlPT09MClzdHJlYW0uZ2V0ZGVudHM9bnVsbDtyZXR1cm4gMH1jYXRjaChlKXtpZih0eXBlb2YgRlM9PT1cInVuZGVmaW5lZFwifHwhKGUgaW5zdGFuY2VvZiBGUy5FcnJub0Vycm9yKSlhYm9ydChlKTtyZXR1cm4tZS5lcnJub319ZnVuY3Rpb24gX19fc3lzY2FsbDE0Nih3aGljaCx2YXJhcmdzKXtTWVNDQUxMUy52YXJhcmdzPXZhcmFyZ3M7dHJ5e3ZhciBzdHJlYW09U1lTQ0FMTFMuZ2V0KCksaW92PVNZU0NBTExTLmdldCgpLGlvdmNudD1TWVNDQUxMUy5nZXQoKTt2YXIgcmV0PTA7aWYoIV9fX3N5c2NhbGwxNDYuYnVmZmVyKXtfX19zeXNjYWxsMTQ2LmJ1ZmZlcnM9W251bGwsW10sW11dO19fX3N5c2NhbGwxNDYucHJpbnRDaGFyPShmdW5jdGlvbihzdHJlYW0sY3Vycil7dmFyIGJ1ZmZlcj1fX19zeXNjYWxsMTQ2LmJ1ZmZlcnNbc3RyZWFtXTthc3NlcnQoYnVmZmVyKTtpZihjdXJyPT09MHx8Y3Vycj09PTEwKXsoc3RyZWFtPT09MT9Nb2R1bGVbXCJwcmludFwiXTpNb2R1bGVbXCJwcmludEVyclwiXSkoVVRGOEFycmF5VG9TdHJpbmcoYnVmZmVyLDApKTtidWZmZXIubGVuZ3RoPTB9ZWxzZXtidWZmZXIucHVzaChjdXJyKX19KX1mb3IodmFyIGk9MDtpPGlvdmNudDtpKyspe3ZhciBwdHI9SEVBUDMyW2lvditpKjg+PjJdO3ZhciBsZW49SEVBUDMyW2lvdisoaSo4KzQpPj4yXTtmb3IodmFyIGo9MDtqPGxlbjtqKyspe19fX3N5c2NhbGwxNDYucHJpbnRDaGFyKHN0cmVhbSxIRUFQVThbcHRyK2pdKX1yZXQrPWxlbn1yZXR1cm4gcmV0fWNhdGNoKGUpe2lmKHR5cGVvZiBGUz09PVwidW5kZWZpbmVkXCJ8fCEoZSBpbnN0YW5jZW9mIEZTLkVycm5vRXJyb3IpKWFib3J0KGUpO3JldHVybi1lLmVycm5vfX1mdW5jdGlvbiBfZW1zY3JpcHRlbl9tZW1jcHlfYmlnKGRlc3Qsc3JjLG51bSl7SEVBUFU4LnNldChIRUFQVTguc3ViYXJyYXkoc3JjLHNyYytudW0pLGRlc3QpO3JldHVybiBkZXN0fWZ1bmN0aW9uIF9fX3N5c2NhbGw2KHdoaWNoLHZhcmFyZ3Mpe1NZU0NBTExTLnZhcmFyZ3M9dmFyYXJnczt0cnl7dmFyIHN0cmVhbT1TWVNDQUxMUy5nZXRTdHJlYW1Gcm9tRkQoKTtGUy5jbG9zZShzdHJlYW0pO3JldHVybiAwfWNhdGNoKGUpe2lmKHR5cGVvZiBGUz09PVwidW5kZWZpbmVkXCJ8fCEoZSBpbnN0YW5jZW9mIEZTLkVycm5vRXJyb3IpKWFib3J0KGUpO3JldHVybi1lLmVycm5vfX1fX0FURVhJVF9fLnB1c2goKGZ1bmN0aW9uKCl7dmFyIGZmbHVzaD1Nb2R1bGVbXCJfZmZsdXNoXCJdO2lmKGZmbHVzaClmZmx1c2goMCk7dmFyIHByaW50Q2hhcj1fX19zeXNjYWxsMTQ2LnByaW50Q2hhcjtpZighcHJpbnRDaGFyKXJldHVybjt2YXIgYnVmZmVycz1fX19zeXNjYWxsMTQ2LmJ1ZmZlcnM7aWYoYnVmZmVyc1sxXS5sZW5ndGgpcHJpbnRDaGFyKDEsMTApO2lmKGJ1ZmZlcnNbMl0ubGVuZ3RoKXByaW50Q2hhcigyLDEwKX0pKTtEWU5BTUlDVE9QX1BUUj1hbGxvY2F0ZSgxLFwiaTMyXCIsQUxMT0NfU1RBVElDKTtTVEFDS19CQVNFPVNUQUNLVE9QPVJ1bnRpbWUuYWxpZ25NZW1vcnkoU1RBVElDVE9QKTtTVEFDS19NQVg9U1RBQ0tfQkFTRStUT1RBTF9TVEFDSztEWU5BTUlDX0JBU0U9UnVudGltZS5hbGlnbk1lbW9yeShTVEFDS19NQVgpO0hFQVAzMltEWU5BTUlDVE9QX1BUUj4+Ml09RFlOQU1JQ19CQVNFO3N0YXRpY1NlYWxlZD10cnVlO2Z1bmN0aW9uIGludm9rZV9paShpbmRleCxhMSl7dHJ5e3JldHVybiBNb2R1bGVbXCJkeW5DYWxsX2lpXCJdKGluZGV4LGExKX1jYXRjaChlKXtpZih0eXBlb2YgZSE9PVwibnVtYmVyXCImJmUhPT1cImxvbmdqbXBcIil0aHJvdyBlO01vZHVsZVtcInNldFRocmV3XCJdKDEsMCl9fWZ1bmN0aW9uIGludm9rZV9paWlpKGluZGV4LGExLGEyLGEzKXt0cnl7cmV0dXJuIE1vZHVsZVtcImR5bkNhbGxfaWlpaVwiXShpbmRleCxhMSxhMixhMyl9Y2F0Y2goZSl7aWYodHlwZW9mIGUhPT1cIm51bWJlclwiJiZlIT09XCJsb25nam1wXCIpdGhyb3cgZTtNb2R1bGVbXCJzZXRUaHJld1wiXSgxLDApfX1Nb2R1bGUuYXNtR2xvYmFsQXJnPXtcIk1hdGhcIjpNYXRoLFwiSW50OEFycmF5XCI6SW50OEFycmF5LFwiSW50MTZBcnJheVwiOkludDE2QXJyYXksXCJJbnQzMkFycmF5XCI6SW50MzJBcnJheSxcIlVpbnQ4QXJyYXlcIjpVaW50OEFycmF5LFwiVWludDE2QXJyYXlcIjpVaW50MTZBcnJheSxcIlVpbnQzMkFycmF5XCI6VWludDMyQXJyYXksXCJGbG9hdDMyQXJyYXlcIjpGbG9hdDMyQXJyYXksXCJGbG9hdDY0QXJyYXlcIjpGbG9hdDY0QXJyYXksXCJOYU5cIjpOYU4sXCJJbmZpbml0eVwiOkluZmluaXR5fTtNb2R1bGUuYXNtTGlicmFyeUFyZz17XCJhYm9ydFwiOmFib3J0LFwiYXNzZXJ0XCI6YXNzZXJ0LFwiZW5sYXJnZU1lbW9yeVwiOmVubGFyZ2VNZW1vcnksXCJnZXRUb3RhbE1lbW9yeVwiOmdldFRvdGFsTWVtb3J5LFwiYWJvcnRPbkNhbm5vdEdyb3dNZW1vcnlcIjphYm9ydE9uQ2Fubm90R3Jvd01lbW9yeSxcImludm9rZV9paVwiOmludm9rZV9paSxcImludm9rZV9paWlpXCI6aW52b2tlX2lpaWksXCJfX19zeXNjYWxsNlwiOl9fX3N5c2NhbGw2LFwiX19fc2V0RXJyTm9cIjpfX19zZXRFcnJObyxcIl9lbXNjcmlwdGVuX21lbWNweV9iaWdcIjpfZW1zY3JpcHRlbl9tZW1jcHlfYmlnLFwiX19fc3lzY2FsbDE0MFwiOl9fX3N5c2NhbGwxNDAsXCJfZXhpdFwiOl9leGl0LFwiX19leGl0XCI6X19leGl0LFwiX19fc3lzY2FsbDE0NlwiOl9fX3N5c2NhbGwxNDYsXCJEWU5BTUlDVE9QX1BUUlwiOkRZTkFNSUNUT1BfUFRSLFwidGVtcERvdWJsZVB0clwiOnRlbXBEb3VibGVQdHIsXCJBQk9SVFwiOkFCT1JULFwiU1RBQ0tUT1BcIjpTVEFDS1RPUCxcIlNUQUNLX01BWFwiOlNUQUNLX01BWH07Ly8gRU1TQ1JJUFRFTl9TVEFSVF9BU01cbnZhciBhc209KGZ1bmN0aW9uKGdsb2JhbCxlbnYsYnVmZmVyKSB7XG5cInVzZSBhc21cIjt2YXIgYT1uZXcgZ2xvYmFsLkludDhBcnJheShidWZmZXIpO3ZhciBiPW5ldyBnbG9iYWwuSW50MTZBcnJheShidWZmZXIpO3ZhciBjPW5ldyBnbG9iYWwuSW50MzJBcnJheShidWZmZXIpO3ZhciBkPW5ldyBnbG9iYWwuVWludDhBcnJheShidWZmZXIpO3ZhciBlPW5ldyBnbG9iYWwuVWludDE2QXJyYXkoYnVmZmVyKTt2YXIgZj1uZXcgZ2xvYmFsLlVpbnQzMkFycmF5KGJ1ZmZlcik7dmFyIGc9bmV3IGdsb2JhbC5GbG9hdDMyQXJyYXkoYnVmZmVyKTt2YXIgaD1uZXcgZ2xvYmFsLkZsb2F0NjRBcnJheShidWZmZXIpO3ZhciBpPWVudi5EWU5BTUlDVE9QX1BUUnwwO3ZhciBqPWVudi50ZW1wRG91YmxlUHRyfDA7dmFyIGs9ZW52LkFCT1JUfDA7dmFyIGw9ZW52LlNUQUNLVE9QfDA7dmFyIG09ZW52LlNUQUNLX01BWHwwO3ZhciBuPTA7dmFyIG89MDt2YXIgcD0wO3ZhciBxPTA7dmFyIHI9Z2xvYmFsLk5hTixzPWdsb2JhbC5JbmZpbml0eTt2YXIgdD0wLHU9MCx2PTAsdz0wLHg9MC4wO3ZhciB5PTA7dmFyIHo9Z2xvYmFsLk1hdGguZmxvb3I7dmFyIEE9Z2xvYmFsLk1hdGguYWJzO3ZhciBCPWdsb2JhbC5NYXRoLnNxcnQ7dmFyIEM9Z2xvYmFsLk1hdGgucG93O3ZhciBEPWdsb2JhbC5NYXRoLmNvczt2YXIgRT1nbG9iYWwuTWF0aC5zaW47dmFyIEY9Z2xvYmFsLk1hdGgudGFuO3ZhciBHPWdsb2JhbC5NYXRoLmFjb3M7dmFyIEg9Z2xvYmFsLk1hdGguYXNpbjt2YXIgST1nbG9iYWwuTWF0aC5hdGFuO3ZhciBKPWdsb2JhbC5NYXRoLmF0YW4yO3ZhciBLPWdsb2JhbC5NYXRoLmV4cDt2YXIgTD1nbG9iYWwuTWF0aC5sb2c7dmFyIE09Z2xvYmFsLk1hdGguY2VpbDt2YXIgTj1nbG9iYWwuTWF0aC5pbXVsO3ZhciBPPWdsb2JhbC5NYXRoLm1pbjt2YXIgUD1nbG9iYWwuTWF0aC5tYXg7dmFyIFE9Z2xvYmFsLk1hdGguY2x6MzI7dmFyIFI9Z2xvYmFsLk1hdGguZnJvdW5kO3ZhciBTPWVudi5hYm9ydDt2YXIgVD1lbnYuYXNzZXJ0O3ZhciBVPWVudi5lbmxhcmdlTWVtb3J5O3ZhciBWPWVudi5nZXRUb3RhbE1lbW9yeTt2YXIgVz1lbnYuYWJvcnRPbkNhbm5vdEdyb3dNZW1vcnk7dmFyIFg9ZW52Lmludm9rZV9paTt2YXIgWT1lbnYuaW52b2tlX2lpaWk7dmFyIFo9ZW52Ll9fX3N5c2NhbGw2O3ZhciBfPWVudi5fX19zZXRFcnJObzt2YXIgJD1lbnYuX2Vtc2NyaXB0ZW5fbWVtY3B5X2JpZzt2YXIgYWE9ZW52Ll9fX3N5c2NhbGwxNDA7dmFyIGJhPWVudi5fZXhpdDt2YXIgY2E9ZW52Ll9fZXhpdDt2YXIgZGE9ZW52Ll9fX3N5c2NhbGwxNDY7dmFyIGVhPVIoMCk7Y29uc3QgZmE9UigwKTtcbi8vIEVNU0NSSVBURU5fU1RBUlRfRlVOQ1NcbmZ1bmN0aW9uIGlhKGEpe2E9YXwwO3ZhciBiPTA7Yj1sO2w9bCthfDA7bD1sKzE1Ji0xNjtyZXR1cm4gYnwwfWZ1bmN0aW9uIGphKCl7cmV0dXJuIGx8MH1mdW5jdGlvbiBrYShhKXthPWF8MDtsPWF9ZnVuY3Rpb24gbGEoYSxiKXthPWF8MDtiPWJ8MDtsPWE7bT1ifWZ1bmN0aW9uIG1hKGEsYil7YT1hfDA7Yj1ifDA7aWYoIW4pe249YTtvPWJ9fWZ1bmN0aW9uIG5hKGEpe2E9YXwwO3k9YX1mdW5jdGlvbiBvYSgpe3JldHVybiB5fDB9ZnVuY3Rpb24gcGEoYSl7YT1hfDA7eWEoYSk7cmV0dXJufWZ1bmN0aW9uIHFhKGEsYixkLGUpe2E9YXwwO2I9YnwwO2Q9ZHwwO2U9ZXwwO3ZhciBmPTAsaD0wLjAsaT0wLjA7Zj0oYTw8MykrMjY0fDA7aWYoIWUpZj14YShmKXwwO2Vsc2V7aWYoIWQpZD0wO2Vsc2UgZD0oY1tlPj4yXXwwKT4+PjA8Zj4+PjA/MDpkO2NbZT4+Ml09ZjtmPWR9aWYoIWYpcmV0dXJuIGZ8MDtjW2Y+PjJdPWE7ZT1mKzR8MDtjW2U+PjJdPWI7aD0rKGF8MCk7YTpkbyBpZigoYXwwKT4wKXtkPTA7d2hpbGUoMSl7aT0rKGR8MCkqLTYuMjgzMTg1MzA3MTc5NTg2L2g7aT0oYnwwKT09MD9pOi1pO2dbZisyNjQrKGQ8PDMpPj4yXT1SKCtEKCtpKSk7Z1tmKzI2NCsoZDw8MykrND4+Ml09UigrRSgraSkpO2Q9ZCsxfDA7aWYoKGR8MCk9PShhfDApKWJyZWFrIGE7Yj1jW2U+PjJdfDB9fXdoaWxlKDApO2g9K3ooKygrQigraCkpKTtiPWE7ZD00O2U9Zis4fDA7d2hpbGUoMSl7YjpkbyBpZigoYnwwKSUoZHwwKXwwKXdoaWxlKDEpe3N3aXRjaChkfDApe2Nhc2UgNDp7ZD0yO2JyZWFrfWNhc2UgMjp7ZD0zO2JyZWFrfWRlZmF1bHQ6ZD1kKzJ8MH1kPSsoZHwwKT5oP2I6ZDtpZighKChifDApJShkfDApfDApKWJyZWFrIGJ9d2hpbGUoMCk7Yj0oYnwwKS8oZHwwKXwwO2NbZT4+Ml09ZDtjW2UrND4+Ml09YjtpZigoYnwwKTw9MSlicmVhaztlbHNlIGU9ZSs4fDB9cmV0dXJuIGZ8MH1mdW5jdGlvbiByYShhLGIsZCxlLGYsaCl7YT1hfDA7Yj1ifDA7ZD1kfDA7ZT1lfDA7Zj1mfDA7aD1ofDA7dmFyIGk9MCxrPTAsbD0wLG09ZmEsbj0wLG89ZmEscD1mYSxxPWZhLHI9MCxzPTAsdD0wLHU9MCx2PTAsdz0wLHg9MCx5PWZhLHo9ZmEsQT1mYSxCPWZhLEM9MCxEPWZhLEU9ZmEsRj1mYSxHPWZhLEg9ZmEsST1mYSxKPWZhLEs9ZmEsTD1mYSxNPWZhO3c9Y1tmPj4yXXwwO249Zis4fDA7eD1jW2YrND4+Ml18MDtyPWErKChOKHgsdyl8MCk8PDMpfDA7aWYoKHh8MCk9PTEpe2s9TihlLGQpfDA7aT1hO2Y9Yjt3aGlsZSgxKXt0PWY7dT1jW3QrND4+Ml18MDt2PWk7Y1t2Pj4yXT1jW3Q+PjJdO2Nbdis0Pj4yXT11O2k9aSs4fDA7aWYoKGl8MCk9PShyfDApKWJyZWFrO2Vsc2UgZj1mKyhrPDwzKXwwfX1lbHNle2s9Tih3LGQpfDA7bD1OKGUsZCl8MDtpPWE7Zj1iO3doaWxlKDEpe3JhKGksZixrLGUsbixoKTtpPWkrKHg8PDMpfDA7aWYoKGl8MCk9PShyfDApKWJyZWFrO2Vsc2UgZj1mKyhsPDwzKXwwfX1zd2l0Y2god3wwKXtjYXNlIDI6e2s9YTtsPXg7aT1oKzI2NHwwO2Y9YSsoeDw8Myl8MDt3aGlsZSgxKXtvPVIoZ1tmPj4yXSk7eT1SKGdbaT4+Ml0pO3A9UihvKnkpO2E9Zis0fDA7bT1SKGdbYT4+Ml0pO3E9UihnW2krND4+Ml0pO3A9UihwLVIobSpxKSk7cT1SKFIoeSptKStSKG8qcSkpO2dbZj4+Ml09UihSKGdbaz4+Ml0pLXApO3g9ays0fDA7Z1thPj4yXT1SKFIoZ1t4Pj4yXSktcSk7Z1trPj4yXT1SKHArUihnW2s+PjJdKSk7Z1t4Pj4yXT1SKHErUihnW3g+PjJdKSk7bD1sKy0xfDA7aWYoIWwpYnJlYWs7ZWxzZXtrPWsrOHwwO2k9aSsoZDw8Myl8MDtmPWYrOHwwfX1yZXR1cm59Y2FzZSAzOntuPXg8PDE7bT1SKGdbaCsyNjQrKChOKHgsZCl8MCk8PDMpKzQ+PjJdKTtsPWgrMjY0fDA7ZT1kPDwxO2Y9YTtpPXg7az1sO3doaWxlKDEpe2g9ZisoeDw8Myl8MDtvPVIoZ1toPj4yXSk7eT1SKGdbaz4+Ml0pO0E9UihvKnkpO2E9ZisoeDw8MykrNHwwO0I9UihnW2E+PjJdKTt6PVIoZ1trKzQ+PjJdKTtBPVIoQS1SKEIqeikpO3o9UihSKHkqQikrUihvKnopKTt2PWYrKG48PDMpfDA7bz1SKGdbdj4+Ml0pO0I9UihnW2w+PjJdKTt5PVIobypCKTt3PWYrKG48PDMpKzR8MDtwPVIoZ1t3Pj4yXSk7cT1SKGdbbCs0Pj4yXSk7eT1SKHktUihwKnEpKTtxPVIoUihCKnApK1IobypxKSk7bz1SKEEreSk7cD1SKHorcSk7eT1SKEEteSk7cT1SKHotcSk7Z1toPj4yXT1SKCtSKGdbZj4+Ml0pLStvKi41KTt1PWYrNHwwO2dbYT4+Ml09UigrUihnW3U+PjJdKS0rcCouNSk7eT1SKG0qeSk7cT1SKG0qcSk7Z1tmPj4yXT1SKG8rUihnW2Y+PjJdKSk7Z1t1Pj4yXT1SKHArUihnW3U+PjJdKSk7Z1t2Pj4yXT1SKHErUihnW2g+PjJdKSk7Z1t3Pj4yXT1SKFIoZ1thPj4yXSkteSk7Z1toPj4yXT1SKFIoZ1toPj4yXSktcSk7Z1thPj4yXT1SKHkrUihnW2E+PjJdKSk7aT1pKy0xfDA7aWYoIWkpYnJlYWs7ZWxzZXtmPWYrOHwwO2s9aysoZDw8Myl8MDtsPWwrKGU8PDMpfDB9fXJldHVybn1jYXNlIDQ6e249eDw8MTtiPXgqM3wwO2Y9aCsyNjR8MDtyPWQ8PDE7cz1kKjN8MDtpZighKGNbaCs0Pj4yXXwwKSl7aT1hO2s9ZjtsPXg7ZT1mO3doaWxlKDEpe3Y9aSsoeDw8Myl8MDttPVIoZ1t2Pj4yXSk7Qj1SKGdbaz4+Ml0pO0U9UihtKkIpO3c9aSsoeDw8MykrNHwwO3o9UihnW3c+PjJdKTtEPVIoZ1trKzQ+PjJdKTtFPVIoRS1SKHoqRCkpO0Q9UihSKEIqeikrUihtKkQpKTtDPWkrKG48PDMpfDA7bT1SKGdbQz4+Ml0pO3o9UihnW2U+PjJdKTtCPVIobSp6KTt0PWkrKG48PDMpKzR8MDtvPVIoZ1t0Pj4yXSk7cD1SKGdbZSs0Pj4yXSk7Qj1SKEItUihvKnApKTtwPVIoUih6Km8pK1IobSpwKSk7aD1pKyhiPDwzKXwwO209UihnW2g+PjJdKTtvPVIoZ1tmPj4yXSk7ej1SKG0qbyk7YT1pKyhiPDwzKSs0fDA7cT1SKGdbYT4+Ml0pO3k9UihnW2YrND4+Ml0pO3o9Uih6LVIocSp5KSk7eT1SKFIobypxKStSKG0qeSkpO209UihnW2k+PjJdKTtxPVIobS1CKTt1PWkrNHwwO289UihnW3U+PjJdKTtBPVIoby1wKTttPVIoQittKTtnW2k+PjJdPW07bz1SKHArbyk7Z1t1Pj4yXT1vO3A9UihFK3opO0I9UihEK3kpO3o9UihFLXopO3k9UihELXkpO2dbQz4+Ml09UihtLXApO2dbdD4+Ml09UihvLUIpO2dbaT4+Ml09UihwK1IoZ1tpPj4yXSkpO2dbdT4+Ml09UihCK1IoZ1t1Pj4yXSkpO0I9UihBK3opO3o9UihBLXopO0E9UihxLXkpO2dbdj4+Ml09UihxK3kpO2dbdz4+Ml09ejtnW2g+PjJdPUE7Z1thPj4yXT1CO2w9bCstMXwwO2lmKCFsKWJyZWFrO2Vsc2V7aT1pKzh8MDtrPWsrKGQ8PDMpfDA7ZT1lKyhyPDwzKXwwO2Y9Zisoczw8Myl8MH19cmV0dXJufWVsc2V7aT1hO2s9ZjtsPXg7ZT1mO3doaWxlKDEpe3c9aSsoeDw8Myl8MDtwPVIoZ1t3Pj4yXSk7Qj1SKGdbaz4+Ml0pO209UihwKkIpO2g9aSsoeDw8MykrNHwwO0U9UihnW2g+PjJdKTtvPVIoZ1trKzQ+PjJdKTttPVIobS1SKEUqbykpO289UihSKEIqRSkrUihwKm8pKTt0PWkrKG48PDMpfDA7cD1SKGdbdD4+Ml0pO0U9UihnW2U+PjJdKTtCPVIocCpFKTt1PWkrKG48PDMpKzR8MDtxPVIoZ1t1Pj4yXSk7eT1SKGdbZSs0Pj4yXSk7Qj1SKEItUihxKnkpKTt5PVIoUihFKnEpK1IocCp5KSk7YT1pKyhiPDwzKXwwO3A9UihnW2E+PjJdKTtxPVIoZ1tmPj4yXSk7RT1SKHAqcSk7Qz1pKyhiPDwzKSs0fDA7ej1SKGdbQz4+Ml0pO0E9UihnW2YrND4+Ml0pO0U9UihFLVIoeipBKSk7QT1SKFIocSp6KStSKHAqQSkpO3A9UihnW2k+PjJdKTt6PVIocC1CKTt2PWkrNHwwO3E9UihnW3Y+PjJdKTtEPVIocS15KTtwPVIoQitwKTtnW2k+PjJdPXA7cT1SKHkrcSk7Z1t2Pj4yXT1xO3k9UihtK0UpO0I9UihvK0EpO0U9UihtLUUpO0E9UihvLUEpO2dbdD4+Ml09UihwLXkpO2dbdT4+Ml09UihxLUIpO2dbaT4+Ml09Uih5K1IoZ1tpPj4yXSkpO2dbdj4+Ml09UihCK1IoZ1t2Pj4yXSkpO0I9UihEK0UpO0U9UihELUUpO0Q9Uih6K0EpO2dbdz4+Ml09Uih6LUEpO2dbaD4+Ml09QjtnW2E+PjJdPUQ7Z1tDPj4yXT1FO2w9bCstMXwwO2lmKCFsKWJyZWFrO2Vsc2V7aT1pKzh8MDtrPWsrKGQ8PDMpfDA7ZT1lKyhyPDwzKXwwO2Y9Zisoczw8Myl8MH19cmV0dXJufX1jYXNlIDU6e0M9Tih4LGQpfDA7bz1SKGdbaCsyNjQrKEM8PDMpPj4yXSk7cT1SKGdbaCsyNjQrKEM8PDMpKzQ+PjJdKTtDPU4oeCxkPDwxKXwwO209UihnW2grMjY0KyhDPDwzKT4+Ml0pO3A9UihnW2grMjY0KyhDPDwzKSs0Pj4yXSk7aWYoKHh8MCk8PTApcmV0dXJuO2I9ZCozfDA7aT1hKyh4PDwzKXwwO2s9YSsoeDw8MTw8Myl8MDtsPWErKHgqMzw8Myl8MDtlPWErKHg8PDI8PDMpfDA7bj0wO2Y9YTt3aGlsZSgxKXtIPVIoZ1tmPj4yXSk7dT1mKzR8MDtGPVIoZ1t1Pj4yXSk7QT1SKGdbaT4+Ml0pO3Q9TihuLGQpfDA7Sj1SKGdbaCsyNjQrKHQ8PDMpPj4yXSk7Rz1SKEEqSik7dj1pKzR8MDtFPVIoZ1t2Pj4yXSk7ST1SKGdbaCsyNjQrKHQ8PDMpKzQ+PjJdKTtHPVIoRy1SKEUqSSkpO0k9UihSKEoqRSkrUihBKkkpKTtBPVIoZ1trPj4yXSk7dD1OKG48PDEsZCl8MDtFPVIoZ1toKzI2NCsodDw8Myk+PjJdKTtKPVIoQSpFKTthPWsrNHwwO3o9UihnW2E+PjJdKTtMPVIoZ1toKzI2NCsodDw8MykrND4+Ml0pO0o9UihKLVIoeipMKSk7TD1SKFIoRSp6KStSKEEqTCkpO0E9UihnW2w+PjJdKTt0PU4oYixuKXwwO3o9UihnW2grMjY0Kyh0PDwzKT4+Ml0pO0U9UihBKnopO0M9bCs0fDA7TT1SKGdbQz4+Ml0pO3k9UihnW2grMjY0Kyh0PDwzKSs0Pj4yXSk7RT1SKEUtUihNKnkpKTt5PVIoUih6Kk0pK1IoQSp5KSk7QT1SKGdbZT4+Ml0pO3Q9TihuPDwyLGQpfDA7TT1SKGdbaCsyNjQrKHQ8PDMpPj4yXSk7ej1SKEEqTSk7dz1lKzR8MDtEPVIoZ1t3Pj4yXSk7Qj1SKGdbaCsyNjQrKHQ8PDMpKzQ+PjJdKTt6PVIoei1SKEQqQikpO0I9UihSKE0qRCkrUihBKkIpKTtBPVIoRyt6KTtEPVIoSStCKTt6PVIoRy16KTtCPVIoSS1CKTtJPVIoSitFKTtHPVIoTCt5KTtFPVIoSi1FKTt5PVIoTC15KTtnW2Y+PjJdPVIoSCtSKEkrQSkpO2dbdT4+Ml09UihGK1IoRytEKSk7TD1SKFIobSpJKStSKEgrUihvKkEpKSk7Sj1SKFIobSpHKStSKEYrUihvKkQpKSk7TT1SKFIocCp5KStSKHEqQikpO0s9UihSKC1SKHEqeikpLVIocCpFKSk7Z1tpPj4yXT1SKEwtTSk7Z1t2Pj4yXT1SKEotSyk7Z1tlPj4yXT1SKE0rTCk7Z1t3Pj4yXT1SKEsrSik7QT1SKFIobypJKStSKEgrUihtKkEpKSk7RD1SKFIobypHKStSKEYrUihtKkQpKSk7Qj1SKFIocSp5KS1SKHAqQikpO0U9UihSKHAqeiktUihxKkUpKTtnW2s+PjJdPVIoQitBKTtnW2E+PjJdPVIoRStEKTtnW2w+PjJdPVIoQS1CKTtnW0M+PjJdPVIoRC1FKTtuPW4rMXwwO2lmKChufDApPT0oeHwwKSlicmVhaztlbHNle2k9aSs4fDA7az1rKzh8MDtsPWwrOHwwO2U9ZSs4fDA7Zj1mKzh8MH19cmV0dXJufWRlZmF1bHQ6e3U9Y1toPj4yXXwwO3Y9eGEodzw8Myl8MDtkbyBpZigoeHwwKT4wPyh3fDApPjA6MCl7aWYoKHd8MCk9PTEpe2Y9MDtkb3trPWErKGY8PDMpfDA7aT1jW2s+PjJdfDA7az1jW2srND4+Ml18MDtDPWErKGY8PDMpfDA7Y1tDPj4yXT1pO2NbQys0Pj4yXT1rO2Y9ZisxfDB9d2hpbGUoKGZ8MCkhPSh4fDApKTtDPXY7Y1tDPj4yXT1pO2NbQys0Pj4yXT1rO2JyZWFrfWVsc2UgdD0wO2Rve2Y9dDtpPTA7d2hpbGUoMSl7cj1hKyhmPDwzKXwwO3M9Y1tyKzQ+PjJdfDA7Qz12KyhpPDwzKXwwO2NbQz4+Ml09Y1tyPj4yXTtjW0MrND4+Ml09cztpPWkrMXwwO2lmKChpfDApPT0od3wwKSlicmVhaztlbHNlIGY9Zit4fDB9bj12O2U9Y1tuPj4yXXwwO249Y1tuKzQ+PjJdfDA7bT0oY1tqPj4yXT1lLFIoZ1tqPj4yXSkpO2s9dDtsPTA7d2hpbGUoMSl7Yj1hKyhrPDwzKXwwO3I9YjtjW3I+PjJdPWU7Y1tyKzQ+PjJdPW47cj1OKGssZCl8MDtzPWErKGs8PDMpKzR8MDtmPTE7aT0wO289bTtwPVIoZ1tzPj4yXSk7ZG97Qz1pK3J8MDtpPUMtKChDfDApPCh1fDApPzA6dSl8MDtNPVIoZ1t2KyhmPDwzKT4+Ml0pO0k9UihnW2grMjY0KyhpPDwzKT4+Ml0pO0o9UihNKkkpO0s9UihnW3YrKGY8PDMpKzQ+PjJdKTtMPVIoZ1toKzI2NCsoaTw8MykrND4+Ml0pO009UihSKEkqSykrUihNKkwpKTtvPVIobytSKEotUihLKkwpKSk7Z1tiPj4yXT1vO3A9UihwK00pO2dbcz4+Ml09cDtmPWYrMXwwfXdoaWxlKChmfDApIT0od3wwKSk7bD1sKzF8MDtpZigobHwwKT09KHd8MCkpYnJlYWs7ZWxzZSBrPWsreHwwfXQ9dCsxfDB9d2hpbGUoKHR8MCkhPSh4fDApKX13aGlsZSgwKTt5YSh2KTtyZXR1cm59fX1mdW5jdGlvbiBzYShhLGIsZCl7YT1hfDA7Yj1ifDA7ZD1kfDA7aWYoKGJ8MCk9PShkfDApKXtkPXhhKGNbYT4+Ml08PDMpfDA7cmEoZCxiLDEsMSxhKzh8MCxhKTtRYShifDAsZHwwLGNbYT4+Ml08PDN8MCl8MDt5YShkKTtyZXR1cm59ZWxzZXtyYShkLGIsMSwxLGErOHwwLGEpO3JldHVybn19ZnVuY3Rpb24gdGEoYSl7YT1hfDA7eWEoYSk7cmV0dXJufWZ1bmN0aW9uIHVhKGEsYixkLGUpe2E9YXwwO2I9YnwwO2Q9ZHwwO2U9ZXwwO3ZhciBmPTAuMCxoPTAsaT0wLGo9MCxrPTAsbT0wLG49MC4wO2s9bDtsPWwrMTZ8MDtpPWs7aWYoYSYxfDApe01hKDM4MCwzNiwxLGNbNjNdfDApfDA7Yj0wO2w9aztyZXR1cm4gYnwwfWo9YT4+MTtxYShqLGIsMCxpKXwwO2g9Y1tpPj4yXXwwO2E9KCgoaiozfDApLzJ8MCk8PDMpKzEyK2h8MDtpZihlKXttPShjW2U+PjJdfDApPj4+MDxhPj4+MDtjW2U+PjJdPWE7aWYobSl7bT0wO2w9aztyZXR1cm4gbXwwfX1lbHNlIGQ9eGEoYSl8MDtpZighZCl7bT0wO2w9aztyZXR1cm4gbXwwfW09ZCsxMnwwO2NbZD4+Ml09bTtoPW0raHwwO2NbZCs0Pj4yXT1oO2E9ZCs4fDA7Y1thPj4yXT1oKyhqPDwzKTtxYShqLGIsbSxpKXwwO2g9KGp8MCkvMnwwO2lmKChqfDApPD0xKXttPWQ7bD1rO3JldHVybiBtfDB9Zj0rKGp8MCk7ZT1jW2E+PjJdfDA7aWYoIWIpe2E9MDtkb3ttPWE7YT1hKzF8MDtuPSgrKGF8MCkvZisuNSkqLTMuMTQxNTkyNjUzNTg5NzkzO2dbZSsobTw8Myk+PjJdPVIoK0QoK24pKTtnW2UrKG08PDMpKzQ+PjJdPVIoK0UoK24pKX13aGlsZSgoYXwwKTwoaHwwKSk7bD1rO3JldHVybiBkfDB9ZWxzZXthPTA7ZG97bT1hO2E9YSsxfDA7bj0oKyhhfDApL2YrLjUpKi0zLjE0MTU5MjY1MzU4OTc5MztnW2UrKG08PDMpPj4yXT1SKCtEKCtuKSk7Z1tlKyhtPDwzKSs0Pj4yXT1SKCtFKCstbikpfXdoaWxlKChhfDApPChofDApKTtsPWs7cmV0dXJuIGR8MH1yZXR1cm4gMH1mdW5jdGlvbiB2YShhLGIsZCl7YT1hfDA7Yj1ifDA7ZD1kfDA7dmFyIGU9MCxmPTAsaD0wLGk9MCxqPWZhLGs9ZmEsbD1mYSxtPWZhLG49ZmEsbz1mYSxwPWZhLHE9MDtlPWNbYT4+Ml18MDtpZihjW2UrND4+Ml18MCl7TWEoNDE3LDM3LDEsY1s2M118MCl8MDtiYSgxKX1pPWNbZT4+Ml18MDtmPWErNHwwO3NhKGUsYixjW2Y+PjJdfDApO2Y9Y1tmPj4yXXwwO2s9UihnW2Y+PjJdKTtqPVIoZ1tmKzQ+PjJdKTtnW2Q+PjJdPVIoaytqKTtnW2QrKGk8PDMpPj4yXT1SKGstaik7Z1tkKzQ+PjJdPVIoMC4wKTtnW2QrKGk8PDMpKzQ+PjJdPVIoMC4wKTtoPShpfDApLzJ8MDtpZigoaXwwKTwyKXJldHVybjtlPWNbYSs4Pj4yXXwwO2I9MTt3aGlsZSgxKXtsPVIoZ1tmKyhiPDwzKT4+Ml0pO289UihnW2YrKGI8PDMpKzQ+PjJdKTthPWktYnwwO249UihnW2YrKGE8PDMpPj4yXSk7cD1SKGdbZisoYTw8MykrND4+Ml0pO209UihsK24pO2s9UihvLXApO249UihsLW4pO3A9UihvK3ApO3E9YistMXwwO289UihnW2UrKHE8PDMpPj4yXSk7bD1SKG4qbyk7aj1SKGdbZSsocTw8MykrND4+Ml0pO2w9UihsLVIocCpqKSk7aj1SKFIocCpvKStSKG4qaikpO2dbZCsoYjw8Myk+PjJdPVIoUihtK2wpKlIoLjUpKTtnW2QrKGI8PDMpKzQ+PjJdPVIoUihrK2opKlIoLjUpKTtnW2QrKGE8PDMpPj4yXT1SKFIobS1sKSpSKC41KSk7Z1tkKyhhPDwzKSs0Pj4yXT1SKFIoai1rKSpSKC41KSk7aWYoKGJ8MCk8KGh8MCkpYj1iKzF8MDtlbHNlIGJyZWFrfXJldHVybn1mdW5jdGlvbiB3YShhLGIsZCl7YT1hfDA7Yj1ifDA7ZD1kfDA7dmFyIGU9MCxmPTAsaD0wLGk9MCxqPTAsaz1mYSxsPTAsbT1mYSxuPWZhLG89ZmEscD1mYSxxPWZhLHI9ZmEscz0wO2k9Y1thPj4yXXwwO2lmKCEoY1tpKzQ+PjJdfDApKXtNYSg0MTcsMzcsMSxjWzYzXXwwKXwwO2JhKDEpfWo9Y1tpPj4yXXwwO2s9UihnW2I+PjJdKTtoPWIrKGo8PDMpfDA7az1SKGsrUihnW2g+PjJdKSk7Zj1jW2ErND4+Ml18MDtnW2Y+PjJdPWs7az1SKGdbYj4+Ml0pO2dbZis0Pj4yXT1SKGstUihnW2g+PjJdKSk7aD0oanwwKS8yfDA7aWYoKGp8MCk8Mil7c2EoaSxmLGQpO3JldHVybn1lPWNbYSs4Pj4yXXwwO2E9MTt3aGlsZSgxKXtuPVIoZ1tiKyhhPDwzKT4+Ml0pO3E9UihnW2IrKGE8PDMpKzQ+PjJdKTtsPWotYXwwO3A9UihnW2IrKGw8PDMpPj4yXSk7cj1SKGdbYisobDw8MykrND4+Ml0pO289UihuK3ApO209UihxLXIpO3A9UihuLXApO3I9UihxK3IpO3M9YSstMXwwO3E9UihnW2UrKHM8PDMpPj4yXSk7bj1SKHAqcSk7az1SKGdbZSsoczw8MykrND4+Ml0pO249UihuLVIociprKSk7az1SKFIocipxKStSKHAqaykpO2dbZisoYTw8Myk+PjJdPVIobytuKTtnW2YrKGE8PDMpKzQ+PjJdPVIobStrKTtnW2YrKGw8PDMpPj4yXT1SKG8tbik7Z1tmKyhsPDwzKSs0Pj4yXT1SKC1SKG0taykpO2lmKChhfDApPChofDApKWE9YSsxfDA7ZWxzZSBicmVha31zYShpLGYsZCk7cmV0dXJufWZ1bmN0aW9uIHhhKGEpe2E9YXwwO3ZhciBiPTAsZD0wLGU9MCxmPTAsZz0wLGg9MCxpPTAsaj0wLGs9MCxtPTAsbj0wLG89MCxwPTAscT0wLHI9MCxzPTAsdD0wLHU9MCx2PTAsdz0wLHg9MDt4PWw7bD1sKzE2fDA7bz14O2RvIGlmKGE+Pj4wPDI0NSl7az1hPj4+MDwxMT8xNjphKzExJi04O2E9az4+PjM7bj1jWzExNF18MDtkPW4+Pj5hO2lmKGQmM3wwKXtiPShkJjFeMSkrYXwwO2E9NDk2KyhiPDwxPDwyKXwwO2Q9YSs4fDA7ZT1jW2Q+PjJdfDA7Zj1lKzh8MDtnPWNbZj4+Ml18MDtpZigoYXwwKT09KGd8MCkpY1sxMTRdPW4mfigxPDxiKTtlbHNle2NbZysxMj4+Ml09YTtjW2Q+PjJdPWd9dz1iPDwzO2NbZSs0Pj4yXT13fDM7dz1lK3crNHwwO2Nbdz4+Ml09Y1t3Pj4yXXwxO3c9ZjtsPXg7cmV0dXJuIHd8MH1tPWNbMTE2XXwwO2lmKGs+Pj4wPm0+Pj4wKXtpZihkfDApe2I9Mjw8YTtiPWQ8PGEmKGJ8MC1iKTtiPShiJjAtYikrLTF8MDtoPWI+Pj4xMiYxNjtiPWI+Pj5oO2Q9Yj4+PjUmODtiPWI+Pj5kO2Y9Yj4+PjImNDtiPWI+Pj5mO2E9Yj4+PjEmMjtiPWI+Pj5hO2U9Yj4+PjEmMTtlPShkfGh8ZnxhfGUpKyhiPj4+ZSl8MDtiPTQ5NisoZTw8MTw8Mil8MDthPWIrOHwwO2Y9Y1thPj4yXXwwO2g9Zis4fDA7ZD1jW2g+PjJdfDA7aWYoKGJ8MCk9PShkfDApKXthPW4mfigxPDxlKTtjWzExNF09YX1lbHNle2NbZCsxMj4+Ml09YjtjW2E+PjJdPWQ7YT1ufWc9KGU8PDMpLWt8MDtjW2YrND4+Ml09a3wzO2U9ZitrfDA7Y1tlKzQ+PjJdPWd8MTtjW2UrZz4+Ml09ZztpZihtfDApe2Y9Y1sxMTldfDA7Yj1tPj4+MztkPTQ5NisoYjw8MTw8Mil8MDtiPTE8PGI7aWYoIShhJmIpKXtjWzExNF09YXxiO2I9ZDthPWQrOHwwfWVsc2V7YT1kKzh8MDtiPWNbYT4+Ml18MH1jW2E+PjJdPWY7Y1tiKzEyPj4yXT1mO2NbZis4Pj4yXT1iO2NbZisxMj4+Ml09ZH1jWzExNl09ZztjWzExOV09ZTt3PWg7bD14O3JldHVybiB3fDB9aT1jWzExNV18MDtpZihpKXtkPShpJjAtaSkrLTF8MDtoPWQ+Pj4xMiYxNjtkPWQ+Pj5oO2c9ZD4+PjUmODtkPWQ+Pj5nO2o9ZD4+PjImNDtkPWQ+Pj5qO2U9ZD4+PjEmMjtkPWQ+Pj5lO2E9ZD4+PjEmMTthPWNbNzYwKygoZ3xofGp8ZXxhKSsoZD4+PmEpPDwyKT4+Ml18MDtkPShjW2ErND4+Ml0mLTgpLWt8MDtlPWNbYSsxNisoKChjW2ErMTY+PjJdfDApPT0wJjEpPDwyKT4+Ml18MDtpZighZSl7aj1hO2c9ZH1lbHNle2Rve2g9KGNbZSs0Pj4yXSYtOCkta3wwO2o9aD4+PjA8ZD4+PjA7ZD1qP2g6ZDthPWo/ZTphO2U9Y1tlKzE2KygoKGNbZSsxNj4+Ml18MCk9PTAmMSk8PDIpPj4yXXwwfXdoaWxlKChlfDApIT0wKTtqPWE7Zz1kfWg9aitrfDA7aWYoaj4+PjA8aD4+PjApe2Y9Y1tqKzI0Pj4yXXwwO2I9Y1tqKzEyPj4yXXwwO2RvIGlmKChifDApPT0oanwwKSl7YT1qKzIwfDA7Yj1jW2E+PjJdfDA7aWYoIWIpe2E9aisxNnwwO2I9Y1thPj4yXXwwO2lmKCFiKXtkPTA7YnJlYWt9fXdoaWxlKDEpe2Q9YisyMHwwO2U9Y1tkPj4yXXwwO2lmKGV8MCl7Yj1lO2E9ZDtjb250aW51ZX1kPWIrMTZ8MDtlPWNbZD4+Ml18MDtpZighZSlicmVhaztlbHNle2I9ZTthPWR9fWNbYT4+Ml09MDtkPWJ9ZWxzZXtkPWNbais4Pj4yXXwwO2NbZCsxMj4+Ml09YjtjW2IrOD4+Ml09ZDtkPWJ9d2hpbGUoMCk7ZG8gaWYoZnwwKXtiPWNbaisyOD4+Ml18MDthPTc2MCsoYjw8Mil8MDtpZigoanwwKT09KGNbYT4+Ml18MCkpe2NbYT4+Ml09ZDtpZighZCl7Y1sxMTVdPWkmfigxPDxiKTticmVha319ZWxzZXtjW2YrMTYrKCgoY1tmKzE2Pj4yXXwwKSE9KGp8MCkmMSk8PDIpPj4yXT1kO2lmKCFkKWJyZWFrfWNbZCsyND4+Ml09ZjtiPWNbaisxNj4+Ml18MDtpZihifDApe2NbZCsxNj4+Ml09YjtjW2IrMjQ+PjJdPWR9Yj1jW2orMjA+PjJdfDA7aWYoYnwwKXtjW2QrMjA+PjJdPWI7Y1tiKzI0Pj4yXT1kfX13aGlsZSgwKTtpZihnPj4+MDwxNil7dz1nK2t8MDtjW2orND4+Ml09d3wzO3c9ait3KzR8MDtjW3c+PjJdPWNbdz4+Ml18MX1lbHNle2Nbais0Pj4yXT1rfDM7Y1toKzQ+PjJdPWd8MTtjW2grZz4+Ml09ZztpZihtfDApe2U9Y1sxMTldfDA7Yj1tPj4+MztkPTQ5NisoYjw8MTw8Mil8MDtiPTE8PGI7aWYoIShuJmIpKXtjWzExNF09bnxiO2I9ZDthPWQrOHwwfWVsc2V7YT1kKzh8MDtiPWNbYT4+Ml18MH1jW2E+PjJdPWU7Y1tiKzEyPj4yXT1lO2NbZSs4Pj4yXT1iO2NbZSsxMj4+Ml09ZH1jWzExNl09ZztjWzExOV09aH13PWorOHwwO2w9eDtyZXR1cm4gd3wwfWVsc2Ugbj1rfWVsc2Ugbj1rfWVsc2Ugbj1rfWVsc2UgaWYoYT4+PjA8PTQyOTQ5NjcyMzEpe2E9YSsxMXwwO2s9YSYtODtqPWNbMTE1XXwwO2lmKGope2U9MC1rfDA7YT1hPj4+ODtpZihhKWlmKGs+Pj4wPjE2Nzc3MjE1KWk9MzE7ZWxzZXtuPShhKzEwNDgzMjB8MCk+Pj4xNiY4O3Y9YTw8bjttPSh2KzUyMDE5MnwwKT4+PjE2JjQ7dj12PDxtO2k9KHYrMjQ1NzYwfDApPj4+MTYmMjtpPTE0LShtfG58aSkrKHY8PGk+Pj4xNSl8MDtpPWs+Pj4oaSs3fDApJjF8aTw8MX1lbHNlIGk9MDtkPWNbNzYwKyhpPDwyKT4+Ml18MDthOmRvIGlmKCFkKXtkPTA7YT0wO3Y9NTd9ZWxzZXthPTA7aD1rPDwoKGl8MCk9PTMxPzA6MjUtKGk+Pj4xKXwwKTtnPTA7d2hpbGUoMSl7Zj0oY1tkKzQ+PjJdJi04KS1rfDA7aWYoZj4+PjA8ZT4+PjApaWYoIWYpe2E9ZDtlPTA7Zj1kO3Y9NjE7YnJlYWsgYX1lbHNle2E9ZDtlPWZ9Zj1jW2QrMjA+PjJdfDA7ZD1jW2QrMTYrKGg+Pj4zMTw8Mik+PjJdfDA7Zz0oZnwwKT09MHwoZnwwKT09KGR8MCk/ZzpmO2Y9KGR8MCk9PTA7aWYoZil7ZD1nO3Y9NTc7YnJlYWt9ZWxzZSBoPWg8PCgoZl4xKSYxKX19d2hpbGUoMCk7aWYoKHZ8MCk9PTU3KXtpZigoZHwwKT09MCYoYXwwKT09MCl7YT0yPDxpO2E9aiYoYXwwLWEpO2lmKCFhKXtuPWs7YnJlYWt9bj0oYSYwLWEpKy0xfDA7aD1uPj4+MTImMTY7bj1uPj4+aDtnPW4+Pj41Jjg7bj1uPj4+ZztpPW4+Pj4yJjQ7bj1uPj4+aTttPW4+Pj4xJjI7bj1uPj4+bTtkPW4+Pj4xJjE7YT0wO2Q9Y1s3NjArKChnfGh8aXxtfGQpKyhuPj4+ZCk8PDIpPj4yXXwwfWlmKCFkKXtpPWE7aD1lfWVsc2V7Zj1kO3Y9NjF9fWlmKCh2fDApPT02MSl3aGlsZSgxKXt2PTA7ZD0oY1tmKzQ+PjJdJi04KS1rfDA7bj1kPj4+MDxlPj4+MDtkPW4/ZDplO2E9bj9mOmE7Zj1jW2YrMTYrKCgoY1tmKzE2Pj4yXXwwKT09MCYxKTw8Mik+PjJdfDA7aWYoIWYpe2k9YTtoPWQ7YnJlYWt9ZWxzZXtlPWQ7dj02MX19aWYoKGl8MCkhPTA/aD4+PjA8KChjWzExNl18MCkta3wwKT4+PjA6MCl7Zz1pK2t8MDtpZihpPj4+MD49Zz4+PjApe3c9MDtsPXg7cmV0dXJuIHd8MH1mPWNbaSsyND4+Ml18MDtiPWNbaSsxMj4+Ml18MDtkbyBpZigoYnwwKT09KGl8MCkpe2E9aSsyMHwwO2I9Y1thPj4yXXwwO2lmKCFiKXthPWkrMTZ8MDtiPWNbYT4+Ml18MDtpZighYil7Yj0wO2JyZWFrfX13aGlsZSgxKXtkPWIrMjB8MDtlPWNbZD4+Ml18MDtpZihlfDApe2I9ZTthPWQ7Y29udGludWV9ZD1iKzE2fDA7ZT1jW2Q+PjJdfDA7aWYoIWUpYnJlYWs7ZWxzZXtiPWU7YT1kfX1jW2E+PjJdPTB9ZWxzZXt3PWNbaSs4Pj4yXXwwO2NbdysxMj4+Ml09YjtjW2IrOD4+Ml09d313aGlsZSgwKTtkbyBpZihmKXthPWNbaSsyOD4+Ml18MDtkPTc2MCsoYTw8Mil8MDtpZigoaXwwKT09KGNbZD4+Ml18MCkpe2NbZD4+Ml09YjtpZighYil7ZT1qJn4oMTw8YSk7Y1sxMTVdPWU7YnJlYWt9fWVsc2V7Y1tmKzE2KygoKGNbZisxNj4+Ml18MCkhPShpfDApJjEpPDwyKT4+Ml09YjtpZighYil7ZT1qO2JyZWFrfX1jW2IrMjQ+PjJdPWY7YT1jW2krMTY+PjJdfDA7aWYoYXwwKXtjW2IrMTY+PjJdPWE7Y1thKzI0Pj4yXT1ifWE9Y1tpKzIwPj4yXXwwO2lmKGEpe2NbYisyMD4+Ml09YTtjW2ErMjQ+PjJdPWI7ZT1qfWVsc2UgZT1qfWVsc2UgZT1qO3doaWxlKDApO2RvIGlmKGg+Pj4wPj0xNil7Y1tpKzQ+PjJdPWt8MztjW2crND4+Ml09aHwxO2NbZytoPj4yXT1oO2I9aD4+PjM7aWYoaD4+PjA8MjU2KXtkPTQ5NisoYjw8MTw8Mil8MDthPWNbMTE0XXwwO2I9MTw8YjtpZighKGEmYikpe2NbMTE0XT1hfGI7Yj1kO2E9ZCs4fDB9ZWxzZXthPWQrOHwwO2I9Y1thPj4yXXwwfWNbYT4+Ml09ZztjW2IrMTI+PjJdPWc7Y1tnKzg+PjJdPWI7Y1tnKzEyPj4yXT1kO2JyZWFrfWI9aD4+Pjg7aWYoYilpZihoPj4+MD4xNjc3NzIxNSliPTMxO2Vsc2V7dj0oYisxMDQ4MzIwfDApPj4+MTYmODt3PWI8PHY7dT0odys1MjAxOTJ8MCk+Pj4xNiY0O3c9dzw8dTtiPSh3KzI0NTc2MHwwKT4+PjE2JjI7Yj0xNC0odXx2fGIpKyh3PDxiPj4+MTUpfDA7Yj1oPj4+KGIrN3wwKSYxfGI8PDF9ZWxzZSBiPTA7ZD03NjArKGI8PDIpfDA7Y1tnKzI4Pj4yXT1iO2E9ZysxNnwwO2NbYSs0Pj4yXT0wO2NbYT4+Ml09MDthPTE8PGI7aWYoIShlJmEpKXtjWzExNV09ZXxhO2NbZD4+Ml09ZztjW2crMjQ+PjJdPWQ7Y1tnKzEyPj4yXT1nO2NbZys4Pj4yXT1nO2JyZWFrfWE9aDw8KChifDApPT0zMT8wOjI1LShiPj4+MSl8MCk7ZD1jW2Q+PjJdfDA7d2hpbGUoMSl7aWYoKGNbZCs0Pj4yXSYtOHwwKT09KGh8MCkpe3Y9OTc7YnJlYWt9ZT1kKzE2KyhhPj4+MzE8PDIpfDA7Yj1jW2U+PjJdfDA7aWYoIWIpe3Y9OTY7YnJlYWt9ZWxzZXthPWE8PDE7ZD1ifX1pZigodnwwKT09OTYpe2NbZT4+Ml09ZztjW2crMjQ+PjJdPWQ7Y1tnKzEyPj4yXT1nO2NbZys4Pj4yXT1nO2JyZWFrfWVsc2UgaWYoKHZ8MCk9PTk3KXt2PWQrOHwwO3c9Y1t2Pj4yXXwwO2NbdysxMj4+Ml09ZztjW3Y+PjJdPWc7Y1tnKzg+PjJdPXc7Y1tnKzEyPj4yXT1kO2NbZysyND4+Ml09MDticmVha319ZWxzZXt3PWgra3wwO2NbaSs0Pj4yXT13fDM7dz1pK3crNHwwO2Nbdz4+Ml09Y1t3Pj4yXXwxfXdoaWxlKDApO3c9aSs4fDA7bD14O3JldHVybiB3fDB9ZWxzZSBuPWt9ZWxzZSBuPWt9ZWxzZSBuPS0xO3doaWxlKDApO2Q9Y1sxMTZdfDA7aWYoZD4+PjA+PW4+Pj4wKXtiPWQtbnwwO2E9Y1sxMTldfDA7aWYoYj4+PjA+MTUpe3c9YStufDA7Y1sxMTldPXc7Y1sxMTZdPWI7Y1t3KzQ+PjJdPWJ8MTtjW3crYj4+Ml09YjtjW2ErND4+Ml09bnwzfWVsc2V7Y1sxMTZdPTA7Y1sxMTldPTA7Y1thKzQ+PjJdPWR8Mzt3PWErZCs0fDA7Y1t3Pj4yXT1jW3c+PjJdfDF9dz1hKzh8MDtsPXg7cmV0dXJuIHd8MH1oPWNbMTE3XXwwO2lmKGg+Pj4wPm4+Pj4wKXt1PWgtbnwwO2NbMTE3XT11O3c9Y1sxMjBdfDA7dj13K258MDtjWzEyMF09djtjW3YrND4+Ml09dXwxO2Nbdys0Pj4yXT1ufDM7dz13Kzh8MDtsPXg7cmV0dXJuIHd8MH1pZighKGNbMjMyXXwwKSl7Y1syMzRdPTQwOTY7Y1syMzNdPTQwOTY7Y1syMzVdPS0xO2NbMjM2XT0tMTtjWzIzN109MDtjWzIyNV09MDthPW8mLTE2XjE0MzE2NTU3Njg7Y1tvPj4yXT1hO2NbMjMyXT1hO2E9NDA5Nn1lbHNlIGE9Y1syMzRdfDA7aT1uKzQ4fDA7aj1uKzQ3fDA7Zz1hK2p8MDtmPTAtYXwwO2s9ZyZmO2lmKGs+Pj4wPD1uPj4+MCl7dz0wO2w9eDtyZXR1cm4gd3wwfWE9Y1syMjRdfDA7aWYoYXwwPyhtPWNbMjIyXXwwLG89bStrfDAsbz4+PjA8PW0+Pj4wfG8+Pj4wPmE+Pj4wKTowKXt3PTA7bD14O3JldHVybiB3fDB9YjpkbyBpZighKGNbMjI1XSY0KSl7ZD1jWzEyMF18MDtjOmRvIGlmKGQpe2U9OTA0O3doaWxlKDEpe2E9Y1tlPj4yXXwwO2lmKGE+Pj4wPD1kPj4+MD8ocj1lKzR8MCwoYSsoY1tyPj4yXXwwKXwwKT4+PjA+ZD4+PjApOjApYnJlYWs7YT1jW2UrOD4+Ml18MDtpZighYSl7dj0xMTg7YnJlYWsgY31lbHNlIGU9YX1iPWctaCZmO2lmKGI+Pj4wPDIxNDc0ODM2NDcpe2E9T2EoYnwwKXwwO2lmKChhfDApPT0oKGNbZT4+Ml18MCkrKGNbcj4+Ml18MCl8MCkpe2lmKChhfDApIT0oLTF8MCkpe2g9YjtnPWE7dj0xMzU7YnJlYWsgYn19ZWxzZXtlPWE7dj0xMjZ9fWVsc2UgYj0wfWVsc2Ugdj0xMTg7d2hpbGUoMCk7ZG8gaWYoKHZ8MCk9PTExOCl7ZD1PYSgwKXwwO2lmKChkfDApIT0oLTF8MCk/KGI9ZCxwPWNbMjMzXXwwLHE9cCstMXwwLGI9KChxJmJ8MCk9PTA/MDoocStiJjAtcCktYnwwKStrfDAscD1jWzIyMl18MCxxPWIrcHwwLGI+Pj4wPm4+Pj4wJmI+Pj4wPDIxNDc0ODM2NDcpOjApe3I9Y1syMjRdfDA7aWYocnwwP3E+Pj4wPD1wPj4+MHxxPj4+MD5yPj4+MDowKXtiPTA7YnJlYWt9YT1PYShifDApfDA7aWYoKGF8MCk9PShkfDApKXtoPWI7Zz1kO3Y9MTM1O2JyZWFrIGJ9ZWxzZXtlPWE7dj0xMjZ9fWVsc2UgYj0wfXdoaWxlKDApO2RvIGlmKCh2fDApPT0xMjYpe2Q9MC1ifDA7aWYoIShpPj4+MD5iPj4+MCYoYj4+PjA8MjE0NzQ4MzY0NyYoZXwwKSE9KC0xfDApKSkpaWYoKGV8MCk9PSgtMXwwKSl7Yj0wO2JyZWFrfWVsc2V7aD1iO2c9ZTt2PTEzNTticmVhayBifWE9Y1syMzRdfDA7YT1qLWIrYSYwLWE7aWYoYT4+PjA+PTIxNDc0ODM2NDcpe2g9YjtnPWU7dj0xMzU7YnJlYWsgYn1pZigoT2EoYXwwKXwwKT09KC0xfDApKXtPYShkfDApfDA7Yj0wO2JyZWFrfWVsc2V7aD1hK2J8MDtnPWU7dj0xMzU7YnJlYWsgYn19d2hpbGUoMCk7Y1syMjVdPWNbMjI1XXw0O3Y9MTMzfWVsc2V7Yj0wO3Y9MTMzfXdoaWxlKDApO2lmKCgodnwwKT09MTMzP2s+Pj4wPDIxNDc0ODM2NDc6MCk/KHU9T2Eoa3wwKXwwLHI9T2EoMCl8MCxzPXItdXwwLHQ9cz4+PjA+KG4rNDB8MCk+Pj4wLCEoKHV8MCk9PSgtMXwwKXx0XjF8dT4+PjA8cj4+PjAmKCh1fDApIT0oLTF8MCkmKHJ8MCkhPSgtMXwwKSleMSkpOjApe2g9dD9zOmI7Zz11O3Y9MTM1fWlmKCh2fDApPT0xMzUpe2I9KGNbMjIyXXwwKStofDA7Y1syMjJdPWI7aWYoYj4+PjA+KGNbMjIzXXwwKT4+PjApY1syMjNdPWI7aj1jWzEyMF18MDtkbyBpZihqKXtiPTkwNDt3aGlsZSgxKXthPWNbYj4+Ml18MDtkPWIrNHwwO2U9Y1tkPj4yXXwwO2lmKChnfDApPT0oYStlfDApKXt2PTE0NTticmVha31mPWNbYis4Pj4yXXwwO2lmKCFmKWJyZWFrO2Vsc2UgYj1mfWlmKCgodnwwKT09MTQ1PyhjW2IrMTI+PjJdJjh8MCk9PTA6MCk/aj4+PjA8Zz4+PjAmaj4+PjA+PWE+Pj4wOjApe2NbZD4+Ml09ZStoO3c9ais4fDA7dz0odyY3fDApPT0wPzA6MC13Jjc7dj1qK3d8MDt3PShjWzExN118MCkrKGgtdyl8MDtjWzEyMF09djtjWzExN109dztjW3YrND4+Ml09d3wxO2Nbdit3KzQ+PjJdPTQwO2NbMTIxXT1jWzIzNl07YnJlYWt9aWYoZz4+PjA8KGNbMTE4XXwwKT4+PjApY1sxMThdPWc7ZD1nK2h8MDtiPTkwNDt3aGlsZSgxKXtpZigoY1tiPj4yXXwwKT09KGR8MCkpe3Y9MTUzO2JyZWFrfWE9Y1tiKzg+PjJdfDA7aWYoIWEpYnJlYWs7ZWxzZSBiPWF9aWYoKHZ8MCk9PTE1Mz8oY1tiKzEyPj4yXSY4fDApPT0wOjApe2NbYj4+Ml09ZzttPWIrNHwwO2NbbT4+Ml09KGNbbT4+Ml18MCkraDttPWcrOHwwO209ZysoKG0mN3wwKT09MD8wOjAtbSY3KXwwO2I9ZCs4fDA7Yj1kKygoYiY3fDApPT0wPzA6MC1iJjcpfDA7az1tK258MDtpPWItbS1ufDA7Y1ttKzQ+PjJdPW58MztkbyBpZigoYnwwKSE9KGp8MCkpe2lmKChifDApPT0oY1sxMTldfDApKXt3PShjWzExNl18MCkraXwwO2NbMTE2XT13O2NbMTE5XT1rO2Nbays0Pj4yXT13fDE7Y1trK3c+PjJdPXc7YnJlYWt9YT1jW2IrND4+Ml18MDtpZigoYSYzfDApPT0xKXtoPWEmLTg7ZT1hPj4+MztkOmRvIGlmKGE+Pj4wPDI1Nil7YT1jW2IrOD4+Ml18MDtkPWNbYisxMj4+Ml18MDtpZigoZHwwKT09KGF8MCkpe2NbMTE0XT1jWzExNF0mfigxPDxlKTticmVha31lbHNle2NbYSsxMj4+Ml09ZDtjW2QrOD4+Ml09YTticmVha319ZWxzZXtnPWNbYisyND4+Ml18MDthPWNbYisxMj4+Ml18MDtkbyBpZigoYXwwKT09KGJ8MCkpe2U9YisxNnwwO2Q9ZSs0fDA7YT1jW2Q+PjJdfDA7aWYoIWEpe2E9Y1tlPj4yXXwwO2lmKCFhKXthPTA7YnJlYWt9ZWxzZSBkPWV9d2hpbGUoMSl7ZT1hKzIwfDA7Zj1jW2U+PjJdfDA7aWYoZnwwKXthPWY7ZD1lO2NvbnRpbnVlfWU9YSsxNnwwO2Y9Y1tlPj4yXXwwO2lmKCFmKWJyZWFrO2Vsc2V7YT1mO2Q9ZX19Y1tkPj4yXT0wfWVsc2V7dz1jW2IrOD4+Ml18MDtjW3crMTI+PjJdPWE7Y1thKzg+PjJdPXd9d2hpbGUoMCk7aWYoIWcpYnJlYWs7ZD1jW2IrMjg+PjJdfDA7ZT03NjArKGQ8PDIpfDA7ZG8gaWYoKGJ8MCkhPShjW2U+PjJdfDApKXtjW2crMTYrKCgoY1tnKzE2Pj4yXXwwKSE9KGJ8MCkmMSk8PDIpPj4yXT1hO2lmKCFhKWJyZWFrIGR9ZWxzZXtjW2U+PjJdPWE7aWYoYXwwKWJyZWFrO2NbMTE1XT1jWzExNV0mfigxPDxkKTticmVhayBkfXdoaWxlKDApO2NbYSsyND4+Ml09ZztkPWIrMTZ8MDtlPWNbZD4+Ml18MDtpZihlfDApe2NbYSsxNj4+Ml09ZTtjW2UrMjQ+PjJdPWF9ZD1jW2QrND4+Ml18MDtpZighZClicmVhaztjW2ErMjA+PjJdPWQ7Y1tkKzI0Pj4yXT1hfXdoaWxlKDApO2I9YitofDA7Zj1oK2l8MH1lbHNlIGY9aTtiPWIrNHwwO2NbYj4+Ml09Y1tiPj4yXSYtMjtjW2srND4+Ml09ZnwxO2NbaytmPj4yXT1mO2I9Zj4+PjM7aWYoZj4+PjA8MjU2KXtkPTQ5NisoYjw8MTw8Mil8MDthPWNbMTE0XXwwO2I9MTw8YjtpZighKGEmYikpe2NbMTE0XT1hfGI7Yj1kO2E9ZCs4fDB9ZWxzZXthPWQrOHwwO2I9Y1thPj4yXXwwfWNbYT4+Ml09aztjW2IrMTI+PjJdPWs7Y1trKzg+PjJdPWI7Y1trKzEyPj4yXT1kO2JyZWFrfWI9Zj4+Pjg7ZG8gaWYoIWIpYj0wO2Vsc2V7aWYoZj4+PjA+MTY3NzcyMTUpe2I9MzE7YnJlYWt9dj0oYisxMDQ4MzIwfDApPj4+MTYmODt3PWI8PHY7dT0odys1MjAxOTJ8MCk+Pj4xNiY0O3c9dzw8dTtiPSh3KzI0NTc2MHwwKT4+PjE2JjI7Yj0xNC0odXx2fGIpKyh3PDxiPj4+MTUpfDA7Yj1mPj4+KGIrN3wwKSYxfGI8PDF9d2hpbGUoMCk7ZT03NjArKGI8PDIpfDA7Y1trKzI4Pj4yXT1iO2E9aysxNnwwO2NbYSs0Pj4yXT0wO2NbYT4+Ml09MDthPWNbMTE1XXwwO2Q9MTw8YjtpZighKGEmZCkpe2NbMTE1XT1hfGQ7Y1tlPj4yXT1rO2NbaysyND4+Ml09ZTtjW2srMTI+PjJdPWs7Y1trKzg+PjJdPWs7YnJlYWt9YT1mPDwoKGJ8MCk9PTMxPzA6MjUtKGI+Pj4xKXwwKTtkPWNbZT4+Ml18MDt3aGlsZSgxKXtpZigoY1tkKzQ+PjJdJi04fDApPT0oZnwwKSl7dj0xOTQ7YnJlYWt9ZT1kKzE2KyhhPj4+MzE8PDIpfDA7Yj1jW2U+PjJdfDA7aWYoIWIpe3Y9MTkzO2JyZWFrfWVsc2V7YT1hPDwxO2Q9Yn19aWYoKHZ8MCk9PTE5Myl7Y1tlPj4yXT1rO2NbaysyND4+Ml09ZDtjW2srMTI+PjJdPWs7Y1trKzg+PjJdPWs7YnJlYWt9ZWxzZSBpZigodnwwKT09MTk0KXt2PWQrOHwwO3c9Y1t2Pj4yXXwwO2NbdysxMj4+Ml09aztjW3Y+PjJdPWs7Y1trKzg+PjJdPXc7Y1trKzEyPj4yXT1kO2NbaysyND4+Ml09MDticmVha319ZWxzZXt3PShjWzExN118MCkraXwwO2NbMTE3XT13O2NbMTIwXT1rO2Nbays0Pj4yXT13fDF9d2hpbGUoMCk7dz1tKzh8MDtsPXg7cmV0dXJuIHd8MH1iPTkwNDt3aGlsZSgxKXthPWNbYj4+Ml18MDtpZihhPj4+MDw9aj4+PjA/KHc9YSsoY1tiKzQ+PjJdfDApfDAsdz4+PjA+aj4+PjApOjApYnJlYWs7Yj1jW2IrOD4+Ml18MH1mPXcrLTQ3fDA7YT1mKzh8MDthPWYrKChhJjd8MCk9PTA/MDowLWEmNyl8MDtmPWorMTZ8MDthPWE+Pj4wPGY+Pj4wP2o6YTtiPWErOHwwO2Q9Zys4fDA7ZD0oZCY3fDApPT0wPzA6MC1kJjc7dj1nK2R8MDtkPWgrLTQwLWR8MDtjWzEyMF09djtjWzExN109ZDtjW3YrND4+Ml09ZHwxO2NbditkKzQ+PjJdPTQwO2NbMTIxXT1jWzIzNl07ZD1hKzR8MDtjW2Q+PjJdPTI3O2NbYj4+Ml09Y1syMjZdO2NbYis0Pj4yXT1jWzIyN107Y1tiKzg+PjJdPWNbMjI4XTtjW2IrMTI+PjJdPWNbMjI5XTtjWzIyNl09ZztjWzIyN109aDtjWzIyOV09MDtjWzIyOF09YjtiPWErMjR8MDtkb3t2PWI7Yj1iKzR8MDtjW2I+PjJdPTd9d2hpbGUoKHYrOHwwKT4+PjA8dz4+PjApO2lmKChhfDApIT0oanwwKSl7Zz1hLWp8MDtjW2Q+PjJdPWNbZD4+Ml0mLTI7Y1tqKzQ+PjJdPWd8MTtjW2E+PjJdPWc7Yj1nPj4+MztpZihnPj4+MDwyNTYpe2Q9NDk2KyhiPDwxPDwyKXwwO2E9Y1sxMTRdfDA7Yj0xPDxiO2lmKCEoYSZiKSl7Y1sxMTRdPWF8YjtiPWQ7YT1kKzh8MH1lbHNle2E9ZCs4fDA7Yj1jW2E+PjJdfDB9Y1thPj4yXT1qO2NbYisxMj4+Ml09ajtjW2orOD4+Ml09YjtjW2orMTI+PjJdPWQ7YnJlYWt9Yj1nPj4+ODtpZihiKWlmKGc+Pj4wPjE2Nzc3MjE1KWQ9MzE7ZWxzZXt2PShiKzEwNDgzMjB8MCk+Pj4xNiY4O3c9Yjw8djt1PSh3KzUyMDE5MnwwKT4+PjE2JjQ7dz13PDx1O2Q9KHcrMjQ1NzYwfDApPj4+MTYmMjtkPTE0LSh1fHZ8ZCkrKHc8PGQ+Pj4xNSl8MDtkPWc+Pj4oZCs3fDApJjF8ZDw8MX1lbHNlIGQ9MDtlPTc2MCsoZDw8Mil8MDtjW2orMjg+PjJdPWQ7Y1tqKzIwPj4yXT0wO2NbZj4+Ml09MDtiPWNbMTE1XXwwO2E9MTw8ZDtpZighKGImYSkpe2NbMTE1XT1ifGE7Y1tlPj4yXT1qO2NbaisyND4+Ml09ZTtjW2orMTI+PjJdPWo7Y1tqKzg+PjJdPWo7YnJlYWt9YT1nPDwoKGR8MCk9PTMxPzA6MjUtKGQ+Pj4xKXwwKTtkPWNbZT4+Ml18MDt3aGlsZSgxKXtpZigoY1tkKzQ+PjJdJi04fDApPT0oZ3wwKSl7dj0yMTY7YnJlYWt9ZT1kKzE2KyhhPj4+MzE8PDIpfDA7Yj1jW2U+PjJdfDA7aWYoIWIpe3Y9MjE1O2JyZWFrfWVsc2V7YT1hPDwxO2Q9Yn19aWYoKHZ8MCk9PTIxNSl7Y1tlPj4yXT1qO2NbaisyND4+Ml09ZDtjW2orMTI+PjJdPWo7Y1tqKzg+PjJdPWo7YnJlYWt9ZWxzZSBpZigodnwwKT09MjE2KXt2PWQrOHwwO3c9Y1t2Pj4yXXwwO2NbdysxMj4+Ml09ajtjW3Y+PjJdPWo7Y1tqKzg+PjJdPXc7Y1tqKzEyPj4yXT1kO2NbaisyND4+Ml09MDticmVha319fWVsc2V7dz1jWzExOF18MDtpZigod3wwKT09MHxnPj4+MDx3Pj4+MCljWzExOF09ZztjWzIyNl09ZztjWzIyN109aDtjWzIyOV09MDtjWzEyM109Y1syMzJdO2NbMTIyXT0tMTtiPTA7ZG97dz00OTYrKGI8PDE8PDIpfDA7Y1t3KzEyPj4yXT13O2Nbdys4Pj4yXT13O2I9YisxfDB9d2hpbGUoKGJ8MCkhPTMyKTt3PWcrOHwwO3c9KHcmN3wwKT09MD8wOjAtdyY3O3Y9Zyt3fDA7dz1oKy00MC13fDA7Y1sxMjBdPXY7Y1sxMTddPXc7Y1t2KzQ+PjJdPXd8MTtjW3Yrdys0Pj4yXT00MDtjWzEyMV09Y1syMzZdfXdoaWxlKDApO2I9Y1sxMTddfDA7aWYoYj4+PjA+bj4+PjApe3U9Yi1ufDA7Y1sxMTddPXU7dz1jWzEyMF18MDt2PXcrbnwwO2NbMTIwXT12O2Nbdis0Pj4yXT11fDE7Y1t3KzQ+PjJdPW58Mzt3PXcrOHwwO2w9eDtyZXR1cm4gd3wwfX1jWyhDYSgpfDApPj4yXT0xMjt3PTA7bD14O3JldHVybiB3fDB9ZnVuY3Rpb24geWEoYSl7YT1hfDA7dmFyIGI9MCxkPTAsZT0wLGY9MCxnPTAsaD0wLGk9MCxqPTA7aWYoIWEpcmV0dXJuO2Q9YSstOHwwO2Y9Y1sxMThdfDA7YT1jW2ErLTQ+PjJdfDA7Yj1hJi04O2o9ZCtifDA7ZG8gaWYoIShhJjEpKXtlPWNbZD4+Ml18MDtpZighKGEmMykpcmV0dXJuO2g9ZCsoMC1lKXwwO2c9ZStifDA7aWYoaD4+PjA8Zj4+PjApcmV0dXJuO2lmKChofDApPT0oY1sxMTldfDApKXthPWorNHwwO2I9Y1thPj4yXXwwO2lmKChiJjN8MCkhPTMpe2k9aDtiPWc7YnJlYWt9Y1sxMTZdPWc7Y1thPj4yXT1iJi0yO2NbaCs0Pj4yXT1nfDE7Y1toK2c+PjJdPWc7cmV0dXJufWQ9ZT4+PjM7aWYoZT4+PjA8MjU2KXthPWNbaCs4Pj4yXXwwO2I9Y1toKzEyPj4yXXwwO2lmKChifDApPT0oYXwwKSl7Y1sxMTRdPWNbMTE0XSZ+KDE8PGQpO2k9aDtiPWc7YnJlYWt9ZWxzZXtjW2ErMTI+PjJdPWI7Y1tiKzg+PjJdPWE7aT1oO2I9ZzticmVha319Zj1jW2grMjQ+PjJdfDA7YT1jW2grMTI+PjJdfDA7ZG8gaWYoKGF8MCk9PShofDApKXtkPWgrMTZ8MDtiPWQrNHwwO2E9Y1tiPj4yXXwwO2lmKCFhKXthPWNbZD4+Ml18MDtpZighYSl7YT0wO2JyZWFrfWVsc2UgYj1kfXdoaWxlKDEpe2Q9YSsyMHwwO2U9Y1tkPj4yXXwwO2lmKGV8MCl7YT1lO2I9ZDtjb250aW51ZX1kPWErMTZ8MDtlPWNbZD4+Ml18MDtpZighZSlicmVhaztlbHNle2E9ZTtiPWR9fWNbYj4+Ml09MH1lbHNle2k9Y1toKzg+PjJdfDA7Y1tpKzEyPj4yXT1hO2NbYSs4Pj4yXT1pfXdoaWxlKDApO2lmKGYpe2I9Y1toKzI4Pj4yXXwwO2Q9NzYwKyhiPDwyKXwwO2lmKChofDApPT0oY1tkPj4yXXwwKSl7Y1tkPj4yXT1hO2lmKCFhKXtjWzExNV09Y1sxMTVdJn4oMTw8Yik7aT1oO2I9ZzticmVha319ZWxzZXtjW2YrMTYrKCgoY1tmKzE2Pj4yXXwwKSE9KGh8MCkmMSk8PDIpPj4yXT1hO2lmKCFhKXtpPWg7Yj1nO2JyZWFrfX1jW2ErMjQ+PjJdPWY7Yj1oKzE2fDA7ZD1jW2I+PjJdfDA7aWYoZHwwKXtjW2ErMTY+PjJdPWQ7Y1tkKzI0Pj4yXT1hfWI9Y1tiKzQ+PjJdfDA7aWYoYil7Y1thKzIwPj4yXT1iO2NbYisyND4+Ml09YTtpPWg7Yj1nfWVsc2V7aT1oO2I9Z319ZWxzZXtpPWg7Yj1nfX1lbHNle2k9ZDtoPWR9d2hpbGUoMCk7aWYoaD4+PjA+PWo+Pj4wKXJldHVybjthPWorNHwwO2U9Y1thPj4yXXwwO2lmKCEoZSYxKSlyZXR1cm47aWYoIShlJjIpKXthPWNbMTE5XXwwO2lmKChqfDApPT0oY1sxMjBdfDApKXtqPShjWzExN118MCkrYnwwO2NbMTE3XT1qO2NbMTIwXT1pO2NbaSs0Pj4yXT1qfDE7aWYoKGl8MCkhPShhfDApKXJldHVybjtjWzExOV09MDtjWzExNl09MDtyZXR1cm59aWYoKGp8MCk9PShhfDApKXtqPShjWzExNl18MCkrYnwwO2NbMTE2XT1qO2NbMTE5XT1oO2NbaSs0Pj4yXT1qfDE7Y1toK2o+PjJdPWo7cmV0dXJufWY9KGUmLTgpK2J8MDtkPWU+Pj4zO2RvIGlmKGU+Pj4wPDI1Nil7Yj1jW2orOD4+Ml18MDthPWNbaisxMj4+Ml18MDtpZigoYXwwKT09KGJ8MCkpe2NbMTE0XT1jWzExNF0mfigxPDxkKTticmVha31lbHNle2NbYisxMj4+Ml09YTtjW2ErOD4+Ml09YjticmVha319ZWxzZXtnPWNbaisyND4+Ml18MDthPWNbaisxMj4+Ml18MDtkbyBpZigoYXwwKT09KGp8MCkpe2Q9aisxNnwwO2I9ZCs0fDA7YT1jW2I+PjJdfDA7aWYoIWEpe2E9Y1tkPj4yXXwwO2lmKCFhKXtkPTA7YnJlYWt9ZWxzZSBiPWR9d2hpbGUoMSl7ZD1hKzIwfDA7ZT1jW2Q+PjJdfDA7aWYoZXwwKXthPWU7Yj1kO2NvbnRpbnVlfWQ9YSsxNnwwO2U9Y1tkPj4yXXwwO2lmKCFlKWJyZWFrO2Vsc2V7YT1lO2I9ZH19Y1tiPj4yXT0wO2Q9YX1lbHNle2Q9Y1tqKzg+PjJdfDA7Y1tkKzEyPj4yXT1hO2NbYSs4Pj4yXT1kO2Q9YX13aGlsZSgwKTtpZihnfDApe2E9Y1tqKzI4Pj4yXXwwO2I9NzYwKyhhPDwyKXwwO2lmKChqfDApPT0oY1tiPj4yXXwwKSl7Y1tiPj4yXT1kO2lmKCFkKXtjWzExNV09Y1sxMTVdJn4oMTw8YSk7YnJlYWt9fWVsc2V7Y1tnKzE2KygoKGNbZysxNj4+Ml18MCkhPShqfDApJjEpPDwyKT4+Ml09ZDtpZighZClicmVha31jW2QrMjQ+PjJdPWc7YT1qKzE2fDA7Yj1jW2E+PjJdfDA7aWYoYnwwKXtjW2QrMTY+PjJdPWI7Y1tiKzI0Pj4yXT1kfWE9Y1thKzQ+PjJdfDA7aWYoYXwwKXtjW2QrMjA+PjJdPWE7Y1thKzI0Pj4yXT1kfX19d2hpbGUoMCk7Y1tpKzQ+PjJdPWZ8MTtjW2grZj4+Ml09ZjtpZigoaXwwKT09KGNbMTE5XXwwKSl7Y1sxMTZdPWY7cmV0dXJufX1lbHNle2NbYT4+Ml09ZSYtMjtjW2krND4+Ml09YnwxO2NbaCtiPj4yXT1iO2Y9Yn1hPWY+Pj4zO2lmKGY+Pj4wPDI1Nil7ZD00OTYrKGE8PDE8PDIpfDA7Yj1jWzExNF18MDthPTE8PGE7aWYoIShiJmEpKXtjWzExNF09YnxhO2E9ZDtiPWQrOHwwfWVsc2V7Yj1kKzh8MDthPWNbYj4+Ml18MH1jW2I+PjJdPWk7Y1thKzEyPj4yXT1pO2NbaSs4Pj4yXT1hO2NbaSsxMj4+Ml09ZDtyZXR1cm59YT1mPj4+ODtpZihhKWlmKGY+Pj4wPjE2Nzc3MjE1KWE9MzE7ZWxzZXtoPShhKzEwNDgzMjB8MCk+Pj4xNiY4O2o9YTw8aDtnPShqKzUyMDE5MnwwKT4+PjE2JjQ7aj1qPDxnO2E9KGorMjQ1NzYwfDApPj4+MTYmMjthPTE0LShnfGh8YSkrKGo8PGE+Pj4xNSl8MDthPWY+Pj4oYSs3fDApJjF8YTw8MX1lbHNlIGE9MDtlPTc2MCsoYTw8Mil8MDtjW2krMjg+PjJdPWE7Y1tpKzIwPj4yXT0wO2NbaSsxNj4+Ml09MDtiPWNbMTE1XXwwO2Q9MTw8YTtkbyBpZihiJmQpe2I9Zjw8KChhfDApPT0zMT8wOjI1LShhPj4+MSl8MCk7ZD1jW2U+PjJdfDA7d2hpbGUoMSl7aWYoKGNbZCs0Pj4yXSYtOHwwKT09KGZ8MCkpe2E9NzM7YnJlYWt9ZT1kKzE2KyhiPj4+MzE8PDIpfDA7YT1jW2U+PjJdfDA7aWYoIWEpe2E9NzI7YnJlYWt9ZWxzZXtiPWI8PDE7ZD1hfX1pZigoYXwwKT09NzIpe2NbZT4+Ml09aTtjW2krMjQ+PjJdPWQ7Y1tpKzEyPj4yXT1pO2NbaSs4Pj4yXT1pO2JyZWFrfWVsc2UgaWYoKGF8MCk9PTczKXtoPWQrOHwwO2o9Y1toPj4yXXwwO2NbaisxMj4+Ml09aTtjW2g+PjJdPWk7Y1tpKzg+PjJdPWo7Y1tpKzEyPj4yXT1kO2NbaSsyND4+Ml09MDticmVha319ZWxzZXtjWzExNV09YnxkO2NbZT4+Ml09aTtjW2krMjQ+PjJdPWU7Y1tpKzEyPj4yXT1pO2NbaSs4Pj4yXT1pfXdoaWxlKDApO2o9KGNbMTIyXXwwKSstMXwwO2NbMTIyXT1qO2lmKCFqKWE9OTEyO2Vsc2UgcmV0dXJuO3doaWxlKDEpe2E9Y1thPj4yXXwwO2lmKCFhKWJyZWFrO2Vsc2UgYT1hKzh8MH1jWzEyMl09LTE7cmV0dXJufWZ1bmN0aW9uIHphKGEpe2E9YXwwO3ZhciBiPTAsZD0wO2I9bDtsPWwrMTZ8MDtkPWI7Y1tkPj4yXT1GYShjW2ErNjA+PjJdfDApfDA7YT1CYShaKDYsZHwwKXwwKXwwO2w9YjtyZXR1cm4gYXwwfWZ1bmN0aW9uIEFhKGEsYixkKXthPWF8MDtiPWJ8MDtkPWR8MDt2YXIgZT0wLGY9MCxnPTA7Zj1sO2w9bCszMnwwO2c9ZjtlPWYrMjB8MDtjW2c+PjJdPWNbYSs2MD4+Ml07Y1tnKzQ+PjJdPTA7Y1tnKzg+PjJdPWI7Y1tnKzEyPj4yXT1lO2NbZysxNj4+Ml09ZDtpZigoQmEoYWEoMTQwLGd8MCl8MCl8MCk8MCl7Y1tlPj4yXT0tMTthPS0xfWVsc2UgYT1jW2U+PjJdfDA7bD1mO3JldHVybiBhfDB9ZnVuY3Rpb24gQmEoYSl7YT1hfDA7aWYoYT4+PjA+NDI5NDk2MzIwMCl7Y1soQ2EoKXwwKT4+Ml09MC1hO2E9LTF9cmV0dXJuIGF8MH1mdW5jdGlvbiBDYSgpe3JldHVybiAoRGEoKXwwKSs2NHwwfWZ1bmN0aW9uIERhKCl7cmV0dXJuIEVhKCl8MH1mdW5jdGlvbiBFYSgpe3JldHVybiA4fWZ1bmN0aW9uIEZhKGEpe2E9YXwwO3JldHVybiBhfDB9ZnVuY3Rpb24gR2EoYSxiLGQpe2E9YXwwO2I9YnwwO2Q9ZHwwO3ZhciBlPTAsZj0wLGc9MCxoPTAsaT0wLGo9MCxrPTAsbT0wLG49MCxvPTAscD0wO249bDtsPWwrNDh8MDtrPW4rMTZ8MDtnPW47Zj1uKzMyfDA7aT1hKzI4fDA7ZT1jW2k+PjJdfDA7Y1tmPj4yXT1lO2o9YSsyMHwwO2U9KGNbaj4+Ml18MCktZXwwO2NbZis0Pj4yXT1lO2NbZis4Pj4yXT1iO2NbZisxMj4+Ml09ZDtlPWUrZHwwO2g9YSs2MHwwO2NbZz4+Ml09Y1toPj4yXTtjW2crND4+Ml09ZjtjW2crOD4+Ml09MjtnPUJhKGRhKDE0NixnfDApfDApfDA7YTpkbyBpZigoZXwwKSE9KGd8MCkpe2I9Mjt3aGlsZSgxKXtpZigoZ3wwKTwwKWJyZWFrO2U9ZS1nfDA7cD1jW2YrND4+Ml18MDtvPWc+Pj4wPnA+Pj4wO2Y9bz9mKzh8MDpmO2I9KG88PDMxPj4zMSkrYnwwO3A9Zy0obz9wOjApfDA7Y1tmPj4yXT0oY1tmPj4yXXwwKStwO289Zis0fDA7Y1tvPj4yXT0oY1tvPj4yXXwwKS1wO2Nbaz4+Ml09Y1toPj4yXTtjW2srND4+Ml09ZjtjW2srOD4+Ml09YjtnPUJhKGRhKDE0NixrfDApfDApfDA7aWYoKGV8MCk9PShnfDApKXttPTM7YnJlYWsgYX19Y1thKzE2Pj4yXT0wO2NbaT4+Ml09MDtjW2o+PjJdPTA7Y1thPj4yXT1jW2E+PjJdfDMyO2lmKChifDApPT0yKWQ9MDtlbHNlIGQ9ZC0oY1tmKzQ+PjJdfDApfDB9ZWxzZSBtPTM7d2hpbGUoMCk7aWYoKG18MCk9PTMpe3A9Y1thKzQ0Pj4yXXwwO2NbYSsxNj4+Ml09cCsoY1thKzQ4Pj4yXXwwKTtjW2k+PjJdPXA7Y1tqPj4yXT1wfWw9bjtyZXR1cm4gZHwwfWZ1bmN0aW9uIEhhKCl7cmV0dXJuIDk1Mn1mdW5jdGlvbiBJYShhKXthPWF8MDtyZXR1cm4gMH1mdW5jdGlvbiBKYShhKXthPWF8MDtyZXR1cm59ZnVuY3Rpb24gS2EoYixkLGUpe2I9YnwwO2Q9ZHwwO2U9ZXwwO3ZhciBmPTAsZz0wLGg9MCxpPTAsaj0wO2Y9ZSsxNnwwO2c9Y1tmPj4yXXwwO2lmKCFnKWlmKCEoTGEoZSl8MCkpe2c9Y1tmPj4yXXwwO2g9NX1lbHNlIGY9MDtlbHNlIGg9NTthOmRvIGlmKChofDApPT01KXtqPWUrMjB8MDtpPWNbaj4+Ml18MDtmPWk7aWYoKGctaXwwKT4+PjA8ZD4+PjApe2Y9aGFbY1tlKzM2Pj4yXSYzXShlLGIsZCl8MDticmVha31iOmRvIGlmKChhW2UrNzU+PjBdfDApPi0xKXtpPWQ7d2hpbGUoMSl7aWYoIWkpe2g9MDtnPWI7YnJlYWsgYn1nPWkrLTF8MDtpZigoYVtiK2c+PjBdfDApPT0xMClicmVhaztlbHNlIGk9Z31mPWhhW2NbZSszNj4+Ml0mM10oZSxiLGkpfDA7aWYoZj4+PjA8aT4+PjApYnJlYWsgYTtoPWk7Zz1iK2l8MDtkPWQtaXwwO2Y9Y1tqPj4yXXwwfWVsc2V7aD0wO2c9Yn13aGlsZSgwKTtRYShmfDAsZ3wwLGR8MCl8MDtjW2o+PjJdPShjW2o+PjJdfDApK2Q7Zj1oK2R8MH13aGlsZSgwKTtyZXR1cm4gZnwwfWZ1bmN0aW9uIExhKGIpe2I9YnwwO3ZhciBkPTAsZT0wO2Q9Yis3NHwwO2U9YVtkPj4wXXwwO2FbZD4+MF09ZSsyNTV8ZTtkPWNbYj4+Ml18MDtpZighKGQmOCkpe2NbYis4Pj4yXT0wO2NbYis0Pj4yXT0wO2U9Y1tiKzQ0Pj4yXXwwO2NbYisyOD4+Ml09ZTtjW2IrMjA+PjJdPWU7Y1tiKzE2Pj4yXT1lKyhjW2IrNDg+PjJdfDApO2I9MH1lbHNle2NbYj4+Ml09ZHwzMjtiPS0xfXJldHVybiBifDB9ZnVuY3Rpb24gTWEoYSxiLGQsZSl7YT1hfDA7Yj1ifDA7ZD1kfDA7ZT1lfDA7dmFyIGY9MCxnPTA7Zj1OKGQsYil8MDtkPShifDApPT0wPzA6ZDtpZigoY1tlKzc2Pj4yXXwwKT4tMSl7Zz0oSWEoZSl8MCk9PTA7YT1LYShhLGYsZSl8MDtpZighZylKYShlKX1lbHNlIGE9S2EoYSxmLGUpfDA7aWYoKGF8MCkhPShmfDApKWQ9KGE+Pj4wKS8oYj4+PjApfDA7cmV0dXJuIGR8MH1mdW5jdGlvbiBOYSgpe31mdW5jdGlvbiBPYShhKXthPWF8MDt2YXIgYj0wLGQ9MDtkPWErMTUmLTE2fDA7Yj1jW2k+PjJdfDA7YT1iK2R8MDtpZigoZHwwKT4wJihhfDApPChifDApfChhfDApPDApe1coKXwwO18oMTIpO3JldHVybiAtMX1jW2k+PjJdPWE7aWYoKGF8MCk+KFYoKXwwKT8oVSgpfDApPT0wOjApe2NbaT4+Ml09YjtfKDEyKTtyZXR1cm4gLTF9cmV0dXJuIGJ8MH1mdW5jdGlvbiBQYShiLGQsZSl7Yj1ifDA7ZD1kfDA7ZT1lfDA7dmFyIGY9MCxnPTAsaD0wLGk9MDtoPWIrZXwwO2Q9ZCYyNTU7aWYoKGV8MCk+PTY3KXt3aGlsZShiJjMpe2FbYj4+MF09ZDtiPWIrMXwwfWY9aCYtNHwwO2c9Zi02NHwwO2k9ZHxkPDw4fGQ8PDE2fGQ8PDI0O3doaWxlKChifDApPD0oZ3wwKSl7Y1tiPj4yXT1pO2NbYis0Pj4yXT1pO2NbYis4Pj4yXT1pO2NbYisxMj4+Ml09aTtjW2IrMTY+PjJdPWk7Y1tiKzIwPj4yXT1pO2NbYisyND4+Ml09aTtjW2IrMjg+PjJdPWk7Y1tiKzMyPj4yXT1pO2NbYiszNj4+Ml09aTtjW2IrNDA+PjJdPWk7Y1tiKzQ0Pj4yXT1pO2NbYis0OD4+Ml09aTtjW2IrNTI+PjJdPWk7Y1tiKzU2Pj4yXT1pO2NbYis2MD4+Ml09aTtiPWIrNjR8MH13aGlsZSgoYnwwKTwoZnwwKSl7Y1tiPj4yXT1pO2I9Yis0fDB9fXdoaWxlKChifDApPChofDApKXthW2I+PjBdPWQ7Yj1iKzF8MH1yZXR1cm4gaC1lfDB9ZnVuY3Rpb24gUWEoYixkLGUpe2I9YnwwO2Q9ZHwwO2U9ZXwwO3ZhciBmPTAsZz0wLGg9MDtpZigoZXwwKT49ODE5MilyZXR1cm4gJChifDAsZHwwLGV8MCl8MDtoPWJ8MDtnPWIrZXwwO2lmKChiJjMpPT0oZCYzKSl7d2hpbGUoYiYzKXtpZighZSlyZXR1cm4gaHwwO2FbYj4+MF09YVtkPj4wXXwwO2I9YisxfDA7ZD1kKzF8MDtlPWUtMXwwfWU9ZyYtNHwwO2Y9ZS02NHwwO3doaWxlKChifDApPD0oZnwwKSl7Y1tiPj4yXT1jW2Q+PjJdO2NbYis0Pj4yXT1jW2QrND4+Ml07Y1tiKzg+PjJdPWNbZCs4Pj4yXTtjW2IrMTI+PjJdPWNbZCsxMj4+Ml07Y1tiKzE2Pj4yXT1jW2QrMTY+PjJdO2NbYisyMD4+Ml09Y1tkKzIwPj4yXTtjW2IrMjQ+PjJdPWNbZCsyND4+Ml07Y1tiKzI4Pj4yXT1jW2QrMjg+PjJdO2NbYiszMj4+Ml09Y1tkKzMyPj4yXTtjW2IrMzY+PjJdPWNbZCszNj4+Ml07Y1tiKzQwPj4yXT1jW2QrNDA+PjJdO2NbYis0ND4+Ml09Y1tkKzQ0Pj4yXTtjW2IrNDg+PjJdPWNbZCs0OD4+Ml07Y1tiKzUyPj4yXT1jW2QrNTI+PjJdO2NbYis1Nj4+Ml09Y1tkKzU2Pj4yXTtjW2IrNjA+PjJdPWNbZCs2MD4+Ml07Yj1iKzY0fDA7ZD1kKzY0fDB9d2hpbGUoKGJ8MCk8KGV8MCkpe2NbYj4+Ml09Y1tkPj4yXTtiPWIrNHwwO2Q9ZCs0fDB9fWVsc2V7ZT1nLTR8MDt3aGlsZSgoYnwwKTwoZXwwKSl7YVtiPj4wXT1hW2Q+PjBdfDA7YVtiKzE+PjBdPWFbZCsxPj4wXXwwO2FbYisyPj4wXT1hW2QrMj4+MF18MDthW2IrMz4+MF09YVtkKzM+PjBdfDA7Yj1iKzR8MDtkPWQrNHwwfX13aGlsZSgoYnwwKTwoZ3wwKSl7YVtiPj4wXT1hW2Q+PjBdfDA7Yj1iKzF8MDtkPWQrMXwwfXJldHVybiBofDB9ZnVuY3Rpb24gUmEoYSxiKXthPWF8MDtiPWJ8MDtyZXR1cm4gZ2FbYSYxXShifDApfDB9ZnVuY3Rpb24gU2EoYSxiLGMsZCl7YT1hfDA7Yj1ifDA7Yz1jfDA7ZD1kfDA7cmV0dXJuIGhhW2EmM10oYnwwLGN8MCxkfDApfDB9ZnVuY3Rpb24gVGEoYSl7YT1hfDA7UygwKTtyZXR1cm4gMH1mdW5jdGlvbiBVYShhLGIsYyl7YT1hfDA7Yj1ifDA7Yz1jfDA7UygxKTtyZXR1cm4gMH1cblxuLy8gRU1TQ1JJUFRFTl9FTkRfRlVOQ1NcbnZhciBnYT1bVGEsemFdO3ZhciBoYT1bVWEsR2EsQWEsVWFdO3JldHVybntfa2lzc19mZnRyX2FsbG9jOnVhLF9raXNzX2ZmdHJpOndhLF9tZW1zZXQ6UGEsc2V0VGhyZXc6bWEsX2tpc3NfZmZ0cjp2YSxfa2lzc19mZnRfYWxsb2M6cWEsX3Nicms6T2EsX21lbWNweTpRYSxzdGFja0FsbG9jOmlhLGdldFRlbXBSZXQwOm9hLHNldFRlbXBSZXQwOm5hLF9raXNzX2ZmdHJfZnJlZTp0YSxkeW5DYWxsX2lpaWk6U2EsX2tpc3NfZmZ0OnNhLF9lbXNjcmlwdGVuX2dldF9nbG9iYWxfbGliYzpIYSxkeW5DYWxsX2lpOlJhLHN0YWNrU2F2ZTpqYSxfZnJlZTp5YSxydW5Qb3N0U2V0czpOYSxlc3RhYmxpc2hTdGFja1NwYWNlOmxhLHN0YWNrUmVzdG9yZTprYSxfbWFsbG9jOnhhLF9raXNzX2ZmdF9mcmVlOnBhfX0pXG5cblxuLy8gRU1TQ1JJUFRFTl9FTkRfQVNNXG4oTW9kdWxlLmFzbUdsb2JhbEFyZyxNb2R1bGUuYXNtTGlicmFyeUFyZyxidWZmZXIpO3ZhciBfa2lzc19mZnRyPU1vZHVsZVtcIl9raXNzX2ZmdHJcIl09YXNtW1wiX2tpc3NfZmZ0clwiXTt2YXIgZ2V0VGVtcFJldDA9TW9kdWxlW1wiZ2V0VGVtcFJldDBcIl09YXNtW1wiZ2V0VGVtcFJldDBcIl07dmFyIF9mcmVlPU1vZHVsZVtcIl9mcmVlXCJdPWFzbVtcIl9mcmVlXCJdO3ZhciBydW5Qb3N0U2V0cz1Nb2R1bGVbXCJydW5Qb3N0U2V0c1wiXT1hc21bXCJydW5Qb3N0U2V0c1wiXTt2YXIgc2V0VGVtcFJldDA9TW9kdWxlW1wic2V0VGVtcFJldDBcIl09YXNtW1wic2V0VGVtcFJldDBcIl07dmFyIF9raXNzX2ZmdHJfYWxsb2M9TW9kdWxlW1wiX2tpc3NfZmZ0cl9hbGxvY1wiXT1hc21bXCJfa2lzc19mZnRyX2FsbG9jXCJdO3ZhciBfa2lzc19mZnRyX2ZyZWU9TW9kdWxlW1wiX2tpc3NfZmZ0cl9mcmVlXCJdPWFzbVtcIl9raXNzX2ZmdHJfZnJlZVwiXTt2YXIgX2tpc3NfZmZ0X2ZyZWU9TW9kdWxlW1wiX2tpc3NfZmZ0X2ZyZWVcIl09YXNtW1wiX2tpc3NfZmZ0X2ZyZWVcIl07dmFyIF9raXNzX2ZmdHJpPU1vZHVsZVtcIl9raXNzX2ZmdHJpXCJdPWFzbVtcIl9raXNzX2ZmdHJpXCJdO3ZhciBfa2lzc19mZnRfYWxsb2M9TW9kdWxlW1wiX2tpc3NfZmZ0X2FsbG9jXCJdPWFzbVtcIl9raXNzX2ZmdF9hbGxvY1wiXTt2YXIgX21lbXNldD1Nb2R1bGVbXCJfbWVtc2V0XCJdPWFzbVtcIl9tZW1zZXRcIl07dmFyIF9tYWxsb2M9TW9kdWxlW1wiX21hbGxvY1wiXT1hc21bXCJfbWFsbG9jXCJdO3ZhciBfa2lzc19mZnQ9TW9kdWxlW1wiX2tpc3NfZmZ0XCJdPWFzbVtcIl9raXNzX2ZmdFwiXTt2YXIgX2Vtc2NyaXB0ZW5fZ2V0X2dsb2JhbF9saWJjPU1vZHVsZVtcIl9lbXNjcmlwdGVuX2dldF9nbG9iYWxfbGliY1wiXT1hc21bXCJfZW1zY3JpcHRlbl9nZXRfZ2xvYmFsX2xpYmNcIl07dmFyIF9tZW1jcHk9TW9kdWxlW1wiX21lbWNweVwiXT1hc21bXCJfbWVtY3B5XCJdO3ZhciBzdGFja0FsbG9jPU1vZHVsZVtcInN0YWNrQWxsb2NcIl09YXNtW1wic3RhY2tBbGxvY1wiXTt2YXIgc2V0VGhyZXc9TW9kdWxlW1wic2V0VGhyZXdcIl09YXNtW1wic2V0VGhyZXdcIl07dmFyIF9zYnJrPU1vZHVsZVtcIl9zYnJrXCJdPWFzbVtcIl9zYnJrXCJdO3ZhciBzdGFja1Jlc3RvcmU9TW9kdWxlW1wic3RhY2tSZXN0b3JlXCJdPWFzbVtcInN0YWNrUmVzdG9yZVwiXTt2YXIgZXN0YWJsaXNoU3RhY2tTcGFjZT1Nb2R1bGVbXCJlc3RhYmxpc2hTdGFja1NwYWNlXCJdPWFzbVtcImVzdGFibGlzaFN0YWNrU3BhY2VcIl07dmFyIHN0YWNrU2F2ZT1Nb2R1bGVbXCJzdGFja1NhdmVcIl09YXNtW1wic3RhY2tTYXZlXCJdO3ZhciBkeW5DYWxsX2lpPU1vZHVsZVtcImR5bkNhbGxfaWlcIl09YXNtW1wiZHluQ2FsbF9paVwiXTt2YXIgZHluQ2FsbF9paWlpPU1vZHVsZVtcImR5bkNhbGxfaWlpaVwiXT1hc21bXCJkeW5DYWxsX2lpaWlcIl07UnVudGltZS5zdGFja0FsbG9jPU1vZHVsZVtcInN0YWNrQWxsb2NcIl07UnVudGltZS5zdGFja1NhdmU9TW9kdWxlW1wic3RhY2tTYXZlXCJdO1J1bnRpbWUuc3RhY2tSZXN0b3JlPU1vZHVsZVtcInN0YWNrUmVzdG9yZVwiXTtSdW50aW1lLmVzdGFibGlzaFN0YWNrU3BhY2U9TW9kdWxlW1wiZXN0YWJsaXNoU3RhY2tTcGFjZVwiXTtSdW50aW1lLnNldFRlbXBSZXQwPU1vZHVsZVtcInNldFRlbXBSZXQwXCJdO1J1bnRpbWUuZ2V0VGVtcFJldDA9TW9kdWxlW1wiZ2V0VGVtcFJldDBcIl07TW9kdWxlW1wiYXNtXCJdPWFzbTtNb2R1bGVbXCJ0aGVuXCJdPShmdW5jdGlvbihmdW5jKXtpZihNb2R1bGVbXCJjYWxsZWRSdW5cIl0pe2Z1bmMoTW9kdWxlKX1lbHNle3ZhciBvbGQ9TW9kdWxlW1wib25SdW50aW1lSW5pdGlhbGl6ZWRcIl07TW9kdWxlW1wib25SdW50aW1lSW5pdGlhbGl6ZWRcIl09KGZ1bmN0aW9uKCl7aWYob2xkKW9sZCgpO2Z1bmMoTW9kdWxlKX0pfXJldHVybiBNb2R1bGV9KTtmdW5jdGlvbiBFeGl0U3RhdHVzKHN0YXR1cyl7dGhpcy5uYW1lPVwiRXhpdFN0YXR1c1wiO3RoaXMubWVzc2FnZT1cIlByb2dyYW0gdGVybWluYXRlZCB3aXRoIGV4aXQoXCIrc3RhdHVzK1wiKVwiO3RoaXMuc3RhdHVzPXN0YXR1c31FeGl0U3RhdHVzLnByb3RvdHlwZT1uZXcgRXJyb3I7RXhpdFN0YXR1cy5wcm90b3R5cGUuY29uc3RydWN0b3I9RXhpdFN0YXR1czt2YXIgaW5pdGlhbFN0YWNrVG9wO3ZhciBwcmVsb2FkU3RhcnRUaW1lPW51bGw7dmFyIGNhbGxlZE1haW49ZmFsc2U7ZGVwZW5kZW5jaWVzRnVsZmlsbGVkPWZ1bmN0aW9uIHJ1bkNhbGxlcigpe2lmKCFNb2R1bGVbXCJjYWxsZWRSdW5cIl0pcnVuKCk7aWYoIU1vZHVsZVtcImNhbGxlZFJ1blwiXSlkZXBlbmRlbmNpZXNGdWxmaWxsZWQ9cnVuQ2FsbGVyfTtNb2R1bGVbXCJjYWxsTWFpblwiXT1Nb2R1bGUuY2FsbE1haW49ZnVuY3Rpb24gY2FsbE1haW4oYXJncyl7YXJncz1hcmdzfHxbXTtlbnN1cmVJbml0UnVudGltZSgpO3ZhciBhcmdjPWFyZ3MubGVuZ3RoKzE7ZnVuY3Rpb24gcGFkKCl7Zm9yKHZhciBpPTA7aTw0LTE7aSsrKXthcmd2LnB1c2goMCl9fXZhciBhcmd2PVthbGxvY2F0ZShpbnRBcnJheUZyb21TdHJpbmcoTW9kdWxlW1widGhpc1Byb2dyYW1cIl0pLFwiaThcIixBTExPQ19OT1JNQUwpXTtwYWQoKTtmb3IodmFyIGk9MDtpPGFyZ2MtMTtpPWkrMSl7YXJndi5wdXNoKGFsbG9jYXRlKGludEFycmF5RnJvbVN0cmluZyhhcmdzW2ldKSxcImk4XCIsQUxMT0NfTk9STUFMKSk7cGFkKCl9YXJndi5wdXNoKDApO2FyZ3Y9YWxsb2NhdGUoYXJndixcImkzMlwiLEFMTE9DX05PUk1BTCk7dHJ5e3ZhciByZXQ9TW9kdWxlW1wiX21haW5cIl0oYXJnYyxhcmd2LDApO2V4aXQocmV0LHRydWUpfWNhdGNoKGUpe2lmKGUgaW5zdGFuY2VvZiBFeGl0U3RhdHVzKXtyZXR1cm59ZWxzZSBpZihlPT1cIlNpbXVsYXRlSW5maW5pdGVMb29wXCIpe01vZHVsZVtcIm5vRXhpdFJ1bnRpbWVcIl09dHJ1ZTtyZXR1cm59ZWxzZXt2YXIgdG9Mb2c9ZTtpZihlJiZ0eXBlb2YgZT09PVwib2JqZWN0XCImJmUuc3RhY2spe3RvTG9nPVtlLGUuc3RhY2tdfU1vZHVsZS5wcmludEVycihcImV4Y2VwdGlvbiB0aHJvd246IFwiK3RvTG9nKTtNb2R1bGVbXCJxdWl0XCJdKDEsZSl9fWZpbmFsbHl7Y2FsbGVkTWFpbj10cnVlfX07ZnVuY3Rpb24gcnVuKGFyZ3Mpe2FyZ3M9YXJnc3x8TW9kdWxlW1wiYXJndW1lbnRzXCJdO2lmKHByZWxvYWRTdGFydFRpbWU9PT1udWxsKXByZWxvYWRTdGFydFRpbWU9RGF0ZS5ub3coKTtpZihydW5EZXBlbmRlbmNpZXM+MCl7cmV0dXJufXByZVJ1bigpO2lmKHJ1bkRlcGVuZGVuY2llcz4wKXJldHVybjtpZihNb2R1bGVbXCJjYWxsZWRSdW5cIl0pcmV0dXJuO2Z1bmN0aW9uIGRvUnVuKCl7aWYoTW9kdWxlW1wiY2FsbGVkUnVuXCJdKXJldHVybjtNb2R1bGVbXCJjYWxsZWRSdW5cIl09dHJ1ZTtpZihBQk9SVClyZXR1cm47ZW5zdXJlSW5pdFJ1bnRpbWUoKTtwcmVNYWluKCk7aWYoTW9kdWxlW1wib25SdW50aW1lSW5pdGlhbGl6ZWRcIl0pTW9kdWxlW1wib25SdW50aW1lSW5pdGlhbGl6ZWRcIl0oKTtpZihNb2R1bGVbXCJfbWFpblwiXSYmc2hvdWxkUnVuTm93KU1vZHVsZVtcImNhbGxNYWluXCJdKGFyZ3MpO3Bvc3RSdW4oKX1pZihNb2R1bGVbXCJzZXRTdGF0dXNcIl0pe01vZHVsZVtcInNldFN0YXR1c1wiXShcIlJ1bm5pbmcuLi5cIik7c2V0VGltZW91dCgoZnVuY3Rpb24oKXtzZXRUaW1lb3V0KChmdW5jdGlvbigpe01vZHVsZVtcInNldFN0YXR1c1wiXShcIlwiKX0pLDEpO2RvUnVuKCl9KSwxKX1lbHNle2RvUnVuKCl9fU1vZHVsZVtcInJ1blwiXT1Nb2R1bGUucnVuPXJ1bjtmdW5jdGlvbiBleGl0KHN0YXR1cyxpbXBsaWNpdCl7aWYoaW1wbGljaXQmJk1vZHVsZVtcIm5vRXhpdFJ1bnRpbWVcIl0pe3JldHVybn1pZihNb2R1bGVbXCJub0V4aXRSdW50aW1lXCJdKXt9ZWxzZXtBQk9SVD10cnVlO0VYSVRTVEFUVVM9c3RhdHVzO1NUQUNLVE9QPWluaXRpYWxTdGFja1RvcDtleGl0UnVudGltZSgpO2lmKE1vZHVsZVtcIm9uRXhpdFwiXSlNb2R1bGVbXCJvbkV4aXRcIl0oc3RhdHVzKX1pZihFTlZJUk9OTUVOVF9JU19OT0RFKXtwcm9jZXNzW1wiZXhpdFwiXShzdGF0dXMpfU1vZHVsZVtcInF1aXRcIl0oc3RhdHVzLG5ldyBFeGl0U3RhdHVzKHN0YXR1cykpfU1vZHVsZVtcImV4aXRcIl09TW9kdWxlLmV4aXQ9ZXhpdDt2YXIgYWJvcnREZWNvcmF0b3JzPVtdO2Z1bmN0aW9uIGFib3J0KHdoYXQpe2lmKE1vZHVsZVtcIm9uQWJvcnRcIl0pe01vZHVsZVtcIm9uQWJvcnRcIl0od2hhdCl9aWYod2hhdCE9PXVuZGVmaW5lZCl7TW9kdWxlLnByaW50KHdoYXQpO01vZHVsZS5wcmludEVycih3aGF0KTt3aGF0PUpTT04uc3RyaW5naWZ5KHdoYXQpfWVsc2V7d2hhdD1cIlwifUFCT1JUPXRydWU7RVhJVFNUQVRVUz0xO3ZhciBleHRyYT1cIlxcbklmIHRoaXMgYWJvcnQoKSBpcyB1bmV4cGVjdGVkLCBidWlsZCB3aXRoIC1zIEFTU0VSVElPTlM9MSB3aGljaCBjYW4gZ2l2ZSBtb3JlIGluZm9ybWF0aW9uLlwiO3ZhciBvdXRwdXQ9XCJhYm9ydChcIit3aGF0K1wiKSBhdCBcIitzdGFja1RyYWNlKCkrZXh0cmE7aWYoYWJvcnREZWNvcmF0b3JzKXthYm9ydERlY29yYXRvcnMuZm9yRWFjaCgoZnVuY3Rpb24oZGVjb3JhdG9yKXtvdXRwdXQ9ZGVjb3JhdG9yKG91dHB1dCx3aGF0KX0pKX10aHJvdyBvdXRwdXR9TW9kdWxlW1wiYWJvcnRcIl09TW9kdWxlLmFib3J0PWFib3J0O2lmKE1vZHVsZVtcInByZUluaXRcIl0pe2lmKHR5cGVvZiBNb2R1bGVbXCJwcmVJbml0XCJdPT1cImZ1bmN0aW9uXCIpTW9kdWxlW1wicHJlSW5pdFwiXT1bTW9kdWxlW1wicHJlSW5pdFwiXV07d2hpbGUoTW9kdWxlW1wicHJlSW5pdFwiXS5sZW5ndGg+MCl7TW9kdWxlW1wicHJlSW5pdFwiXS5wb3AoKSgpfX12YXIgc2hvdWxkUnVuTm93PXRydWU7aWYoTW9kdWxlW1wibm9Jbml0aWFsUnVuXCJdKXtzaG91bGRSdW5Ob3c9ZmFsc2V9cnVuKClcblxuXG5cblxuXG4gIHJldHVybiBLaXNzRkZUTW9kdWxlO1xufTtcbmlmICh0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gIG1vZHVsZVsnZXhwb3J0cyddID0gS2lzc0ZGVE1vZHVsZTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEtpc3NGRlRNb2R1bGUgPSByZXF1aXJlKCcuL0tpc3NGRlQnKTtcblxuXG52YXIga2lzc0ZGVE1vZHVsZSA9IEtpc3NGRlRNb2R1bGUoe30pO1xuXG52YXIga2lzc19mZnRyX2FsbG9jID0ga2lzc0ZGVE1vZHVsZS5jd3JhcChcbiAgICAna2lzc19mZnRyX2FsbG9jJywgJ251bWJlcicsIFsnbnVtYmVyJywgJ251bWJlcicsICdudW1iZXInLCAnbnVtYmVyJyBdXG4pO1xuXG52YXIga2lzc19mZnRyID0ga2lzc0ZGVE1vZHVsZS5jd3JhcChcbiAgICAna2lzc19mZnRyJywgJ3ZvaWQnLCBbJ251bWJlcicsICdudW1iZXInLCAnbnVtYmVyJyBdXG4pO1xuXG52YXIga2lzc19mZnRyaSA9IGtpc3NGRlRNb2R1bGUuY3dyYXAoXG4gICAgJ2tpc3NfZmZ0cmknLCAndm9pZCcsIFsnbnVtYmVyJywgJ251bWJlcicsICdudW1iZXInIF1cbik7XG5cbnZhciBraXNzX2ZmdHJfZnJlZSA9IGtpc3NGRlRNb2R1bGUuY3dyYXAoXG4gICAgJ2tpc3NfZmZ0cl9mcmVlJywgJ3ZvaWQnLCBbJ251bWJlciddXG4pO1xuXG52YXIga2lzc19mZnRfYWxsb2MgPSBraXNzRkZUTW9kdWxlLmN3cmFwKFxuICAgICdraXNzX2ZmdF9hbGxvYycsICdudW1iZXInLCBbJ251bWJlcicsICdudW1iZXInLCAnbnVtYmVyJywgJ251bWJlcicgXVxuKTtcblxudmFyIGtpc3NfZmZ0ID0ga2lzc0ZGVE1vZHVsZS5jd3JhcChcbiAgICAna2lzc19mZnQnLCAndm9pZCcsIFsnbnVtYmVyJywgJ251bWJlcicsICdudW1iZXInIF1cbik7XG5cbnZhciBraXNzX2ZmdF9mcmVlID0ga2lzc0ZGVE1vZHVsZS5jd3JhcChcbiAgICAna2lzc19mZnRfZnJlZScsICd2b2lkJywgWydudW1iZXInXVxuKTtcblxudmFyIEZGVCA9IGZ1bmN0aW9uIChzaXplKSB7XG5cbiAgICB0aGlzLnNpemUgPSBzaXplO1xuICAgIHRoaXMuZmNmZyA9IGtpc3NfZmZ0X2FsbG9jKHNpemUsIGZhbHNlKTtcbiAgICB0aGlzLmljZmcgPSBraXNzX2ZmdF9hbGxvYyhzaXplLCB0cnVlKTtcbiAgICBcbiAgICB0aGlzLmlucHRyID0ga2lzc0ZGVE1vZHVsZS5fbWFsbG9jKHNpemUqOCArIHNpemUqOCk7XG4gICAgdGhpcy5vdXRwdHIgPSB0aGlzLmlucHRyICsgc2l6ZSo4O1xuICAgIFxuICAgIHRoaXMuY2luID0gbmV3IEZsb2F0MzJBcnJheShraXNzRkZUTW9kdWxlLkhFQVBVOC5idWZmZXIsIHRoaXMuaW5wdHIsIHNpemUqMik7XG4gICAgdGhpcy5jb3V0ID0gbmV3IEZsb2F0MzJBcnJheShraXNzRkZUTW9kdWxlLkhFQVBVOC5idWZmZXIsIHRoaXMub3V0cHRyLCBzaXplKjIpO1xuICAgIFxuICAgIHRoaXMuZm9yd2FyZCA9IGZ1bmN0aW9uKGNpbikge1xuXHR0aGlzLmNpbi5zZXQoY2luKTtcblx0a2lzc19mZnQodGhpcy5mY2ZnLCB0aGlzLmlucHRyLCB0aGlzLm91dHB0cik7XG5cdHJldHVybiBuZXcgRmxvYXQzMkFycmF5KGtpc3NGRlRNb2R1bGUuSEVBUFU4LmJ1ZmZlcixcblx0XHRcdFx0dGhpcy5vdXRwdHIsIHRoaXMuc2l6ZSAqIDIpO1xuICAgIH07XG4gICAgXG4gICAgdGhpcy5pbnZlcnNlID0gZnVuY3Rpb24oY2luKSB7XG5cdHRoaXMuY2luLnNldChjcHgpO1xuXHRraXNzX2ZmdCh0aGlzLmljZmcsIHRoaXMuaW5wdHIsIHRoaXMub3V0cHRyKTtcblx0cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoa2lzc0ZGVE1vZHVsZS5IRUFQVTguYnVmZmVyLFxuXHRcdFx0XHR0aGlzLm91dHB0ciwgdGhpcy5zaXplICogMik7XG4gICAgfTtcbiAgICBcbiAgICB0aGlzLmRpc3Bvc2UgPSBmdW5jdGlvbigpIHtcblx0a2lzc0ZGVE1vZHVsZS5fZnJlZSh0aGlzLmlucHRyKTtcblx0a2lzc19mZnRfZnJlZSh0aGlzLmZjZmcpO1xuXHRraXNzX2ZmdF9mcmVlKHRoaXMuaWNmZyk7XG4gICAgfVxufTtcblxudmFyIEZGVFIgPSBmdW5jdGlvbiAoc2l6ZSkge1xuXG4gICAgdGhpcy5zaXplID0gc2l6ZTtcbiAgICB0aGlzLmZjZmcgPSBraXNzX2ZmdHJfYWxsb2Moc2l6ZSwgZmFsc2UpO1xuICAgIHRoaXMuaWNmZyA9IGtpc3NfZmZ0cl9hbGxvYyhzaXplLCB0cnVlKTtcbiAgICBcbiAgICB0aGlzLnJwdHIgPSBraXNzRkZUTW9kdWxlLl9tYWxsb2Moc2l6ZSo0ICsgKHNpemUrMikqNCk7XG4gICAgdGhpcy5jcHRyID0gdGhpcy5ycHRyICsgc2l6ZSo0O1xuICAgIFxuICAgIHRoaXMucmkgPSBuZXcgRmxvYXQzMkFycmF5KGtpc3NGRlRNb2R1bGUuSEVBUFU4LmJ1ZmZlciwgdGhpcy5ycHRyLCBzaXplKTtcbiAgICB0aGlzLmNpID0gbmV3IEZsb2F0MzJBcnJheShraXNzRkZUTW9kdWxlLkhFQVBVOC5idWZmZXIsIHRoaXMuY3B0ciwgc2l6ZSsyKTtcbiAgICBcbiAgICB0aGlzLmZvcndhcmQgPSBmdW5jdGlvbihyZWFsKSB7XG5cdHRoaXMucmkuc2V0KHJlYWwpO1xuXHRraXNzX2ZmdHIodGhpcy5mY2ZnLCB0aGlzLnJwdHIsIHRoaXMuY3B0cik7XG5cdHJldHVybiBuZXcgRmxvYXQzMkFycmF5KGtpc3NGRlRNb2R1bGUuSEVBUFU4LmJ1ZmZlcixcblx0XHRcdFx0dGhpcy5jcHRyLCB0aGlzLnNpemUgKyAyKTtcbiAgICB9O1xuICAgIFxuICAgIHRoaXMuaW52ZXJzZSA9IGZ1bmN0aW9uKGNweCkge1xuXHR0aGlzLmNpLnNldChjcHgpO1xuXHRraXNzX2ZmdHJpKHRoaXMuaWNmZywgdGhpcy5jcHRyLCB0aGlzLnJwdHIpO1xuXHRyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShraXNzRkZUTW9kdWxlLkhFQVBVOC5idWZmZXIsXG5cdFx0XHRcdHRoaXMucnB0ciwgdGhpcy5zaXplKTtcbiAgICB9O1xuICAgIFxuICAgIHRoaXMuZGlzcG9zZSA9IGZ1bmN0aW9uKCkge1xuXHRraXNzRkZUTW9kdWxlLl9mcmVlKHRoaXMucnB0cik7XG5cdGtpc3NfZmZ0cl9mcmVlKHRoaXMuZmNmZyk7XG5cdGtpc3NfZmZ0cl9mcmVlKHRoaXMuaWNmZyk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgRkZUOiBGRlQsXG4gICAgRkZUUjogRkZUUlxufTtcbiJdfQ==
