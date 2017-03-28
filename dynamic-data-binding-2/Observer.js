/* The `Observer` class converts arbitrary object
 * into the observable one using recursive iteration
 * @param {object} data - the arbitrary object
 */
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

/*
 * Defines accessor property via `Object.defineProperty()` method
 * to achieve dynamic data-binding
 * Convert properties of object that users set to getter and setter
 * @param {string} name - the property name
 * @param {arbitrary type} value - the property value
 */
Observer.prototype.convert = function(name, value) {
  var self = this;
  Object.defineProperty(this.data, name, {
    get: function() {
      console.log('你访问了 ' + name);
      return value;
    },
    set: function(newValue) {
      console.log('你设置了 ' + name + '，新的值为 ' + newValue);
      // Publish the message
      Event.trigger(name, value, newValue);
      value = newValue;
      if (typeof newValue === 'object') {
        new Observer(newValue);
      }
    },
    enumerable: true,
    configurable: true
  });
};

/*
 * Subscribe for certain message
 * @param {string} key - the property name
 * @param {function} cb - the callback function will be invoked when property value changes
 */
Observer.prototype.$watch = function(key, cb) {
  Event.listen(key, cb);
};
