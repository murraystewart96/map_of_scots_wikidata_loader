import React, {Fragment, Component} from 'react';
import SPARQLQueryDispatcher from '../requests/requestService'
import PeopleList from '../components/PeopleList'
import Request from '../helpers/request'


const sparqlQueryActors = `SELECT DISTINCT ?person ?personLabel ?place ?placeLabel ?coord ?dob ?occupationLabel ?genderLabel ?dod ?image ?sitelink
WHERE {
   ?person wdt:P19 ?place .
   ?person wdt:P106 wd:Q33999 .
   ?place wdt:P131* wd:Q22 .
   ?place wdt:P625 ?coord .
   ?sitelink schema:about ?person;
    schema:isPartOf <https://en.wikipedia.org/>;
   OPTIONAL {?person wdt:P569 ?dob .}
   OPTIONAL {?person wdt:P106 ?occupation .}
   OPTIONAL {?person wdt:P570 ?dod . }
   OPTIONAL {?person wdt:P21 ?gender .}
   OPTIONAL {?person wdt:P18 ?image .}
   OPTIONAL {?sitelink schema:about ?person . ?sitelink schema:inLanguage "en"}

   SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" }
  }`;

  const sparqlQueryPhysicist = `SELECT DISTINCT ?person ?personLabel ?place ?placeLabel ?coord ?dob ?occupationLabel ?genderLabel ?dod ?image ?sitelink
WHERE {
   ?person wdt:P19 ?place .
   ?person wdt:P106 wd:Q169470 .
   ?place wdt:P131* wd:Q22 .
   ?place wdt:P625 ?coord .
   ?sitelink schema:about ?person;
   schema:isPartOf <https://en.wikipedia.org/>;
   OPTIONAL {?person wdt:P569 ?dob .}
   OPTIONAL {?person wdt:P106 ?occupation .}
   OPTIONAL {?person wdt:P570 ?dod . }
   OPTIONAL {?person wdt:P21 ?gender .}
   OPTIONAL {?person wdt:P18 ?image .}
   OPTIONAL {?sitelink schema:about ?person . ?sitelink schema:inLanguage "en"}

   SERVICE wikibase:label {  bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" }

  }`;

  const sparqlQueryOccupations = `SELECT DISTINCT ?personLabel ?occupationLabel
WHERE {
   ?person wdt:P19 ?place .
   ?place wdt:P131* wd:Q22 .
   ?place wdt:P625 ?coord .
   OPTIONAL {?person wdt:P569 ?dob .}
   OPTIONAL {?sitelink schema:about ?person; schema:isPartOf <https://en.wikipedia.org/> .}
   OPTIONAL {?person wdt:P106 ?occupation .}
   OPTIONAL {?person wdt:P570 ?dod . }
   OPTIONAL {?person wdt:P21 ?gender .}
   OPTIONAL {?person wdt:P18 ?image .}
   OPTIONAL {?sitelink schema:about ?person . ?sitelink schema:inLanguage "en"}

   SERVICE wikibase:label {  bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" }

  }`;



  const sparqlQueryAllScots = `SELECT DISTINCT ?person ?personLabel ?placeLabel ?coord ?occupationLabel ?genderLabel ?dob ?dod ?image ?sitelink
  WHERE {
   ?person wdt:P19 ?place .
   ?place wdt:P131* wd:Q22 .
   ?place wdt:P625 ?coord .
   OPTIONAL {?person wdt:P569 ?dob .}
   OPTIONAL {?sitelink schema:about ?person; schema:isPartOf <https://en.wikipedia.org/> .}
   OPTIONAL {?person wdt:P106 ?occupation .}
   OPTIONAL {?person wdt:P570 ?dod . }
   OPTIONAL {?person wdt:P21 ?gender .}
   OPTIONAL {?person wdt:P18 ?image .}
   OPTIONAL {?sitelink schema:about ?person . ?sitelink schema:inLanguage "en"}

   SERVICE wikibase:label {  bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" }

 }`;

class Container extends Component{

  constructor(props){
    super(props)
    this.state = {
      people: [],
      peopleFormatted: [],
      occupations:[],
      occupationNames: []

    }
  }

  componentDidMount(){

    const queryDispatcher = new SPARQLQueryDispatcher();
    queryDispatcher.query( sparqlQueryAllScots )
    .then((body) => {
      this.setState({people: body.results.bindings});
      this.generatePeopleObjects();
      this.postFormattedPeople();
    })


  }

  generatePeopleObjects(){


    const request = new Request();

    for(let i = 0; i < this.state.people.length; i++){
      //have to create new person each time
      let formattedPerson = {
        name: "",
        occupation: "",
        gender: "",
        dateOfBirth: "",
        placeOfBirth: "",
        dateOfDeath: "",
        coord: "",
        imageURL: "",
        siteLink: "",
        pageID: ""

      }

      if(this.state.people[i].personLabel) formattedPerson.name = this.state.people[i].personLabel.value;
      if(this.state.people[i].occupationLabel) formattedPerson.occupation = this.state.people[i].occupationLabel.value;
      if(this.state.people[i].genderLabel) formattedPerson.gender = this.state.people[i].genderLabel.value;
      if(this.state.people[i].dob) formattedPerson.dateOfBirth = this.state.people[i].dob.value;
      if(this.state.people[i].placeLabel) formattedPerson.placeOfBirth = this.state.people[i].placeLabel.value;
      if(this.state.people[i].dod) formattedPerson.dateOfDeath = this.state.people[i].dod.value;
      if(this.state.people[i].image && this.state.people[i].image.value.length <= 255) formattedPerson.imageURL = this.state.people[i].image.value;
      if(this.state.people[i].sitelink) formattedPerson.siteLink = this.state.people[i].sitelink.value;
      if(this.state.people[i].person) formattedPerson.pageID = this.state.people[i].person.value;
      if(this.state.people[i].coord){
          formattedPerson.coord = this.state.people[i].coord.value.slice(6, this.state.people[i].coord.value.length-1)
       }
      console.log(formattedPerson);

      this.setState({
        peopleFormatted: this.state.peopleFormatted.concat(formattedPerson)
      })
    }
  }


  generateOccupationArray(){

    let formattedOccupations = []

    for(let i = 0; i < this.state.occupations; i++){
      formattedOccupations.push(this.state.occupations[i].occupationLabel.value)
      console.log(this.state.occupations[i].occupationLabel.value);
    }

    this.setState({occupationNames: formattedOccupations})
  }


  postFormattedPeople(){

    console.log("ARIGHT!");
    const request = new Request();
    request.post('/api/scots', this.state.peopleFormatted);
  }


  render(){
    return(
      <div>
      <PeopleList people={this.state.people} />
      </div>
    )
  }

}


export default Container;
