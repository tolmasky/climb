module.exports = function pipe(...fs)
{
    return value => fs.reduce((value, f) => f(value), value);
}
