import {
    dispatch
} from "d3-dispatch"

export default function() {
    var extId = "djcdicpaejhpgncicoglfckiappkoeof"
    var chanId = "cnbChan01"
    var status = {
        connection: "No Connection",
        id: ""
    }
    var hub = dispatch("sendMessage",
        "receiveMessage", "_disconnect")

    hub.on("_disconnect.status", function() {
        status.connection = "No Connection"
        status.id = ""
    });


    var _dispatch //local dispatch for same webpage
    var defaultCodes = ["update", "brush"]
    if (arguments.length > 0) {
        _dispatch = dispatch.apply(this, arguments)
    } else {
        _dispatch = dispatch.apply(this, defaultCodes)
    }

    var onchange = function() {

    }
    var onclose = function() {
        onchange();
    }
    var agent = function() {
        //TODO Call Agent
    }
    
    agent.connect = function(_) {
        if (typeof _ == "function") {
            connect(chanId, extId, hub, status, function(d) {
                onchange();
                _(d);
            }, onclose)
        } else {
            connect(chanId, extId, hub, status, function(d) {
                onchange();
            }, onclose)
        }
    }
    agent.disconnect = function(_) {
        hub.call("_disconnect", this, {})
    }
    agent.close = function(_) {
        hub.call("_disconnect", this, {})
    }
    //V0 API
    // chan.dipsatch()
    // code: sendMessage
    //       receiveMessage  
    // data:  {
    //      code: CodeString,
    //      data: Stringify JSON Object 
    // }
    agent.dispatch = function() {
        return hub;
    }
    agent.extId = function(_) {
        return arguments.length ? (extId = _, agent) : extId;
    }
    agent.chanId = function(_) {
        return arguments.length ? (chanId = _, agent) : chanId;
    }
    agent.status = function() {
        return status
    }
    //status change callback
    agent.onchange = function(_) {
        return arguments.length ? (onchange = _, agent) : onchange;
    }
    //V1 API
    agent.on = function(m, f) {
        var a = m.split(".")
        var m0 = a[0] || ""
        //check status??
        if (m0 === "sendMessage" || m0 === "receiveMessage") {
            hub.on(m, f)
        } else {
            // codebook
            // Add Code Book Wrapper for Receive Message Interface
            // Extend d3 hub 
            // user interface:
            // agent.on("code.x",function(data){})
            // translate to
            // agent.on("receiveMessage.code.x",function({"code":code,data:JSON.stringify(data)}))
            hub.on("receiveMessage".concat(".").concat(m), function(d) {
                if (d.code === m0) {
                    f(JSON.parse(d.data))
                }
            })
            _dispatch.on(m, function(d) {
                f(d)
            })
        }
    }
    agent.call = function(code, self, data) {
        if (code === "sendMessage" || code === "receiveMessage") {
            hub.call(code, self, data)
        } else {
            hub.call("sendMessage", self, {
                "code": code,
                data: JSON.stringify(data)
            })
            //local call
            _dispatch.call(code, self, data)
        }
    }
    // TODO: Add Share Worker (share worker js) in case BroadcastChannel not support.
    return agent
}

function _connectExt(extId, _hub, status, callback, onclose) {
    var chromeExtPort = window.chrome.runtime.connect(
        extId)
    _hub.on("sendMessage.apps", function(d) {
        chromeExtPort.postMessage(d) //send message to chromeExt
    })
    chromeExtPort.onMessage.addListener(function(d) {
        _hub.call("receiveMessage",
            this, {
                code: d.code,
                data: JSON.stringify(
                    d.data)
            });
    })
    chromeExtPort.onDisconnect.addListener(function(e) {
        console.log("disconnect to extension ", extId)
        _hub.on("sendMessage.apps", null)
        onclose()
    })
    _hub.on("_disconnect", function(d) {
        console.log("disconnect to extension ", extId)
        _hub.on("sendMessage.apps", null)
        onclose()
        chromeExtPort.disconnect()
    })
    status.connection = "Extension"
    status.id = extId
    callback(status)
}


function _connectChan(channel, _hub, status, callback) {
    try {
        var chan = new BroadcastChannel(channel)
        _hub.on("sendMessage.chan", function(d) {
            chan.postMessage(d)
        })
        chan.onmessage = function(e) {
            var d = e.data
            _hub.call("receiveMessage", this, d)

        };
        _hub.on("_disconnect", function(d) {
            _hub.on("sendMessage.chan", null)
            chan.close()
            onclose()
        })
        status.connection = "Channel"
        status.id = channel
        callback(status)

    } catch (e) {
        console.log("your browser doesn't support BroadCastChannel")
        status.connection = "No Connection"
        status.id = ""
        callback(status)
    }
}

function connect(chanId, extId, _hub, status, callback, onclose) {
    var chromeExtPort;
    var chromeExtID = extId
    //var hasExtension
    var channel = chanId
    var connectChan = function() {
        _connectChan(channel, _hub, status, callback)
    }
    try {
        window.chrome.runtime.sendMessage(chromeExtID, {
                message: "version"
            },
            function(reply) {
                if (reply) {
                    if (reply.version) {
                        connectExt();
                    }
                } else {
                    connectChan()
                }
            });
    } catch (e) {
        connectChan()
    }
    var connectExt = function() {
        _connectExt(extId, _hub, status, callback, onclose)
    }
}
