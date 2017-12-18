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
const test7 = function () {
    var p = timeoutPromise(resolve=>resolve('ok'),4000);
    Promise.race( [
        p,
        timeoutPromise(resolve=>resolve('ops'),2000)
    ] )
        .then(
            value => {
                console.log(1)
                console.log(value)
            },
            reason => {
                console.log(2)
                console.log(reason)
            }
        );
    p.then(value => {
        console.log(3)
        console.log(value)
    },reason => {
        console.log(4)
        console.log(reason)
    });
}
const test8 = function () {
   const p = new Promise(function (resolve,reject) {
       setTimeout(function () {
           if(Math.random()>0.5){
               resolve(100*Math.random())
           }else {
               reject('x')
           }
       },100)
   })
    p.then(value => console.log(value))
    p.then(value => console.log(value))
    p.then(value => console.log(value))
    p.then(value => console.log(value))
}
const test9 = function () {
    const foo = function () {
        console.log('foo1')
        bar().then(function () {
            console.log('foo2')
        })
    }
    const bar = function () {
        return new Promise(resolve => {
            console.log('bar')
            resolve()
        })
    }
    setTimeout(function () {
        console.log(0)
    },0)
    console.log(1)
    foo()
    console.log(2)

}
const test10 = function () {
    const foo = async function () {
        console.log('foo1')
        await bar()
        console.log('foo2') //in microtask
        Promise.resolve().then(value => {
            console.log('foo3')
        })
    }
    const bar = async function () {
        console.log('bar')
    }
    setTimeout(function () {
        console.log(0) //in macro task
    },0)
    console.log(1)
    foo()
    console.log(2)
    //1 foo1 2
}
const test11 = function () {
    const p = Promise.resolve().then(function () {
        return new Promise(resolve => {
            resolve(10)
            console.log(11)
            return new Promise(resolve2 => {
                resolve2(20)
                console.log(21)
                return new Promise(resolve3 => {
                    resolve3(30)
                    console.log(31)
                })
            })
        })
    })
    p.then(value => {
        console.log(value)
        console.log(p)
    },reason => {
        console.log(reason)
    })

}
const test12 = function () {
    const p1 = Promise.resolve(1)
    const p2 = Promise.reject(1)
    p1.then().then(value => {
        console.log(value)
    })
    p2.then().then(null,reason => {
        console.log(reason)
    })
}
const test13 = function () {
if(!Promise.first){
    Promise.first = function (prs,errCb) {
        return new Promise(function (resolve, reject) {
            let i = 0
            prs.forEach(function (pr) {
                return Promise.resolve(pr).then(resolve).catch(function (reason) {
                    i++
                    if(i===prs.length){
                        console.log('all break')
                        reject(reason)
                    }
                    errCb(reason)
                })
            })
        })
    }
}
    const p1 = new Promise(function (resolve,reject) {
        setTimeout(function () {
            reject(1)
        },2000)
    })
    const p2 = new Promise(function (resolve,reject) {
        setTimeout(function () {
            reject(2)
        },1500)
    })

    Promise.first([p1,p2],function (reason) {
        console.log(reason)
    }).then(value => {
        console.log(`value:${value}`)
    }).catch(reason => {
        console.log(`reason:${reason}`)
    })
}
const test14 = function () {
    function spread(fn) {
        return Function.apply.bind( fn, null );
    }
    spread(function (x,y,z) {
        console.log(x,y,z)
    })([1,2,3])
}
test14()


