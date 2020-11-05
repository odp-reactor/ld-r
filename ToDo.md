# Daily TODOS

- OntologyDesignPatternNetwork should query
- ? OntologyDesignPatternNetwork should handle the different views (ODP Hierarchy, ODP Instances ...)
  ? link between the different views
- Ld-UI create instance view :) 

- filters

# TODO list
- Design a smart routing algorithm for default routing of components (e.g. based on value types or components metadata).
- Add interface for more Triple stores other than Virtuoso and Stardog.
- Consider Language tag in SPARQL Queries.
- Support LD-Fragment for streaming query results (useful esp. in facets).
- Add infinite scrolling features to facets.
- Add more customized facets (e.g. for taxonomical data, timeline, etc.).
- Implement Aggregate Property Reactor.
- In case of resource access level, find a way to update user session after a new resource is created by the user.
- Adding Microdata annotations to components
- test agg objects + Queries
- add http authentication Support
- extend export plugin for faceted browser and other cases when not all triples are needed

# Fork TODO list
- Handle state management for Odp View. At the moment: 
	for each View/Pattern:
		- create a pattern action that dispatch pattern events (they all maikes request to the same Endpoint) 
		- create a pattern store to collect data for the pattern
		- create a PatternViewWrapper (it wraps the view on the framework side and feed it with params and call fetchData)
		    - write fetchData calling loadPatternAction
		- add a switch to OntologyDesignPattern reactor with that Wrapper

- Add dynamic configuration for OntologyDesignPattern reactor (creates and reads the config from Configuration Graph instead of file)
	the action too
- (demo) add graphql + apollo + next.js + redux state management for ODPs


REGISTER FETCHR AND STORE PROVIDER
