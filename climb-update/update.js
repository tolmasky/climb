const given = f => f();
const ArrayIsArray = Array.isArray;
const mapAccum = require("@climb/map-accum");


module.exports = (item, key, f) => given((
    keyPath = ArrayIsArray(key) ? key : [key],
    pairs = mapAccum((item, key) =>
        [item[key], [item, key]], item, keyPath)[1].reverse(),
    value = f(pairs[0][0][pairs[0][1]])) =>
        pairs.reduce((value, [item, key]) =>
            value === item[key] ? item :
            ArrayIsArray(item) ?
                Object.assign([...item], { [key]: value }) :
                ({ ...item, [key]: value }),
            value));
