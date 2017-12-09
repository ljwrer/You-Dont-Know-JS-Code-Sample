const timeoutPromise = require('./util').timeoutPromise

// 永远要记住为每个promise关联一个拒绝错误处理函数，特别是从 Promise.all([ .. ])返回的那一个。
const test1 = function () {
    Promise.all([
        Promise.resolve(1),
        Promise.reject(2).catch(function (msg) {
            return new Error(msg)
        })
    ]).then(msg => {
        console.log(msg)
    }).catch(reason => {
        console.log(reason)
    })
}
// 如果你传入了一个空数组，主race([..])Promise永远不会决议，而不是立即决议
const test2 = function () {
    Promise.race([])
        .then(function () {
            console.log('fulfilled')
        })
        .catch(function () {
            console.log('reject')
        })
}
// 取第一个决议的Promise
const test3 = function () {
    Promise.race([
        timeoutPromise(function (resolve, reject) {
            console.log('not clean')
            reject(1)
        }),
        Promise.resolve(2)
    ]).then(function (msg) {
        console.log(msg)
    }).catch(function (error) {
        console.log(error)
    })
}
const test4 = function () {
    global.Promise = require('bluebird')
    timeoutPromise(function (resolve, reject) {
        reject(1)
    }).catch(reason => {
        a.b()
        console.log(reason)
    }).finally(reason => {
        console.log('finally')
        console.log(reason)
    }).catch(reason => {
        console.log('catch')
        console.log(reason)
    })
    setTimeout(function () {
        console.log('5s later')
    }, 5000)
}
const test5 = function () {
    Promise.observe = function (pr, cb) {
        pr.then(
            function fulfilled(msg) {
                // 安排异步回调（作为Job）
                Promise.resolve(msg).then(cb);
            },
            function rejected(err) {
                // 安排异步回调（作为Job）
                Promise.resolve(err).then(cb);
            }
        );
        // 返回最初的promise
        return pr;
    }
    Promise.race([
        Promise.observe(
            timeoutPromise((resolve) => resolve(3), 3000),
            function (msg) {
                console.log(msg)
            }
        ),
        timeoutPromise((resolve) => resolve(1), 1000)  // 给它3秒钟
    ]).then(value => console.log(value))
}
const test6 = function () {
    Promise.map = function (prs, cb) {
        return Promise.all(prs.map(pr => {
            return new Promise(resolve => {
                cb(pr,resolve)
            })
        }))
    }
    var p1 = Promise.resolve(21);
    var p2 = Promise.resolve(42);
    var p3 = Promise.reject("Oops");

// 把列表中的值加倍，即使是在Promise中
    Promise.map([p1, p2, p3], function (pr, resolve) {
        Promise.resolve(pr).then(value => {
            setTimeout(function () {
                resolve(value * 2)
            }, 1000)
        }).catch(resolve)
    }).then(function (vals) {
        console.log(vals);         // [42,84,"Oops"]
    });
}
test6()