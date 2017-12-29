exports.timeoutPromise = function (cb,timeout=1000) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            cb(resolve,reject)
        },timeout)
    })
}
exports.asyncify = function (fn) {
    let oFn = fn
    let tid
    tid = setTimeout(function () {
        tid = null
        if(fn) fn()
    })
    fn = null
    return function () {
        if(tid){
            fn = oFn.bind.apply(oFn,[this].concat([...arguments]))
        }else {
            oFn.apply(this,arguments)
        }
    }
}