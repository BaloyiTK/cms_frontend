import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faBook, faQuestionCircle, faComment } from '@fortawesome/free-solid-svg-icons';

const Support = () => {
  return (
    <div className="max-w-lg mx-auto md:p-4 bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center mb-4">
        <h1 className="text-lg font-semibold text-gray-700">SUPPORT</h1>
      </div>
      
      <ul className="space-y-2">
        <li>
          <a href="#" className="text-blue-500 hover:underline flex items-center">
            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
            Get in Touch
          </a>
        </li>
        <li>
          <a href="#" className="text-blue-500 hover:underline flex items-center">
            <FontAwesomeIcon icon={faBook} className="mr-2" />
            Documentation
          </a>
        </li>
        <li>
          <a href="#" className="text-blue-500 hover:underline flex items-center">
            <FontAwesomeIcon icon={faQuestionCircle} className="mr-2" />
            FAQs
          </a>
        </li>
        <li>
          <a href="#" className="text-blue-500 hover:underline flex items-center">
            <FontAwesomeIcon icon={faComment} className="mr-2" />
            Live Chat
          </a>
        </li>
        {/* Add more support options here */}
      </ul>
    </div>
  );
};

export default Support;
