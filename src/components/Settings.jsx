import React from "react";

const Settings = ({ onSelectedSetting }) => {
  const handleSettingClick = (setting) => {
    onSelectedSetting(setting);
  };

  const settingsList = [
    // {
    //   title: "Project",
    //   onClick: () => handleSettingClick("Project"),
    // //  content: <div>General project settings content</div> // Replace with actual content
    // },
    {
      title: "Endpoints",
      onClick: () => handleSettingClick("Endpoints"),
      //content: <div>Access control content</div> // Replace with actual content
    },
    {
      title: "Team Members",
      onClick: () => handleSettingClick("Team Members"),
      //content: <div>Project members content</div> // Replace with actual content
    }
  ];

  return (
    <div className="max-w-lg mx-auto md:p-4">
      <div className="flex items-center">
        <h1 className="text-sm font-bold">SETTINGS</h1>
      </div>

      <div className="grid grid-cols-1 ">
        {settingsList.map((setting, index) => (
          <div key={index}>
            <h2
              className="font-semibold mb-1 cursor-pointer tett-sm text-blue-300"
              onClick={setting.onClick}
            >
              {setting.title}
            </h2>
            {setting.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
