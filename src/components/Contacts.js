import React, { useState } from "react";
import styles from "./Chat.module.css";

import { init, useLazyQueryWithPagination } from "@airstack/airstack-react";

init("3ec4fa1dbaf34ee98563876ff8f7ca19");

const Contacts = (props) => {
  const [contacts, setContacts] = useState([]);
  const [profileName, setProfileName] = useState("");
  const [results, setResults] = useState([]);
  const [variables, setVariables] = useState({
    name: "",
  });

  const lensQuery = `query LensUser($name: Identity!) {
    Wallet(input: {identity: $name, blockchain: ethereum}) {
      addresses
    }
  }`;

  const fcQuery = `query FarcasterUser($name: Identity!)  {
    Wallet(input: {identity: $name, blockchain: ethereum}) {
      addresses
    }
  }`;

  const [
    fetchLensUser,
    { data: lensData, loading: lensLoading, pagination: lensPagination },
  ] = useLazyQueryWithPagination(lensQuery, variables);

  const [
    fetchFCUser,
    { data: fcData, loading: fcLoading, pagination: fcPagination },
  ] = useLazyQueryWithPagination(fcQuery, variables);

  const searchForUsers = async function () {
    let res;
    if (profileName.includes(".lens")) {
      res = await fetchLensUser(variables);
    } else {
      res = await fetchFCUser(variables);
    }

    setResults(res?.data?.Wallet?.addresses || []);
  };

  const handleInputChange = (e) => {
    setResults([]);
    setProfileName(e.target.value);
    setVariables({
      name: e.target.value.includes(".lens")
        ? e.target.value
        : `fc_fname:${e.target.value}`,
    });
  };

  const SearchResults = () => {
    return (
      <div>
        <div>
          <h3>{profileName}</h3>
          {results.map((r) => {
            return <p key={r}>{r}</p>;
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.Contacts}>
      <div className={styles.searchInput}>
        <input
          type="text"
          className={styles.inputField}
          onChange={handleInputChange}
          value={profileName}
          placeholder="Search for new Lens or Farcaster contacts"
        />
        <button onClick={searchForUsers}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </div>
      {results.length > 0 && profileName && <SearchResults />}
      <div>
        {contacts?.map(() => {
          return <div></div>;
        })}
      </div>
    </div>
  );
};

export default Contacts;
