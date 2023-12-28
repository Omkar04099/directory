import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/userDirectory.module.css'

const UserDirectory = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
        const usersData = await usersResponse.json();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };

    const fetchPosts = async () => {
      try {
        const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
        const postsData = await postsResponse.json();
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts', error);
      }
    };

    fetchUsers();
    fetchPosts();
  }, []);

  const getPostCount = (userId) => {
    return posts.filter((post) => post.userId === userId).length;
  };

  return (
    <div className={styles.container}>
      <h2>Directory</h2>
      <ul>
        {users.map((user) => (
            <Link to={`/user/${user.id}`}>
            <li key={user.id}>
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
