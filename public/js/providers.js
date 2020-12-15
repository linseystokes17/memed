import { React, ReactDOM } from "https://unpkg.com/es-react@16.8.60/index.js";
import htm from "https://unpkg.com/htm@2.2.1/dist/htm.mjs";
const html = htm.bind(React.createElement);

function Provider(props) {
    const provider = props.provider;
    return html`
      <div key=${provider.id} className="col-lg-4 col-md-6 col-mb-4">
        <div className="card h-30">
          <div className="card-body">
            <img
           src=${"/img/providers/" + provider.img}
              className="card-img-top"
              alt="bootstraplogo"
            />
            <h5 className="card-title">${provider.name}</h5>
            <p className="card-text">Specialty: ${provider.specialty}</p>
            <p className="card-text">Location: ${provider.location}</p>
            <p className="card-text">Description: ${provider.description}</p>
            
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
    provider,
    sortProp,
    onSortPropChange,
    sortOrder,
    onSortOrderChange
  } = props;
  // props to exclude from the sort
  const propsExcludedFromSort = new Set(["id", "img", "description", "stars"]);
  const searchableProps = Object.keys(provider)
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
function sortProviders(providers, sortProp, sortOrder) {
  return providers.sort((focusedProvider, alternateProvider) => {
    const moveFocusedProviderLeft = -1,
      moveFocusedProviderRight = 1,
      dontMoveEitherprovider = 0;
    if (focusedProvider[sortProp] < alternateProvider[sortProp]) {
      if (sortOrder === "ascending") {
        // move focusedProvider left of alternateProvider
        return moveFocusedProviderLeft;
      } else {
        // move focusedProvider right of alternateProvider
        return moveFocusedProviderRight;
      }
    } else if (focusedProvider[sortProp] > alternateProvider[sortProp]) {
      if (sortOrder === "ascending") {
        // move focusedProvider right of alternateProvider
        return moveFocusedProviderRight;
      } else {
        // move focusedProvider left of alternateProvider
        return moveFocusedProviderLeft;
      }
    } else {
      // Both providers are equal don't move either.
      return dontMoveEitherprovider;
    }
  });
}
function Providers(props) {
  const [sortProp, setSortProp] = React.useState("company");
  const [sortOrder, setSortOrder] = React.useState("ascending");
  const providers = sortProviders(props.providers, sortProp, sortOrder);
  return html`
    <div className="col-12 row">
      <div className="col-12 row">
        <${SortingOptions}
          provider=${props.providers[0]}
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
        ${providers.map(function(provider) {
          return html`
            <${Provider} key=${provider.id} provider="${provider}" />
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
        filterProviders(searchTerm);
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
      <button className="btn-search" id="btn-search" type="submit">
        Search
      </button>
    </form>
  `;
}
// create a copy of providers;
let filteredProviders;
function filterProviders(searchTerm) {
  filteredProviders = providers.med_providers.filter(provider => {
    const lowerSearchTerm = searchTerm;
    return (
      provider.plan.toLowerCase().includes(lowerSearchTerm) ||
      provider.company.toLowerCase().includes(lowerSearchTerm)
    );
  });
  render();
}
window.render = function render() {
  ReactDOM.render(
    html`
      <${Providers} providers=${filteredProviders} />
    `,
    document.getElementById("displayprovidersdiv")
  );
};

fetch('/api/Med_providers').then(response => {
    if (response.ok) {
        return response.json();
    } else {
        throw Error("Something went wrong with that request:", response.statusText);
    }
}).then(function (data) {
  window.providers = data;
  filteredProviders = providers.med_providers.slice();
  render();
});