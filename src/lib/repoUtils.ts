import { RepositoryInfo } from '../redux/api/v2/apiResponse';

export interface RepoGroup {
  folderName: string;
  basePath: string;
  repositories: RepositoryInfo[];
}

export const groupRepositoriesByFolder = (repos: RepositoryInfo[]): RepoGroup[] => {
  const groups: { [key: string]: { repos: RepositoryInfo[], basePath: string } } = {};

  repos.forEach((repo) => {
    // Get the parent folder name. 
    const path = repo.path.replace(/\\/g, '/');
    const parts = path.split('/');
    
    // The immediate parent is the second to last element
    const folderName = parts.length > 1 ? parts[parts.length - 2] : 'Root';
    
    // The base path is everything BEFORE the repo name
    const basePath = parts.slice(0, -1).join('/') + '/';
    
    if (!groups[folderName]) {
      groups[folderName] = { repos: [], basePath };
    }
    groups[folderName].repos.push(repo);
  });

  return Object.entries(groups).map(([folderName, data]) => ({
    folderName,
    basePath: data.basePath,
    repositories: data.repos,
  })).sort((a, b) => a.folderName.localeCompare(b.folderName));
};
