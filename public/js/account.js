import { React, ReactDOM } from "https://unpkg.com/es-react@16.8.60/index.js";
import htm from "https://unpkg.com/htm@2.2.1/dist/htm.mjs";
const html = htm.bind(React.createElement);

function Account(props) {
    const account = props.account;
    return html`
      <div key=${account.id} className="col-lg-4 col-md-6 col-mb-4">
        <div className="card h-30">
          <div className="card-body">
            <h5 className="card-title">${account.displayName}</h5>
            <p className="card-text">Insurance: ${account.insurance}</p>
            <p className="card-text">Balance: $${account.balance}</p>
          </div>
        </div>
      </div>
    `;
  }

function Accounts(props) {
  const accounts = props.accounts
  return html`
    <div className="col-12 row">
      <div className="col-12 row">
        ${accounts.map(function(account) {
          return html`
            <${Account} key=${account.id} account="${account}" />
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
        filterAccounts(searchTerm);
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
// create a copy of accounts;
let filteredAccounts;
function filterAccounts(searchTerm) {
  filteredAccounts = accounts.users.filter(account => {
    const lowerSearchTerm = searchTerm;
    return (
      account.insurance.toLowerCase().includes(lowerSearchTerm) ||
      account.name.toLowerCase().includes(lowerSearchTerm)
    );
  });
  render();
}
window.render = function render() {
  ReactDOM.render(
    html`
      <${Accounts} accounts=${filteredAccounts} />
    `,
    document.getElementById("displayaccountdiv")
  );
};
fetch('/api/users').then(response => {
    if (response.ok) {
        return response.json();
    } else {
        throw Error("Something went wrong with that request:", response.statusText);
    }
}).then(function (data) {
  window.accounts = data;
  filteredAccounts = accounts.users.slice();
  render();
});