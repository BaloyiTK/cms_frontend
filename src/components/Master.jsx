import React, { useState } from "react";
import SidePanel from "./SidePanel";
import Schema from "./Schema";
import Content from "./Content";
import ContentManagement from "./ContentManagement";
import Settings from "./Settings";
import SettingManagement from "./SettingManagement";
import ProjectStats from "./ProjectStats";
import MyImage from "../images/database.png";
import Support from "./Support";


const Master = () => {
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedModel, setSelectedModel] = useState();
  const [selectedSetting, setSelectedSetting] = useState();
  const [showAddForm, setShowAddForm] = useState(false)

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setSelectedModel(null);
    setSelectedSetting(null);
  };

  const handleSelectedModel = (model) => {
    setSelectedModel(model);
  };

  const handleSelectedSetting = (setting) => {
    setSelectedSetting(setting);
  };

  const handleAddModelClick = () => {
    setShowAddForm(true)
   
  
   
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="md:w-1/4 lg:w-1/5 border p-4">
        <SidePanel
          selectedItem={selectedItem}
          onItemClicked={handleItemClick}
        />
      </div>
      <div className="md:w-3/4 lg:w-4/5 p-1">
        {selectedItem === "Schema" && (
          <div className="flex flex-col md:flex-row h-full">
            <div className="md:w-1/3 lg:w-1/4 border p-1">
              <Schema showAddForm={showAddForm} />
            </div>
            <div className="w-full md:w-2/3 lg:w-3/4 mx-auto mt-4 md:mt-0">
              <div className="border md:p-12 p-3 shadow-md h-full flex flex-col items-center">
                <img
                  className="w-1/2 h-auto mb-4"
                  src={MyImage}
                  alt="Database"
                />
                {/* <p className="text-gray-700">
                  A schema defines the structure and rules for organizing and
                  presenting content within your application. By creating
                  schemas, you can ensure consistency in the content format and
                  enable various content types to be managed effectively.
                </p> */}
                <p className="text-gray-700">
                  A model establishes a structured blueprint and guidelines for
                  organizing and managing content within CMS. By creating and
                  adhering to models, you ensure uniformity in content
                  presentation and streamline the management of diverse content
                  types.
                </p>
                <button
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        onClick={handleAddModelClick}
      >
        Add Model
      </button>
                
              </div>
            </div>
          </div>
        )}

        {selectedItem === "Content" && (
          <div className="flex flex-col md:flex-row h-full">
            <div className="md:w-1/3 lg:w-1/4 border p-1">
              <Content onSelectedModel={handleSelectedModel} />
            </div>
            <div className="md:w-2/3 lg:w-3/4 mt-4 md:mt-0">
              {selectedModel ? (
                <ContentManagement selectedModel={selectedModel} />
              ) : (
                <div className="border p-4 h-full">No model selected</div>
              )}
            </div>
          </div>
        )}
        
        {selectedItem === "Support" && (
          <div className="flex flex-col md:flex-row h-full">
            <div className="md:w-1/3 lg:w-1/4 border p-1">
           <Support/>
            </div>
            <div className="md:w-2/3 lg:w-3/4 p-4">
           
            </div>
          </div>
        )}
        {selectedItem === "Settings" && (
          <div className="flex flex-col md:flex-row h-full">
            <div className="md:w-1/3 lg:w-1/4 border p-1">
              <Settings onSelectedSetting={handleSelectedSetting} />
            </div>
            <div className="md:w-2/3 lg:w-3/4 p-4">
              {selectedSetting && (
                <SettingManagement selectedSetting={selectedSetting} />
              )}
            </div>
          </div>
        )}

        {!selectedItem && (
          <div className="h-full">
            <ProjectStats />
          </div>
        )}
      </div>
    </div>
  );
};

export default Master;
