import React, { useState } from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import './ImageGrid.css';

const { namedNode } = require('@rdfjs/data-model');

export function ImageGrid({ resourceURI, depictions = [], source }) {
    const [images, setImages] = useState([]);

    if (!source) {
        return null
    }

    // create path to traverse resource images    
    const { PathFactory } = require('ldflex');
    const { default: ComunicaEngine } = require('@ldflex/comunica');   
    // The JSON-LD context for resolving properties
    const context = {
        '@context': {
            '@vocab': 'http://xmlns.com/foaf/0.1/',
            friends: 'knows',
            label: 'http://www.w3.org/2000/01/rdf-schema#label',
            depiction: 'depiction',
        },
    };    
    // The query engine and its source
    const queryEngine = new ComunicaEngine({
        type: 'sparql',
        value: source, //<== TODO : get this dynamically
    });    
    // The object that can create new paths
    const path = new PathFactory({ context, queryEngine });
    const cProp = path.create({
        subject: namedNode(resourceURI),
    });

    if (images.length === 0) {
        (async function fetchDepiction() {
            console.log('fetching depiction');
            const imageSet = new Set();
            for await (const image of cProp.depiction)
                imageSet.add(image.value);
            const newImages = [...imageSet].map((img) => {
                return { original: img, thumbnail: img };
            });
            console.log(newImages);
            setImages(newImages);
        })();
    }

    // const images = [
    //     {
    //         original: "https://picsum.photos/id/1018/1000/600/",
    //         thumbnail: "https://picsum.photos/id/1018/250/150/",
    //         description: "una prova di descrizione",
    //     },
    //     {
    //         original: "https://picsum.photos/id/1015/1000/600/",
    //         thumbnail: "https://picsum.photos/id/1015/250/150/",
    //         thumbnailLabel: "prova",
    //     },
    //     {
    //         original: "https://picsum.photos/id/1019/1000/600/",
    //         thumbnail: "https://picsum.photos/id/1019/250/150/",
    //     },
    // ];

    return images.length > 0 ? (
        <div style={{ width: 600 }}>
            <ImageGallery
                showThumbnails={images.length === 1 ? false : true}
                items={images}
                showPlayButton={false}
            />
        </div>
    ) : null;
}