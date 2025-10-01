import { useState, useEffect, useCallback } from 'react';
import { LogIn, UserPlus, Home as HomeIcon, Upload, Image, X, Trash2, Pointer } from 'lucide-react';

//UI Components
const Input = ({ label, id, type="text", value, onChange, placeholder, classname="" }) => (
    <div className="input">
        <label htmlFor={id} className="input-label">
            {label}
        </label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`input-field ${classname}`}
        />
    </div>
);

const Button = ({ onClick, children, classname="", type="button", disabled=false, variant }) => {
    const variantClass = variant ? `button-${variant}` : '';
    return (
        <button 
            onClick={onClick} 
            className={`button ${variantClass} ${classname}`} 
            type='type'
            disabled={disabled}
            >
            {children}
            
        </button>
    );
};

const Card =({title, children, className=""}) => (
    <div className={`card ${className}`}>
        {title && <h2 className="card-title">{title}</h2>}
        {children}
    </div>
);

const Toast = ({ message, type, onClose }) => {
    const isError = type === 'error';
    const bgColorClass = isError ? 'toast-error' : 'toast-success';
    const title = isError ? 'Error' : 'Success';

    useEffect(() => {
    if (message) {
            const timer = setTimeout(onClose, 5000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div className="toast-container">
            <div className={`toast-message ${bgColorClass}`}>
                <div className="toast-header">
                    <p>{title}</p>
                    <p>{message}</p>
                </div>
                <button className="toast-close" onClick={onClose}></button>
            </div>
        </div>
    );
};

//Authentication Components
const AuthForm = ({ handleLogin, handleSignUp, showToast }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            handleLogin(email, password, showToast);
        } else {
            handleSignUp(name, email, password, showToast);
        }
    }

return (
    <div>
        <Card title={isLogin ? "Welcome back!" : "Create an Account"}>
            <form onSubmit={handleSubmit}>

            {/* Toggle between Login and Sign Up */}
            {!isLogin && (
                <Input
                    label="Full Name"
                    id="name"
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            )}
                {/* Email Input Field */}
                <Input
                    label="Email"
                    id="email"
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required    
                />

                {/* Password Input Field */}
                <Input
                    label="Password"
                    id="password"
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required    
                />

                {/* Submit Button */}
                <Button type="submit">
                    {isLogin ? (<> <LogIn/> Login </>) : (<> <UserPlus/> Sign Up </>)}
                </Button>
            </form>
            <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button type="button" onClick={() => setIsLogin(!isLogin)} className="link-button"> {isLogin ? 'Sign Up' : 'Login'}
                </button>
            </p>
        </Card>
    </div>
    );
};

const Dashboard = ({ user, uploadedImages, handleUpload, DeleteImages, setCurrentPage}) => {

    const FileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
    <div>
        <div className="db-header">
            <h1 className="db-title">
                Hello, {user.name}!
            </h1>

        <label>
        <Button variant="primary">
            <Upload size={18} />
            <span>Upload New Image</span>
        </Button>

        <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            style={{ display: 'none' }}
            />
        </label>
    </div>

    <Card title={`My Uploads (${uploadedImages.length})`}>
        {uploadedImages.length === 0 ? (
        <div style={{ textAlign: 'center', paddingBlock: '2.5rem', color: '#6b7280' }}>
            <Image size={48} style={{ display: 'block', margin: '0 auto 1rem' }} />
            <p>No images uploaded yet.</p>
            <p>Use the 'Upload New Image' button to get started.</p>
        </div>
        ) : (
            <div className="image-grid">
            {uploadedImages.map((image) => (
                <div key={image.id} className="image-item" style={{ position: 'relative' }}>
                <img
                    src={image.url}
                    alt={image.name}
                    className="image-item-img"
                    onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = `https://placehold.co/400x300/e5e7eb/4b5563?text=Error`;
                }}
                />
                <div className="image-item-info">
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} title={image.name}>
                    {image.name}
                </p>

                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    Size: {FileSize(image.size)}
                </p>

                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    Uploaded: {new Date(image.uploadedAt).toLocaleDateString()}
                </p>
                </div>

                <Button
                    variant="danger"
                    onClick={() => DeleteImage(image.id)}
                    className="delete-button"
                >
                <Trash2 size={16} />
                </Button>
                </div>
                ))}
            </div>
            )}
        </Card>
        </div>
    );
};

const App = () => {
    const [user, setUser] = useState(null);
    const [currentPage, setCurrentPage] = useState('login');
    const [uploadedImages, setUploadedImages] = useState([]);
    const [toast, setToast] = useState({ message: '', type: '' });

  // Load user data and images on initial load
    useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
        setUser(storedUser);
        setCurrentPage('dashboard');
        const userImages = JSON.parse(localStorage.getItem(`userImages_${storedUser.id}`) || '[]');
        setUploadedImages(userImages);
    }
}, []);

const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
}, []);

const handleToastClose = useCallback(() => {
    setToast({ message: '', type: '' });
}, []);

const getUsers = () => JSON.parse(localStorage.getItem('users') || '[]');

const handleSignUp = (email, password, name) => {
    const users = getUsers();
    if (users.find(u => u.email === email)) {
    showToast('Account with this email already exists.', 'error');
    return;
}

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
    showToast(`Welcome, ${name}! Your account is ready.`);
};

const handleLogin = (email, password) => {
    const users = getUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        setUser(foundUser);
        setCurrentPage('dashboard');
        const userImages = JSON.parse(localStorage.getItem(`userImages_${foundUser.id}`) || '[]');
        setUploadedImages(userImages);
        showToast(`Welcome back, ${foundUser.name}!`);
    } else {
        showToast('Invalid email or password.', 'error');
    }
};

const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setCurrentPage('login');
    setUploadedImages([]);
    showToast('You have been logged out.');
};

const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file && user) {
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
        showToast(`Image "${file.name}" uploaded successfully!`);
        };
        reader.readAsDataURL(file);
    }
};

    const DeleteImage = (imageId) => {
    const updatedImages = uploadedImages.filter(img => img.id !== imageId);
    setUploadedImages(updatedImages);
    localStorage.setItem(`userImages_${user.id}`, JSON.stringify(updatedImages));
    showToast('Image deleted.', 'error');
};


return (
    <>
    <div className="app-container">
        <header className="header">
            <div className="header-content">
            <h1 className="logo">
                <Image size={28} />
                <span>Memoires</span>
            </h1>
            {user ? (
            
            <div className="sm-block"> Welcome, {user.name}
                
                <Button 
                    variant="outline" 
                    onClick={() => setCurrentPage('dashboard')} 
                    style={{ fontSize: '0.875rem' }}
                >
                    <HomeIcon size={16} />
                    <span className="hidden sm-inline">Dashboard</span>
                </Button>
                
                <Button 
                    variant="ghost" 
                    onClick={handleLogout} 
                    style={{ fontSize: '0.875rem' }}
                >
                    <LogIn size={16} style={{ transform: 'rotate(180deg)' }} />
                    <span className="hidden sm-inline">Logout</span>
                </Button>
            </div>

            ) : (
            <Button 
                variant="outline" 
                onClick={() => setCurrentPage('login')} 
                style={{ fontSize: '0.875rem' }}
            >
                <LogIn size={16} />
                Login/Sign Up
                </Button>
            )}
            </div>
        </header>

        <main className="main-content">
        {!user ? (
            <AuthForm
                setCurrentPage={setCurrentPage}
                handleLogin={handleLogin}
                handleSignUp={handleSignUp}
                showToast={showToast}
            />
        ) : (
            <Dashboard
                user={user}
                uploadedImages={uploadedImages}
                handleUpload={handleUpload}
                DeleteImage={DeleteImage}
                setCurrentPage={setCurrentPage}
            />
            )}
        </main>
        
        <Toast message={toast.message} type={toast.type} onClose={handleToastClose} />
        </div>
    </>
    );
};

export default App;