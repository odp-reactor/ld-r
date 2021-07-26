import { PropertyValue } from './PropertyValue'

export class PropertyValueList {
    constructor(properties = []) {
        this.properties = properties
    }
    addProperty(key, value) {
        this.properties.push(PropertyValue.create(key, value))
    }
    getProperties() {
        let propertiesToReturn = {};
        this.properties.forEach((prop) =>{
            if (prop.key) {
                propertiesToReturn[prop.key] = prop
            }
        })
        return propertiesToReturn
    }
}