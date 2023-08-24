import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../utils/baseUrl";
import { BallTriangle } from "react-loader-spinner";

const ProjectStats = () => {
  const [project, setProject] = useState();
  const [models, setModels] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const url = window.location.href;
  const projectId = url.split("/").pop();

  useEffect(() => {
    const cachedProject = localStorage.getItem(`cachedProject_${projectId}`);

    if (cachedProject) {
      setProject(JSON.parse(cachedProject));
      setProjectName(JSON.parse(cachedProject)[0].name);

      setLoading(false);
    } else {
      fetchProject();
    }
  }, []);

  useEffect(() => {
    const cachedModels = localStorage.getItem(`cachedModels_${projectId}`);

    if (cachedModels) {
      setModels(JSON.parse(cachedModels));
      setLoading(false);
    } else {
      fetchModels();
    }
  }, []);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${baseUrl}/project/${projectId}`);
      setProject(response.data);
      setProjectName(response.data[0].name);
      localStorage.setItem(`cachedProject_${projectId}`, JSON.stringify(response.data));
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchModels = async () => {
    axios
      .get(`${baseUrl}/model/${projectId}`)
      .then((response) => {
        setModels(response.data);
        localStorage.setItem(`cachedModels_${projectId}`, JSON.stringify(response.data));
      })
      .catch((error) => {
        console.error("Error retrieving models:", error);
      });
  };

  const numberOfModels = models.length;
  const maxModels = 100;
  const progressPercentage = (numberOfModels / maxModels) * 100;

  return (
    <div className="p-4 text-sm">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <BallTriangle color="blue" height={80} width={80} />
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-bold mb-2">
            {projectName && projectName}
          </h2>
          <h3 className="text-base font-bold mb-2">Project Stats</h3>

          {/* Stacked layout for small devices */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Models Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className=" font-bold mb-2">Models</h4>
              <p className="text-gray-600">{`${numberOfModels}/${maxModels}`}</p>
              <div className="bg-gray-200 h-2 rounded-lg mt-2">
                <div
                  className="bg-blue-500 h-full rounded-lg"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Project Status Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className=" font-bold mb-2">Project Status</h4>
              <p className="text-green-600">Active</p>
            </div>

       
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectStats;
