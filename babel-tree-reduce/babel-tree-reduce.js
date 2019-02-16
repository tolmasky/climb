const { isArray } = Array;


function babelTreeReduce(t, f, start, node, field)
{if (node) console.log(node.type + " " + isArray(node));
    return  node === null ?
                start :

            isArray(node) ?
                node.reduce((accum, node, index) =>
                    f(accum, babelTreeReduce(t, f, start, node), index),
                    start) :

            f(t.VISITOR_KEYS[node.type].reduce((accum, field) =>
                ignore(field, node) ?
                    accum :
                    f(accum, babelTreeReduce(t, f, start, node[field], field)),
                start), node, field);
}


function ignore(field, parent)
{
    return  !parent[field] ||

            parent.type === "MemberExpression" &&
            field === "property" &&
            !parent.computed ||
            
            parent.type === "ObjectProperty" &&
            field === "key" &&
            !parent.computed;
}

module.exports = babelTreeReduce;

module.exports.type = function babelTreeReduceType(t, handlers, start, node)
{
    return babelTreeReduce(t, (accum, node, field) =>
        (handlers[node.type] || handlers["Node"] || (x => x))(accum, node, field), start, node);
}
