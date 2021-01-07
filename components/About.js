import React from 'react';

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
                                        ODP Reactor is a web-based software to
                                        visualize knowledge graphs modelled with
                                        Ontology Design Patterns. It's been
                                        developed by STLab at Bologna
                                        University. STLab research aims at
                                        identifying cognitively sound formal
                                        representations of knowledge as well as
                                        at developing efficient ways to process
                                        it for its automatic understanding.
                                        STLab team is composed of researchers
                                        with diverse backgrounds in order to
                                        achieve its goals with an
                                        interdisciplinary approach. ODP Reactor
                                        extends LD-R develloped at VU.
                                    </div>
                                    <br />
                                    <div>
                                        <div
                                            className="blue ui card item"
                                            style={{
                                                width: '100%',
                                                maxWidth: ''
                                            }}
                                        >
                                            <div
                                                className="content"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-end',
                                                    fontSize: 10
                                                }}
                                            >
                                                <div>
                                                    Documentation is available
                                                    at{' '}
                                                    <a href="http://ld-r.org">
                                                        http://ld-r.org
                                                    </a>
                                                    . <br />
                                                    LD-Reactor is developed by:
                                                </div>
                                                <div
                                                    className="header"
                                                    style={{
                                                        width: '10%',
                                                        float: 'right'
                                                    }}
                                                >
                                                    <a
                                                        href="http://vu.nl"
                                                        target="_blank"
                                                    >
                                                        <img
                                                            className="ui centered medium image"
                                                            src="/assets/img/VU_logo.png"
                                                        />
                                                    </a>
                                                </div>
                                                <div className="meta">
                                                    <a
                                                        href="http://www.networkinstitute.org/"
                                                        target="_blank"
                                                    >
                                                        Department of Computer
                                                        Science & <br /> The
                                                        Network Institute
                                                    </a>
                                                </div>
                                                <div className="description">
                                                    VU University Amsterdam{' '}
                                                    <br />
                                                    de Boelelaan 1081a
                                                    <br /> 1081HV Amsterdam
                                                    <br /> The Netherlands{' '}
                                                    <br />
                                                </div>
                                            </div>
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
