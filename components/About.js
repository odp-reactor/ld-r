import React from 'react';

const PUBLIC_URL = process.env.PUBLIC_URL ? process.env.PUBLIC_URL : '';

class About extends React.Component {
    render() {
        return (
            <div className="credits">
                <div className="ui fluid container ldr-padding" ref="about">
                    <div className="ui grid">
                        <div className="ui row">
                            <div className="column">
                                <div className="ui segment content">
                                    <h2 className="ui header">
                                        About{' '}
                                        <a
                                            href="http://stlab.istc.cnr.it/stlab/"
                                            target="_blank"
                                            style={{ marginLeft: 0 }}
                                        >
                                            <img
                                                className="ui centered little image"
                                                src="http://stlab.istc.cnr.it/stlab/wp-content/uploads/2016/04/STLabLogo-h80.png"
                                            />
                                        </a>
                                    </h2>
                                    <div style={{ fontSize: 20, margin: 20 }}>
                                        <ul>
                                            <li className="about-li">
                                                ODP Reactor is a knowledge graph
                                                visualiser based on{' '}
                                                <a
                                                    href="http://ontologydesignpatterns.org/wiki/Main_Page"
                                                    target="_blank"
                                                >
                                                    Ontology Design Patterns
                                                </a>
                                            </li>
                                            <li className="about-li">
                                                To trigger the ODP reaction in
                                                the visualisation, your
                                                knowledge graph must include{' '}
                                                <a
                                                    href="http://ontologydesignpatterns.org/wiki/images/0/0a/Paper-09.pdf"
                                                    target="_blank"
                                                >
                                                    OPLa
                                                </a>{' '}
                                                annotations
                                            </li>
                                            <li className="about-li">
                                                ODP Reactor is developed by{' '}
                                                <a
                                                    href="http://stlab.istc.cnr.it/stlab/"
                                                    target="_blank"
                                                >
                                                    STLab
                                                </a>
                                            </li>
                                            <li className="about-li">
                                                ODP Reactor extends
                                                <a
                                                    href="http://ld-r.org"
                                                    target="_blank"
                                                >
                                                    {' '}
                                                    Ld-r{' '}
                                                </a>
                                                developped at{' '}
                                                <a
                                                    href="https://www.vu.nl/en"
                                                    target="_blank"
                                                >
                                                    VU
                                                </a>
                                                .
                                            </li>
                                        </ul>
                                    </div>
                                    <br />
                                </div>
                            </div>
                        </div>
                        <div className="ui row">
                            <div className="ui fluid grid container">
                                <div className="two column row">
                                    <div className="column">
                                        <div className="ldr-padding">
                                            <img
                                                style={{ width: '100%' }}
                                                src={`${PUBLIC_URL}/assets/img/tool-image/screenshot_patterns.png`}
                                            ></img>
                                            <p className="about-img-desc">
                                                Visualise large knowledge graphs
                                                in one page and be able to grasp
                                                at first sight what type of data
                                                it encodes
                                            </p>
                                        </div>
                                        <div className="ldr-padding">
                                            <img
                                                style={{ width: '100%' }}
                                                src={`${PUBLIC_URL}/assets/img/tool-image/time_indexed_typed_location_detailed.png`}
                                            ></img>
                                            <p className="about-img-desc">
                                                Visualise data based on the
                                                context of your interests
                                                (location -{'>'} maps,
                                                collection -{'>'} sets,
                                                structure -{'>'} components)
                                            </p>
                                        </div>
                                    </div>
                                    <div className="column">
                                        <div className="ldr-padding">
                                            <img
                                                style={{ width: '100%' }}
                                                src={`${PUBLIC_URL}/assets/img/tool-image/list_layout.png`}
                                            ></img>
                                            <p className="about-img-desc">
                                                Choose among different layouts
                                                the one that better fits your
                                                needs
                                            </p>
                                        </div>
                                        <div className="ldr-padding">
                                            <img
                                                style={{ width: '100%' }}
                                                src={`${PUBLIC_URL}/assets/img/tool-image/geog_filter.png`}
                                            ></img>
                                            <p className="about-img-desc">
                                                Apply context-aware filters to
                                                refine your search
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default About;
