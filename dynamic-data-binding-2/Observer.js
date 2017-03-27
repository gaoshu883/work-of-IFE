/* The `Observer` class converts arbitrary object
 * into the observable one using recursive iteration
 * @param {object} data - the arbitrary object
 */
function Observer(data) {
  this.data = data;
  this.callBacks = {};
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
      self.$fire(name, newValue);
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
 * If certain property changes, the corresponding function will be invoked
 * @param {string} key - the property name
 * @param {function} cb - the callback function will be invoked when property value changes
 */
Observer.prototype.$watch = function(key, cb) {
  if (this.callBacks[key] === undefined) {
    this.callBacks[key] = [cb];
  } else {
    this.callBacks[key].push(cb);
  }
};

/*
 * Triggers all callbacks which register on the certain property
 * @param {string} key - the property name
 * @param {arbitrary type} value - the new value that will be set to the property
 */
Observer.prototype.$fire = function(key,value) {
  if (key in this.callBacks) {
    this.callBacks[key].forEach(function(item) {
      item(value);
    });
  }
};