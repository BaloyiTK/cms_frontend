import {
  FaFont,
  FaAlignLeft,
  FaItalic,
  FaHashtag,
  FaImage,
  FaCalendar,
  FaClock,
  FaEnvelope,
  FaList,
  FaLink,
  FaLock,

} from "react-icons/fa";

export const fieldTypeOptions = {
  SingleLineText: {
    id: "Single Line Text",
    icon: FaFont,
    color: "green",
    description: "Headings and Titles",
  },
  MultiLineText: {
    id: "Multi Line Text",
    icon: FaAlignLeft,
    color: "blue",
    description: "Description",
  },
  RichText: {
    id: "Rich Text",
    icon: FaItalic,
    color: "yellow",
    description: "Text editor",
  },
  Number: {
    id: "Number",
    icon: FaHashtag,
    color: "cyan",
    description: "Numeric input",
  },
  Media: {
    id: "Media",
    icon: FaImage,
    color: "red",
    description: "Images, Videos, etc",
  },
  Date: {
    id: "Date",
    icon: FaCalendar,
    color: "orange",
    description: "Date picker",
  },
  DateTime: {
    id: "DateTime",
    icon: FaClock,
    color: "pink",
    description: "Date and time input",
  },
  Email: {
    id: "Email",
    icon: FaEnvelope,
    color: "blue",
    description: "Email input",
  },
  
  Select: {
    id: "Select",
    icon: FaList,
    color: "cyan",
    description: "Select dropdown",
  },
  Url: {
    id: "Url",
    icon: FaLink,
    color: "pink",
    description: "URL input",
  },
  Password: {
    id: "Password",
    icon: FaLock,
    color: "blue",
    description: "Password input",
  }

};
