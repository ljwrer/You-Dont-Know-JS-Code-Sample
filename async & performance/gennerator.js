const test1 = function () {
    function *foo(x,y) {
        const a = yield x+y
        return x+y+a
    }
    const it = foo(1,2)
    const res1 = it.next()
    console.log(res1)
    const res2 = it.next(3)
    console.log(res2)
}
const test2 = function () {
    function *foo() {
        var x = yield 2;
        z++;
        var y = yield (x * z);
        console.log( x, y, z );
    }
    var z = 1;
    var it1 = foo();
    var it2 = foo();
    var val1 = it1.next().value; // 2 <-- yield 2
    var val2 = it2.next().value; // 2 <-- yield 2
    val1 = it1.next( val2 * 10 ).value; // 40 <-- x:20, z:2
    val2 = it2.next( val1 * 5 ).value; // 600 <-- x:200, z:3
    it1.next( val2 / 2 ); // y:300
// 20 300 3
    it2.next( val1 / 4 ); // y:10
// 200 10 3
}
const test3 = function () {
    var a = 1;
    var b = 2;
    function *foo() {
        a++;
        yield;
        b = b * a;
        a = (yield b) + 3;
    }
    function *bar() {
        b--;
        yield;
        a = (yield 8) + b;
        //此处a=9
        b = a * (yield 2);
    }
    function step(gen) {
        var it = gen();
        var last;
        return function() {
            last = it.next( last ).value;
        };
    }
    a = 1;
    b = 2;
    var s1 = step( foo );
    var s2 = step( bar );
    s2();  //a=1 b=1
    s2();  //a=1 b=1 8
    s1();  //a=2 b=1
    s2();  //a=9 b=1 2
    s1();  //a=9 b=9 9
    s1();  //a=12 b=9
    s2();  //a=12 b=18
}
const test4  = function () {
    const gen = function* () {
        let i;
        while (true){
            if(i){
                i = 3*i+6
                yield i
            }else {
                i = 1
                yield i
            }
        }
    }
    for (const val of gen()){
        console.log(val)
        if(val>1000){
            break
        }
    }
    const obj = {
        foo:'hello',
        bar:'world',
        baz(){
            console.log(this)
        },
        [Symbol.iterator]:function* (){
            for(const key of Object.keys(this)){
                yield [key, this[key]]
            }
        }
    }
    for(const x of obj){
        console.log(x)
    }
}
test4()