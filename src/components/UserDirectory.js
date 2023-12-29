import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/userDirectory.module.css';
import loader from '../assets/loading.gif'

const UserDirectory = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
        const usersData = await usersResponse.json();
        setUsers(usersData);
  
        const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
        const postsData = await postsResponse.json();
        setPosts(postsData);
  
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
  
    fetchData();
  }, []);

  const getPostCount = (userId) => {
    return posts.filter((post) => post.userId === userId).length;
  };

  if (loading) {
    return <>
        <img className={styles.loader} src={loader} alt='Loading....'/>
        <p className={styles.loaderText}>Loading Directory... Please wait...</p>
    </>
  }

  return (
    <div className={styles.container}>
      <h2>Directory</h2>
      <ul>
        {users.map((user) => (
            <Link to={`/user/${user.id}`} key={user.id}>
            <li>
             <p> Name: {user.name} </p>    
             <p> Posts: {getPostCount(user.id)} </p> 
             </li>
            </Link>
        ))}
      </ul>
    </div>
  );
};

export default UserDirectory;
