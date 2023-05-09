// adding Scorm
var pipwerks = {};
pipwerks.UTILS = {};
pipwerks.debug = { isActive: true };
pipwerks.SCORM = {
    version: null,
    handleCompletionStatus: true,
    handleExitMode: true,
    API: { handle: null, isFound: false },
    connection: { isActive: false },
    data: { completionStatus: null, exitStatus: null },
    debug: {}
};
pipwerks.SCORM.isAvailable = function() {
    return true;
};
pipwerks.SCORM.API.find = function(e) {
    var t = null,
        n = 0,
        r = 500,
        i = "SCORM.API.find",
        s = pipwerks.UTILS.trace,
        o = pipwerks.SCORM;
    while (!e.API && !e.API_1484_11 && e.parent && e.parent != e && n <= r) {
        n++;
        e = e.parent;
    }
    if (o.version) {
        switch (o.version) {
            case "2004":
                if (e.API_1484_11) {
                    t = e.API_1484_11;
                } else {
                    s(
                        i +
                            ": SCORM version 2004 was specified by user, but API_1484_11 cannot be found."
                    );
                }
                break;
            case "1.2":
                if (e.API) {
                    t = e.API;
                } else {
                    s(
                        i +
                            ": SCORM version 1.2 was specified by user, but API cannot be found."
                    );
                }
                break;
        }
    } else {
        if (e.API_1484_11) {
            o.version = "2004";
            t = e.API_1484_11;
        } else if (e.API) {
            o.version = "1.2";
            t = e.API;
        }
    }
    if (t) {
        s(i + ": API found. Version: " + o.version);
        s("API: " + t);
    } else {
        s(
            i +
                ": Error finding API. \nFind attempts: " +
                n +
                ". \nFind attempt limit: " +
                r
        );
    }
    return t;
};
pipwerks.SCORM.API.get = function() {
    var e = null,
        t = window,
        n = pipwerks.SCORM.API.find,
        r = pipwerks.UTILS.trace;
    if (t.parent && t.parent != t) {
        e = n(t.parent);
    }
    if (!e && t.top.opener) {
        e = n(t.top.opener);
    }
    if (e) {
        pipwerks.SCORM.API.isFound = true;
    } else {
        r("API.get failed: Can't find the API!");
    }
    return e;
};
pipwerks.SCORM.API.getHandle = function() {
    var e = pipwerks.SCORM.API;
    if (!e.handle && !e.isFound) {
        e.handle = e.get();
    }
    return e.handle;
};
pipwerks.SCORM.connection.initialize = function() {
    var e = false,
        t = pipwerks.SCORM,
        n = pipwerks.SCORM.data.completionStatus,
        r = pipwerks.UTILS.trace,
        i = pipwerks.UTILS.StringToBoolean,
        s = pipwerks.SCORM.debug,
        o = "SCORM.connection.initialize ";
    r("connection.initialize called.");
    if (!t.connection.isActive) {
        var u = t.API.getHandle(),
            a = 0;
        if (u) {
            switch (t.version) {
                case "1.2":
                    e = i(u.LMSInitialize(""));
                    break;
                case "2004":
                    e = i(u.Initialize(""));
                    break;
            }
            if (e) {
                a = s.getCode();
                if (a !== null && a === 0) {
                    t.connection.isActive = true;
                    if (t.handleCompletionStatus) {
                        n = pipwerks.SCORM.status("get");
                        if (n) {
                            switch (n) {
                                case "not attempted":
                                    pipwerks.SCORM.status("set", "incomplete");
                                    break;
                                case "unknown":
                                    pipwerks.SCORM.status("set", "incomplete");
                                    break;
                            }
                        }
                    }
                } else {
                    e = false;
                    r(
                        o +
                            "failed. \nError code: " +
                            a +
                            " \nError info: " +
                            s.getInfo(a)
                    );
                }
            } else {
                a = s.getCode();
                if (a !== null && a !== 0) {
                    r(
                        o +
                            "failed. \nError code: " +
                            a +
                            " \nError info: " +
                            s.getInfo(a)
                    );
                } else {
                    r(o + "failed: No response from server.");
                }
            }
        } else {
            r(o + "failed: API is null.");
        }
    } else {
        r(o + "aborted: Connection already active.");
    }
    return e;
};
pipwerks.SCORM.connection.terminate = function() {
    var e = false,
        t = pipwerks.SCORM,
        n = pipwerks.SCORM.data.exitStatus,
        r = pipwerks.SCORM.data.completionStatus,
        i = pipwerks.UTILS.trace,
        s = pipwerks.UTILS.StringToBoolean,
        o = pipwerks.SCORM.debug,
        u = "SCORM.connection.terminate ";
    if (t.connection.isActive) {
        var a = t.API.getHandle(),
            f = 0;
        if (a) {
            if (t.handleExitMode && !n) {
                if (r !== "completed" && r !== "passed") {
                    switch (t.version) {
                        case "1.2":
                            e = t.set("cmi.core.exit", "suspend");
                            break;
                        case "2004":
                            e = t.set("cmi.exit", "suspend");
                            break;
                    }
                } else {
                    switch (t.version) {
                        case "1.2":
                            e = t.set("cmi.core.exit", "logout");
                            break;
                        case "2004":
                            e = t.set("cmi.exit", "logout");
                            break;
                    }
                }
            }
            switch (t.version) {
                case "1.2":
                    e = s(a.LMSFinish(""));
                    break;
                case "2004":
                    e = s(a.Terminate(""));
                    break;
            }
            if (e) {
                t.connection.isActive = false;
            } else {
                f = o.getCode();
                i(
                    u +
                        "failed. \nError code: " +
                        f +
                        " \nError info: " +
                        o.getInfo(f)
                );
            }
        } else {
            i(u + "failed: API is null.");
        }
    } else {
        i(u + "aborted: Connection already terminated.");
    }
    return e;
};
pipwerks.SCORM.data.get = function(e) {
    var t = null,
        n = pipwerks.SCORM,
        r = pipwerks.UTILS.trace,
        i = pipwerks.SCORM.debug,
        s = "SCORM.data.get(" + e + ") ";
    if (n.connection.isActive) {
        var o = n.API.getHandle(),
            u = 0;
        if (o) {
            switch (n.version) {
                case "1.2":
                    t = o.LMSGetValue(e);
                    break;
                case "2004":
                    t = o.GetValue(e);
                    break;
            }
            u = i.getCode();
            if (t !== "" && u === 0) {
                switch (e) {
                    case "cmi.core.lesson_status":
                    case "cmi.completion_status":
                        n.data.completionStatus = t;
                        break;
                    case "cmi.core.exit":
                    case "cmi.exit":
                        n.data.exitStatus = t;
                        break;
                }
            } else {
                r(
                    s +
                        "failed. \nError code: " +
                        u +
                        "\nError info: " +
                        i.getInfo(u)
                );
            }
        } else {
            r(s + "failed: API is null.");
        }
    } else {
        r(s + "failed: API connection is inactive.");
    }
    r(s + " value: " + t);
    return String(t);
};
pipwerks.SCORM.data.set = function(e, t) {
    var n = false,
        r = pipwerks.SCORM,
        i = pipwerks.UTILS.trace,
        s = pipwerks.UTILS.StringToBoolean,
        o = pipwerks.SCORM.debug,
        u = "SCORM.data.set(" + e + ") ";
        console.log("SCORM INFOS",r.version,e,t);
    if (r.connection.isActive) {
        var a = r.API.getHandle(),
            f = 0;
        if (a) {
            switch (r.version) {
                case "1.2":
                    n = s(a.LMSSetValue(e, t));
                    break;
                case "2004":
                    n = s(a.SetValue(e, t));
                    break;
            }
            if (n) {
                if (
                    e === "cmi.core.lesson_status" ||
                    e === "cmi.completion_status"
                ) {
                    r.data.completionStatus = t;
                }
            } else {
                i(
                    u +
                        "failed. \nError code: " +
                        f +
                        ". \nError info: " +
                        o.getInfo(f)
                );
            }
        } else {
            i(u + "failed: API is null.");
        }
    } else {
        i(u + "failed: API connection is inactive.");
    }
    return n;
};
pipwerks.SCORM.data.save = function() {
    var e = false,
        t = pipwerks.SCORM,
        n = pipwerks.UTILS.trace,
        r = pipwerks.UTILS.StringToBoolean,
        i = "SCORM.data.save failed";
    if (t.connection.isActive) {
        var s = t.API.getHandle();
        if (s) {
            switch (t.version) {
                case "1.2":
                    e = r(s.LMSCommit(""));
                    break;
                case "2004":
                    e = r(s.Commit(""));
                    break;
            }
        } else {
            n(i + ": API is null.");
        }
    } else {
        n(i + ": API connection is inactive.");
    }
    return e;
};
pipwerks.SCORM.status = function(e, t) {
    var n = false,
        r = pipwerks.SCORM,
        i = pipwerks.UTILS.trace,
        s = "SCORM.getStatus failed",
        o = "";
    if (e !== null) {
        switch (r.version) {
            case "1.2":
                o = "cmi.core.lesson_status";
                break;
            case "2004":
                o = "cmi.completion_status";
                break;
        }
        switch (e) {
            case "get":
                n = pipwerks.SCORM.data.get(o);
                break;
            case "set":
                if (t !== null) {
                    n = pipwerks.SCORM.data.set(o, t);
                } else {
                    n = false;
                    i(s + ": status was not specified.");
                }
                break;
            default:
                n = false;
                i(s + ": no valid action was specified.");
        }
    } else {
        i(s + ": action was not specified.");
    }
    return n;
};
pipwerks.SCORM.debug.getCode = function() {
    var e = pipwerks.SCORM.API.getHandle(),
        t = pipwerks.SCORM,
        n = pipwerks.UTILS.trace,
        r = 0;
    if (e) {
        switch (t.version) {
            case "1.2":
                r = parseInt(e.LMSGetLastError(), 10);
                break;
            case "2004":
                r = parseInt(e.GetLastError(), 10);
                break;
        }
    } else {
        n("SCORM.debug.getCode failed: API is null.");
    }
    return r;
};
pipwerks.SCORM.debug.getInfo = function(e) {
    var t = pipwerks.SCORM.API.getHandle(),
        n = pipwerks.SCORM,
        r = pipwerks.UTILS.trace,
        i = "";
    if (t) {
        switch (n.version) {
            case "1.2":
                i = t.LMSGetErrorString(e.toString());
                break;
            case "2004":
                i = t.GetErrorString(e.toString());
                break;
        }
    } else {
        r("SCORM.debug.getInfo failed: API is null.");
    }
    return String(i);
};
pipwerks.SCORM.debug.getDiagnosticInfo = function(e) {
    var t = pipwerks.SCORM.API.getHandle(),
        n = pipwerks.SCORM,
        r = pipwerks.UTILS.trace,
        i = "";
    if (t) {
        switch (n.version) {
            case "1.2":
                i = t.LMSGetDiagnostic(e);
                break;
            case "2004":
                i = t.GetDiagnostic(e);
                break;
        }
    } else {
        r("SCORM.debug.getDiagnosticInfo failed: API is null.");
    }
    return String(i);
};
pipwerks.SCORM.init = pipwerks.SCORM.connection.initialize;
pipwerks.SCORM.get = pipwerks.SCORM.data.get;
pipwerks.SCORM.set = pipwerks.SCORM.data.set;
pipwerks.SCORM.save = pipwerks.SCORM.data.save;
pipwerks.SCORM.quit = pipwerks.SCORM.connection.terminate;
pipwerks.UTILS.StringToBoolean = function(e) {
    switch (e.toLowerCase()) {
        case "true":
        case "yes":
        case "1":
            return true;
        case "false":
        case "no":
        case "0":
        case null:
            return false;
        default:
            return Boolean(e);
    }
};
pipwerks.UTILS.trace = function(e) {
    if (pipwerks.debug.isActive) {
        if (window.console && window.console.firebug) {
            console.log(e);
        } else {
        }
    }
};
