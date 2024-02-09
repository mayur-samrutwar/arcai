// pages/index.js
import { useEffect, useState } from 'react';

const gitlabApiUrl = 'https://gitlab.com/api/v4';

const getRepoContent = async (repoPath) => {
  try {
    const apiUrl = `${gitlabApiUrl}/projects/${repoPath}/repository/tree`;

    const response = await fetch(apiUrl, {
      headers: {
        'PRIVATE-TOKEN': 'glpat-YQoU5E4TZY7RpA_rzEYg',
      },
    });

    if (!response.ok) {
      throw new Error(`GitLab API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching GitLab data:', error.message);
    throw error;
  }
};

const GitLabRepoExplorer = () => {
  const [repoContent, setRepoContent] = useState([]);

  useEffect(() => {
    const repoPath = 'mayurrrr/test2'; // Replace with your GitLab repo path

    getRepoContent(repoPath)
      .then((data) => setRepoContent(data))
      .catch((error) => console.error('Error:', error.message));
  }, []);

  

  return (
    <div>
      <h1>GitLab Repo Explorer</h1>
      <ul>
        {repoContent.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default GitLabRepoExplorer;
