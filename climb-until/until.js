

module.exports = function until (predicate, transform, start)
{
    if (predicate(start))
        return start;

    return until(predicate, transform, transform(start));
}
