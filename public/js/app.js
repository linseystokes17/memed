import { React, ReactDOM } from "https://unpkg.com/es-react@16.8.60/index.js";
import htm from "https://unpkg.com/htm@2.2.1/dist/htm.mjs";
const html = htm.bind(React.createElement);
function Watch(props) {
    const watch = props.watch;
    return html`
      <div key=${watch.id} className="col-lg-4 col-md-6 col-mb-4">
        <div className="card h-30">
          <img
         src=${"/img/watches/" + watch.img}
            className="card-img-top"
            alt="bootstraplogo"
          />
          <div className="card-body">
            <h5 className="card-title">${watch.name}</h5>
            <p className="card-text">${watch.description}</p>
            <p className="card-text">$${watch.price}</p>
            <p className="card-text">${watch.stars.toFixed(2)} stars</p>
          </div>
        </div>
      </div>
    `;
  }
function SortCriteria(props) {
  // The below uncommented line is the same as:
  // const name = props.name;
  // const checked = props.checked
  const { name, checked, onSortPropChange } = props;
  const id = `sort-${name}`;
  return html`
    <span className="sort-prop mx-2">
      <input
        onChange=${e => onSortPropChange(e.target.checked, name)}
        checked=${checked}
        className="mx-1"
        type="radio"
        id=${id}
        name="sortbyprop"
      />
      <label className="mx-1" htmlFor=${id}>${name}</label>
    </span>
  `;
}
function SortingOptions(props) {
  const {
    watch,
    sortProp,
    onSortPropChange,
    sortOrder,
    onSortOrderChange
  } = props;
  // props to exclude from the sort
  const propsExcludedFromSort = new Set(["id", "img"]);
  const searchableProps = Object.keys(watch)
    // filter out excluded props
    .filter(keyProperty => !propsExcludedFromSort.has(keyProperty))
    // map the keys/props to React Components.
    .map(
      (keyProperty, index) => html`
        <${SortCriteria}
          key=${keyProperty}
          name=${keyProperty}
          onSortPropChange=${onSortPropChange}
          checked=${keyProperty === sortProp}
        />
      `
    );
  return html`
    <div className="col-md-12 row">
      <div className="col-md-6">
        Sort By:
        <br />
        ${searchableProps}
      </div>
      <div className="col-md-6">
        Sort:
        <br />
        <span className="mx-2">
          <input
            onChange=${e => onSortOrderChange(e.target.checked, "ascending")}
            className="mx-1"
            type="radio"
            checked=${sortOrder === "ascending"}
            id="sort-ascending"
            name="sortorder"
          />
          <label className="mx-1" htmlFor="sort-ascending">Ascending</label>
        </span>
        ${" "}
        <span className="mx-2">
          <input
            onChange=${e => onSortOrderChange(e.target.checked, "descending")}
            className="mx-1"
            checked=${sortOrder === "descending"}
            type="radio"
            id="sort-descending"
            name="sortorder"
          />
          <label className="mx-1" htmlFor="sort-descending">Descending</label>
        </span>
      </div>
    </div>
  `;
}
function sortWatches(watches, sortProp, sortOrder) {
  return watches.sort((focusedWatch, alternateWatch) => {
    const moveFocusedWatchLeft = -1,
      moveFocusedWatchRight = 1,
      dontMoveEitherWatch = 0;
    if (focusedWatch[sortProp] < alternateWatch[sortProp]) {
      if (sortOrder === "ascending") {
        // move focusedWatch left of alternateWatch
        return moveFocusedWatchLeft;
      } else {
        // move focusedWatch right of alternateWatch
        return moveFocusedWatchRight;
      }
    } else if (focusedWatch[sortProp] > alternateWatch[sortProp]) {
      if (sortOrder === "ascending") {
        // move focusedWatch right of alternateWatch
        return moveFocusedWatchRight;
      } else {
        // move focusedWatch left of alternateWatch
        return moveFocusedWatchLeft;
      }
    } else {
      // Both watches are equal don't move either.
      return dontMoveEitherWatch;
    }
  });
}
function Watches(props) {
  const [sortProp, setSortProp] = React.useState("name");
  const [sortOrder, setSortOrder] = React.useState("ascending");
  const watches = sortWatches(props.watches, sortProp, sortOrder);
  return html`
    <div className="col-12 row">
      <div className="col-12 row">
        <${SortingOptions}
          watch=${props.watches[0]}
          sortProp=${sortProp}
          sortOrder=${sortOrder}
          onSortPropChange=${(isChecked, sortProperty) => {
            if (isChecked && sortProp != sortProperty) {
              setSortProp(sortProperty);
            }
          }}
          onSortOrderChange=${(isChecked, sortOrdering) => {
            if (isChecked && sortOrdering != sortOrder) {
              setSortOrder(sortOrdering);
            }
          }}
        />
      </div>
      <div className="col-12 row">
        ${watches.map(function(watch) {
          return html`
            <${Watch} key=${watch.id} watch="${watch}" />
          `;
        })}
      </div>
    </div>
  `;
}

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
      <button className="btn-search  " type="submit">
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
};
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