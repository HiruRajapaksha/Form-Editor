import './App.css';
import { useState } from 'react';
import welcome from './Assets/welcome.webp';

// Comprehensive list of full-stack languages
const availableLanguages = [
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'SASS', 'Tailwind CSS',
  'Node.js', 'Express', 'PHP', 'Ruby', 'Python', 'Java', 'C#', 'Spring Boot', '.NET',
  'MySQL', 'MongoDB', 'PostgreSQL', 'SQLite',
  'Docker', 'Kubernetes', 'Jenkins', 'Git', 'AWS', 'Azure'
];

function App() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    gender: '', // No default gender selected
    languages: [],
    image: null,
  });

  const [errors, setErrors] = useState({ email: '', username: '', image: '', languages: '', gender: '' });
  const [languageInput, setLanguageInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const onChangeHandler = (event) => {
    if (event.target.name === 'image') {
      setFormData({ ...formData, image: event.target.files[0] });
    } else {
      setFormData({
        ...formData,
        [event.target.name]: event.target.value,
      });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    let newErrors = { email: '', username: '', image: '', languages: '', gender: '' };

    if (!formData.username) {
      newErrors.username = 'Username is required';
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.image) {
      newErrors.image = 'Image is required';
    }
    if (formData.languages.length === 0) {
      newErrors.languages = 'At least one language is required';
    }
    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }

    setErrors(newErrors);

    // Check if there are any errors
    if (newErrors.username || newErrors.email || newErrors.image || newErrors.languages || newErrors.gender) {
      return;
    }

    // Display alert for successful submission
    alert('Form successfully submitted!');

    // Reset form
    setFormData({
      username: '',
      email: '',
      gender: '', // Reset gender
      languages: [],
      image: null,
    });
    setLanguageInput('');
    setSuggestions([]);
    setShowForm(false); // Optional: reset to welcome screen
  };

  const handleWelcomeClick = () => {
    setShowForm(true);
  };

  const handleLanguageInputChange = (event) => {
    const input = event.target.value;
    setLanguageInput(input);

    // Split input by comma and trim spaces
    const languages = input.split(',').map(lang => lang.trim());

    if (languages.length > 0) {
      const lastInput = languages[languages.length - 1];
      if (lastInput.length === 0) {
        setSuggestions([]);
        return;
      }

      const filteredSuggestions = availableLanguages.filter(lang =>
        lang.toLowerCase().startsWith(lastInput.toLowerCase())
      );

      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (lang) => {
    // Prevent adding duplicate languages
    if (!formData.languages.includes(lang)) {
      // Add language to the formData
      const updatedLanguages = [...formData.languages, lang];
      setFormData(prev => ({
        ...prev,
        languages: updatedLanguages,
      }));
    }

    // Update the input field with the new language
    setLanguageInput(prev => {
      const languages = prev.split(',').slice(0, -1);
      return [...languages, lang].join(', ') + ', ';
    });
    setSuggestions([]);
  };

  const handleBlur = () => {
    setTimeout(() => setSuggestions([]), 100); // Close suggestions list after user clicks out
  };

  return (
    <div className="App">
      {!showForm ? (
        <div className="welcome-screen">
          <img src={welcome} alt="Welcome" className="welcome-image" />
          <h1>Welcome to Our Awesome Form!</h1>
          <p>We're excited to have you here. Please click the button below to fill out the form.</p>
          <button className="btn welcome-btn" onClick={handleWelcomeClick}>
            Proceed to Form
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmitHandler}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">User Name</label>
            <input
              className="form-control"
              name="username"
              onChange={onChangeHandler}
              value={formData.username}
              placeholder="Enter your username"
            />
            {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              className="form-control"
              name="email"
              onChange={onChangeHandler}
              value={formData.email}
              placeholder="Enter your email"
            />
            {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="gender" className="form-label">Gender</label>
            <div>
              <div>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  onChange={onChangeHandler}
                  checked={formData.gender === 'male'}
                />
                <label htmlFor="male">Male</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  onChange={onChangeHandler}
                  checked={formData.gender === 'female'}
                />
                <label htmlFor="female">Female</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  onChange={onChangeHandler}
                  checked={formData.gender === 'other'}
                />
                <label htmlFor="other">Other</label>
              </div>
            </div>
            {errors.gender && <p style={{ color: 'red' }}>{errors.gender}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="languages" className="form-label">Languages</label>
            <input
              type="text"
              className="form-control"
              value={languageInput}
              onChange={handleLanguageInputChange}
              onBlur={handleBlur}
              placeholder="Programming languages you're skilled in "
            />
            {errors.languages && <p style={{ color: 'red' }}>{errors.languages}</p>}
            {suggestions.length > 0 && (
              <ul className="suggestions">
                {suggestions.map((lang, index) => (
                  <li key={index} onClick={() => handleSuggestionClick(lang)}>
                    {lang}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="image" className="form-label">Upload your image</label>
            <input
              type="file"
              className="form-control"
              name="image"
              onChange={onChangeHandler}
            />
            {errors.image && <p style={{ color: 'red' }}>{errors.image}</p>}
          </div>
          <div className="form-group">
            <button className="btn" type="submit">Submit</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default App;
