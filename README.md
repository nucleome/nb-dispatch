# @nucleome/nb-dispatch
[![npm (scoped)](https://img.shields.io/npm/v/@nucleome/nb-dispatch.svg)](https://www.npmjs.com/package/@nucleome/nb-dispatch)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@nucleome/nb-dispatch.svg)](https://github.com/nucleome/nb-dispatch)

nb-dispatch is a multi-channel, cross-tab, and cross-domain event dispatcher for [Nucleome Browser](http://www.nucleome.org). 

Once you install the Chrome web browser extension [*Nucleome Bridge*](https://chrome.google.com/webstore/detail/djcdicpaejhpgncicoglfckiappkoeof), nb-dispatch will use *Nucleome Bridge* to dispatch event messages between tabs across multiple domains, otherwise, it will use the web browser's *BroadCast channel API* to send event messages between tabs within the same domain. 

Use can create custom web applications using nb-dispatch to connect these web applications with Nucleome Browser.

## Installing
1) Use npm to install nb-dispatch, and import it in JavaScript.
```javascript
import {dispatch} from "@nucleome/nb-dispatch";
```
2) Use nb-dispatch in one webpage
```html
<script src="https://unpkg.com/@nucleome/nb-dispatch"></script>
<script>
var c = nb.dispatch("update","brush");
c.connect(function(status){
    //add your code callback.
});
</script>
```

## Quick Start
The following scripts create a event-dispatch hub, register two operations (i.e., update and brush), and check connection status.
```javascript
var c = nb.dispatch("update","brush")
var callback = function(status){
  console.log(status)
}
c.connect(callback)
```

The following scripts show how to monitor events in other connected panels or web applications.
```javascript
//receive messages from nucleome bridge or BroadCast dispatch channel.
c.on("update",function(d){
  //Add your code (e.g., when user navigates to these genome coordinates in other panel, respond accordingly )
})
c.on("update.anything",function(d){
  //register multiple listeners as d3-dispatch
  //Add your other code (e..g, when user navigates to these genome coordinates in other panel, respond accordingly )
})
c.on("brush",function(d){
  //Add your code  (e.g., when user brushes these genome coordinates in other panel, respond accordingly )
})
```

The following scripts show how to emit events to other connected panels or web applications.
```javascript
var regions = [{genome:"hg38",chr:"chr1",start:1,end:10000, color: "#336289" },{genome:"hg38",chr:"chr2",start:1,end:1000}]
// navigate to specific regions
c.call("update",this,regions)
// highlgith some regions
c.call("brush",this,regions)
```

## Test your code using CodePen or JSFiddle
To further allow users to visualize new data types in Nucleome Browser or link other web applications with our platform, *Nucleome Bridge* allows user to test their code in Codepen and JSFiddle.
Here is [a collection of examples in Codepen](https://codepen.io/collection/DkGVYL/) and [a collection of examples in JSfiddle](https://jsfiddle.net/user/nucleome/fiddles/) showing how to connect to Nucleome Browser for customized purposes.

## Connect other web applications with *Nucleome Bridge*
*Nucleome Bridge* also supports synchronized operations with UCSC Genome Browser and WashU EpiGenome Browser.

Due to the web safety reason, we only allow certain websites to connect with Nucleome Browser, which is specified in the *Nucleome Bridge* manifest.json file.
Besides the aforementioned websites, any local websites, such as `*://127.0.0.1:*/*` and `https://bl.ocks.org/*` are allowed to connect to Nucleome Browser. 
We also have some demos in bl.ocks.org, here is [the link](https://bl.ocks.org/nb1page).
You can view the full list (whitelist) of allowed websites [here](https://nb-docs.readthedocs.io/en/latest/nb_dispatch_api.html#overview)

If you want to add your website to the whitelist, Please contact [us](mailto:zhuxp@cmu.edu). 

## Communication code specification

Currently, we use the following rules to represent navigation or highlight of genomic coordinates
```
event name: update and brush.
pass data: regions = [region... ]
           region format {genome:string,chr:string,start:int,end:int, color:color}
           color is optional
```
Start and end are defined as same as [bed format](https://genome.ucsc.edu/FAQ/FAQformat.html#format1). 

## API Reference 
nb-dispatch has the same initialization method and the same function interface such as "on" and "call" as [d3-dispatch](https://github.com/d3/d3-dispatch).

\# nb.<b>dispatch</b>(<i>types…</i>) [<>](https://github.com/nucleome/nb-dispatch/blob/master/src/dispatch.js "Source")

Creates a new dispatch for the specified event *types*. Each *type* is a string, such as `"update"` or `"brush"`.

\# *dispatch*.<b>on</b>(<i>typenames</i>[, <i>callback</i>]) 

Adds, removes, or gets the *callback* for the specified *typenames*. If a *callback* function is specified, it is registered for the specified (fully-qualified) *typenames*. If a callback was already registered for the given *typenames*, the existing callback is removed before the new callback is added.

A specified *typename* is a string, such as `start` or `end.foo`. The type may be optionally followed by a period (`.`) and a name; the optional name allows multiple callbacks to be registered to receive events of the same type, such as `update.foo` and `update.bar`. To specify multiple typenames, separate typenames with spaces, such as update brush or update.foo brush.bar.

To remove a callback with update.foo, say dispatch.on("update.foo", null).

\# *dispatch*.<b>call</b>(<i>type</i>[, <i>that</i>[, <i>arguments…</i>]]) 

Like [*function*.call](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call), invoke each registered callback for a specified *type*, passing the callback the specified *arguments*, with *that* as the `this` context. 

The following scripts are nb-dispatch functions for communication across channels which is different from d3-dispatch.

\# *dispatch*.<b>connect</b>(<i>callback</i>) 

connect Nucleome Bridge or BroadCast Channel 

\# *dispatch*.<b>disconnect</b>() 

disconnect Nucleome Bridge or BroadCast Channel 

\# *dispatch*.<b>status</b>() 

check the status of connected channel ( dispatch.status().connection is one of "Extension","None","Channel" ) 

\# *dispatch*.<b>chanId</b>(<i>channelName</i>)

set connect channel id , use before <b>connect</b>. 
if no arguments, get current channel id. 
default channel id : "cnbChan01"
 
