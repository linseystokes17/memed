import { React, ReactDOM } from "https://unpkg.com/es-react@16.8.60/index.js";
import htm from "https://unpkg.com/htm@2.2.1/dist/htm.mjs";
const html = htm.bind(React.createElement);

function Insurance(props) {
    const insurance = props.insurance;
    return html`
      <div key=${insurance.id} className="col-lg-4 col-md-6 col-mb-4">
        <div className="card h-30">
          <div className="card-body">
            <h5 className="card-title">${insurance.company}</h5>
            <p className="card-text">${insurance.plan}</p>
            <p className="card-text">$${insurance.deductible}</p>
            <p className="card-text">$${insurance.monthly_premium}</p>
            <p className="card-text">${insurance.stars.toFixed(2)} stars</p>
            
          </div>
        </div>
      </div>
    `;
  }
          //   <img
        //  src=${"/img/insurances/" + insurance.img}
        //     className="card-img-top"
        //     alt="bootstraplogo"
        //   />
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
    insurance,
    sortProp,
    onSortPropChange,
    sortOrder,
    onSortOrderChange
  } = props;
  // props to exclude from the sort
  const propsExcludedFromSort = new Set(["id", "img"]);
  const searchableProps = Object.keys(insurance)
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
function sortInsurances(insurances, sortProp, sortOrder) {
  return insurances.sort((focusedInsurance, alternateInsurance) => {
    const moveFocusedInsuranceLeft = -1,
      moveFocusedInsuranceRight = 1,
      dontMoveEitherInsurance = 0;
    if (focusedInsurance[sortProp] < alternateInsurance[sortProp]) {
      if (sortOrder === "ascending") {
        // move focusedinsurance left of alternateinsurance
        return moveFocusedInsuranceLeft;
      } else {
        // move focusedinsurance right of alternateinsurance
        return moveFocusedInsuranceRight;
      }
    } else if (focusedInsurance[sortProp] > alternateInsurance[sortProp]) {
      if (sortOrder === "ascending") {
        // move focusedinsurance right of alternateinsurance
        return moveFocusedInsuranceRight;
      } else {
        // move focusedinsurance left of alternateinsurance
        return moveFocusedInsuranceLeft;
      }
    } else {
      // Both insurances are equal don't move either.
      return dontMoveEitherInsurance;
    }
  });
}
function Insurances(props) {
  const [sortProp, setSortProp] = React.useState("name");
  const [sortOrder, setSortOrder] = React.useState("ascending");
  const insurances = sortInsurances(props.insurances, sortProp, sortOrder);
  return html`
    <div className="col-12 row">
      <div className="col-12 row">
        <${SortingOptions}
          insurance=${props.insurances[0]}
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
        ${insurances.map(function(insurance) {
          return html`
            <${Insurance} key=${insurance.id} insurance="${insurance}" />
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
        filterInsurances(searchTerm);
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
// create a copy of insurances;
let filteredInsurances;
function filterInsurances(searchTerm) {
  filteredInsurances = insurances.products.filter(insurance => {
    const lowerSearchTerm = searchTerm;
    return (
      insurance.description.toLowerCase().includes(lowerSearchTerm) ||
      insurance.name.toLowerCase().includes(lowerSearchTerm)
    );
  });
  render();
}
window.render = function render() {
  ReactDOM.render(
    html`
      <${Insurances} insurances=${filteredInsurances} />
    `,
    document.getElementById("displayinsurancesdiv")
  );
};

fetch('/api/Products').then(response => {
    if (response.ok) {
        return response.json();
    } else {
        throw Error("Something went wrong with that request:", response.statusText);
    }
}).then(function (data) {
  window.insurances = data;
  filteredInsurances = insurances.products.slice();
  render();
});