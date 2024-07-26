import * as model from './model.js';
import {MODAL_CLOSE_SEC} from './config.js'
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';


// if (model.hot) {
//   model.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    // 0> Update mark selected results View

    resultsView.update(model.getSearchResultsPage());
    // 1> Update bookmarks View
    bookmarksView.update(model.state.bookmarks);
    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);


  } catch (err) {
    recipeView.renderError();
    console.error(err)
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();

    if (!query) return;
    // 2) Load Search Results
    await model.loadSearchResults(query);

    // 3) Rendering  results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4) Rendering pagination
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // 1) Rendering New results
  // resultsView.render(model.state.search.results);
  resultsView.render(model.getSearchResultsPage(goToPage));
  // 2) Rendering New pagination
  paginationView.render(model.state.search);

};

const controlServings = function (newServings) {
  // Update the recipe serving (in state)
  model.updateServings(newServings)
  // Update the recipe view
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function () {
  // Add/Remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  
  // Update the recipe view
  recipeView.update(model.state.recipe);

  // Render bookmark list
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe) {
 try {
  // Render spinning recipe
  addRecipeView.renderSpinner()

  //  Upload new recipe
  await model.uploadRecipe(newRecipe)

  // Render new recipe
  recipeView.render(model.state.recipe)

  // Render success message
  addRecipeView.renderMessage()

  // Render bookmark view
  bookmarksView.render(model.state.bookmarks)

  // Change Id in Url
  window.history.pushState(null, '', `#${model.state.recipe.id}`);

  // Close modal
  setTimeout(() => {
    addRecipeView.toggleWindow()
  }, MODAL_CLOSE_SEC * 1000)
 
 } catch(err) {
  console.error('💥' + err)
  addRecipeView.renderError(err.message)
 }

}

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandleSearch(controlSearchResults);
  paginationView.addHandleClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);

};

init();
