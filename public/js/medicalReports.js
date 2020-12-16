import { React, ReactDOM } from "https://unpkg.com/es-react@16.8.60/index.js";
import htm from "https://unpkg.com/htm@2.2.1/dist/htm.mjs";
const html = htm.bind(React.createElement);

function Report(props) {
    const report = props.report;
    return html`
      <div key=${report.id} className="col-lg-4 col-md-6 col-mb-4">
        <div className="card h-30">
          <div className="card-body">
            <h5 className="card-title">${report.procedure_name}</h5>
            <p className="card-text">Plan: ${report.procedure_code}</p>
            <p className="card-text">Price: $${report.price}</p>
            <p className="card-text">Description: ${report.description}</p>
            
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
    report,
    sortProp,
    onSortPropChange,
    sortOrder,
    onSortOrderChange
  } = props;
  // props to exclude from the sort
  const propsExcludedFromSort = new Set(["name", "code", "description"]);
  const searchableProps = Object.keys(report)
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
function sortReports(reports, sortProp, sortOrder) {
  return reports.sort((focusedReport, alternateReports) => {
    const moveFocusedReportLeft = -1,
      moveFocusedReportRight = 1,
      dontMoveEitherReport = 0;
    if (focusedReport[sortProp] < alternateReports[sortProp]) {
      if (sortOrder === "ascending") {
        // move focusedReport left of alternateReports
        return moveFocusedReportLeft;
      } else {
        // move focusedReport right of alternateReports
        return moveFocusedReportRight;
      }
    } else if (focusedReport[sortProp] > alternateReports[sortProp]) {
      if (sortOrder === "ascending") {
        // move focusedReport right of alternateReports
        return moveFocusedReportRight;
      } else {
        // move focusedReport left of alternateReports
        return moveFocusedReportLeft;
      }
    } else {
      // Both reports are equal don't move either.
      return dontMoveEitherReport;
    }
  });
}
function Reports(props) {
  const [sortProp, setSortProp] = React.useState("company");
  const [sortOrder, setSortOrder] = React.useState("ascending");
  const reports = sortReports(props.reports, sortProp, sortOrder);
  return html`
    <div className="col-12 row">
      <div className="col-12 row">
        <${SortingOptions}
          report=${props.reports[0]}
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
        ${reports.map(function(report) {
          return html`
            <${Report} key=${report.id} report="${report}" />
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
        filterReports(searchTerm);
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
// create a copy of reports;
let filteredReports;
function filterReports(searchTerm) {
  filteredReports = reports.reports.filter(report => {
    const lowerSearchTerm = searchTerm;
    return (
      report.plan.toLowerCase().includes(lowerSearchTerm) ||
      report.company.toLowerCase().includes(lowerSearchTerm)
    );
  });
  render();
}
window.render = function render() {
  ReactDOM.render(
    html`
      <${Reports} reports=${filteredReports} />
    `,
    document.getElementById("displayreportsdiv")
  );
};

fetch('/api/reports').then(response => {
    if (response.ok) {
        return response.json();
    } else {
        throw Error("Something went wrong with that request:", response.statusText);
    }
}).then(function (data) {
  window.reports = data;
  filteredReports = reports.reports.slice();
  render();
});