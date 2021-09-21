export class PropertyValue {
    constructor(key, property, uri, label, index, onClick) {
        this.key = key
        this.property = property
        this.uri = uri
        this.index = index
        this.label = label
        this.onClick = onClick
    }
    static create(key, {
        property,
        uri,
        label,
        onClick,
        index
    }) {
        return new PropertyValue(key, property, uri, label, index, onClick)
    }
    toJSON() {
        return {
            key: this.key,
            property: this.property,
            uri: this.uri,
            label: this.label,
            onClick: this.onClick,
            index: this.index
        }
    }
}