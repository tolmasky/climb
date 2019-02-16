const { isArray } = Array;
//const t = require("@babel/types");
const mapAccum = require("@climb/map-accum");


function babelTreeMapAccum(t, f, start, node)
{
    return  isArray(node) ?
                mapAccum((accum, node) =>
                    babelTreeMapAccum(t, f, accum, node), start, node) :
            node === null ? [start, null] :
            f(...t.VISITOR_KEYS[node.type]
                .reduce(function ([start, node], field)
                {
                    if (node.type === "MemberExpression" &&
                        field === "property" &&
                        !node.computed)
                        return [start, node];
                    
                    if (node.type === "ObjectProperty" &&
                        field === "key" &&
                        !node.computed)
                        return [start, node];

                    if (!node[field])
                        return [start, node];
    
                    const [accum, child] =
                        babelTreeMapAccum(t, f, start, node[field]);
    
                    node[field] = child;
    
                    return [accum, node];
                }, [start, { ...node }]));
}

module.exports = babelTreeMapAccum;

module.exports.type = function babelTreeMapAccumType(t, handlers, start, node)
{
    return babelTreeMapAccum(t, (accum, node) =>
        (handlers[node.type] || handlers["Node"] || ((x,y) => [x,y]))(accum, node), start, node);
}
