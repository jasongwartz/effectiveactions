import React from "react";
import CardsGrid from "../components/articles/CardsGrid";

const Articles = (props) => {
  return (
    <div id="articles">
      <CardsGrid search={props.location.state.search} />
    </div>
  );
};

export default Articles;
