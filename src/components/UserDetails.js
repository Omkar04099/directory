import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from '../styles/userDetails.module.css';

const UserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [post, setPost] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clockRunning, setClockRunning] = useState(true);
  const [pausedTime, setPausedTime] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user', error);
      }
    };

    const fetchPosts = async ()=>{
        try{
            const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
            const postsData = await postsResponse.json();
            const posts = postsData.filter((p)=>{ return p.userId==userId});
            setPost(posts);
        } catch(error){
            console.error('Error fetching posts',error);
        }
    }

    const fetchCountries = async () => {
      try {
        const response = await fetch('http://worldtimeapi.org/api/timezone');
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Error fetching countries', error);
      }
    };

    fetchUser();
    fetchPosts();
    fetchCountries();
  }, [userId ]);

  useEffect(() => {
    let interval;

    if (clockRunning) {
      interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [clockRunning]);

  const handlePauseStart = () => {
    if (clockRunning) {
      // Pause the clock and store the paused time
      setClockRunning(false);
      setPausedTime(new Date());
    } else {
      // Start the clock from the paused time
      setClockRunning(true);
      const now = new Date();
      const timeDifference = now - pausedTime;
      setCurrentTime(new Date(currentTime.getTime() + timeDifference));
    }
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  return (
    <div>
      {user && (
        <div>
          <div className={styles.header}>
            <Link to="/"><button>Back</button></Link>
            <div>
            Country Dropdown: &nbsp;
            <select id="countrySelector" value={selectedCountry} onChange={handleCountryChange}>
              <option value="" disabled></option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            </div>
            <p>
              Current Time: {currentTime.toLocaleTimeString()}{' '}
              <button onClick={handlePauseStart}>{clockRunning ? 'Pause' : 'Start'}</button>
            </p>
          </div>

          <h3>Profile page</h3>
          <div className={styles.personalDetails}> 
                <div className={styles.nameAddress}>
                    <p>{user.name}</p>
                    <p>{user.address.suite}, {user.address.street}, {user.address.city}, {user.address.zipcode}</p>
                </div>
                <div className={styles.moreDetails}>
                    <div className={styles.userNamePhrase}>
                        <p>{user.username} |&nbsp;</p>   
                        <p> {user.company.catchPhrase} </p>
                    </div>
                    <div className={styles.emailPhone}>
                        <p>{user.email} |&nbsp;</p>
                        <p>{user.phone}</p>
                    </div>
                </div>
          </div>
          <div className={styles.posts}>
            {post.map(p=>{
                return(<div className={styles.cardContainer}>
                    <h6>{p.title}</h6>
                    <p>{p.body}</p>
                </div>)
            })}
          </div>

        </div>
      )}
    </div>
  );
};

export default UserDetails;
