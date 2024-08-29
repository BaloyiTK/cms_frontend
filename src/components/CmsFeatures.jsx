import React from "react";
import { motion } from "framer-motion";
import { FaEdit, FaSync, FaTrash, FaCalendarAlt, FaArrowUp, FaArrowDown, FaPlug, FaUsers, FaCode } from "react-icons/fa";
import { Link } from "react-router-dom";

// Define animation variants for framer-motion
const animationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// Placeholder images from the internet
const features = [
  {
    image: "contentC.gif",
    icon: <FaEdit className="text-pink-500 text-4xl" />,
    title: "Create Content",
    description: "Transform your ideas into engaging content with our intuitive editor. Customize titles, bodies, and multimedia elements effortlessly.",
  },
  {
    image: "contentU.gif",
    icon: <FaSync className="text-teal-500 text-4xl" />,
    title: "Update Content",
    description: "Keep your content fresh and relevant with just a few clicks. Our CMS allows seamless updates to text, images, and media.",
  },
  {
    image: "contentD.gif",
    icon: <FaTrash className="text-red-500 text-4xl" />,
    title: "Delete Content",
    description: "Easily remove outdated or irrelevant content while maintaining the option to reverse the action if needed.",
  },
  {
    image: "contentS.gif",
    icon: <FaCalendarAlt className="text-purple-500 text-4xl" />,
    title: "Schedule Content",
    description: "Plan your content releases to align with your strategy. Schedule posts to be published at specific times effortlessly.",
  },
  {
    image: "contentP.gif",
    icon: <FaArrowUp className="text-yellow-500 text-4xl" />,
    title: "Publish Content",
    description: "Push your content live whenever you're ready. Share your work with the world and make it visible to your audience.",
  },
  {
    image: "contentUnp.gif",
    icon: <FaArrowDown className="text-gray-500 text-4xl" />,
    title: "Unpublish Content",
    description: "Hide content from view without deleting it. Perfect for updates or temporary removal while keeping content safely stored.",
  },
  {
    image: "contentInt.gif",
    icon: <FaPlug className="text-teal-500 text-4xl" />,
    title: "Frontend Integration",
    description: "Seamlessly integrate with your frontend. Our CMS is designed to work with various frameworks and platforms, allowing smooth content synchronization and dynamic updates.",
  },
  {
    image: "contentCol.gif",
    icon: <FaUsers className="text-indigo-500 text-4xl" />,
    title: "Team Collaboration",
    description: "Invite and manage team members to work together on content creation and management. Enhance productivity with collaborative tools and permissions.",
  },
  {
    image: "contentCode.gif",
    icon: <FaCode className="text-gray-500 text-4xl" />,
    title: "No Backend Skills Required",
    description: "Create and manage content easily without needing backend development skills. Our CMS handles all the technical aspects for you.",
  }
];

const CmsFeatures = () => (
  <section id="cms-features" className="relative mt-12 px-4 py-8 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400">
    <div className="text-center mb-12">
      <h2 className="text-5xl font-bold text-white mb-4">Discover Our CMS Features</h2>
      <p className="text-lg text-white">Explore the powerful tools designed to make content management simple and efficient.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={animationVariants}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <img src={feature.image} alt={feature.title} className="w-full h-32 object-cover" />
          <div className="p-6 flex items-center space-x-4">
            <div className="text-4xl text-blue-500">{feature.icon}</div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 mt-2">{feature.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
    {/* Call to Action Section */}
    <div className="bg-blue-600 text-white py-12 mt-12 text-center">
      <Link to="/register" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-100 transition">
        Get Started
      </Link>
    </div>
  </section>
);

export default CmsFeatures;
