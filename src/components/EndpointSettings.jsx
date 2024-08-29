import React, { useEffect, useState, useRef } from "react";
import { FiCopy } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUser } from "../utils/api";
import { baseUrl } from "../utils/baseUrl";

const EndpointSettings = () => {
  const [endpoint, setEndpoint] = useState("");
  const [apiKey, setApiKey] = useState("");
 // const [accessLevel, setAccessLevel] = useState("read");
  const [selectedExample, setSelectedExample] = useState("fetch");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [userId, setUserId] = useState();

  const textareaRef = useRef(null);

  const url = window.location.href;
  const projectId = url.split("/").pop();

  useEffect(() => {
    adjustTextareaHeight();
  }, [codeSnippet]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };



  useEffect(() => {
    getUser()
      .then((response) => {
      
        setApiKey(response.apiKey);
        setUserId(response._id);
        setEndpoint(`${baseUrl}/content/${projectId}`);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [endpoint]);

  useEffect(() => {
    renderCodeSnippet();
  }, [selectedExample]);

  const handleCopyEndpoint = () => {
    navigator.clipboard
      .writeText(endpoint)
      .then(() => {
      
        toast.success("Copied to clipboard");
      })
      .catch((error) => {
        console.error("Failed to copy Endpoint URL:", error);
        toast.error("Failed to copy Endpoint URL");
      });
  };

  const handleCopyApiKey = () => {
    navigator.clipboard
      .writeText(apiKey)
      .then(() => {
        toast.success("API key copied to clipboard");
      })
      .catch((error) => {
        console.error("Failed to copy API key:", error);
        toast.error("Failed to copy API key");
      });
  };

  const handleExampleChange = (example) => {
    setSelectedExample(example);
  };
  useEffect(() => {
    renderCodeSnippet();
  }, [endpoint]);

  const renderCodeSnippet = () => {
    if (selectedExample === "fetch") {
      setCodeSnippet(
        `
  fetch('${endpoint}', {
    headers: {
      'Authorization': 'Bearer ${apiKey}'
    }
  })
    .then(response => response.json())
    .then(data => {
      // Handle the response data
      console.log(data);
    })
    .catch(error => {
      // Handle any errors that occurred during the request
      console.error('Error:', error);
    });
        `
      );
    } else if (selectedExample === "axios") {
      setCodeSnippet(
        `
  axios.get('${endpoint}', {
    headers: {
      'Authorization': 'Bearer ${apiKey}'
    }
  })
    .then(response => {
      // Handle the response data
    
    })
    .catch(error => {
      // Handle any errors that occurred during the request
      console.error('Error:', error);
    });
        `
      );
    }
  };

  const handleCopyCodeSnippet = () => {
    navigator.clipboard
      .writeText(codeSnippet)
      .then(() => {
        toast.success("Copied to clipboard");
      })
      .catch((error) => {
        console.error("Failed to copy code snippet:", error);
        toast.error("Failed to copy code snippet");
      });
  };

  return (
    <>
      <div className=" w-full md:w-5/6 mx-auto bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Endpoint</h2>
        <div className="mb-4">
          <label htmlFor="endpoint" className="block mb-2 font-medium text-sm">
            Content API:
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              id="endpoint"
              name="endpoint"
              value={endpoint}
              readOnly
              className="border border-gray-300 px-3 py-2 rounded-md w-full pr-10 text-sm"
            />
            <button
              type="button"
              className="absolute right-0 top-0 h-full px-3 flex items-center hover:text-blue-500"
              onClick={handleCopyEndpoint}
            >
              <FiCopy />
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="apiKey" className="block mb-2 font-medium text-sm">
            API Key:
          </label>

          <div className="relative flex items-center">
            <input
              type="text"
              id="apiKey"
              name="apiKey"
              value={apiKey}
              readOnly
              className="border border-gray-300 px-3 py-2 rounded-md w-full pr-10 text-sm"
            />
            <button
              type="button"
              className="absolute right-0 top-0 h-full px-3 flex items-center hover:text-blue-500"
              onClick={handleCopyApiKey}
            >
              <FiCopy />
            </button>
          </div>
        </div>
       
      </div>
      <div className="w-full md:w-5/6 mx-auto bg-white p-4 rounded-lg shadow-lg mt-2">
        <h2 className="text-xl font-semibold mb-4">API Configuration</h2>

        <div className="flex text-xs">
          <button
            className={` p-1 ${
              selectedExample === "fetch"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }  hover:text-blue-500 transition-colors duration-300 focus:outline-none`}
            onClick={() => handleExampleChange("fetch")}
          >
            Fetch
          </button>
          <button
            className={` p-1 ${
              selectedExample === "axios"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }  hover:text-blue-500 transition-colors duration-300 focus:outline-none`}
            onClick={() => handleExampleChange("axios")}
          >
            NodeJs(Axios)
          </button>

          {/* Add more buttons for additional examples */}
        </div>

        {/* Code snippet */}
        <div className="relative mt-4">
          <textarea
            ref={textareaRef}
            value={codeSnippet}
            readOnly
            className="border border-gray-300 px-3 py-2 rounded-md w-full pr-10 text-xs resize-none overflow-hidden bg-black text-gray-300"
            onChange={adjustTextareaHeight}
          />
          <button
            type="button"
            className="absolute top-0 right-0 h-full px-3 flex items-center hover:text-blue-500 text-white"
            onClick={handleCopyCodeSnippet}
          >
            <FiCopy />
          </button>
        </div>
      </div>
    </>
  );
};

export default EndpointSettings;
