const { isArray, from: ArrayFrom } = Array;
const builtInFlatMap = !!Array.prototype.flatMap;


module.exports = module.exports = function flatMap(f, iterable)
{
    return  builtInFlatMap && isArray(iterable) ?
            iterable.flatMap(f) :
            [].concat(...ArrayFrom(iterable, f));
}
