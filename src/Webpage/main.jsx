import { useState } from "react";
import Auth from '../Webpage/signin';
import Dashboard from './Webpage/upload';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('currentUser') || 'null'));
  const [uploadedImages, setUploadedImages] = useState([]);

  // This should be in a separate file or context in a real app
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  const handleSignUp = (email, password, name) => {
    const newUser = {
      id: Date.now(),
      email,
      password,
      name,
      createdAt: new Date().toISOString()
    };
    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setUser(newUser);
    setCurrentPage('dashboard');
  };

  const handleLogin = (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      setUser(foundUser);
      setCurrentPage('dashboard');
      const userImages = JSON.parse(localStorage.getItem(`userImages_${foundUser.id}`) || '[]');
      setUploadedImages(userImages);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setCurrentPage('login');
    setUploadedImages([]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = {
          id: Date.now(),
          url: event.target.result,
          name: file.name,
          uploadedAt: new Date().toISOString(),
          size: file.size
        };
        const updatedImages = [...uploadedImages, newImage];
        setUploadedImages(updatedImages);
        localStorage.setItem(`userImages_${user.id}`, JSON.stringify(updatedImages));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-background border-b border-border px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">CollabShare</h1>
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground">Welcome, {user.name}</span>
              <Button variant="outline" onClick={() => setCurrentPage('dashboard')} className="text-sm">
                Dashboard
              </Button>
              <Button variant="ghost" onClick={handleLogout} className="text-sm">
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!user ? (
          <Auth
            setCurrentPage={setCurrentPage}
            handleLogin={handleLogin}
            handleSignUp={handleSignUp}
          />
        ) : (
          <Dashboard
            user={user}
            uploadedImages={uploadedImages}
            handleImageUpload={handleImageUpload}
            setCurrentPage={setCurrentPage}
          />
        )}
      </main>
    </div>
  );
};

export default App;