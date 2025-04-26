import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../styles/clearTaskSection.css";
const ClearTasksSection = () => {
    const [users, setUsers] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [loading, setLoading] = useState(false);
    // const token = localStorage.getItem("adminToken");

    useEffect(() => {
        fetchUsers();
      }, []);
    
      const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("adminToken"); // <-- fetch fresh token inside
          const res = await axios.get('https://task-b1w0.onrender.com/api/admin/users', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Fetched user response:", res.data); // 👈 yeh add kar ke dekho kya aata hai
          setUsers(res.data); // ✅ sahi tarika
        } catch (error) {
          console.error('Error fetching users:', error);
        }
        
      };
      
      const handleSelectUser = (userId) => {
        if (selectedUserIds.includes(userId)) {
          setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
        } else {
          setSelectedUserIds([...selectedUserIds, userId]);
        }
      };
    
      const handleClearTasksForSelected = async () => {
        try {
            const token = localStorage.getItem("adminToken"); // <-- fetch fresh token inside
          if (selectedUserIds.length === 0) {
            alert('Please select at least one user.');
            return;
          }
    
          await axios.put('https://task-b1w0.onrender.com/api/admin/clear-selected-tasks', 
            { userIds: selectedUserIds },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          alert('Selected users\' tasks cleared successfully!');
          fetchUsers();
        } catch (error) {
          console.error('Error clearing tasks for selected users:', error);
        }
      };
    
      const handleClearTasksForAll = async () => {
        try {
            const token = localStorage.getItem("adminToken"); // <-- fetch fresh token inside
            await axios.put('https://task-b1w0.onrender.com/api/admin/clear-all-tasks',
            {}, 
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          alert('All users\' tasks cleared successfully!');
          fetchUsers();
        } catch (error) {
          console.error('Error clearing tasks for all users:', error);
        }
      };
    
    return (
      <div className="clear-tasks-section">
        <h2>Clear Tasks Section</h2>
  
        {users.length > 0 ? (
          <div className="users-list">
            {users.map(user => (
              <div key={user._id} className="user-checkbox">
                <input
                  type="checkbox"
                  checked={selectedUserIds.includes(user._id)}
                  onChange={() => handleSelectUser(user._id)}
                />
                {user.username}
              </div>
            ))}
          </div>
        ) : (
          <p>Loading users...</p>
        )}
  
        <div className="clear-buttons">
          <button onClick={handleClearTasksForSelected} disabled={loading}>
            Clear Tasks For Selected Users
          </button>
          <button onClick={handleClearTasksForAll} disabled={loading}>
            Clear Tasks For All Users
          </button>
        </div>
      </div>
    );
  };
  
  export default ClearTasksSection;
