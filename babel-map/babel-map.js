const babelMapAccum = require("@climb/babel-map-accum");
const zero = { identity: 0, concat: () => 0 };


module.exports = function mapBabel(fOrDefinitions)
{
    return babelMapAccum(zero, fOrDefinitions)[1];
}

module.exports.fromDefinitions = function fromDefinitions(definitions, fallback)
{
    return function f(mapAccumNode, node)
    {
        if (definitions[node.type])
            return [zero, definitions[node.type](mapAccumNode, node)];

        if (fallback)
            return fallback(mapAccumNode, node);

        const fields = t.VISITOR_KEYS[node.type];
        const children = fields.map(field => node[field]);
        const [accumOut, mapped] = mapAccumNode(children);
        const modified = children
            .map((child, index) => [child, index, fields[index]])
            .filter(([child, index]) => child !== mapped[index]);
        const newNode = modified.length === 0 ?
            node :
            modified.reduce((accum, [, index, field]) =>
                (accum[field] = mapped[index], accum), { ...node });

        return [accumOut, newNode];
    }
}
