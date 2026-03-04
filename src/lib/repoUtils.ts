import { RepositoryInfo } from '../redux/api/v2/apiResponse';

export interface ExplorerNode {
  name: string;
  path: string;
  type: 'folder' | 'repo';
  children: ExplorerNode[];
  repo?: RepositoryInfo;
}

export const buildExplorerTree = (repos: RepositoryInfo[]): ExplorerNode => {
  const root: ExplorerNode = { name: 'Root', path: '', type: 'folder', children: [] };

  repos.forEach((repo) => {
    const normalizedPath = repo.path.replace(/\\/g, '/');
    const parts = normalizedPath.split('/').filter(p => p !== '');
    
    let currentNode = root;
    let currentPath = '';

    parts.forEach((part, index) => {
      currentPath += (currentPath ? '/' : '') + part;
      const isLast = index === parts.length - 1;

      let child = currentNode.children.find(c => c.name === part);

      if (!child) {
        child = {
          name: part,
          path: currentPath,
          type: isLast ? 'repo' : 'folder',
          children: [],
          repo: isLast ? repo : undefined
        };
        currentNode.children.push(child);
      } else if (isLast && child.type === 'folder') {
          // If we found a folder but it's actually the repo (unlikely with .git usually inside, but for this app repo.path is the repo itself)
          child.type = 'repo';
          child.repo = repo;
      }
      
      currentNode = child;
    });
  });

  // Sort: folders first, then alphabetical
  const sortTree = (node: ExplorerNode) => {
    node.children.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
    node.children.forEach(sortTree);
  };

  sortTree(root);
  return root;
};

export interface RepoGroup {
  folderName: string;
  basePath: string;
  repositories: RepositoryInfo[];
}

export const groupRepositoriesByFolder = (repos: RepositoryInfo[]): RepoGroup[] => {
  const groups: { [key: string]: { repos: RepositoryInfo[], basePath: string } } = {};

  repos.forEach((repo) => {
    const path = repo.path.replace(/\\/g, '/');
    const parts = path.split('/');
    const folderName = parts.length > 1 ? (parts[parts.length - 2] || 'Root') : 'Root';
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
