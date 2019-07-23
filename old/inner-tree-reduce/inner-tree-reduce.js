module.exports = function innerTreeReduce(children, f, node)
{
    return f(node, children(node)
        .map(node => innerTreeReduce(children, f, node)));
}
