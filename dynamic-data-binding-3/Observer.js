/* The `Observer` class converts arbitrary object
 * into the observable one using recursive iteration
 * @param {object} data - the arbitrary object
 */
function Observer(data) {
  this.keyChain = Array.prototype.slice.call(arguments, 0)[1] || 'data';// 存储父级属性名称链字符串
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
        new Observer(value, this.keyChain + '.' + key); // 实例化观察对象，并传入最新的keyChain
      }
      this.convert(key, value);
    }
  }
};

/*
 * Defines accessor property via `Object.defineProperty()` method
 * to achieve dynamic data-binding
 * Convert properties of object that users set to getter and setter
 * @param {string} key - the property name
 * @param {arbitrary type} value - the property value
 */
Observer.prototype.convert = function(key, value) {
  var self = this;
  Object.defineProperty(this.data, key, {
    get: function() {
      // console.log('你访问了 ' + key);
      return value;
    },
    set: function(newValue) {
      // console.log('你设置了 ' + key + '，新的值为 ' + newValue);
      var ownKeyChain = self.keyChain + '.' + key; // 获得最新的keyChain，不管是否为对象属性
      if (typeof newValue === 'object') {
        new Observer(newValue, ownKeyChain); // 实例化观察对象，并传入最新的keyChain
      }
      var keyArray = ownKeyChain.split('.').slice(1); // 排除"data"
      keyArray.forEach(function(item) {
        Event.trigger(item, newValue, value);
      });
      value = newValue;
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
