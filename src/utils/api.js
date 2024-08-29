import axios from "axios";
import { baseUrl } from "./baseUrl";

//const baseUrl = process.env.REACT_APP_API_BASE_URL;

console.log(baseUrl);

axios.defaults.withCredentials = true;

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${baseUrl}/login`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const getUser = async () => {
  try {
    const response = await axios.get(`${baseUrl}/user`);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const getLoginStatus = async () => {
  try {
    const response = await axios.get(`${baseUrl}/loginStatus`);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${baseUrl}/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error.message);
    throw error.response.data.message;
  }
};

export const updateUser = async (userData) => {
  try {
    const response = await axios.patch(`${baseUrl}/updateuser`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw error.response.data.message;
  }
};

export const getModel = async (projectId) => {
  try {
    const response = await axios.get(`${baseUrl}/model/${projectId}`);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const updateModel = async (userData, projectId) => {
  try {
    const response = await axios.patch(
      `${baseUrl}/model/${projectId}`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const addModel = async (projectId, schema, modelName) => {
  try {
    const response = await axios.post(`${baseUrl}/model/${projectId}`, {
      schema,
      modelName,
    });

    return response.data; // Return response data on success
  } catch (error) {
    throw error.response.data.message;
  }
};
