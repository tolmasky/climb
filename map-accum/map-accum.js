module.exports = function mapAccum(f, accumulated, list)
{
    const implementation = Array.isArray(list) ?
        mapAccumArray : mapAccumIterable;

    return implementation(f, accumulated, list);
}

function mapAccumIterable(f, accumulated, iterable)
{
    var index = 0;
    var result = [];

    for (const item of iterable)
        [accumulated, result[index++]] =
            f(accumulated, item);

    return [accumulated, result];
}

function mapAccumArray(f, accumulated, list)
{
    const count = list.length;
    const result = [];

    if (count <= 0)
        return [accumulated, result];

    var index = 0;

    for (; index < count; ++index)
        [accumulated, result[index]] =
            f(accumulated, list[index]);

    return [accumulated, result];
}