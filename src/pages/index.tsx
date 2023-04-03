import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  phone: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchCity, setSearchCity] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter(user =>
        user.address.city.toLowerCase().includes(searchCity.toLowerCase())
      )
    );
  }, [users, searchCity]);

  const pageSize = 5;
  const pageCount = Math.ceil(filteredUsers.length / pageSize);

  function handleSearchCityChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchCity(event.target.value);
    setCurrentPage(1);
  }

  function handlePageChange(pageNumber: number) {
    setCurrentPage(pageNumber);
  }

  function handleSort() {
    const sortedUsers = [...filteredUsers];
    sortedUsers.sort((a, b) => {
      if (a.name > b.name) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      if (a.name < b.name) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      return 0;
    });
    setFilteredUsers(sortedUsers);
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  }

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <>
      <label htmlFor="searchCity">Search by city:</label>
      <input id="searchCity" type="text" value={searchCity} onChange={handleSearchCityChange} />
      <table>
        <thead>
          <tr>
            <th onClick={handleSort}>Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Company</th>
          </tr>
        </thead>
        <tbody>
          {displayedUsers.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>
                <ul>
                  <li>{user.address.street}</li>
                  <li>{user.address.suite}</li>
                  <li>{user.address.city}</li>
                </ul>
              </td>
              <td>{user.phone}</td>
              <td>{user.company.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {Array.from(Array(pageCount).keys()).map(pageNumber => (
          <button key={pageNumber} onClick={() => handlePageChange(pageNumber + 1)}>
            {pageNumber + 1}
          </button>
        ))}
      </div>
    </>
  );
}
export default UserTable;


