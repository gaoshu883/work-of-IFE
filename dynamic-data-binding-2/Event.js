// `JavaScript设计模式与开发实践`中实现的自定义事件
// 定义全局变量Event
var Event = (function() {
    var clientList = {},
        listen,
        trigger,
        remove;
    listen = function(key, fn) {
        if (!clientList[key]) { // 如果还没有订阅过此类消息，给此类消息创建一个缓存列表
            clientList[key] = [];
        }
        clientList[key].push(fn);
    };
    trigger = function() {
        // 使用arguments获取传入trigger函数中的实参
        // arguments类数组对象中第一个是消息类型
        // 其余参数传入订阅者的回调函数中
        var key = Array.prototype.shift.call(arguments), // 取出消息类型
            fns = clientList[key]; // 取出该消息对应的回调函数数组

        if (!fns || fns.length === 0) {
            return false;
        } // 如果没有订阅该消息则返回

        for (var i = 0, fn; fn = fns[i++];) {
            fn.apply(this, arguments);
        }
    };
    remove = function(key, fn) {
        // 只有当Fn是具名函数才能删除对应的回调函数
        // 类似removeEventListener()
        var fns = clientList[key];

        if (!fns) {
            return false; // 如果没有此订阅消息，则返回false
        }
        if (!fn) {
            fns && (fns.length = 0); //  如果订阅者指明特定的回调函数，默认删除全部的回调函数
        } else {
            for (var l = fns.length - 1; l >= 0; l--) {
                var _fn = fns[l];
                if (_fn === fn) {
                    fns.splice(l, 1); // 删除当前要取消的回调函数
                }
            }
        }
    };

    return {
      listen: listen,
      trigger: trigger,
      remove: remove
    };
}());