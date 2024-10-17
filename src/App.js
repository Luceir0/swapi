import { Fragment, useState, useEffect, useRef } from "react";
import "./App.css";
import { getCharacter, getPeople, searchCharacter } from "./api/people";

function App() {
  const inputSearch = useRef(null);
  const [textSearch, setTextSearch] = useState("");
  const [people, setPeople] = useState([]);
  const [errorState, setErrorState] = useState({ hasError: false });
  const [currentCharacter, setCurrentCharacter] = useState(1);
  const [details, setDetails] = useState({});
  const [currentPage, setPage] = useState(1);

  const { name, height, gender, birth_year } = details;

  useEffect(() => {
    getPeople(currentPage).then(setPeople).catch(handleError);
  }, [currentPage]);

  useEffect(() => {
    getCharacter(currentCharacter).then(setDetails).catch(handleError);
  }, [currentCharacter]);

  const handleError = (error) => {
    setErrorState({ hasError: true, message: error.message });
  };

  const showDetails = (character) => {
    const id = Number(character.url.split("/").slice(-2)[0]);
    setCurrentCharacter(id);
  };

  const onChangeTextSearch = (event) => {
    event.preventDefault();
    const text = inputSearch.current.value;
    setTextSearch(text);
  };

  const onSearchSubmit = (event) => {
    if (event.key !== "Enter") return;

    inputSearch.current.value = "";
    setDetails({});
    searchCharacter(textSearch).then(setPeople).catch(handleError);
  };

  const onChangePage = (next) => {
    if (!people.previous && currentPage + next <= 0) return;
    if (!people.next && currentPage + next >= 9) return;

    setPage(currentPage + next);
  };

  return (
    <Fragment>
      <input
        ref={inputSearch}
        onChange={onChangeTextSearch}
        onKeyDown={onSearchSubmit}
        type="text"
        placeholder="Search a character by name"
      ></input>
      <ul>
        {errorState.hasError && <div>{errorState.message}</div>}
        {people?.results?.map((character) => (
          <li key={character.name} onClick={() => showDetails(character)}>
            {character.name}
          </li>
        ))}
      </ul>

      <section>
        <button onClick={() => onChangePage(-1)}>⬅️</button>
        <span className="page-number">{currentPage}</span>
        <button onClick={() => onChangePage(+1)}>➡️</button>
      </section>

      {details && Object.keys(details).length > 0 && (
        <section>
          <h1>{name}</h1>
          <ul>
            <li>Height: {height}</li>
            <li>Gender: {gender}</li>
            <li>Year of birth: {birth_year}</li>
          </ul>
        </section>
      )}
    </Fragment>
  );
}

export default App;
