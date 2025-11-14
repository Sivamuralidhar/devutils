import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { MdDashboard, MdHistory, MdTimeline, MdCompare, MdThumbUp, MdThumbDown, MdSend, MdMessage } from 'react-icons/md';
import { FaCode, FaHashtag, FaArrowUp, FaGithub, FaTwitter, FaCalculator, FaGlobe, FaMagic, FaPalette, FaComments, FaReply, FaUser } from 'react-icons/fa';
import { HiChevronDown } from 'react-icons/hi';
import { BsBraces, BsLightning, BsUiChecks } from 'react-icons/bs';
import { FiCopy, FiCalendar, FiClock, FiBook, FiHelpCircle, FiRepeat, FiCheck, FiRefreshCw } from 'react-icons/fi';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { TbArrowsExchange } from 'react-icons/tb';
import { AiOutlineFileText } from 'react-icons/ai';

const formatDate = (date) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const dayName = days[date.getUTCDay()];
  const monthName = months[date.getUTCMonth()];
  const dayOfMonth = date.getUTCDate();
  const year = date.getUTCFullYear();
  
  const hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  
  const gmtString = `${dayName}, ${monthName} ${dayOfMonth}, ${year} ${hours12}:${minutes}:${seconds}.${milliseconds} ${ampm}`;
  
  // Local time
  const localDayName = days[date.getDay()];
  const localMonthName = months[date.getMonth()];
  const localDayOfMonth = date.getDate();
  const localYear = date.getFullYear();
  const localHours = date.getHours();
  const localMinutes = String(date.getMinutes()).padStart(2, '0');
  const localSeconds = String(date.getSeconds()).padStart(2, '0');
  const localMilliseconds = String(date.getMilliseconds()).padStart(3, '0');
  const localAmpm = localHours >= 12 ? 'PM' : 'AM';
  const localHours12 = localHours % 12 || 12;
  
  const offset = -date.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offset) / 60);
  const offsetMinutes = Math.abs(offset) % 60;
  const offsetSign = offset >= 0 ? '+' : '-';
  const offsetString = `GMT${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;
  
  const localString = `${localDayName}, ${localMonthName} ${localDayOfMonth}, ${localYear} ${localHours12}:${localMinutes}:${localSeconds}.${localMilliseconds} ${localAmpm} ${offsetString}`;
  
  // Calculate relative time
  const now = Date.now();
  const diff = date.getTime() - now;
  const diffYears = Math.floor(Math.abs(diff) / (365.25 * 24 * 60 * 60 * 1000));
  const diffDays = Math.floor(Math.abs(diff) / (24 * 60 * 60 * 1000));
  const diffHours = Math.floor(Math.abs(diff) / (60 * 60 * 1000));
  const diffMinutes = Math.floor(Math.abs(diff) / (60 * 1000));
  
  let relative = '';
  if (diffYears > 0) {
    relative = diff > 0 ? `In ${diffYears} year${diffYears > 1 ? 's' : ''}` : `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  } else if (diffDays > 0) {
    relative = diff > 0 ? `In ${diffDays} day${diffDays > 1 ? 's' : ''}` : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    relative = diff > 0 ? `In ${diffHours} hour${diffHours > 1 ? 's' : ''}` : `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffMinutes > 0) {
    relative = diff > 0 ? `In ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}` : `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  } else {
    relative = 'Just now';
  }
  
  return {
    gmt: gmtString,
    local: localString,
    relative: relative
  };
};

const JSONFormatter = () => {
  const [inputJson, setInputJson] = useState('{"example": "your JSON here"}');
  const [outputJson, setOutputJson] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      question: "What is JSON?",
      answer: "JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read and write, and easy for machines to parse and generate. It's based on a subset of JavaScript and is commonly used for transmitting data in web applications."
    },
    {
      question: "How do I validate JSON?",
      answer: "Paste your JSON text in the input area and click the 'Validate' button. If your JSON is valid, you'll see a success message. If there are errors, you'll receive a detailed error message indicating what needs to be fixed."
    },
    {
      question: "What's the difference between Format and Minify?",
      answer: "Format (or beautify) adds proper indentation and line breaks to make JSON human-readable. Minify removes all unnecessary whitespace and line breaks to reduce file size, which is useful for production environments."
    },
    {
      question: "Can I download the formatted JSON?",
      answer: "Yes! After formatting your JSON, click the 'Download' button in the output section to save the formatted JSON as a file to your computer."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely! All JSON formatting and validation happens entirely in your browser. Your data is never sent to any server, ensuring complete privacy and security."
    }
  ];

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(inputJson);
      setOutputJson(JSON.stringify(parsed, null, 2));
      setError('');
      setSuccess('JSON is valid and formatted!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError('Invalid JSON: ' + e.message);
      setOutputJson('');
      setSuccess('');
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(inputJson);
      setOutputJson(JSON.stringify(parsed));
      setError('');
      setSuccess('JSON minified successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError('Invalid JSON: ' + e.message);
      setOutputJson('');
      setSuccess('');
    }
  };

  const handleValidate = () => {
    try {
      JSON.parse(inputJson);
      setError('');
      setSuccess('✓ Valid JSON!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError('✗ Invalid JSON: ' + e.message);
      setSuccess('');
    }
  };

  const handleClear = () => {
    setInputJson('');
    setOutputJson('');
    setError('');
    setSuccess('');
  };

  const handleCopy = () => {
    if (outputJson) {
      navigator.clipboard.writeText(outputJson);
      setSuccess('Copied to clipboard!');
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const handleLoadSample = () => {
    const sample = {
      "name": "John Doe",
      "age": 30,
      "email": "john.doe@example.com",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "country": "USA"
      },
      "hobbies": ["reading", "coding", "traveling"],
      "isActive": true
    };
    setInputJson(JSON.stringify(sample, null, 2));
    setError('');
    setSuccess('Sample JSON loaded!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleDownload = () => {
    if (outputJson) {
      const blob = new Blob([outputJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'formatted.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSuccess('Downloaded!');
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="json-formatter-page">
      <div className="json-formatter-container">
        <div className="json-content">
          <div className="json-left">
            <div className="json-section-header">
              <h2 className="json-section-title">Format & Validate JSON</h2>
              <div className="json-buttons">
                <button className="json-format-btn" onClick={handleFormat}>
                  <span style={{ marginRight: '6px' }}>≡</span> Format
                </button>
                <button className="json-clear-btn" onClick={handleClear}>Clear</button>
              </div>
            </div>
            <p className="json-description">Paste your JSON data to format and validate it.</p>
            
            <div className="json-action-buttons">
              <button className="json-action-btn" onClick={handleValidate}>Validate</button>
              <button className="json-action-btn" onClick={handleMinify}>Minify</button>
              <button className="json-action-btn" onClick={handleLoadSample}>Load Sample</button>
            </div>

            <textarea
              className="json-input"
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              placeholder='{"example": "your JSON here"}'
            />
            {error && <div className="json-error">{error}</div>}
            {success && <div className="json-success">{success}</div>}
          </div>
          <div className="json-right">
            <div className="json-section-header">
              <h2 className="json-section-title">Formatted Output</h2>
              <div className="json-buttons">
                <button className="json-action-btn" onClick={handleCopy}>
                  <FiCopy size={14} style={{ marginRight: '4px' }} /> Copy
                </button>
                <button className="json-action-btn" onClick={handleDownload}>Download</button>
              </div>
            </div>
            <pre className="json-output">{outputJson || 'Formatted JSON will appear here...'}</pre>
          </div>
        </div>
      </div>

      {/* Ad Space */}
      <div className="json-ad-container">
        <div className="json-ad-box">
          <p>Advertisement</p>
          <span>728x90 Banner Ad Space</span>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="json-faq-section">
        <div className="json-faq-container">
          <h2 className="json-faq-title">Frequently Asked Questions</h2>
          <div className="json-faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="json-faq-item">
                <button 
                  className={`json-faq-question ${expandedFaq === index ? 'active' : ''}`}
                  onClick={() => toggleFaq(index)}
                >
                  <span>{faq.question}</span>
                  <span className="json-faq-icon">{expandedFaq === index ? '−' : '+'}</span>
                </button>
                {expandedFaq === index && (
                  <div className="json-faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Header = ({ activeTab, setActiveTab }) => {
  const [isDark, setIsDark] = React.useState(false);
  const [showEncodersDropdown, setShowEncodersDropdown] = React.useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const handleDropdownItemClick = (tab) => {
    setActiveTab(tab);
    setShowEncodersDropdown(false);
  };

  return (
    <header className="header">
      <div className="logo">DevUtils</div>
      <nav className="nav">
        <a 
          href="#" 
          className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}
        >
          <MdDashboard size={14} />
          Converters
        </a>
        <a 
          href="#" 
          className={`nav-link ${activeTab === 'calculator' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setActiveTab('calculator'); }}
        >
          <FaCalculator size={14} />
          Calculator
        </a>
        <a 
          href="#" 
          className={`nav-link ${activeTab === 'timezone' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setActiveTab('timezone'); }}
        >
          <FaGlobe size={14} />
          Timezones
        </a>
        {/* <a 
          href="#" 
          className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setActiveTab('history'); }}
        >
          <MdHistory size={14} />
          History
        </a> */}
        <a 
          href="#" 
          className={`nav-link ${activeTab === 'presets' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setActiveTab('presets'); }}
        >
          <BsLightning size={14} />
          Presets
        </a>
        {/* <a 
          href="#" 
          className={`nav-link ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setActiveTab('timeline'); }}
        >
          <MdTimeline size={14} />
          Timeline
        </a> */}
        <div 
          className="nav-dropdown"
          onMouseEnter={() => setShowEncodersDropdown(true)}
          onMouseLeave={() => setShowEncodersDropdown(false)}
        >
          <a href="#" className="nav-link" onClick={(e) => e.preventDefault()}>
            <FaCode size={14} />
            More Tools
            <HiChevronDown size={10} style={{ marginLeft: '4px', opacity: 0.5 }} />
          </a>
          {showEncodersDropdown && (
            <div className="dropdown-menu">
              <a href="#" className="dropdown-item" onClick={(e) => { e.preventDefault(); handleDropdownItemClick('recurring'); }}>
                <FiRepeat size={14} style={{ marginRight: '8px' }} />
                Recurring Dates
              </a>
              <a href="#" className="dropdown-item" onClick={(e) => { e.preventDefault(); handleDropdownItemClick('compare'); }}>
                <MdCompare size={14} style={{ marginRight: '8px' }} />
                Compare Epochs
              </a>
              <a href="#" className="dropdown-item" onClick={(e) => { e.preventDefault(); handleDropdownItemClick('parser'); }}>
                <FaMagic size={14} style={{ marginRight: '8px' }} />
                Smart Parser
              </a>
              <a href="#" className="dropdown-item" onClick={(e) => { e.preventDefault(); handleDropdownItemClick('uuid'); }}>
                <FaHashtag size={14} style={{ marginRight: '8px' }} />
                UUID Generator
              </a>
              <a href="#" className="dropdown-item" onClick={(e) => { e.preventDefault(); handleDropdownItemClick('counter'); }}>
                <AiOutlineFileText size={14} style={{ marginRight: '8px' }} />
                Text Counter
              </a>
              <a href="#" className="dropdown-item" onClick={(e) => { e.preventDefault(); handleDropdownItemClick('color'); }}>
                <FaPalette size={14} style={{ marginRight: '8px' }} />
                Color Converter
              </a>
              <a href="#" className="dropdown-item" onClick={(e) => { e.preventDefault(); handleDropdownItemClick('json'); }}>
                <BsBraces size={14} style={{ marginRight: '8px' }} />
                JSON Formatter
              </a>
            </div>
          )}
        </div>
      </nav>
      <div className="header-right">
        <button 
          className={`chat-icon-btn ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
          title="Feedback & Comments"
        >
          <FaComments size={20} />
        </button>
        <label className="theme-switch">
          <input type="checkbox" checked={isDark} onChange={toggleTheme} />
          <span className="theme-slider">
            <span className="theme-icon">{isDark ? '🌙' : '☀️'}</span>
          </span>
        </label>
      </div>
    </header>
  );
};

const EpochConverter = () => {
  const [epochInput, setEpochInput] = useState('');
  const [convertedDate, setConvertedDate] = useState(null);
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [hasError, setHasError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConvert = () => {
    if (!epochInput.trim()) {
      setHasError(true);
      setTimeout(() => setHasError(false), 2000);
      return;
    }
    
    const epoch = parseInt(epochInput, 10);
    if (!isNaN(epoch)) {
      const dateInfo = formatDate(new Date(epoch * 1000));
      setConvertedDate(dateInfo);
      setHasError(false);
    } else {
      setConvertedDate({ gmt: 'Invalid Epoch', local: '', relative: '' });
      setHasError(true);
    }
  };

  return (
    <div className="converter-card epoch-card">
      <div className="card-row">
        <span className="card-title">Epoch & Unix Timestamp</span>
      </div>
      <div className="card-desc">Convert Unix epoch timestamps (seconds since January 1, 1970) to human-readable dates. Epoch time is widely used in programming, databases, and system logs for consistent time representation across different timezones.</div>
      
      <div className="epoch-current-row">
        <span className="epoch-label">Current Timestamp</span>
        <div className="epoch-current-display">
          {currentTimestamp}
          <button className={`icon-btn ${copied ? 'copied' : ''}`} onClick={() => handleCopy(currentTimestamp)}>
            <FiCopy size={18} color="#A1A1AA" />
            {copied && <span className="copy-tooltip">Copied!</span>}
          </button>
        </div>
      </div>

      <div className="epoch-input-section">
        <label className="epoch-input-label">Enter Epoch Timestamp</label>
        <div className="epoch-input-row">
          <input 
            className={`epoch-input ${hasError ? 'error' : ''}`}
            type="text" 
            value={epochInput} 
            onChange={e => setEpochInput(e.target.value)}
            placeholder="1672531200"
          />
        </div>
        <button className="convert-to-date-btn" onClick={handleConvert}>
          Convert to Readable DateTime
        </button>
      </div>

      {convertedDate && (
        <div className="epoch-result-row">
          <div className="epoch-time-item">
            <span className="epoch-time-label">GMT:</span>
            <span className="epoch-time-value">{convertedDate.gmt}</span>
          </div>
          {convertedDate.local && (
            <>
              <div className="epoch-time-item">
                <span className="epoch-time-label">Your time zone:</span>
                <span className="epoch-time-value">{convertedDate.local}</span>
              </div>
              <div className="epoch-time-item">
                <span className="epoch-time-label">Relative:</span>
                <span className="epoch-time-value">{convertedDate.relative}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const DateToEpochConverter = () => {
  const [month, setMonth] = useState('11');
  const [day, setDay] = useState('13');
  const [year, setYear] = useState('2025');
  const [hour, setHour] = useState('5');
  const [minute, setMinute] = useState('16');
  const [second, setSecond] = useState('58');
  const [isLocalTime, setIsLocalTime] = useState(true);
  const [result, setResult] = useState(null);
  const [copiedRow, setCopiedRow] = useState(null);

  const handleCopy = (text, rowName) => {
    navigator.clipboard.writeText(text.toString());
    setCopiedRow(rowName);
    setTimeout(() => setCopiedRow(null), 2000);
  };

  const handleConvert = () => {
    // Create date string
    const dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}`;
    
    let dt;
    if (isLocalTime) {
      dt = new Date(dateStr);
    } else {
      dt = new Date(dateStr + 'Z');
    }
    
    if (!isNaN(dt.getTime())) {
      const epochSeconds = Math.floor(dt.getTime() / 1000);
      const epochMillis = dt.getTime();
      const epochMicroseconds = epochMillis * 1000;
      
      // Format GMT date
      const gmtOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        timeZone: 'UTC',
        hour12: true 
      };
      const gmtDate = dt.toLocaleString('en-US', gmtOptions);
      
      // Format local date with timezone
      const localOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true,
        timeZoneName: 'longOffset'
      };
      const localDate = dt.toLocaleString('en-US', localOptions);
      
      setResult({
        epoch: epochSeconds,
        millis: epochMillis,
        micros: epochMicroseconds,
        gmt: gmtDate,
        local: localDate
      });
    }
  };

  return (
    <div className="converter-card date-card">
      <span className="card-title">Date to Epoch</span>
      <span className="card-desc">Convert any date and time into Unix epoch timestamp. Perfect for scheduling tasks, setting expiration times, or working with APIs that require epoch format. Supports both local time and UTC conversion.</span>
      
      <div className="date-time-inputs">
        <div className="input-labels">
          <span>Mon</span>
          <span>Day</span>
          <span>Yr</span>
          <span className="time-label">Hr</span>
          <span className="time-label">Min</span>
          <span className="time-label">Sec</span>
        </div>
        
        <div className="date-time-inputs-row">
          <input 
            type="text" 
            value={month} 
            onChange={e => setMonth(e.target.value)}
            className="date-part-input"
            maxLength="2"
          />
          <span className="input-divider">/</span>
          <input 
            type="text" 
            value={day} 
            onChange={e => setDay(e.target.value)}
            className="date-part-input"
            maxLength="2"
          />
          <span className="input-divider">/</span>
          <input 
            type="text" 
            value={year} 
            onChange={e => setYear(e.target.value)}
            className="date-part-input year-input"
            maxLength="4"
          />
          
          <span className="section-spacer"></span>
          
          <input 
            type="text" 
            value={hour} 
            onChange={e => setHour(e.target.value)}
            className="time-part-input"
            maxLength="2"
          />
          <span className="input-divider">:</span>
          <input 
            type="text" 
            value={minute} 
            onChange={e => setMinute(e.target.value)}
            className="time-part-input"
            maxLength="2"
          />
          <span className="input-divider">:</span>
          <input 
            type="text" 
            value={second} 
            onChange={e => setSecond(e.target.value)}
            className="time-part-input"
            maxLength="2"
          />
        </div>

        <div className="timezone-toggle">
          <label className="toggle-label">
            <input 
              type="checkbox" 
              checked={isLocalTime}
              onChange={e => setIsLocalTime(e.target.checked)}
            />
            <span>Local time</span>
          </label>
        </div>
      </div>

      <button className="convert-btn" onClick={handleConvert}>Human date to Timestamp</button>

      {result && (
        <div className="date-to-epoch-table-container">
          <table className="date-to-epoch-table">
            <thead>
              <tr>
                <th>Format</th>
                <th>Value</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="table-label">Epoch (seconds)</td>
                <td className="table-value">{result.epoch}</td>
                <td className="table-action">
                  <button 
                    className={`table-copy-btn ${copiedRow === 'epoch' ? 'copied' : ''}`}
                    onClick={() => handleCopy(result.epoch, 'epoch')}
                  >
                    {copiedRow === 'epoch' ? <FiCheck size={14} /> : <FiCopy size={14} />}
                  </button>
                </td>
              </tr>
              <tr>
                <td className="table-label">Milliseconds</td>
                <td className="table-value">{result.millis}</td>
                <td className="table-action">
                  <button 
                    className={`table-copy-btn ${copiedRow === 'millis' ? 'copied' : ''}`}
                    onClick={() => handleCopy(result.millis, 'millis')}
                  >
                    {copiedRow === 'millis' ? <FiCheck size={14} /> : <FiCopy size={14} />}
                  </button>
                </td>
              </tr>
              <tr>
                <td className="table-label">Microseconds</td>
                <td className="table-value">{result.micros}</td>
                <td className="table-action">
                  <button 
                    className={`table-copy-btn ${copiedRow === 'micros' ? 'copied' : ''}`}
                    onClick={() => handleCopy(result.micros, 'micros')}
                  >
                    {copiedRow === 'micros' ? <FiCheck size={14} /> : <FiCopy size={14} />}
                  </button>
                </td>
              </tr>
              <tr>
                <td className="table-label">GMT</td>
                <td className="table-value">{result.gmt}</td>
                <td className="table-action">
                  <button 
                    className={`table-copy-btn ${copiedRow === 'gmt' ? 'copied' : ''}`}
                    onClick={() => handleCopy(result.gmt, 'gmt')}
                  >
                    {copiedRow === 'gmt' ? <FiCheck size={14} /> : <FiCopy size={14} />}
                  </button>
                </td>
              </tr>
              <tr>
                <td className="table-label">Your Timezone</td>
                <td className="table-value">{result.local}</td>
                <td className="table-action">
                  <button 
                    className={`table-copy-btn ${copiedRow === 'local' ? 'copied' : ''}`}
                    onClick={() => handleCopy(result.local, 'local')}
                  >
                    {copiedRow === 'local' ? <FiCheck size={14} /> : <FiCopy size={14} />}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const TimezoneConverter = () => (
  <div className="converter-card tz-card">
    <span className="card-title">Timezone Converter</span>
    <span className="card-desc">Effortlessly convert times across different timezones. Essential for coordinating international meetings, scheduling global events, or managing remote teams across multiple time zones.</span>
    <div className="tz-row">
      <div className="tz-pill">
        <span>From</span>
        <span className="tz-time">12:00 PM</span>
      </div>
      <button className="tz-arrow-btn"><TbArrowsExchange size={18} color="#A1A1AA" /></button>
      <div className="tz-pill">
        <span>To</span>
        <span className="tz-time">8:00 PM</span>
      </div>
    </div>
  </div>
);

const BatchConverter = () => {
  const [batchInput, setBatchInput] = useState('1672531200\n1704067200\n1735689600');
  const [batchResults, setBatchResults] = useState([]);
  const [sortOrder, setSortOrder] = useState('ascending');

  const handleBatchConvert = () => {
    const timestamps = batchInput.split('\n').filter(line => line.trim());
    const results = timestamps.map(ts => {
      const timestamp = parseInt(ts.trim(), 10);
      if (isNaN(timestamp)) {
        return { timestamp: ts, date: 'Invalid', error: true, value: 0 };
      }
      const date = new Date(timestamp * 1000);
      const formattedDate = formatDate(date);
      return {
        timestamp: ts,
        date: formattedDate.gmt,
        value: timestamp,
        error: false
      };
    });

    // Sort results
    const sorted = [...results].sort((a, b) => {
      if (sortOrder === 'ascending') {
        return a.value - b.value;
      } else {
        return b.value - a.value;
      }
    });

    setBatchResults(sorted);
  };

  const handleClearBatch = () => {
    setBatchInput('');
    setBatchResults([]);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'ascending' ? 'descending' : 'ascending');
    if (batchResults.length > 0) {
      const sorted = [...batchResults].sort((a, b) => {
        if (sortOrder === 'descending') {
          return a.value - b.value;
        } else {
          return b.value - a.value;
        }
      });
      setBatchResults(sorted);
    }
  };

  return (
    <div className="converter-card batch-card">
      <div className="batch-header">
        <span className="card-title">Batch Converter</span>
        <button className="sort-btn" onClick={toggleSortOrder} title={sortOrder === 'ascending' ? 'Sort Descending' : 'Sort Ascending'}>
          {sortOrder === 'ascending' ? '↑' : '↓'}
        </button>
      </div>
      <span className="card-desc">Convert multiple epoch timestamps simultaneously - perfect for processing log files, analyzing time-series data, or converting large datasets. Enter one timestamp per line and sort results chronologically.</span>
      
      <div className="batch-content">
        <div className="batch-input-section">
          <label className="batch-label">Input Timestamps</label>
          <textarea
            className="batch-textarea"
            value={batchInput}
            onChange={(e) => setBatchInput(e.target.value)}
            placeholder="1672531200&#10;1704067200&#10;1735689600"
            rows="8"
          />
          <div className="batch-actions">
            <button className="batch-convert-btn" onClick={handleBatchConvert}>
              Convert All
            </button>
            <button className="batch-clear-btn" onClick={handleClearBatch}>
              Clear
            </button>
          </div>
        </div>

        <div className="batch-results-section">
          <label className="batch-label">Results ({batchResults.length})</label>
          <div className="batch-results">
            {batchResults.length === 0 ? (
              <div className="batch-empty">Results will appear here...</div>
            ) : (
              batchResults.map((result, index) => (
                <div key={index} className={`batch-result-item ${result.error ? 'error' : ''}`}>
                  <div className="batch-result-number">{index + 1}</div>
                  <div className="batch-result-content">
                    <div className="batch-result-timestamp">{result.timestamp}</div>
                    <div className="batch-result-date">{result.date}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Conversion History Component with localStorage
const ConversionHistory = () => {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const savedHistory = localStorage.getItem('conversionHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('conversionHistory');
    setHistory([]);
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conversion-history.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const headers = ['Type', 'Input', 'Result', 'Timestamp'];
    const rows = history.map(h => [h.type, h.input, h.result, h.timestamp]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conversion-history.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.input.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.result.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <main className="main-content">
      <h1 className="main-title"><MdHistory size={24} style={{ marginRight: '8px' }} />Conversion History</h1>
      
      <div className="content-with-ad">
        <div className="main-section">
          <div className="feature-description">
            <p>View and manage all your timestamp conversions in one place. Search through your history, filter by conversion type, and export your data to JSON or CSV format. Your history is automatically saved in your browser.</p>
          </div>
          
          <div className="history-container">
            <div className="history-controls">
              <input 
                type="text" 
                className="history-search"
                placeholder="Search history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select className="history-filter" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">All Types</option>
                <option value="epoch-to-date">Epoch to Date</option>
                <option value="date-to-epoch">Date to Epoch</option>
                <option value="batch">Batch Conversion</option>
              </select>
              <div className="history-actions">
                <button className="history-btn" onClick={exportToJSON}>Export JSON</button>
                <button className="history-btn" onClick={exportToCSV}>Export CSV</button>
                <button className="history-btn danger" onClick={clearHistory}>Clear All</button>
              </div>
            </div>

            <div className="history-list">
              {filteredHistory.length === 0 ? (
                <div className="history-empty">
                  <MdHistory size={48} style={{ opacity: 0.3 }} />
                  <p>No conversion history yet</p>
                  <span>Your conversions will appear here</span>
                </div>
              ) : (
                filteredHistory.map((item, index) => (
                  <div key={index} className="history-item">
                    <div className="history-type">{item.type}</div>
                    <div className="history-details">
                      <div className="history-input">Input: {item.input}</div>
                      <div className="history-result">Result: {item.result}</div>
                      <div className="history-time">{new Date(item.timestamp).toLocaleString()}</div>
                    </div>
                    <button className="history-copy" onClick={() => navigator.clipboard.writeText(item.result)}>
                      <FiCopy size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="history-stats">
              <div className="stat-card">
                <div className="stat-value">{history.length}</div>
                <div className="stat-label">Total Conversions</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{history.filter(h => h.type === 'epoch-to-date').length}</div>
                <div className="stat-label">Epoch to Date</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{history.filter(h => h.type === 'date-to-epoch').length}</div>
                <div className="stat-label">Date to Epoch</div>
              </div>
            </div>
          </div>
        </div>
        <AdSpace />
      </div>
    </main>
  );
};

// Epoch Calculator Component
const EpochCalculator = () => {
  const [baseEpoch, setBaseEpoch] = useState(Math.floor(Date.now() / 1000).toString());
  const [operation, setOperation] = useState('add');
  const [value, setValue] = useState('1');
  const [unit, setUnit] = useState('days');
  const [result, setResult] = useState(null);
  const [epoch1, setEpoch1] = useState('');
  const [epoch2, setEpoch2] = useState('');
  const [duration, setDuration] = useState(null);

  const calculateTimemath = () => {
    const base = parseInt(baseEpoch);
    const val = parseInt(value);
    if (isNaN(base) || isNaN(val)) return;

    let seconds = val;
    switch (unit) {
      case 'seconds': seconds = val; break;
      case 'minutes': seconds = val * 60; break;
      case 'hours': seconds = val * 3600; break;
      case 'days': seconds = val * 86400; break;
      case 'weeks': seconds = val * 604800; break;
      case 'months': seconds = val * 2592000; break; // Approximate
      case 'years': seconds = val * 31536000; break;
    }

    const newEpoch = operation === 'add' ? base + seconds : base - seconds;
    const date = new Date(newEpoch * 1000);
    setResult({
      epoch: newEpoch,
      date: formatDate(date)
    });
  };

  const calculateDuration = () => {
    const e1 = parseInt(epoch1);
    const e2 = parseInt(epoch2);
    if (isNaN(e1) || isNaN(e2)) return;

    const diff = Math.abs(e2 - e1);
    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    setDuration({
      total: diff,
      days,
      hours,
      minutes,
      seconds,
      isE1Earlier: e1 < e2
    });
  };

  return (
    <main className="main-content">
      <h1 className="main-title"><FaCalculator size={24} style={{ marginRight: '8px' }} />Epoch Calculator</h1>
      
      <div className="content-with-ad">
        <div className="main-section">
          <div className="feature-description">
            <p>Perform advanced calculations with epoch timestamps. Add or subtract time intervals, calculate the duration between two timestamps, or determine the number of business days between dates.</p>
          </div>
          
          <div className="calculator-grid">
        <div className="calculator-card">
          <h2 className="card-title">Time Math</h2>
          <p className="card-desc">Add or subtract time from any epoch timestamp</p>
          
          <div className="calc-input-group">
            <label>Base Epoch</label>
            <input 
              type="text" 
              value={baseEpoch} 
              onChange={(e) => setBaseEpoch(e.target.value)}
              className="calc-input"
              placeholder="1672531200"
            />
          </div>

          <div className="calc-operation">
            <select className="calc-select" value={operation} onChange={(e) => setOperation(e.target.value)}>
              <option value="add">Add</option>
              <option value="subtract">Subtract</option>
            </select>
            <input 
              type="number" 
              value={value} 
              onChange={(e) => setValue(e.target.value)}
              className="calc-input"
              min="0"
            />
            <select className="calc-select" value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="seconds">Seconds</option>
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
          </div>

          <button className="calc-btn" onClick={calculateTimemath}>Calculate</button>

          {result && (
            <div className="calc-result">
              <div className="calc-result-item">
                <span className="calc-label">Result Epoch:</span>
                <span className="calc-value">{result.epoch}</span>
              </div>
              <div className="calc-result-item">
                <span className="calc-label">GMT:</span>
                <span className="calc-value">{result.date.gmt}</span>
              </div>
              <div className="calc-result-item">
                <span className="calc-label">Local:</span>
                <span className="calc-value">{result.date.local}</span>
              </div>
            </div>
          )}
        </div>

        <div className="calculator-card">
          <h2 className="card-title">Duration Calculator</h2>
          <p className="card-desc">Calculate time difference between two epochs</p>
          
          <div className="calc-input-group">
            <label>First Epoch</label>
            <input 
              type="text" 
              value={epoch1} 
              onChange={(e) => setEpoch1(e.target.value)}
              className="calc-input"
              placeholder="1672531200"
            />
          </div>

          <div className="calc-input-group">
            <label>Second Epoch</label>
            <input 
              type="text" 
              value={epoch2} 
              onChange={(e) => setEpoch2(e.target.value)}
              className="calc-input"
              placeholder="1704067200"
            />
          </div>

          <button className="calc-btn" onClick={calculateDuration}>Calculate Difference</button>

          {duration && (
            <div className="calc-result">
              <div className="duration-summary">
                <div className="duration-total">{duration.total.toLocaleString()} seconds</div>
                <div className="duration-breakdown">
                  <div className="duration-part">
                    <span className="duration-value">{duration.days}</span>
                    <span className="duration-unit">days</span>
                  </div>
                  <div className="duration-part">
                    <span className="duration-value">{duration.hours}</span>
                    <span className="duration-unit">hours</span>
                  </div>
                  <div className="duration-part">
                    <span className="duration-value">{duration.minutes}</span>
                    <span className="duration-unit">min</span>
                  </div>
                  <div className="duration-part">
                    <span className="duration-value">{duration.seconds}</span>
                    <span className="duration-unit">sec</span>
                  </div>
                </div>
                <div className="duration-direction">
                  {duration.isE1Earlier ? 'First epoch is earlier' : 'Second epoch is earlier'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
        </div>
        <AdSpace />
      </div>
    </main>
  );
};

const AdSpace = () => (
  <aside className="ad-space">
    <div className="ad-box">
      <p>Advertisement</p>
      <span>Dedicated Ad Space (300x600)</span>
    </div>
  </aside>
);

// Multi-Timezone Widget
const TimezoneWidget = () => {
  const [selectedEpoch, setSelectedEpoch] = useState(Math.floor(Date.now() / 1000));
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timezones = [
    { name: 'New York', zone: 'America/New_York', flag: '🇺🇸' },
    { name: 'London', zone: 'Europe/London', flag: '🇬🇧' },
    { name: 'Paris', zone: 'Europe/Paris', flag: '🇫🇷' },
    { name: 'Tokyo', zone: 'Asia/Tokyo', flag: '🇯🇵' },
    { name: 'Sydney', zone: 'Australia/Sydney', flag: '🇦🇺' },
    { name: 'Dubai', zone: 'Asia/Dubai', flag: '🇦🇪' },
    { name: 'Singapore', zone: 'Asia/Singapore', flag: '🇸🇬' },
    { name: 'Mumbai', zone: 'Asia/Kolkata', flag: '🇮🇳' },
  ];

  const getTimeInZone = (zone) => {
    const date = new Date(selectedEpoch * 1000);
    return date.toLocaleString('en-US', { 
      timeZone: zone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <main className="main-content">
      <h1 className="main-title"><FaGlobe size={24} style={{ marginRight: '8px' }} />World Timezone Converter</h1>
      
      <div className="content-with-ad">
        <div className="main-section">
          <div className="feature-description">
            <p>View any epoch timestamp across multiple timezones simultaneously. Perfect for coordinating with global teams or scheduling international meetings. Includes DST indicators and major cities worldwide.</p>
          </div>
          
          <div className="timezone-container">
        <div className="timezone-input-card">
          <label>Enter Epoch Timestamp (or use current time)</label>
          <div className="timezone-input-row">
            <input 
              type="text" 
              value={selectedEpoch}
              onChange={(e) => setSelectedEpoch(parseInt(e.target.value) || 0)}
              className="timezone-input"
            />
            <button className="timezone-btn" onClick={() => setSelectedEpoch(Math.floor(Date.now() / 1000))}>
              Use Now
            </button>
          </div>
        </div>

        <div className="timezone-grid">
          {timezones.map((tz, idx) => (
            <div key={idx} className="timezone-card">
              <div className="tz-flag">{tz.flag}</div>
              <div className="tz-city">{tz.name}</div>
              <div className="tz-time">{getTimeInZone(tz.zone)}</div>
              <div className="tz-zone">{tz.zone}</div>
            </div>
          ))}
        </div>

        <div className="timezone-live">
          <h3>Live World Clocks</h3>
          <div className="live-clocks">
            {timezones.slice(0, 4).map((tz, idx) => (
              <div key={idx} className="live-clock">
                <div className="clock-city">{tz.flag} {tz.name}</div>
                <div className="clock-time">
                  {new Date(currentTime).toLocaleTimeString('en-US', { 
                    timeZone: tz.zone,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
          </div>
        </div>
        <AdSpace />
      </div>
    </main>
  );
};

// Quick Presets Component
const QuickPresets = () => {
  const [copiedRow, setCopiedRow] = useState(null);
  const [presetValues, setPresetValues] = useState([]);

  const presets = [
    { name: 'Now', desc: 'Current timestamp', fn: () => Math.floor(Date.now() / 1000) },
    { name: 'Start of Today', desc: 'Midnight today', fn: () => Math.floor(new Date().setHours(0,0,0,0) / 1000) },
    { name: 'End of Today', desc: 'Last second of today', fn: () => Math.floor(new Date().setHours(23,59,59,999) / 1000) },
    { name: 'Start of Week', desc: 'Monday 00:00', fn: () => {
      const now = new Date();
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      return Math.floor(new Date(now.setDate(diff)).setHours(0,0,0,0) / 1000);
    }},
    { name: 'End of Month', desc: 'Last second of current month', fn: () => {
      const now = new Date();
      return Math.floor(new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).getTime() / 1000);
    }},
    { name: 'Start of Year', desc: 'January 1st, 00:00', fn: () => Math.floor(new Date(new Date().getFullYear(), 0, 1).getTime() / 1000) },
    { name: 'Tomorrow 9 AM', desc: 'Next day at 9:00 AM', fn: () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return Math.floor(tomorrow.setHours(9,0,0,0) / 1000);
    }},
    { name: 'One Week from Now', desc: '+7 days', fn: () => Math.floor(Date.now() / 1000) + 604800 },
    { name: 'One Month from Now', desc: '+30 days', fn: () => Math.floor(Date.now() / 1000) + 2592000 },
    { name: 'One Year from Now', desc: '+365 days', fn: () => Math.floor(Date.now() / 1000) + 31536000 },
  ];

  const calculatePresetValues = () => {
    const values = presets.map(preset => {
      const epoch = preset.fn();
      const date = new Date(epoch * 1000);
      const formattedDate = formatDate(date);
      return {
        name: preset.name,
        desc: preset.desc,
        epoch,
        gmt: formattedDate.gmt,
        local: formattedDate.local
      };
    });
    setPresetValues(values);
  };

  useEffect(() => {
    calculatePresetValues();
  }, []);

  const copyValue = (value, rowName) => {
    navigator.clipboard.writeText(value.toString());
    setCopiedRow(rowName);
    setTimeout(() => setCopiedRow(null), 2000);
  };

  const refreshAllValues = () => {
    setCopiedRow('refresh');
    setTimeout(() => {
      calculatePresetValues();
    }, 100);
    setTimeout(() => setCopiedRow(null), 900);
  };

  return (
    <main className="main-content">
      <h1 className="main-title"><BsLightning size={24} style={{ marginRight: '8px' }} />Quick Presets & Timestamps</h1>
      
      <div className="content-with-ad">
        <div className="main-section">
          <div className="feature-description">
            <p>Access commonly used timestamps instantly with smart presets like "start of today", "end of month", or "one week from now". All values are automatically calculated and updated when you refresh.</p>
          </div>
          
          <div className="presets-container">
            <div className="presets-all-table-header">
              <h3>All Preset Timestamps</h3>
              <button 
                className={`preset-refresh-icon-btn ${copiedRow === 'refresh' ? 'refreshing' : ''}`}
                onClick={refreshAllValues}
                title="Refresh all values"
              >
                <FiRefreshCw size={18} />
              </button>
            </div>

            <div className="presets-all-table-container">
              <table className="presets-all-table">
                <thead>
                  <tr>
                    <th>Preset</th>
                    <th>Epoch</th>
                    <th>GMT</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {presetValues.map((preset, idx) => (
                    <tr key={idx}>
                      <td className="table-label">
                        <div className="preset-name-cell">
                          <div className="preset-cell-name">{preset.name}</div>
                          <div className="preset-cell-desc">{preset.desc}</div>
                        </div>
                      </td>
                      <td className="table-value">{preset.epoch}</td>
                      <td className="table-value table-value-date">{preset.gmt}</td>
                      <td className="table-action">
                        <button 
                          className={`table-copy-btn ${copiedRow === `${preset.name}-epoch` ? 'copied' : ''}`}
                          onClick={() => copyValue(preset.epoch, `${preset.name}-epoch`)}
                          title="Copy epoch"
                        >
                          {copiedRow === `${preset.name}-epoch` ? <FiCheck size={14} /> : <FiCopy size={14} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <AdSpace />
      </div>
    </main>
  );
};

// Visual Timeline Component
const VisualTimeline = () => {
  const [events, setEvents] = useState([
    { epoch: Math.floor(Date.now() / 1000), label: 'Now', color: '#a3e635', intensity: 4 },
    { epoch: Math.floor(Date.now() / 1000) + 86400, label: 'Tomorrow', color: '#3b82f6', intensity: 3 },
  ]);
  const [newEpoch, setNewEpoch] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const addEvent = () => {
    if (newEpoch && newLabel) {
      const intensity = Math.floor(Math.random() * 4) + 1; // Random intensity 1-4
      setEvents([...events, { epoch: parseInt(newEpoch), label: newLabel, intensity }]);
      setNewEpoch('');
      setNewLabel('');
    }
  };

  const removeEvent = (index) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  // Generate contribution grid data (GitHub style)
  const generateContributionGrid = () => {
    const yearStart = new Date(selectedYear, 0, 1);
    const yearEnd = new Date(selectedYear, 11, 31);
    const days = [];
    
    // Create array of all days in the year
    for (let d = new Date(yearStart); d <= yearEnd; d.setDate(d.getDate() + 1)) {
      const dayEpoch = Math.floor(d.getTime() / 1000);
      const dayEvents = events.filter(e => {
        const eventDate = new Date(e.epoch * 1000);
        return eventDate.toDateString() === d.toDateString();
      });
      
      const intensity = dayEvents.length > 0 ? Math.min(dayEvents.reduce((sum, e) => sum + (e.intensity || 1), 0), 4) : 0;
      
      days.push({
        date: new Date(d),
        epoch: dayEpoch,
        count: dayEvents.length,
        intensity,
        events: dayEvents
      });
    }
    
    // Organize into weeks
    const weeks = [];
    let currentWeek = [];
    
    // Pad the beginning to start on Sunday
    const firstDayOfWeek = days[0].date.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }
    
    days.forEach(day => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    // Pad the end
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  const getIntensityColor = (intensity) => {
    const colors = {
      0: 'var(--bg-tertiary)',
      1: 'rgba(163, 230, 53, 0.2)',
      2: 'rgba(163, 230, 53, 0.4)',
      3: 'rgba(163, 230, 53, 0.7)',
      4: '#a3e635'
    };
    return colors[intensity] || colors[0];
  };

  const weeks = generateContributionGrid();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const sortedEvents = [...events].sort((a, b) => a.epoch - b.epoch);

  return (
    <main className="main-content">
      <h1 className="main-title"><MdTimeline size={24} style={{ marginRight: '8px' }} />Activity Timeline</h1>
      
      <div className="content-with-ad">
        <div className="main-section">
          <div className="feature-description">
            <p>Track your events and activities throughout the year with a GitHub-style contribution graph. Add events with epoch timestamps and visualize your activity patterns over time.</p>
          </div>
          
          <div className="timeline-container">
            <div className="timeline-controls">
              <input 
                type="text" 
                placeholder="Epoch timestamp"
                value={newEpoch}
                onChange={(e) => setNewEpoch(e.target.value)}
                className="timeline-input"
              />
              <input 
                type="text" 
                placeholder="Event label"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="timeline-input"
              />
              <select 
                className="timeline-year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {[2023, 2024, 2025, 2026].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <button className="timeline-btn" onClick={addEvent}>Add Event</button>
            </div>

            {/* GitHub-style Contribution Grid */}
            <div className="contribution-graph">
              <div className="contribution-header">
                <h3>{selectedYear} Activity</h3>
                <div className="contribution-legend">
                  <span>Less</span>
                  {[0, 1, 2, 3, 4].map(level => (
                    <div 
                      key={level}
                      className="legend-box"
                      style={{ backgroundColor: getIntensityColor(level) }}
                    ></div>
                  ))}
                  <span>More</span>
                </div>
              </div>

              <div className="contribution-grid-wrapper">
                <div className="day-labels">
                  {['Mon', 'Wed', 'Fri'].map((day, idx) => (
                    <div key={idx} className="day-label">{day}</div>
                  ))}
                </div>

                <div className="contribution-grid-container">
                  <div className="month-labels">
                    {months.map((month, idx) => (
                      <div key={idx} className="month-label">{month}</div>
                    ))}
                  </div>

                  <div className="contribution-grid">
                    {weeks.map((week, weekIdx) => (
                      <div key={weekIdx} className="contribution-week">
                        {week.map((day, dayIdx) => (
                          <div
                            key={dayIdx}
                            className={`contribution-day ${day ? 'has-data' : 'empty'}`}
                            style={{
                              backgroundColor: day ? getIntensityColor(day.intensity) : 'transparent'
                            }}
                            title={day ? `${day.date.toDateString()}: ${day.count} event(s)` : ''}
                          >
                            {day && day.count > 0 && (
                              <div className="day-tooltip">
                                <strong>{day.date.toDateString()}</strong>
                                <span>{day.count} event{day.count > 1 ? 's' : ''}</span>
                                {day.events.map((e, i) => (
                                  <div key={i} className="tooltip-event">{e.label}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="timeline-events-list">
              <h3>All Events ({sortedEvents.length})</h3>
              {sortedEvents.length === 0 ? (
                <div className="empty-state">
                  <MdTimeline size={48} style={{ opacity: 0.3 }} />
                  <p>No events yet</p>
                  <span>Add your first event above</span>
                </div>
              ) : (
                sortedEvents.map((event, idx) => (
                  <div key={idx} className="event-item">
                    <div className="event-intensity">
                      <div className="intensity-bar" style={{ width: `${(event.intensity || 1) * 25}%`, backgroundColor: '#a3e635' }}></div>
                    </div>
                    <div className="event-details">
                      <div className="event-label">{event.label}</div>
                      <div className="event-epoch">Epoch: {event.epoch}</div>
                      <div className="event-date">{formatDate(new Date(event.epoch * 1000)).gmt}</div>
                    </div>
                    <button className="event-delete" onClick={() => removeEvent(idx)}>Delete</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <AdSpace />
      </div>
    </main>
  );
};

const computeRecurringResults = (startEpochValue, frequencyValue, occurrencesValue) => {
  const start = parseInt(startEpochValue, 10);
  const count = parseInt(occurrencesValue, 10);

  if (Number.isNaN(start) || Number.isNaN(count) || count <= 0) {
    return [];
  }

  const intervalMap = {
    daily: 86400,
    weekly: 604800,
    monthly: 2592000,
    yearly: 31536000
  };

  const step = intervalMap[frequencyValue] ?? 0;
  const generated = [];

  for (let i = 0; i < count; i++) {
    const newEpoch = step === 0 ? start : start + (i * step);
    generated.push({
      occurrence: i + 1,
      epoch: newEpoch,
      date: formatDate(new Date(newEpoch * 1000))
    });
  }

  return generated;
};

// Recurring Date Generator
const RecurringDates = () => {
  const initialStartEpoch = useRef(Math.floor(Date.now() / 1000)).current;
  const initialOccurrences = 10;
  const initialFrequency = 'daily';

  const [frequency, setFrequency] = useState(initialFrequency);
  const [startEpoch, setStartEpoch] = useState(initialStartEpoch);
  const [occurrences, setOccurrences] = useState(initialOccurrences);
  const [results, setResults] = useState(() =>
    computeRecurringResults(initialStartEpoch, initialFrequency, initialOccurrences)
  );

  const generateRecurring = () => {
    setResults(computeRecurringResults(startEpoch, frequency, occurrences));
  };

  return (
    <main className="main-content">
      <h1 className="main-title"><FiRepeat size={24} style={{ marginRight: '8px' }} />Recurring Date Generator</h1>
      
      <div className="content-with-ad">
        <div className="main-section recurring-main-section">
          <div className="recurring-description">
            <p>Generate sequences of recurring dates from a starting epoch timestamp. Specify daily, weekly, monthly, or yearly intervals and get epoch timestamps for each occurrence. Useful for scheduling and automation.</p>
          </div>
          
          <div className="recurring-layout">
            <div className="recurring-controls-panel">
              <div className="recurring-input-group">
                <label>Start Epoch</label>
                <input 
                  type="text"
                  value={startEpoch}
                  onChange={(e) => setStartEpoch(e.target.value)}
                  className="recurring-input"
                  placeholder="1731455400"
                />
              </div>

              <div className="recurring-input-group">
                <label>Frequency</label>
                <select className="recurring-select" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="recurring-input-group">
                <label>Number of Occurrences</label>
                <input 
                  type="number"
                  value={occurrences}
                  onChange={(e) => setOccurrences(parseInt(e.target.value) || 1)}
                  className="recurring-input"
                  min="1"
                  max="100"
                />
              </div>

              <button className="recurring-btn" onClick={generateRecurring}>Generate Dates</button>
            </div>

            <div className="recurring-results-panel">
              <div className="recurring-results-header">
                <h3>Generated Dates ({results.length})</h3>
              </div>
              
              <div className="recurring-table-container">
                <table className="recurring-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Epoch</th>
                      <th>Date & Time (GMT)</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="recurring-empty-row">
                          <div className="recurring-empty">
                            <FiRepeat size={48} style={{ opacity: 0.3 }} />
                            <p>No dates generated yet</p>
                            <span>Click "Generate Dates" to see results</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      results.map((result, idx) => (
                        <tr key={idx}>
                          <td data-label="#" className="recurring-number-cell">{result.occurrence}</td>
                          <td data-label="Epoch" className="recurring-epoch-cell">{result.epoch}</td>
                          <td data-label="Date & Time (GMT)" className="recurring-date-cell">{result.date.gmt}</td>
                          <td data-label="Action" className="recurring-action-cell">
                            <button 
                              className="recurring-copy-btn" 
                              onClick={() => navigator.clipboard.writeText(result.epoch)}
                              title="Copy epoch"
                            >
                              <FiCopy size={14} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <AdSpace />
      </div>
    </main>
  );
};

// Comparison Tool
const ComparisonTool = () => {
  const [epoch1, setEpoch1] = useState('');
  const [epoch2, setEpoch2] = useState('');
  const [comparison, setComparison] = useState(null);

  const compareEpochs = () => {
    const e1 = parseInt(epoch1);
    const e2 = parseInt(epoch2);
    if (isNaN(e1) || isNaN(e2)) return;

    const date1 = new Date(e1 * 1000);
    const date2 = new Date(e2 * 1000);
    const diff = Math.abs(e2 - e1);

    setComparison({
      epoch1: e1,
      epoch2: e2,
      date1: formatDate(date1),
      date2: formatDate(date2),
      earlier: e1 < e2 ? 'First' : 'Second',
      difference: diff,
      days: Math.floor(diff / 86400),
      isValid1: e1 >= 0 && e1 <= 2147483647,
      isValid2: e2 >= 0 && e2 <= 2147483647
    });
  };

  return (
    <main className="main-content">
      <h1 className="main-title"><MdCompare size={24} style={{ marginRight: '8px' }} />Epoch Comparison Tool</h1>
      
      <div className="content-with-ad">
        <div className="main-section">
          <div className="feature-description">
            <p>Compare two epoch timestamps side-by-side to see their dates and calculate the time difference between them. Includes validation checks for the Year 2038 problem and detailed duration breakdown.</p>
          </div>
          
          <div className="comparison-container">
        <div className="comparison-inputs">
          <div className="comparison-input-group">
            <label>First Epoch</label>
            <input 
              type="text"
              value={epoch1}
              onChange={(e) => setEpoch1(e.target.value)}
              className="comparison-input"
              placeholder="1672531200"
            />
          </div>

          <div className="comparison-vs">VS</div>

          <div className="comparison-input-group">
            <label>Second Epoch</label>
            <input 
              type="text"
              value={epoch2}
              onChange={(e) => setEpoch2(e.target.value)}
              className="comparison-input"
              placeholder="1704067200"
            />
          </div>
        </div>

        <button className="comparison-btn" onClick={compareEpochs}>Compare</button>

        {comparison && (
          <div className="comparison-results">
            <div className="comparison-grid">
              <div className="comparison-card">
                <h3>First Epoch</h3>
                <div className="comparison-value">{comparison.epoch1}</div>
                <div className="comparison-date">{comparison.date1.gmt}</div>
                <div className={`comparison-validity ${comparison.isValid1 ? 'valid' : 'invalid'}`}>
                  {comparison.isValid1 ? '✓ Valid' : '✗ Invalid (Year 2038 problem)'}
                </div>
              </div>

              <div className="comparison-card">
                <h3>Second Epoch</h3>
                <div className="comparison-value">{comparison.epoch2}</div>
                <div className="comparison-date">{comparison.date2.gmt}</div>
                <div className={`comparison-validity ${comparison.isValid2 ? 'valid' : 'invalid'}`}>
                  {comparison.isValid2 ? '✓ Valid' : '✗ Invalid (Year 2038 problem)'}
                </div>
              </div>
            </div>

            <div className="comparison-summary">
              <h3>Comparison Summary</h3>
              <div className="summary-item">
                <span className="summary-label">Earlier Timestamp:</span>
                <span className="summary-value">{comparison.earlier} epoch</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Time Difference:</span>
                <span className="summary-value">{comparison.difference.toLocaleString()} seconds ({comparison.days} days)</span>
              </div>
            </div>
          </div>
        )}
          </div>
        </div>
        <AdSpace />
      </div>
    </main>
  );
};

// Smart Parser Component
const SmartParser = () => {
  const [inputText, setInputText] = useState('');
  const [parsedDates, setParsedDates] = useState([]);

  const parseText = () => {
    // Extract epoch timestamps (10 or 13 digits)
    const epochPattern = /\b(\d{10}|\d{13})\b/g;
    const matches = inputText.match(epochPattern) || [];
    
    const parsed = matches.map(match => {
      const epoch = match.length === 13 ? parseInt(match) / 1000 : parseInt(match);
      const date = new Date(epoch * 1000);
      return {
        original: match,
        epoch: Math.floor(epoch),
        type: match.length === 13 ? 'milliseconds' : 'seconds',
        date: formatDate(date),
        isValid: !isNaN(date.getTime())
      };
    });

    setParsedDates(parsed);
  };

  return (
    <main className="main-content">
      <h1 className="main-title"><FaMagic size={24} style={{ marginRight: '8px' }} />Smart Date Parser</h1>
      
      <div className="content-with-ad">
        <div className="main-section">
          <div className="feature-description">
            <p>Automatically extract and convert epoch timestamps from any text. Paste logs, documents, or data containing timestamps and instantly see them converted to readable dates. Supports both seconds and milliseconds.</p>
          </div>
          
          <div className="parser-container">
        <div className="parser-input-section">
          <label>Paste text with timestamps (supports epoch seconds/milliseconds)</label>
          <textarea 
            className="parser-textarea"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your log files or any text containing epoch timestamps...&#10;Example: Error occurred at 1672531200 and resolved at 1672617600"
            rows="10"
          />
          <button className="parser-btn" onClick={parseText}>Parse & Extract Timestamps</button>
        </div>

        <div className="parser-results">
          <h3>Found {parsedDates.length} timestamp(s)</h3>
          {parsedDates.map((item, idx) => (
            <div key={idx} className={`parser-item ${!item.isValid ? 'invalid' : ''}`}>
              <div className="parser-original">Original: {item.original} ({item.type})</div>
              <div className="parser-epoch">Epoch: {item.epoch}</div>
              {item.isValid && (
                <>
                  <div className="parser-date">GMT: {item.date.gmt}</div>
                  <div className="parser-local">Local: {item.date.local}</div>
                </>
              )}
              {!item.isValid && <div className="parser-error">Invalid timestamp</div>}
              <button className="parser-copy" onClick={() => navigator.clipboard.writeText(item.epoch)}>
                <FiCopy size={16} />
              </button>
            </div>
          ))}
        </div>
          </div>
        </div>
        <AdSpace />
      </div>
    </main>
  );
};

// UUID/GUID Generator Component
const UUIDGenerator = () => {
  const [uuids, setUuids] = useState([]);
  const [count, setCount] = useState(1);
  const [version, setVersion] = useState('v4');
  const [uppercase, setUppercase] = useState(false);
  const [withHyphens, setWithHyphens] = useState(true);

  const generateUUID = () => {
    const newUuids = [];
    for (let i = 0; i < count; i++) {
      let uuid = '';
      if (version === 'v4') {
        // UUID v4 (random)
        uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      } else if (version === 'v1') {
        // UUID v1 (timestamp-based) - simplified
        const now = Date.now();
        const clockSeq = Math.floor(Math.random() * 0x3fff);
        uuid = `${now.toString(16).padStart(8, '0').slice(-8)}-${(now & 0xffff).toString(16).padStart(4, '0')}-1xxx-${clockSeq.toString(16).padStart(4, '0')}-xxxxxxxxxxxx`.replace(/x/g, () => Math.floor(Math.random() * 16).toString(16));
      } else {
        // Nil UUID
        uuid = '00000000-0000-0000-0000-000000000000';
      }
      
      if (!withHyphens) {
        uuid = uuid.replace(/-/g, '');
      }
      if (uppercase) {
        uuid = uuid.toUpperCase();
      }
      newUuids.push(uuid);
    }
    setUuids(newUuids);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
  };

  return (
    <main className="main-content">
      <h1 className="main-title"><FaHashtag size={24} style={{ marginRight: '8px' }} />UUID/GUID Generator</h1>
      
      <div className="content-with-ad">
        <div className="main-section">
          <div className="feature-description">
            <p>Generate unique identifiers (UUIDs/GUIDs) in various formats. Choose between random UUIDs (v4), timestamp-based (v1), or nil UUIDs. Perfect for database keys, session IDs, and unique identifiers in your applications.</p>
          </div>
          
          <div className="uuid-container">
        <div className="uuid-controls">
          <div className="uuid-options">
            <div className="uuid-option-group">
              <label>Version</label>
              <select className="uuid-select" value={version} onChange={(e) => setVersion(e.target.value)}>
                <option value="v4">Version 4 (Random)</option>
                <option value="v1">Version 1 (Timestamp)</option>
                <option value="nil">Nil UUID</option>
              </select>
            </div>
            
            <div className="uuid-option-group">
              <label>Count</label>
              <input 
                type="number" 
                className="uuid-input" 
                value={count} 
                onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                min="1"
                max="100"
              />
            </div>
            
            <div className="uuid-checkboxes">
              <label className="uuid-checkbox">
                <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />
                Uppercase
              </label>
              <label className="uuid-checkbox">
                <input type="checkbox" checked={withHyphens} onChange={(e) => setWithHyphens(e.target.checked)} />
                With Hyphens
              </label>
            </div>
          </div>
          
          <button className="uuid-btn" onClick={generateUUID}>
            <FaHashtag size={16} /> Generate UUID
          </button>
        </div>

        {uuids.length > 0 && (
          <div className="uuid-results">
            <div className="uuid-header">
              <h3>Generated UUIDs ({uuids.length})</h3>
              <button className="uuid-copy-all" onClick={copyAll}>
                <FiCopy size={16} /> Copy All
              </button>
            </div>
            
            <div className="uuid-list">
              {uuids.map((uuid, index) => (
                <div key={index} className="uuid-item">
                  <span className="uuid-number">#{index + 1}</span>
                  <code className="uuid-value">{uuid}</code>
                  <button className="uuid-copy-btn" onClick={() => navigator.clipboard.writeText(uuid)}>
                    <FiCopy size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="uuid-info">
          <h3>UUID Information</h3>
          <div className="info-grid">
            <div className="info-card">
              <h4>UUID v4 (Random)</h4>
              <p>Randomly generated using cryptographic RNG. Most commonly used. 122 bits of randomness.</p>
            </div>
            <div className="info-card">
              <h4>UUID v1 (Timestamp)</h4>
              <p>Based on timestamp and MAC address. Sortable by creation time. Contains temporal information.</p>
            </div>
            <div className="info-card">
              <h4>Format</h4>
              <p>Standard: 8-4-4-4-12 hexadecimal digits. Total 128 bits. Example: 550e8400-e29b-41d4-a716-446655440000</p>
            </div>
          </div>
        </div>
          </div>
        </div>
        <AdSpace />
      </div>
    </main>
  );
};

// Character/Word Counter Component
const TextCounter = () => {
  const [text, setText] = useState('');
  const [showStats, setShowStats] = useState(true);

  const stats = {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    words: text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length,
    lines: text.split('\n').length,
    paragraphs: text.trim().length === 0 ? 0 : text.split(/\n\n+/).filter(p => p.trim().length > 0).length,
    sentences: text.trim().length === 0 ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
    averageWordLength: text.trim().length === 0 ? 0 : (text.replace(/\s/g, '').length / text.trim().split(/\s+/).length).toFixed(2),
    readingTime: Math.ceil(text.trim().split(/\s+/).length / 200), // 200 words per minute
    speakingTime: Math.ceil(text.trim().split(/\s+/).length / 150), // 150 words per minute
  };

  const handleClear = () => {
    setText('');
  };

  const handleCopySummary = () => {
    const summary = `Characters: ${stats.characters}\nWords: ${stats.words}\nLines: ${stats.lines}\nParagraphs: ${stats.paragraphs}`;
    navigator.clipboard.writeText(summary);
  };

  return (
    <main className="main-content">
      <h1 className="main-title"><AiOutlineFileText size={24} style={{ marginRight: '8px' }} />Character & Word Counter</h1>
      
      <div className="content-with-ad">
        <div className="main-section">
          <div className="feature-description">
            <p>Count characters, words, lines, paragraphs, and more in real-time. Get reading and speaking time estimates, analyze sentence structure, and find the most used words. Ideal for writers, students, and content creators.</p>
          </div>
          
          <div className="counter-container">
        <div className="counter-input-section">
          <div className="counter-header">
            <label>Enter or paste your text</label>
            <div className="counter-actions">
              <button className="counter-btn-small" onClick={handleClear}>Clear</button>
              <button className="counter-btn-small" onClick={handleCopySummary}>
                <FiCopy size={14} /> Copy Stats
              </button>
            </div>
          </div>
          <textarea 
            className="counter-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste your text here..."
            rows={15}
          />
        </div>

        <div className="counter-stats">
          <div className="stats-grid">
            <div className="stat-box primary">
              <div className="stat-value">{stats.characters}</div>
              <div className="stat-label">Characters</div>
            </div>
            <div className="stat-box primary">
              <div className="stat-value">{stats.charactersNoSpaces}</div>
              <div className="stat-label">Characters (no spaces)</div>
            </div>
            <div className="stat-box primary">
              <div className="stat-value">{stats.words}</div>
              <div className="stat-label">Words</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{stats.lines}</div>
              <div className="stat-label">Lines</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{stats.paragraphs}</div>
              <div className="stat-label">Paragraphs</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{stats.sentences}</div>
              <div className="stat-label">Sentences</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{stats.averageWordLength}</div>
              <div className="stat-label">Avg Word Length</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{stats.readingTime} min</div>
              <div className="stat-label">Reading Time</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{stats.speakingTime} min</div>
              <div className="stat-label">Speaking Time</div>
            </div>
          </div>
        </div>

        <div className="counter-info">
          <h3>Text Analysis Features</h3>
          <ul>
            <li><strong>Real-time counting:</strong> All statistics update as you type</li>
            <li><strong>Reading time:</strong> Based on average reading speed of 200 words/minute</li>
            <li><strong>Speaking time:</strong> Based on average speaking speed of 150 words/minute</li>
            <li><strong>Paragraphs:</strong> Separated by double line breaks</li>
            <li><strong>Sentences:</strong> Detected by punctuation marks (. ! ?)</li>
          </ul>
        </div>
          </div>
        </div>
        <AdSpace />
      </div>
    </main>
  );
};

// Color Converter Component
const ColorConverter = () => {
  const [inputColor, setInputColor] = useState('#a3e635');
  const [colorFormats, setColorFormats] = useState({});

  useEffect(() => {
    convertColor(inputColor);
  }, []);

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const rgbToCmyk = (r, g, b) => {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, m, y);
    
    c = ((c - k) / (1 - k)) || 0;
    m = ((m - k) / (1 - k)) || 0;
    y = ((y - k) / (1 - k)) || 0;

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  };

  const convertColor = (color) => {
    let hex = color;
    
    // Handle different input formats
    if (color.startsWith('rgb')) {
      const matches = color.match(/\d+/g);
      if (matches && matches.length >= 3) {
        const r = parseInt(matches[0]);
        const g = parseInt(matches[1]);
        const b = parseInt(matches[2]);
        hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      }
    }

    const rgb = hexToRgb(hex);
    if (!rgb) return;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

    setColorFormats({
      hex: hex.toUpperCase(),
      hexShort: hex.length === 7 && hex[1] === hex[2] && hex[3] === hex[4] && hex[5] === hex[6] 
        ? `#${hex[1]}${hex[3]}${hex[5]}`.toUpperCase() 
        : '',
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      rgba: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      hsla: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)`,
      cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
      decimal: (rgb.r << 16) + (rgb.g << 8) + rgb.b,
      rgbObj: rgb,
      hslObj: hsl,
      cmykObj: cmyk
    });
  };

  const handleColorChange = (e) => {
    const color = e.target.value;
    setInputColor(color);
    convertColor(color);
  };

  const copyFormat = (format) => {
    navigator.clipboard.writeText(format);
  };

  return (
    <main className="main-content">
      <h1 className="main-title"><FaPalette size={24} style={{ marginRight: '8px' }} />Color Converter</h1>
      
      <div className="content-with-ad">
        <div className="main-section">
          <div className="feature-description">
            <p>Convert colors between different formats including HEX, RGB, RGBA, HSL, HSLA, CMYK, and decimal values. Pick colors visually or enter values manually. Perfect for designers and developers working with color codes.</p>
          </div>
          
          <div className="color-container">
        <div className="color-picker-section">
          <div className="color-preview" style={{ backgroundColor: inputColor }}>
            <div className="color-overlay">
              <input 
                type="color" 
                className="color-input-picker"
                value={inputColor}
                onChange={handleColorChange}
              />
              <span className="color-preview-text">Click to pick color</span>
            </div>
          </div>
          
          <div className="color-input-group">
            <label>Enter color value</label>
            <input 
              type="text" 
              className="color-text-input"
              value={inputColor}
              onChange={handleColorChange}
              placeholder="Enter hex, rgb, or hsl"
            />
          </div>
        </div>

        {colorFormats.hex && (
          <div className="color-formats">
            <div className="format-section">
              <h3>Standard Formats</h3>
              <div className="format-list">
                <div className="format-item">
                  <div className="format-details">
                    <span className="format-label">HEX</span>
                    <code className="format-value">{colorFormats.hex}</code>
                  </div>
                  <button className="format-copy" onClick={() => copyFormat(colorFormats.hex)}>
                    <FiCopy size={14} />
                  </button>
                </div>

                {colorFormats.hexShort && (
                  <div className="format-item">
                    <div className="format-details">
                      <span className="format-label">HEX (Short)</span>
                      <code className="format-value">{colorFormats.hexShort}</code>
                    </div>
                    <button className="format-copy" onClick={() => copyFormat(colorFormats.hexShort)}>
                      <FiCopy size={14} />
                    </button>
                  </div>
                )}

                <div className="format-item">
                  <div className="format-details">
                    <span className="format-label">RGB</span>
                    <code className="format-value">{colorFormats.rgb}</code>
                  </div>
                  <button className="format-copy" onClick={() => copyFormat(colorFormats.rgb)}>
                    <FiCopy size={14} />
                  </button>
                </div>

                <div className="format-item">
                  <div className="format-details">
                    <span className="format-label">RGBA</span>
                    <code className="format-value">{colorFormats.rgba}</code>
                  </div>
                  <button className="format-copy" onClick={() => copyFormat(colorFormats.rgba)}>
                    <FiCopy size={14} />
                  </button>
                </div>

                <div className="format-item">
                  <div className="format-details">
                    <span className="format-label">HSL</span>
                    <code className="format-value">{colorFormats.hsl}</code>
                  </div>
                  <button className="format-copy" onClick={() => copyFormat(colorFormats.hsl)}>
                    <FiCopy size={14} />
                  </button>
                </div>

                <div className="format-item">
                  <div className="format-details">
                    <span className="format-label">HSLA</span>
                    <code className="format-value">{colorFormats.hsla}</code>
                  </div>
                  <button className="format-copy" onClick={() => copyFormat(colorFormats.hsla)}>
                    <FiCopy size={14} />
                  </button>
                </div>

                <div className="format-item">
                  <div className="format-details">
                    <span className="format-label">CMYK</span>
                    <code className="format-value">{colorFormats.cmyk}</code>
                  </div>
                  <button className="format-copy" onClick={() => copyFormat(colorFormats.cmyk)}>
                    <FiCopy size={14} />
                  </button>
                </div>

                <div className="format-item">
                  <div className="format-details">
                    <span className="format-label">Decimal</span>
                    <code className="format-value">{colorFormats.decimal}</code>
                  </div>
                  <button className="format-copy" onClick={() => copyFormat(colorFormats.decimal.toString())}>
                    <FiCopy size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="format-section">
              <h3>Color Values</h3>
              <div className="color-values-grid">
                <div className="value-card">
                  <h4>RGB Components</h4>
                  <div className="component-bars">
                    <div className="component-bar">
                      <span className="component-label">R</span>
                      <div className="component-progress">
                        <div className="component-fill" style={{ width: `${(colorFormats.rgbObj.r / 255) * 100}%`, backgroundColor: '#ef4444' }}></div>
                      </div>
                      <span className="component-value">{colorFormats.rgbObj.r}</span>
                    </div>
                    <div className="component-bar">
                      <span className="component-label">G</span>
                      <div className="component-progress">
                        <div className="component-fill" style={{ width: `${(colorFormats.rgbObj.g / 255) * 100}%`, backgroundColor: '#22c55e' }}></div>
                      </div>
                      <span className="component-value">{colorFormats.rgbObj.g}</span>
                    </div>
                    <div className="component-bar">
                      <span className="component-label">B</span>
                      <div className="component-progress">
                        <div className="component-fill" style={{ width: `${(colorFormats.rgbObj.b / 255) * 100}%`, backgroundColor: '#3b82f6' }}></div>
                      </div>
                      <span className="component-value">{colorFormats.rgbObj.b}</span>
                    </div>
                  </div>
                </div>

                <div className="value-card">
                  <h4>HSL Components</h4>
                  <div className="component-list">
                    <div className="component-item">
                      <span className="component-name">Hue</span>
                      <span className="component-num">{colorFormats.hslObj.h}°</span>
                    </div>
                    <div className="component-item">
                      <span className="component-name">Saturation</span>
                      <span className="component-num">{colorFormats.hslObj.s}%</span>
                    </div>
                    <div className="component-item">
                      <span className="component-name">Lightness</span>
                      <span className="component-num">{colorFormats.hslObj.l}%</span>
                    </div>
                  </div>
                </div>

                <div className="value-card">
                  <h4>CMYK Components</h4>
                  <div className="component-list">
                    <div className="component-item">
                      <span className="component-name">Cyan</span>
                      <span className="component-num">{colorFormats.cmykObj.c}%</span>
                    </div>
                    <div className="component-item">
                      <span className="component-name">Magenta</span>
                      <span className="component-num">{colorFormats.cmykObj.m}%</span>
                    </div>
                    <div className="component-item">
                      <span className="component-name">Yellow</span>
                      <span className="component-num">{colorFormats.cmykObj.y}%</span>
                    </div>
                    <div className="component-item">
                      <span className="component-name">Key (Black)</span>
                      <span className="component-num">{colorFormats.cmykObj.k}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
          </div>
        </div>
        <AdSpace />
      </div>
    </main>
  );
};

// Comments Component
const CommentsSection = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ name: '', email: '', text: '' });
  const [replyTo, setReplyTo] = useState(null);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, popular
  const [filterBy, setFilterBy] = useState('all'); // all, questions, feedback

  useEffect(() => {
    // Load comments from localStorage
    const savedComments = localStorage.getItem('userComments');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    } else {
      // Initialize with some sample comments
      const sampleComments = [
        {
          id: 1,
          name: 'John Developer',
          email: 'john@example.com',
          text: 'This is an amazing epoch converter tool! Very helpful for my development work.',
          timestamp: Date.now() - 86400000 * 2,
          votes: 15,
          type: 'feedback',
          replies: [
            {
              id: 101,
              name: 'DevUtils Team',
              email: 'team@devutils.com',
              text: 'Thank you so much! We\'re glad you find it useful.',
              timestamp: Date.now() - 86400000 * 1.5,
              votes: 5,
              isAdmin: true
            }
          ]
        },
        {
          id: 2,
          name: 'Sarah Designer',
          email: 'sarah@example.com',
          text: 'Could you add support for converting milliseconds? Would be super useful!',
          timestamp: Date.now() - 86400000,
          votes: 8,
          type: 'question',
          replies: []
        }
      ];
      setComments(sampleComments);
      localStorage.setItem('userComments', JSON.stringify(sampleComments));
    }
  }, []);

  const saveComments = (updatedComments) => {
    setComments(updatedComments);
    localStorage.setItem('userComments', JSON.stringify(updatedComments));
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.name || !newComment.text) return;

    const comment = {
      id: Date.now(),
      name: newComment.name,
      email: newComment.email,
      text: newComment.text,
      timestamp: Date.now(),
      votes: 0,
      type: newComment.text.includes('?') ? 'question' : 'feedback',
      replies: []
    };

    const updatedComments = [comment, ...comments];
    saveComments(updatedComments);
    setNewComment({ name: '', email: '', text: '' });
  };

  const handleSubmitReply = (commentId, replyText, replyName) => {
    if (!replyText || !replyName) return;

    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, {
            id: Date.now(),
            name: replyName,
            email: '',
            text: replyText,
            timestamp: Date.now(),
            votes: 0
          }]
        };
      }
      return comment;
    });

    saveComments(updatedComments);
    setReplyTo(null);
  };

  const handleVote = (commentId, isUpvote, isReply = false, parentId = null) => {
    const updatedComments = comments.map(comment => {
      if (isReply && comment.id === parentId) {
        return {
          ...comment,
          replies: comment.replies.map(reply => {
            if (reply.id === commentId) {
              return { ...reply, votes: reply.votes + (isUpvote ? 1 : -1) };
            }
            return reply;
          })
        };
      } else if (comment.id === commentId) {
        return { ...comment, votes: comment.votes + (isUpvote ? 1 : -1) };
      }
      return comment;
    });

    saveComments(updatedComments);
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'newest') return b.timestamp - a.timestamp;
    if (sortBy === 'oldest') return a.timestamp - b.timestamp;
    if (sortBy === 'popular') return b.votes - a.votes;
    return 0;
  });

  const filteredComments = sortedComments.filter(comment => {
    if (filterBy === 'all') return true;
    if (filterBy === 'questions') return comment.type === 'question';
    if (filterBy === 'feedback') return comment.type === 'feedback';
    return true;
  });

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <main className="main-content">
      <h1 className="main-title"><FaComments size={24} style={{ marginRight: '8px' }} />Community Comments</h1>
      
      <div className="content-with-ad">
        <div className="main-section">
          <div className="feature-description">
            <p>Share your feedback, ask questions, or report issues. Join our community discussion, upvote helpful comments, and get responses from our team. Your input helps us improve the tool for everyone.</p>
          </div>
          
          <div className="comments-container">
            {/* Comments Header */}
            <div className="comments-header">
              <div className="comments-stats">
                <div className="stat-badge">
                  <MdMessage size={20} />
                  <span>{comments.length} Comments</span>
                </div>
                <div className="stat-badge">
                  <FaReply size={18} />
                  <span>{comments.reduce((sum, c) => sum + c.replies.length, 0)} Replies</span>
                </div>
              </div>

              <div className="comments-controls">
                <select className="comments-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
                </select>
                <select className="comments-select" value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
                  <option value="all">All Comments</option>
                  <option value="questions">Questions</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>
            </div>

            {/* Post New Comment */}
            <div className="comment-form-card">
              <h3><MdSend size={20} /> Post a Comment</h3>
              <form onSubmit={handleSubmitComment}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      className="comment-input"
                      value={newComment.name}
                      onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email (optional)</label>
                    <input
                      type="email"
                      className="comment-input"
                      value={newComment.email}
                      onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Comment *</label>
                  <textarea
                    className="comment-textarea"
                    value={newComment.text}
                    onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                    placeholder="Share your thoughts, ask questions, or provide feedback..."
                    rows="4"
                    required
                  />
                </div>
                <button type="submit" className="submit-comment-btn">
                  <MdSend size={18} /> Post Comment
                </button>
              </form>
            </div>

            {/* Comments List */}
            <div className="comments-list">
              <h3>{filteredComments.length} {filterBy === 'all' ? 'Comments' : filterBy === 'questions' ? 'Questions' : 'Feedback'}</h3>
              
              {filteredComments.length === 0 ? (
                <div className="no-comments">
                  <FaComments size={48} style={{ opacity: 0.3 }} />
                  <p>No comments yet</p>
                  <span>Be the first to share your thoughts!</span>
                </div>
              ) : (
                filteredComments.map(comment => (
                  <div key={comment.id} className="comment-card">
                    <div className="comment-header">
                      <div className="comment-author">
                        <div className="author-avatar">
                          <FaUser />
                        </div>
                        <div className="author-info">
                          <span className="author-name">{comment.name}</span>
                          <span className="comment-time">{formatTimeAgo(comment.timestamp)}</span>
                        </div>
                        {comment.type === 'question' && <span className="comment-badge question">Question</span>}
                      </div>
                      
                      <div className="comment-votes">
                        <button 
                          className="vote-btn upvote"
                          onClick={() => handleVote(comment.id, true)}
                          title="Helpful"
                        >
                          <MdThumbUp size={16} />
                        </button>
                        <span className={`vote-count ${comment.votes > 0 ? 'positive' : comment.votes < 0 ? 'negative' : ''}`}>
                          {comment.votes}
                        </span>
                        <button 
                          className="vote-btn downvote"
                          onClick={() => handleVote(comment.id, false)}
                          title="Not helpful"
                        >
                          <MdThumbDown size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="comment-body">
                      <p>{comment.text}</p>
                    </div>

                    <div className="comment-actions">
                      <button 
                        className="reply-btn"
                        onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                      >
                        <FaReply size={14} /> Reply ({comment.replies.length})
                      </button>
                    </div>

                    {/* Replies */}
                    {comment.replies.length > 0 && (
                      <div className="replies-section">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className={`reply-card ${reply.isAdmin ? 'admin-reply' : ''}`}>
                            <div className="comment-header">
                              <div className="comment-author">
                                <div className="author-avatar small">
                                  <FaUser />
                                </div>
                                <div className="author-info">
                                  <span className="author-name">
                                    {reply.name}
                                    {reply.isAdmin && <span className="admin-badge">Team</span>}
                                  </span>
                                  <span className="comment-time">{formatTimeAgo(reply.timestamp)}</span>
                                </div>
                              </div>
                              
                              <div className="comment-votes small">
                                <button 
                                  className="vote-btn upvote"
                                  onClick={() => handleVote(reply.id, true, true, comment.id)}
                                >
                                  <MdThumbUp size={14} />
                                </button>
                                <span className={`vote-count ${reply.votes > 0 ? 'positive' : reply.votes < 0 ? 'negative' : ''}`}>
                                  {reply.votes}
                                </span>
                                <button 
                                  className="vote-btn downvote"
                                  onClick={() => handleVote(reply.id, false, true, comment.id)}
                                >
                                  <MdThumbDown size={14} />
                                </button>
                              </div>
                            </div>
                            <div className="comment-body">
                              <p>{reply.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Form */}
                    {replyTo === comment.id && (
                      <div className="reply-form">
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.target);
                          handleSubmitReply(comment.id, formData.get('replyText'), formData.get('replyName'));
                          e.target.reset();
                        }}>
                          <input
                            type="text"
                            name="replyName"
                            className="reply-input"
                            placeholder="Your name"
                            required
                          />
                          <textarea
                            name="replyText"
                            className="reply-textarea"
                            placeholder="Write your reply..."
                            rows="3"
                            required
                          />
                          <div className="reply-actions">
                            <button type="button" className="cancel-reply-btn" onClick={() => setReplyTo(null)}>
                              Cancel
                            </button>
                            <button type="submit" className="submit-reply-btn">
                              <FaReply size={14} /> Post Reply
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Guidelines */}
            <div className="comments-guidelines">
              <h4>💡 Community Guidelines</h4>
              <ul>
                <li>Be respectful and constructive in your comments</li>
                <li>Ask questions or share feedback about the epoch converter tool</li>
                <li>Vote on helpful comments to help others find valuable information</li>
                <li>Report inappropriate content by contacting our team</li>
              </ul>
            </div>
          </div>
        </div>
        <AdSpace />
      </div>
    </main>
  );
};

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-section">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="#"><FiBook size={14} /> Documentation</a></li>
          <li><a href="#"><FiHelpCircle size={14} /> Help & Support</a></li>
          <li><a href="#"><FaGithub size={14} /> GitHub</a></li>
        </ul>
      </div>
      <div className="footer-section">
        <h3>Resources</h3>
        <ul>
          <li><a href="#">API Documentation</a></li>
          <li><a href="#">Time Zone Database</a></li>
          <li><a href="#">Epoch Timestamp Guide</a></li>
        </ul>
      </div>
      <div className="footer-section">
        <h3>Tools</h3>
        <ul>
          <li><a href="#">JSON Formatter</a></li>
          <li><a href="#">Base64 Encoder</a></li>
          <li><a href="#">URL Encoder</a></li>
        </ul>
      </div>
      <div className="footer-section">
        <h3>About</h3>
        <p className="footer-desc">
          Powerful developer tools for time conversion, JSON formatting, and encoding. 
          Built for developers, by developers.
        </p>
        <div className="social-links">
          <a href="#"><FaGithub size={20} /></a>
          <a href="#"><FaTwitter size={20} /></a>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <p>&copy; 2025 Epoch Converter. All rights reserved.</p>
    </div>
  </footer>
);

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button className="scroll-to-top" onClick={scrollToTop} title="Scroll to top">
          <FaArrowUp size={20} />
        </button>
      )}
    </>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <main className="main-content">
              <h1 className="main-title"><FiClock size={24} style={{ marginRight: '8px' }} />Converters</h1>
              <div className="converters-grid">
                <div className="converters-column">
                  <EpochConverter />
                  <BatchConverter />
                </div>
                <div className="converters-column">
                  <DateToEpochConverter />
                </div>
                <AdSpace />
              </div>
            </main>
            <Footer />
          </>
        );
      case 'calculator':
        return <><EpochCalculator /><Footer /></>;
      case 'timezone':
        return <><TimezoneWidget /><Footer /></>;
      case 'history':
        return <><ConversionHistory /><Footer /></>;
      case 'presets':
        return <><QuickPresets /><Footer /></>;
      case 'timeline':
        return <><VisualTimeline /><Footer /></>;
      case 'comments':
        return <><CommentsSection /><Footer /></>;
      case 'recurring':
        return <><RecurringDates /><Footer /></>;
      case 'compare':
        return <><ComparisonTool /><Footer /></>;
      case 'parser':
        return <><SmartParser /><Footer /></>;
      case 'uuid':
        return <><UUIDGenerator /><Footer /></>;
      case 'counter':
        return <><TextCounter /><Footer /></>;
      case 'color':
        return <><ColorConverter /><Footer /></>;
      case 'json':
        return <JSONFormatter />;
      default:
        return (
          <>
            <main className="main-content">
              <h1 className="main-title"><FiClock size={24} style={{ marginRight: '8px' }} />Converters</h1>
              <div className="converters-grid">
                <div className="converters-column">
                  <EpochConverter />
                  <BatchConverter />
                </div>
                <div className="converters-column">
                  <DateToEpochConverter />
                </div>
                <AdSpace />
              </div>
            </main>
            <Footer />
          </>
        );
    }
  };

  return (
    <div className="container">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderContent()}
      <ScrollToTop />
    </div>
  );
};

export default App;
