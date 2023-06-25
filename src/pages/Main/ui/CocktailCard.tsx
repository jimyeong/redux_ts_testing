import React from "react";
import { Card, Image } from "semantic-ui-react";
import utils from "../../../utils/utils-library";

export interface CocktailProps {
  item: ICocktail;
}
export interface ICocktail {
  dateModified: string;

  idDrink: string;
  strAlcoholic: string;
  strCategory: string;
  strCreativeCommonsConfirmed: string;
  strDrink: string;
  strDrinkAlternate: string;
  strDrinkThumb: string;
  strGlass: string;
  strIBA: string;
  strImageAttribution: string;
  strImageSource: string;
  strIngredient1: string;
  strIngredient2: string;
  strIngredient3: string;
  strInstructions: string;
  strVideo: string;
}

const CocktailCard = ({ item }: CocktailProps) => {
  return (
    <Card>
      <div className="image">
        <Image src={item.strDrinkThumb} />
      </div>
      <div className="content">
        <div className="header ellipsis">{item.strDrink}</div>
        <div className="meta">{item.strCategory}</div>
        <div className="description">
          {utils.trim(item.strInstructions, 120)}
        </div>
      </div>
      <div className="extra content">
        <a href={item.strVideo} target="_blank" rel="noopener noreferrer">
          Watch video instructions
        </a>
      </div>
    </Card>
  );
};

export default CocktailCard;
