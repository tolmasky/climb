const { isArray } = Array;
const innerTreeReduce = require("@climb/inner-tree-reduce");


function innerTreeReduceBabel(t, f, node)
{
    if (!t.NON_COMPUTED_VISITOR_KEYS)
    {
        t.NON_COMPUTED_VISITOR_KEYS = { ...t.VISITOR_KEYS };
        t.NON_COMPUTED_VISITOR_KEYS.MemberExpression =
            t.VISITOR_KEYS.MemberExpression.filter(field => field !== "property");
        t.NON_COMPUTED_VISITOR_KEYS.ObjectProperty =
            t.VISITOR_KEYS.ObjectProperty.filter(field => field !== "property");
    }

    return innerTreeReduce(children(t), f, node);
}

module.exports = innerTreeReduceBabel;

module.exports.type = function innerTreeReduceBabelType(t, types, node)
{
    return innerTreeReduceBabel(t, (node, children) => 
        (node && types[node.type] || types["Node"])(node, children), node);
}

function children(t)
{
    return function children(node)
    {
        return  node === null || node === void(0) ? [] :
                isArray(node) ? node :
                (node.computed ? t.VISITOR_KEYS : t.NON_COMPUTED_VISITOR_KEYS)
                    [node.type].map(field => node[field]);
    }
}

