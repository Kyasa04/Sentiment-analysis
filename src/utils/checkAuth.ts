export const checkAuthState = () => {
  const registeredUsers = localStorage.getItem('registeredUsers');
  const authToken = localStorage.getItem('authToken');
  const userEmail = localStorage.getItem('userEmail');
  
  console.log('Registered Users:', registeredUsers ? JSON.parse(registeredUsers) : 'None');
  console.log('Auth Token:', authToken);
  console.log('Current User Email:', userEmail);
};