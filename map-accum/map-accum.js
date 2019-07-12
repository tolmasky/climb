module.exports = function mapAccum(f, accumulated, list)
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
