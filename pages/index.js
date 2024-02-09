import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [url, setUrl] = useState('https://gitlab.com/Magictallguy/kumabot');
  const [fileStructure, setFileStructure] = useState([]);
  const gitlabBaseUrl = 'https://gitlab.com/api/v4/projects';

  const startScrapping = async () => {
    try {
      const newUrl = new URL(url);
      const path = newUrl.pathname.replace(/^\//, '');
      const encodedRepoPath = encodeURIComponent(path);
      setUrl(encodedRepoPath);
      const baseFiles = await axios.get(`${gitlabBaseUrl}/${encodedRepoPath}/repository/tree`);
      setFileStructure(addChildrenProperty(baseFiles.data));
    } catch (error) {
      console.error('Error fetching repo structure:', error);
    }
  };

  const fetchSubfolderContent = async (subfolderPath) => {
    try {
      const encodedSubfolderPath = encodeURIComponent(subfolderPath);
      const subfolderContent = await axios.get(`${gitlabBaseUrl}/${url}/repository/tree?path=${encodedSubfolderPath}`);
      return addChildrenProperty(subfolderContent.data);
    } catch (error) {
      console.error('Error fetching subfolder content:', error);
      return [];
    }
  };

  const addChildrenProperty = (data) => {
    return data.map((item) => ({ ...item, children: [] }));
  };

  const handleFolderClick = async (folderPath, currentStructure = fileStructure) => {
    const updatedFileStructure = [...currentStructure];
    const folderIndex = updatedFileStructure.findIndex((item) => item.path === folderPath);
  
    if (folderIndex !== -1) {
      if (updatedFileStructure[folderIndex].children.length === 0) {
        const subfolderContent = await fetchSubfolderContent(folderPath);
        updatedFileStructure[folderIndex].children = subfolderContent;
        setFileStructure((prevStructure) => {
          const newStructure = [...prevStructure];
          updateChildren(newStructure, folderPath, subfolderContent);
          return newStructure;
        });
      } else {
        updatedFileStructure[folderIndex].children = [];
        setFileStructure([...updatedFileStructure]);
      }
    }
  };
  
  const updateChildren = (structure, folderPath, subfolderContent) => {
    const folder = structure.find((item) => item.path === folderPath);
    if (folder) {
      folder.children = subfolderContent;
    } else {
      for (const item of structure) {
        if (item.children && item.children.length > 0) {
          updateChildren(item.children, folderPath, subfolderContent);
        }
      }
    }
  };
  

  const renderStructure = (structure, indent = 0) => (
    <ul style={{ marginLeft: `${indent * 20}px` }}>
      {structure.map((item) => (
        <li key={item.id}>
          {item.type === 'tree' ? (
            <>
              <div onClick={() => handleFolderClick(item.path)}>
                📁 {item.name}
              </div>
              {item.children.length > 0 && renderStructure(item.children, indent + 1)}
            </>
          ) : (
            <div>
              📄 {item.name}
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="h-screen w-[600px] p-4 bg-white">
      <div className="h-max w-full border rounded-xl p-4">
        <div className="flex flex-col">
          <div className="flex space-x-4">
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                </svg>
              </span>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                type="text"
                id="website-admin"
                className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="elonmusk"
              />
            </div>
            <button
              onClick={startScrapping}
              className="bg-black text-white text-sm px-6 rounded-md"
            >
              Start
            </button>
          </div>

          <div className="">Hello</div>
          <div className="flex flex-col space-y-2">
            {fileStructure && renderStructure(fileStructure)}
          </div>
        </div>
      </div>
    </div>
  );
}
