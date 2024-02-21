import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [url, setUrl] = useState('https://gitlab.com/mayurrrr/kumabot');
  const [repoTree, setRepoTree] = useState({});
  const gitlabBaseUrl = 'https://gitlab.com/api/v4/projects/mayurrrr%2Ftest2/repository';

  const doTheMagic = async () => {
    try {
      const newState = await traverseFolders('');
      console.log(newState);
      setRepoTree(newState);
    } catch (error) {
      console.error('Error fetching repo structure:', error);
    }
  };

  const traverseFolders = async (currentPath) => {
    const encodedCurrentPath = encodeURIComponent(currentPath);
    const repoContent = await axios.get(`${gitlabBaseUrl}/tree?path=${encodedCurrentPath}`);
  
    const tree = {};
  
    for (const item of repoContent.data) {
      const { name, type } = item;
  
      if (type === 'tree') {
        tree[name] = await traverseFolders(`${currentPath}${currentPath ? '/' : ''}${encodeURIComponent(name)}`);
      } else {
        const fileContent = await axios.get(`${gitlabBaseUrl}/files/${encodeURIComponent(currentPath ? currentPath + '/' : '')}${encodeURIComponent(name)}?ref=main`);
        tree[name] = atob(fileContent.data.content);
      }
    }
  
    return tree;
  };
  
  

  return (
    <div className="h-screen w-[600px] p-4 bg-white">
      <div className="h-max w-full border rounded-xl p-4">
        <div className="flex flex-col">
          <div className="flex space-x-4">
            <div className="flex">
              <button onClick={doTheMagic}>Start</button>
            </div>
            
          </div>
          {JSON.stringify(repoTree)}
        </div>
      </div>
    </div>
  );
}
