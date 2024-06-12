import axios from "axios";
import jwt_decode from 'jwt-decode';
function UserInfo(){
    const token = localStorage.getItem('token');

if (token) {
  try {
    const decodedToken = jwt_decode(token);
    console.log(decodedToken); 

    axios.get('http://localhost:3001/collablearn/User', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      const userInfo = response.data;
      console.log(userInfo);
    })
    .catch(error => {
      console.error('Error fetching user info:', error);
    });

  } catch (error) {
    console.error('Error decoding token:', error);
  }
} else {
  console.log('No token found in localStorage');
}
return(
    <div></div>
);
    }
    
    export default UserInfo;