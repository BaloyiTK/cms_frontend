import React from 'react';
import TeamMembers from './TeamMembers';
import ProjectSettings from './ProjectSettings';
import EndpointSettings from './EndpointSettings';

const SettingManagement = ({ selectedSetting }) => {
  let settingContent;

  switch (selectedSetting) {
    case 'Team Members':
      settingContent = <div><TeamMembers/></div>;
      break;
    case 'Project':
      settingContent = <div><ProjectSettings/></div>;
      break;
    case 'Endpoints':
      settingContent = <div><EndpointSettings/></div>;
      break;
    default:
      settingContent = <div>No setting selected</div>;
  }

  return <div>{settingContent}</div>;
};

export default SettingManagement;
