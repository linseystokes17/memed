import { React, ReactDOM } from "https://unpkg.com/es-react@16.8.60/index.js";
import htm from "https://unpkg.com/htm@2.2.1/dist/htm.mjs";
const html = htm.bind(React.createElement);

function TopBar(props) {
  return html`
    <div className="row align-items-center">
      <${Search} />
    </div>
  `;
}
function Search() {
  const [searchTerm, setSearchTerm] = React.useState("");
  return html`
    <form
      id="search"
      onSubmit=${e => {
        e.preventDefault();
        filterWatches(searchTerm);
      }}
      className="form-inline my-2 my-lg-0"
    >
      <input
        value=${searchTerm}
        onChange=${eventData => setSearchTerm(eventData.target.value)}
        className="form-control mr-sm-2"
        type="search"
        placeholder="Search"
        aria-label="Search"
      />
      <button className="btn btn-outline-success my-2 my-sm-0" type="submit">
        Search
      </button>
    </form>
  `;
}
// create a copy of watches;
let filteredWatches;
function filterWatches(searchTerm) {
  filteredWatches = watches.products.filter(watch => {
    const lowerSearchTerm = searchTerm;
    return (
      watch.description.toLowerCase().includes(lowerSearchTerm) ||
      watch.name.toLowerCase().includes(lowerSearchTerm)
    );
  });
  render();
}
window.render = function render() {
  ReactDOM.render(
    html`
      <${Watches} watches=${filteredWatches} />
    `,
    document.getElementById("displaywatchesdiv")
  );
  ReactDOM.render(
    html`
      <${TopBar} shoppingCart=${shoppingCartData} />
    `,
    document.getElementById("search")
  );
};
/*fetch('/api/getProducts').then(response => {
    if (response.ok) {
        return response.json();
    } else {
        throw Error("Something went wrong with that request:", response.statusText);
    }
}).then(function (data) {
  window.watches = data;
  filteredWatches = watches.products.slice();
  render();
});*/
fetch('/api/Products').then(response => {
    if (response.ok) {
        return response.json();
    } else {
        throw Error("Something went wrong with that request:", response.statusText);
    }
}).then(function (data) {
  window.watches = data;
  filteredWatches = watches.products.slice();
  render();
});