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
                                                ODP Reactor is a web-based
                                                software to visualize knowledge
                                                graphs modelled with Ontology
                                                Design Patterns.
                                            </li>
                                            <li className="about-li">
                                                KnowledgeGraph should be
                                                annotated with OPLa ontology in
                                                order to make the tool able to
                                                analyze and visualize data.
                                            </li>
                                            <li className="about-li">
                                                ODP Reactor is developed by
                                                STLab. STLab research aims at
                                                identifying cognitively sound
                                                formal representations of
                                                knowledge as well as at
                                                developing efficient ways to
                                                process it for its automatic
                                                understanding.
                                            </li>
                                            <li className="about-li">
                                                ODP Reactor extends
                                                <a href="http://ld-r.org">
                                                    {' '}
                                                    Ld-r{' '}
                                                </a>
                                                developped at VU.
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
                                                Explore by knoweldge patterns to
                                                better grasp what knowledge is
                                                in large dataset
                                            </p>
                                        </div>
                                        <div className="ldr-padding">
                                            <img
                                                style={{ width: '100%' }}
                                                src={`${PUBLIC_URL}/assets/img/tool-image/time_indexed_typed_location_detailed.png`}
                                            ></img>
                                            <p className="about-img-desc">
                                                Map every pattern with a
                                                standard visualization. You can
                                                integrate new visualization best
                                                to represent different data
                                                structures
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
                                                Switch and choose between
                                                several representation to best
                                                visualize and retrieve data.
                                                Like Graph or Table
                                            </p>
                                        </div>
                                        <div className="ldr-padding">
                                            <img
                                                style={{ width: '100%' }}
                                                src={`${PUBLIC_URL}/assets/img/tool-image/geog_filter.png`}
                                            ></img>
                                            <p className="about-img-desc">
                                                Advanced filtering components
                                                based on data semantics
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
