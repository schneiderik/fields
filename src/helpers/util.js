function isNodeList (obj) {
  return Object.prototype.toString.call(obj) === '[object NodeList]';
}

function isArray (obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

function nodeListToArray (obj) {
  return Array.prototype.slice.call(obj);
}

function bind (func, context) {
  return function () {
    func.apply(context);
  };
}

function uniqueArray(array) {
  var a = array.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i+1; j < a.length; ++j) {
      if (a[i] === a[j]) {
        a.splice(j--, 1);
      }
    }
  }

  return a;
};

// Takes any combination of single objects or arrays
// of objects and returns a unique array
function toUniqueArray(obj1, obj2) {
  if (isArray(obj1)) {
    if (isArray(obj2)) {
      obj1 = uniqueArray(obj1.concat(obj2));
    } else {
      obj1.push(obj2);
      obj1 = uniqueArray(obj1);
    }
  } else {
    if (isArray(obj2)) {
      el.push(obj1);
      obj1 = uniqueArray(obj2);
    } else {
      obj1 = [obj1, obj2];
    }
  }

  return obj1;
}

module.exports = {
  isNodeList: isNodeList,
  isArray: isArray,
  nodeListToArray: nodeListToArray,
  uniqueArray: uniqueArray,
  toUniqueArray: toUniqueArray,
  bind: bind
}
