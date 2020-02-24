

const endpointUrl = 'https://query.wikidata.org/sparql';




class SPARQLQueryDispatcher {
	constructor() {
		this.endpoint = 'https://query.wikidata.org/sparql';
	}

	query( sparqlQuery ) {
		const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
		const headers = { 'Accept': 'application/sparql-results+json' };

		return fetch( fullUrl, { headers } )
    .then( body => body.json() );

	}
}




export default SPARQLQueryDispatcher;
