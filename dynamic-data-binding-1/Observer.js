// The `Observer` class converts arbitrary object
// into the observable one using recursive iteration
// @param {object} data - the arbitrary object
function Observer(data) {
  this.data = data;
  this.iterate(data);
}
// Recursively iterates the object
Observer.prototype.iterate = function(obj) {
  var value;
  for(var key in obj) {
    if(obj.hasOwnProperty(key)) {
      value = obj[key];
      if(typeof value === 'object') {
        new Observer(value);
      }
      this.convert(key, value);
    }
  }
};
// Defines accessor property via `Object.defineProperty()` method
Observer.prototype.convert = function(name, value) {
  Object.defineProperty(this.data, name, {
    get: function() {
      console.log('你访问了 ' + name);
      return value;
    },
    set: function(newValue) {
      console.log('你设置了 ' + name + '，新的值为 ' + newValue);
      value = newValue;
    },
    enumerable: true,
    configurable: true
  });
};