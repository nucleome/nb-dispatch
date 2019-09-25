# @nucleome/nb-dipatch
[![npm (scoped)](https://img.shields.io/npm/v/@nucleome/nb-dispatch.svg)](https://www.npmjs.com/package/@nucleome/nb-dispatch)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@nucleome/nb-dispatch.svg)](https://github.com/nucleome/nb-dispatch)

nb-dipatch is a cross-domain event dispatcher for [Nucleome Platform](http://doc.nucleome.org). nb-dipatch has the same initialize method and the same function interface "on" and "call" as [d3-dispatch](https://github.com/d3/d3-dispatch). 

if user install our chrome extension [*Nucleome Bridge*](https://chrome.google.com/webstore/detail/djcdicpaejhpgncicoglfckiappkoeof), nb-dipatch will use *Nucleome Bridge* to send event emittion between tabs from multiple domains, otherwise, it will use web browser's *BroadCast dipatchnel* to send event emittion between tabs within the same domain.

Our Web Application [Nucleome Browser](https://vis.nucleome.org) is connected with nb-dipatch.

## Connect 

Connect to dipatchnel.
```javascript
import {dipatch} from "@nucleome/nb-dipatch";
var c = dipatch("update","brush")
var callback = function(status){
  console.log(status)
}
c.connect(callback)
```
Listen to events in all dipatch connected tabs.
```javascript
//receive message from nucleome bridge or BroadCast dipatchnel.

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
Emit events to all dipatch connected tabs.
```javascript

var regions = [{genome:"hg38",chr:"chr1",start:1,end:10000},{genome:"hg38",chr:"chr2",start:1,end:1000}]

c.call("update",this,regions)

c.call("brush",this,regions)
```


## Installing
If you use NPM, `npm install @nucleome/nb-dipatch`.
If you use in your webpage,
```html
<script src="https://vis.nucleome.org/static/lib/nb-dipatch.min.js"></script>
<script>

var c = nb.dipatch();
c.connect(function(status){
    //add your code callback.
});

</script>

```
## Connect your web page with *Nucleome Bridge*
*Nucleome Bridge* now support communication with UCSC Genome Browser and WashU EpiGenome Browser.

Due to the web safety reason, any web sites which want to connect with *Nucleome Bridge* needs to satisfty the pattern specify in *Nucleome Bridge* manifest.json file.

Currently, any local website, whose IP address is such as `*://127.0.0.1:*/*`, is connectable with *Nucleome Bridge*.

For user sharing their web pages, `https://bl.ocks.org/*` is also connectable with *Nucleome Bridge*. User can share their web page in this website by submit their code to gist. For futhur information. Please read [this webpage](https://bl.ocks.org/-/about).
We also have some demos in bl.ocks.org, here is [the link](https://bl.ocks.org/nb1page).

If you want to your website can be connectable with *Nucleome Bridge*, Please contact [us](mailto:zhuxp@cmu.edu). 


## API Reference

Check the connection status of dipatchnel
```javascript
  var c = nb.dipatch()
  c.connect(function(){
    console.log(c.status())
  }
```
Currently, standard communication code
```
event name: update and brush.
pass data: regions = [region... ]
           region format {genome:string,chr:string,start:int,end:int}
```
Start and end is defined as same as [bed format](https://genome.ucsc.edu/FAQ/FAQformat.html#format1). Start is 0-index. and end is not included in this region.

