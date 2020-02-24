import React from 'react';
import Person from './Person'

function PeopleList(props){

  if (props.people.length === 0){
    return <p>Loading</p>
  }

  const peopleList = props.people.map((person, index) =>{
    return null;//<Person key={index} person={person} />
  })

  return (
    <div>
    {peopleList}
    </div>
  )
}

export default PeopleList;
