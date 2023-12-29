import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from '../styles/userDetails.module.css';
import loader from '../assets/loading.gif'

const UserDetails = () => {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [post, setPost] = useState([]);
  const [countries, setCountries] = useState([]);
  const [time, setTime] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date(time));
  const [clockRunning, setClockRunning] = useState(true);
  const [selectedPost, setSelectedPost] = useState();

  const openPopup = (post) => {
    setSelectedPost(post);
  };

  const closePopup = () => {
    setSelectedPost(null);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPosts = async () => {
      try {
        const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
        const postsData = await postsResponse.json();
        const posts = postsData.filter((p) => p.userId == userId);
        setPost(posts);
      } catch (error) {
        console.error('Error fetching posts', error);
      }
    };

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
  }, [userId]);

  useEffect(() => {
    let interval;

    if (clockRunning) {
      interval = setInterval(() => {
        setCurrentTime((time) => new Date(time.getTime() + 1000));
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [clockRunning]);

  const fetchTime = async (value) => {
    try {
      const response = await fetch(`http://worldtimeapi.org/api/timezone/${value}`);
      const data = await response.json();
      const timeString = data.datetime.slice(11, 19);
      const [hours, minutes, seconds] = timeString.split(':').map(Number);
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      date.setSeconds(seconds);
      setTime(date);
      setCurrentTime(date);
    } catch (error) {
      console.log('Error in fetching time for selected country', error);
    }
  };

  const handlePauseStart = () => {
    setClockRunning((prevClockRunning) => !prevClockRunning);
  };

  const handleCountryChange = (event) => {
    fetchTime(event.target.value);
  };

  if (loading) {
    return <>
      <img className={styles.loader} src={loader} alt='Loading....'/>
      <p className={styles.loaderText}>Fetching User Details...Please Wait...</p>
    </>
  }

  return (
    <div>
      {user && (
        <div>
          <div className={styles.header}>
            <Link to="/">
              <button>Back</button>
            </Link>
            <div className={styles.clockAndBtn}>
              <div>
                <select id="countrySelector" defaultValue="" onChange={(e) => handleCountryChange(e)}>
                  <option value="" disabled>
                    Country Dropdown
                  </option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.clock}>
                <sup>{currentTime.toLocaleDateString()}</sup>
                <p>{currentTime.toLocaleTimeString()}</p>
              </div>
              <button className={styles.btn} onClick={handlePauseStart}>
                {clockRunning ? 'Pause' : 'Start'}
              </button>
            </div>
          </div>

          <h3>Profile page</h3>
          <div className={styles.personalDetails}>
            <div className={styles.nameAddress}>
              <p>{user.name}</p>
              <p>
                {user.address.suite}, {user.address.street}, {user.address.city}, {user.address.zipcode}
              </p>
            </div>
            <div className={styles.moreDetails}>
              <div className={styles.userNamePhrase}>
                <p>
                  {user.username} |&nbsp;
                </p>
                <p> {user.company.catchPhrase} </p>
              </div>
              <div className={styles.emailPhone}>
                <p>{user.email} |&nbsp;</p>
                <p>{user.phone}</p>
              </div>
            </div>
          </div>
          <div className={styles.posts}>
            {post.map((p) => (
              <div key={p.id} className={styles.cardContainer} onClick={() => openPopup(p)}>
                <h6>{p.title}</h6>
                <p>{p.body}</p>
              </div>
            ))}

            {selectedPost && (
              <div className={styles.popupOverlay} onClick={closePopup}>
                <div className={styles.popupContent}>
                  <h6>{selectedPost.title}</h6>
                  <p>{selectedPost.body}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
