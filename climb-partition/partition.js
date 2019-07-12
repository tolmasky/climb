module.exports = function partition(f, list)
{
    const filtered = [];
    const rejected = [];

    for (const item of list)
        (f(item) ? filtered : rejected).push(item);

    return [filtered, rejected];
}
