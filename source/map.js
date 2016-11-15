import {isArray} from "vue/src/util/lang";

export function map(model, response) {
    // console.log(response);
    var resolved = (isArray(response))
        ? mapResponseToMultiple(response, model)
        : mapResponseToModel(response, model);
    return Promise.resolve(resolved);
}

function mapResponseToModel(response, bluePrint) {
    var model = (typeof bluePrint === 'function') ? new bluePrint : bluePrint;
    for (var key in response) {
        if (response.hasOwnProperty(key)) {
            model.properties[key] = response[key];
            model.originals[key] = response[key];
            //make sure relations aren't set directly on
            //the model.
            if (typeof model[key] === 'undefined') {
                model[key] = response[key];
            }

        }
    }
    return model;
}

function mapResponseToMultiple(response, model) {
    return response.map(function (item) {
        return mapResponseToModel(item, model);
    });
}
