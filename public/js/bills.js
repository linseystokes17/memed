import { React, ReactDOM } from "https://unpkg.com/es-react@16.8.60/index.js";
import htm from "https://unpkg.com/htm@2.2.1/dist/htm.mjs";
const html = htm.bind(React.createElement);

function Bill(props) {
    const bill = props.bill;
    return html`
      <div key=${bill.id} className="col-lg-4 col-md-6 col-mb-4">
        <div className="card h-30">
          <div className="card-body">
            <h5 className="card-title">${bill.date}</h5>
            <p className="card-text">${bill.description}</p>
            <p className="card-text">$${bill.outstanding}</p>
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
    bill,
    sortProp,
    onSortPropChange,
    sortOrder,
    onSortOrderChange
  } = props;
  // props to exclude from the sort
  const propsExcludedFromSort = new Set(["id", "img"]);
  const searchableProps = Object.keys(bill)
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
function sortBills(bills, sortProp, sortOrder) {
  return bills.sort((focusedBill, alternateBill) => {
    const moveFocusedBillLeft = -1,
      moveFocusedBillRight = 1,
      dontMoveEitherBill = 0;
    if (focusedBill[sortProp] < alternateBill[sortProp]) {
      if (sortOrder === "ascending") {
        // move focusedBill left of alternateBill
        return moveFocusedBillLeft;
      } else {
        // move focusedBill right of alternateBill
        return moveFocusedBillRight;
      }
    } else if (focusedBill[sortProp] > alternateBill[sortProp]) {
      if (sortOrder === "ascending") {
        // move focusedBill right of alternateBill
        return moveFocusedBillRight;
      } else {
        // move focusedBill left of alternateBill
        return moveFocusedBillLeft;
      }
    } else {
      // Both bills are equal don't move either.
      return dontMoveEitherBill;
    }
  });
}
function Bills(props) {
  const [sortProp, setSortProp] = React.useState("name");
  const [sortOrder, setSortOrder] = React.useState("ascending");
  const bills = sortBills(props.bills, sortProp, sortOrder);
  return html`
    <div className="col-12 row">
      <div className="col-12 row">
        <${SortingOptions}
          bill=${props.bills[0]}
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
        ${bills.map(function(bill) {
          return html`
            <${Bill} key=${bill.id} bill="${bill}" />
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
        filterBills(searchTerm);
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
      <button className="btn-search" id="btn-search"  type="submit">
        Search
      </button>
    </form>
  `;
}
// create a copy of bills;
let filteredBills;
function filterBills(searchTerm) {
  filteredBills = bills.bills.filter(bill => {
    const lowerSearchTerm = searchTerm;
    return (
      bill.description.toLowerCase().includes(lowerSearchTerm) ||
      bill.name.toLowerCase().includes(lowerSearchTerm)
    );
  });
  render();
}
window.render = function render() {
  ReactDOM.render(
    html`
      <${Bills} bills=${filteredBills} />
    `,
    document.getElementById("displaybillsdiv")
  );
};

fetch('/api/bills').then(response => {
    if (response.ok) {
        return response.json();
    } else {
        throw Error("Something went wrong with that request:", response.statusText);
    }
}).then(function (data) {
  window.bills = data;
  filteredBills = bills.bills.slice();
  render();
});