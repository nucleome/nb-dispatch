# @nucleome/nb-dispatch
[![npm (scoped)](https://img.shields.io/npm/v/@nucleome/nb-dispatch.svg)](https://www.npmjs.com/package/@nucleome/nb-dispatch)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@nucleome/nb-dispatch.svg)](https://github.com/nucleome/nb-dispatch)

nb-dispatch is a cross-domain event dispatcher for [Nucleome Platform](http://doc.nucleome.org). 

if user install our chrome extension [*Nucleome Bridge*](https://chrome.google.com/webstore/detail/djcdicpaejhpgncicoglfckiappkoeof), nb-dispatch will use *Nucleome Bridge* to send event emittion between tabs from multiple domains, otherwise, it will use web browser's *BroadCast dispatchnel* to send event emittion between tabs within the same domain.

Our Web Application [Nucleome Browser](https://vis.nucleome.org) is connected with nb-dispatch.

## Connect 

Connect to cross-tab channel.
```javascript
import {dispatch} from "@nucleome/nb-dispatch";
var c = dispatch("update","brush")
var callback = function(status){
  console.log(status)
}
c.connect(callback)
```
Listen to events in all dispatch connected tabs.
```javascript
//receive message from nucleome bridge or BroadCast dispatchnel.

c.on("update",function(d){
  //Add your code (user navigate to these genome coordinates in other tab, respond accordingly )
})
c.on("update.anything",function(d){
  //register multiple listeners as d3-dispatch
  //Add your other code (user navigate to these genome coordinates in other tab, respond accordingly )
})
c.on("brush",function(d){
  //Add your code  (user brush these genome coordinates in other tab, respond accordingly )
})
```
Emit events to all dispatch connected tabs.
```javascript

var regions = [{genome:"hg38",chr:"chr1",start:1,end:10000, color: "#336289" },{genome:"hg38",chr:"chr2",start:1,end:1000}]

c.call("update",this,regions)

c.call("brush",this,regions)
```


## Installing
If you use NPM, `npm install @nucleome/nb-dispatch`.
If you use in your webpage,
```html
<script src="https://unpkg.com/@nucleome/nb-dispatch"></script>
<script>

var c = nb.dispatch("update","brush");
c.connect(function(status){
    //add your code callback.
});

</script>

```
## Test your code with CodePen or JSFiddle
*Nucleome Bridge* now support connection with Codepen and JSFiddle.
Here is [a collection of examples in Codepen](https://codepen.io/collection/DkGVYL/) and [a collection of example in JSfiddle](https://jsfiddle.net/user/nucleome/fiddles/).

## Connect your web page with *Nucleome Bridge*
*Nucleome Bridge* now support communication with UCSC Genome Browser and WashU EpiGenome Browser.

Due to the web safety reason, any web sites which want to connect with *Nucleome Bridge* needs to satisfty the pattern specify in *Nucleome Bridge* manifest.json file.

Currently, any local website, whose IP address is such as `*://127.0.0.1:*/*`, is connectable with *Nucleome Bridge*.

For user sharing their web pages, `https://bl.ocks.org/*` is also connectable with *Nucleome Bridge*. User can share their web page in this website by submit their code to gist. For futhur information. Please read [this webpage](https://bl.ocks.org/-/about).
We also have some demos in bl.ocks.org, here is [the link](https://bl.ocks.org/nb1page).

If you want to your website can be connectable with *Nucleome Bridge*, Please contact [us](mailto:zhuxp@cmu.edu). 



## API Quick Start

Check the connection status of dispatch
```javascript
  var c = nb.dispatch("update","brush")
  c.connect(function(){
    console.log(c.status())
  }
```
Currently, standard communication code
```
event name: update and brush.
pass data: regions = [region... ]
           region format {genome:string,chr:string,start:int,end:int, color:color}
           color is optional
```
Start and end is defined as same as [bed format](https://genome.ucsc.edu/FAQ/FAQformat.html#format1). Start is 0-index. and end is not included in this region.

## API Reference 
nb-dispatch has the same initialize method and the same function interface "on" and "call" as [d3-dispatch](https://github.com/d3/d3-dispatch).

\# nb.<b>dispatch</b>(<i>types…</i>) [<>](https://github.com/nucleome/nb-dispatch/blob/master/src/dispatch.js "Source")

Creates a new dispatch for the specified event *types*. Each *type* is a string, such as `"update"` or `"brush"`.


\# *dispatch*.<b>on</b>(<i>typenames</i>[, <i>callback</i>]) 

Adds, removes or gets the *callback* for the specified *typenames*. If a *callback* function is specified, it is registered for the specified (fully-qualified) *typenames*. If a callback was already registered for the given *typenames*, the existing callback is removed before the new callback is added.

The specified *typenames* is a string, such as `start` or `end.foo`. The type may be optionally followed by a period (`.`) and a name; the optional name allows multiple callbacks to be registered to receive events of the same type, such as `update.foo` and `update.bar`. 

\# *dispatch*.<b>call</b>(<i>type</i>[, <i>that</i>[, <i>arguments…</i>]]) 

Like [*function*.call](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call), invokes each registered callback for the specified *type*, passing the callback the specified *arguments*, with *that* as the `this` context. 

Besides, nb-dispatch has two other functions to connect and disconnect to cross-tab channels.

\# *dispatch*.<b>connect</b>(<i>callback</i>) 
Connect Nucleome Bridge or BroadCast Channel 

\# *dispatch*.<b>connect</b>(<i>callback</i>) 
disconnect Nucleome Bridge or BroadCast Channel 

\# *dispatch*.<b>status</b>() 
check connect channel status ( dispatch.status().connection is one of "Extension","None","Channel" ) 
