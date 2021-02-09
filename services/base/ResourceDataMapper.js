import { map, forEach } from 'lodash';

export default class ResourceDataMapper {
    async parseResults(comunicaBindings) {
        // from comunica bindings to Resource
        // or better json resource
        // let's remain agnostic until we integrate
        // fluxible with odpReactor + typescript
        /*
        {
            uri:
            label:
            otherProp:
        }
        */
        let bindings = await comunicaBindings;
        const resources = map(bindings, binding => {
            const jsonResource = {};
            const variables = Array.from(binding.keys());
            forEach(variables, v => {
                const result = binding.get(v);
                jsonResource[stripeQuestionMark(v)] = result.value; // value convert from rdf object NamedNode, Literal giving just the value
            });
            return jsonResource;
        });
        return resources;
    }
}

const stripeQuestionMark = sparqlVariable => {
    return sparqlVariable.replace('?', '');
};
