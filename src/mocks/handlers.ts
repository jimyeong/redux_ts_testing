import { rest } from "msw";
import { baseURL, sleep } from "../axios-util/axios-library-utility";

export const handlers = [
  rest.get(
    `https://www.thecocktaildb.com/api/json/v1/1/search.php`,
    async (req, res, ctx) => {
      const searchId = req.url.searchParams.get("s");
      return res(
        ctx.json({
          drinks: [
            {
              idDrink: "13501",
              dateModified: "2016-08-31 19:32:08",

              strAlcoholic: "Alcoholic",
              strCategory: "Shot",
              strCreativeCommonsConfirmed: "No",
              strDrink: "ABC",
              strDrinkAlternate: null,
              strDrinkThumb:
                "https://www.thecocktaildb.com/images/media/drink/tqpvqp1472668328.jpg",
              strGlass: "Shot glass",
              strIBA: null,
              strImageAttribution: null,
              strImageSource: null,
              strIngredient1: "Amaretto",
              strIngredient2: "Baileys irish cream",
              strIngredient3: "Cognac",
              strInstructions: "Layered in a shot glass.",
              strInstructionsDE: "Schichtaufbau in einem Schnapsglas.",
              strInstructionsES:
                "Coloque todos los ingredientes en un vaso de chupito.",
              strInstructionsIT:
                "Versa in ordine di lettera i vari ingredienti. 1/3 del bicchiere va riempito con l'Amaretto, 1/3 di Baileys e il restante di Cognac.",
              strMeasure1: "1/3 ",
              strMeasure2: "1/3 ",
              strMeasure3: "1/3 ",
            },
          ],
        })
      );
    }
  ),
];
