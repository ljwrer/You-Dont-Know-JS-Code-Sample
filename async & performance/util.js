exports.timeoutPromise = function (cb,timeout=1000) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            cb(resolve,reject)
        },timeout)
    })
}