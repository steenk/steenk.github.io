/* key-value-pointer v0.4.1, (c) 2015 Steen Klingberg. License: MIT */
!function(t,e){"function"==typeof define&&define.amd?define(e):"undefined"!=typeof module?module.exports=e():t.keyValuePointer=e()}(this,function(){function t(t,e){var n,o,r=!1;if("string"==typeof t&&(t=JSON.parse(t)),"object"==typeof t){if("string"==typeof e)n=e.split("/");else{if(!Array.isArray(e))return;n=e}return o=t,n.forEach(function(t){r||(t=t.replace("~1","/").replace("~0","~"),""!==t&&("undefined"==typeof o[t]?(r=!0,o=void 0):o=o[t]))}),o}}function e(t){return t.substr(t.lastIndexOf("/")+1)}function n(t){return t.substr(0,t.lastIndexOf("/"))}function o(e){function n(t,e,i){var c,u,f,l,s=[];for(u=0;u<t.length;u++){l=t[u];for(c in l){var a=i+"/"+u;if(f=e.call(o,{key:c,value:l[c],pointer:r[a]+"/"+c}))return l[c];"object"==typeof l[c]&&null!==l[c]&&(r[i+1+"/"+s.length]=r[a]+"/"+c,s.push(l[c]))}}return s.length>0?n(s,e,i+1):o.collection[0]}var o=function(){},r={"0/0":""};return"string"==typeof e&&(e=JSON.parse(e)),o.collection="object"==typeof e&&null!==e?[e]:[void 0],o.query=function(e,o){if("function"==typeof e)return o=e,n(this.collection,o,0);var i=t(this.collection[0],e);return"object"==typeof i?(r["0/0"]=e,n([i],o,0)):void 0},o.select=function(e){return t(this.collection[0],e)},o.replace=function(e,n){var o=e.split("/"),r=o.pop(),i=t(this.collection[0],o);return"object"==typeof i?(t(this.collection[0],o)[r]=n,!0):!1},o.remove=function(e){var n=e.split("/"),o=n.pop(),r=t(this.collection[0],n);return"object"==typeof r&&r[o]?(delete r[o],!0):!1},o.insert=function(n,o){var r,i=n.split("/"),c=!1,u=this.collection[0],f=[];return i.forEach(function(n,l){f.push(n),r=t(e,f),r?u=r:l<i.length-1?(u[n]=/\d+/.test(i[l+1])?[]:{},u=u[n]):(u[n]=o,c=!0)}),c},o.getObject=function(){return this.collection[0]},o.getJSON=function(){return JSON.stringify(this.collection[0])},o.basename=function(t){return t.substr(t.lastIndexOf("/")+1)},o.dirname=function(t){return t.substr(0,t.lastIndexOf("/"))},o}return o.basename=e,o.dirname=n,o});