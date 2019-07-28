const { isArray, from: ArrayFrom } = Array;


module.exports = Object.fromEntries || function fromEntries(entries)
{
    const array = isArray(entries) || ArrayFrom(entries, entry => entry);
    
    return array.reduce(
        (object, [key, value]) => (object[key] = value, object),
        { });
}
