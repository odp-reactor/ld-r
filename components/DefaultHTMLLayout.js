'use strict';
import React from 'react';
import ApplicationStore from '../stores/ApplicationStore';
import ga from '../plugins/googleAnalytics/ga';
import { googleAnalyticsID } from '../configs/general';

const PUBLIC_URL = process.env.PUBLIC_URL ? process.env.PUBLIC_URL : '';

class DefaultHTMLLayout extends React.Component {
    render() {
        return (
            <html>
                <head>
                    <meta
                        http-equiv="Content-Security-Policy"
                        content="upgrade-insecure-requests"
                    />
                    <meta charSet="utf-8" />
                    <title>
                        {this.props.context
                            .getStore(ApplicationStore)
                            .getPageTitle()}
                    </title>
                    <meta
                        name="viewport"
                        content="width=device-width, user-scalable=no"
                    />
                    <link
                        href={`${PUBLIC_URL}/semantic-ui/semantic.min.css`}
                        rel="stylesheet"
                        type="text/css"
                    />
                    <link
                        href={`${PUBLIC_URL}/animate.css/animate.min.css`}
                        rel="stylesheet"
                        type="text/css"
                    />
                    <link
                        href={`${PUBLIC_URL}/odp-reactor-visualframes/dist/index.css`}
                        rel="stylesheet"
                        type="text/css"
                    />
                    <link
                        href={`${PUBLIC_URL}/odp-reactor-visualframes/dist/browser.css`}
                        rel="stylesheet"
                        type="text/css"
                    />
                    {/* Vendors css bundle */
                        this.props.addAssets ? (
                            <link
                                href={`${PUBLIC_URL}/public/css/vendor.bundle.css`}
                                rel="stylesheet"
                                type="text/css"
                            />
                        ) : (
                            <style></style>
                        )}
                    <link
                        href={`${PUBLIC_URL}/leaflet/dist/leaflet.css`}
                        rel="stylesheet"
                        type="text/css"
                    />
                    <link
                        href={`${PUBLIC_URL}/jqcloud2/dist/jqcloud.min.css`}
                        rel="stylesheet"
                        type="text/css"
                    />
                    <link
                        href={`${PUBLIC_URL}/assets/css/custom1.css`}
                        rel="stylesheet"
                        type="text/css"
                    />
                    <link
                        href={`${PUBLIC_URL}/assets/css/image-gallery.css`}
                        rel="stylesheet"
                        type="text/css"
                    />
                    {/* <script
                        type="text/javascript"
                        src="/assets/js/matomoAnalytics.js"
                    ></script> */}
                </head>
                <body>
                    <div
                        id="app"
                        dangerouslySetInnerHTML={{
                            __html: this.props.markup
                        }}
                    ></div>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: this.props.state
                        }}
                    ></script>
                    {/* Following are added only to support IE browser */}
                    <script
                        src={`${PUBLIC_URL}/es5-shim/es5-shim.min.js`}
                    ></script>
                    <script
                        src={`${PUBLIC_URL}/es5-shim/es5-sham.min.js`}
                    ></script>
                    <script
                        src={`${PUBLIC_URL}/json3/lib/json3.min.js`}
                    ></script>
                    <script
                        src={`${PUBLIC_URL}/es6-shim/es6-shim.min.js`}
                    ></script>
                    <script
                        src={`${PUBLIC_URL}/es6-shim/es6-sham.min.js`}
                    ></script>
                    {/* Above are added only to support IE browser */}
                    <script
                        src={`${PUBLIC_URL}/jquery/dist/jquery.min.js`}
                    ></script>
                    <script
                        src={`${PUBLIC_URL}/jqcloud2/dist/jqcloud.min.js`}
                    ></script>
                    <script
                        src={`${PUBLIC_URL}/semantic-ui/components/transition.min.js`}
                    ></script>
                    <script
                        src={`${PUBLIC_URL}/semantic-ui/components/dropdown.min.js`}
                    ></script>
                    <script
                        src={`${PUBLIC_URL}/semantic-ui/components/checkbox.min.js`}
                    ></script>
                    <script
                        src={`${PUBLIC_URL}/semantic-ui/components/dimmer.min.js`}
                    ></script>
                    <script
                        src={`${PUBLIC_URL}/semantic-ui/components/modal.min.js`}
                    ></script>
                    <script
                        src={`${PUBLIC_URL}/codemirror/lib/codemirror.js`}
                    ></script>
                    <script
                        src={`${PUBLIC_URL}/yasgui-yasqe/dist/yasqe.min.js`}
                    ></script>
                    {/* All external vendors bundle*/
                        this.props.addAssets ? (
                            <script
                                src={`${PUBLIC_URL}/public/js/vendor.bundle.js`}
                            ></script>
                        ) : (
                            ''
                        )}
                    {/* Main app bundle */}
                    <script
                        src={`${PUBLIC_URL}/public/js/` + this.props.clientFile}
                    ></script>
                    {googleAnalyticsID && (
                        <script
                            dangerouslySetInnerHTML={{
                                __html: ga.replace(
                                    '{googleAnalyticsID}',
                                    googleAnalyticsID
                                )
                            }}
                        />
                    )}
                </body>
            </html>
        );
    }
}

module.exports = DefaultHTMLLayout;
