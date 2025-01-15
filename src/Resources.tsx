import React, { useState, useEffect } from "react";
import { getDatabase, ref, get, push } from "firebase/database";
import { getAuth } from "firebase/auth";
import { FaBook, FaVideo, FaSearch } from "react-icons/fa";
import Navbar from "./Navbar";

interface Resources {
  id: string;
  title: string;
  description: string;
  type: "article" | "video";
  link: string;
}

const ResourcesModule: React.FC = () => {
  const [resources, setResources] = useState<Resources[]>([]);
  const [filter, setFilter] = useState<"all" | "article" | "video">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      const db = getDatabase();
      const resourcesRef = ref(db, "resources/");
      const snapshot = await get(resourcesRef);

      if (snapshot.exists()) {
        setResources(Object.values(snapshot.val()));
      } else {
        console.log("No data available");
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    let lastScrollTop = 0;
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsNavbarVisible(scrollTop <= lastScrollTop);
      lastScrollTop = scrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFilterChange = (type: "all" | "article" | "video") => {
    setFilter(type);
  };

  const filteredResources = resources.filter((resource) => {
    const matchesFilter = filter === "all" || resource.type === filter;
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleResourceClick = (resource: Resources) => {
    const db = getDatabase();
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const visitRef = ref(db, `users/${user.uid}/resourceVisits`);
      const newVisit = {
        id: resource.id,
        title: resource.title,
        type: resource.type,
        timestamp: new Date().toISOString(),
      };
      push(visitRef, newVisit);
    }

    window.open(resource.link, "_blank");
  };

  return (
    <div className="h-full bg-[#ECDFCC]">
      {isNavbarVisible && <Navbar />}
      <div className="pt-20 w-full p-8">
        <div className="text-center mb-6">
          <h2 className="mt-6 text-3xl font-serif text-black">Mental Health Resources</h2>
          <p className="text-md text-gray-700">Find helpful articles and videos.</p>
        </div>
        <div className="flex flex-col items-center mb-6">
          <div className="relative flex items-center w-full max-w-md mb-4">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border-2 border-black rounded-l-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button className="px-4 py-2 bg-transparent border-2 border-black text-black rounded-r-lg hover:bg-yellow-600 transition">
              <FaSearch />
            </button>
          </div>
          <div className="flex justify-center mb-4">
            {["all", "article", "video"].map((type) => (
              <button
                key={type}
                onClick={() => handleFilterChange(type as "all" | "article" | "video")}
                className={`px-6 py-2 mx-2 rounded-full ${
                  filter === type
                    ? "border-2 border-black bg-[#A5B68D] text-white"
                    : "border-2 border-black text-black"
                } hover:bg-[#A5B68D] hover:text-white transition duration-300`}
              >
                {type === "all" ? "All" : type === "article" ? "Articles" : "Videos"}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
          {filteredResources.length === 0 ? (
            <p className="text-black text-center col-span-full">No resources found. Try a different filter or search term.</p>
          ) : (
            filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white border-2 border-black p-6 rounded-lg hover:shadow-lg transition duration-300"
              >
                <h4 className="text-lg font-bold text-black flex items-center">
                  {resource.type === "article" ? <FaBook className="mr-2" /> : <FaVideo className="mr-2" />}
                  {resource.title}
                </h4>
                <p className="text-sm text-gray-700 mt-2">{resource.description}</p>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleResourceClick(resource);
                  }}
                  className="border-2 border-black px-4 py-2 rounded-full mt-4 inline-block text-black hover:underline"
                >
                  {resource.type === "article" ? "Read Article" : "Watch Video"}
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourcesModule;
