const { isArray } = Array;
const t = require("@babel/types");
const mapAccumArray = require("@climb/map-accum");


console.log("hi!");
module.exports = function babelMapAccum({ concat, identity }, fOrDefinitions)
{
    const f = typeof fOrDefinitions === "object" ?
        fromDefinitions(fOrDefinitions) : fOrDefinitions;
    const keyed = pairs => mapAccumArray(
        (accumIn, [node, key]) =>
            (([accumOut, mapped]) => [concat(accumIn, accumOut, key), mapped])
            (mapAccum(node)),
        identity,
        pairs);
    const mapAccum = Object.assign(function mapAccum(node)
    {
        if (node === null || node === void(0))
            return [identity, node];

        if (isArray(node))
        {
            const [accumOut, mapped] =
                keyed(node.map((node, index) => [node, index]));
            const modified = mapped.some(
                (mapped, index) => mapped !== node[index]);

            return [accumOut, modified ? mapped : node];
        }

        return f(mapAccum, node);
    }, { keyed, identity, concat, fallback: f.fallback });

    return mapAccum;
}

module.exports.fromDefinitions = function fromDefinitions(definitions, fallback = defaultFallback)
{
    return Object.assign(function f(babelMapAccum, node)
    {
        const closest = definitions[node.type] ?
            node.type : t.ALIAS_KEYS[node.type].find(key => definitions[key]);
        const definition = definitions[closest] || fallback;

        return definition(babelMapAccum, node);
    }, { fallback });
}

function defaultFallback(mapAccum, node)
{
    const fields = toVisitorKeys(node);
    const tuples = fields.map((field, index) => [node[field], field, index]);
    const [accumOut, mapped] = mapAccum.keyed(tuples);
    const modified = tuples
        .filter(([child], index) => child !== mapped[index]);
    const newNode = modified.length === 0 ?
        node :
        modified.reduce((accum, [, field, index]) =>
            (accum[field] = mapped[index], accum), { ...node });

    return [accumOut, newNode];
}

const toVisitorKeys = (function ()
{
    const fields = t.VISITOR_KEYS;
    const withold = target => field => field !== target;
    const fieldsWitholdingComputed = 
    {
        MemberExpression: fields.MemberExpression.filter(withold("property")),
        ObjectProperty: fields.ObjectProperty.filter(withold("key"))
    };

    return function toVisitorKeys({ type, computed })
    {
        return  type !== "MemberExpression" &&
                type !== "ObjectProperty" ||
                computed === true ?
                fields[type] :
                fieldsWitholdingComputed[type];
    }
})();
