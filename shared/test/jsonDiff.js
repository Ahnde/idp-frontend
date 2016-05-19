"use strict";

function getMissing(obj1, obj2) {

  function getClass(obj) {
    if (typeof obj === "undefined")
      return "undefined";
    if (obj === null)
      return "null";
    return Object.prototype.toString.call(obj)
      .match(/^\[object\s(.*)\]$/)[1];
  }

  function rec(o1, o2, acc, mis) {
    for (var k in o1) {
      if(o2.hasOwnProperty(k)) {
        var c = getClass(o1[k]);
        if(c === "Object" || c === "Array") {
          acc[k] = (c === "Object")? {} : [];
          var r = rec(o1[k],o2[k],acc[k], false);
          if(r.m == false) {
            delete acc[k];
          } else {
            mis = true
          }
        } else {
          if(o2[k] != o1[k]) {
            acc[k] = "is: ->" + o2[k] + "<- should be: ->" + o1[k]+"<-";
            mis = true;
          }
        }
      } else {
        acc[k] = "key ->" + k + "<- is missing, value should be: ->" + o1[k]+"<-";
        mis = true;
      }
    }
    return {a:acc,m:mis};
  };

  return rec(obj1, obj2,{}, false).a;
};

function logMissing(ob1,ob2)
{
  console.log("full objects:");
  console.log(JSON.stringify(ob1));
  console.log(JSON.stringify(ob2));
  console.log("\ndifference:");
  console.log(JSON.stringify(getMissing(ob1,ob2),null, '\t'));
  console.log(JSON.stringify(getMissing(ob2,ob1),null, '\t'));
};