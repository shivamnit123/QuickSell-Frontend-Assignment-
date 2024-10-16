import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import List from './Components/List/List';
import Navbar from './Components/Navbar/Navbar';

function App() {
  const Status = ['In progress', 'Backlog', 'Todo', 'Done', 'Cancelled']
  const user = ['Anoop sharma', 'Yogesh', 'Shankar Kumar', 'Ramesh', 'Suresh']
  const priority = [
    { name: 'No priority', priority: 0 },
    { name: 'Low', priority: 1 },
    { name: 'Medium', priority: 2 },
    { name: 'High', priority: 3 },
    { name: 'Urgent', priority: 4 }
  ]

  const [orderValue, setorderValue] = useState('title')
  const [ticketDetails, setticketDetails] = useState([]);
  const [groupval, setgroupval] = useState(getStateFromLocalStorage() || 'status')


  const orderDataByValue = useCallback(async (cardsArry) => {
    if (orderValue === 'priority') {
      cardsArry.sort((a, b) => b.priority - a.priority);
    } else if (orderValue === 'title') {
      cardsArry.sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();

        if (titleA < titleB) {
          return -1;
        } else if (titleA > titleB) {
          return 1;
        } else {
          return 0;
        }
      });
    }
    await setticketDetails(cardsArry);
  }, [orderValue, setticketDetails]);

  function saveStateToLocalStorage(state) {
    localStorage.setItem('groupValue', JSON.stringify(state));
  }

  function getStateFromLocalStorage() {
    const storedState = localStorage.getItem('groupValue');
    if (storedState) {
      return JSON.parse(storedState);
    }
    return null;
  }

  useEffect(() => {
    saveStateToLocalStorage(groupval);
    async function fetchData() {
      const response = await axios.get('https://api.quicksell.co/v1/internal/frontend-assignment');
      await refactorData(response);

    }
    fetchData();
    async function refactorData(response) {
      let ticketArray = []
      if (response.status === 200) {
        for (let i = 0; i < response.data.tickets.length; i++) {
          for (let j = 0; j < response.data.users.length; j++) {
            if (response.data.tickets[i].userId === response.data.users[j].id) {
              let ticketJson = { ...response.data.tickets[i], userObj: response.data.users[j] }
              ticketArray.push(ticketJson)
            }
          }
        }
      }
      await setticketDetails(ticketArray)
      orderDataByValue(ticketArray)
    }

  }, [orderDataByValue, groupval])

  function handleGroupValue(value) {
    setgroupval(value);
    console.log(value);
  }

  function handleOrderValue(value) {
    setorderValue(value);
    console.log(value);
  }

  return (
    <>
      <Navbar
        groupValue={groupval}
        orderValue={orderValue}
        handleGroupValue={handleGroupValue}
        handleOrderValue={handleOrderValue}
      />
      <section className="board-details">
        <div className="board-details-list">
          {
            {
              'status': <>
                {
                  Status.map((listItem) => {
                    return (<List
                      groupValue='status'
                      orderValue={orderValue}
                      listTitle={listItem}
                      listIcon=''
                      statusList={Status}
                      ticketDetails={ticketDetails}
                    />)
                  })
                }
              </>,
              'user': <>
                {
                  user.map((listItem) => {
                    return (<List
                      groupValue='user'
                      orderValue={orderValue}
                      listTitle={listItem}
                      listIcon=''
                      userList={user}
                      ticketDetails={ticketDetails}
                    />)
                  })
                }
              </>,
              'priority': <>
                {
                  priority.map((listItem) => {
                    return (<List
                      groupValue='priority'
                      orderValue={orderValue}
                      listTitle={listItem.priority}
                      listIcon=''
                      priorityList={priority}
                      ticketDetails={ticketDetails}
                    />)
                  })
                }
              </>
            }[groupval]
          }
        </div>
      </section>
    </>
  );
}

export default App;
