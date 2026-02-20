import { useState, useMemo } from 'react';
import { RepositoryInfo } from '../../../redux/api/v2/apiResponse';

export const useRepoTable = (repositories: RepositoryInfo[] = []) => {
  const [filterDirty, setFilterDirty] = useState(false);
  const [filterUnpushed, setFilterUnpushed] = useState(false);
  const [filterBranch, setFilterBranch] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    return repositories.filter(repo => {
      if (filterDirty && !repo.is_dirty) return false;
      if (filterUnpushed && !repo.has_unpushed_commits) return false;
      if (filterBranch && repo.current_branch !== filterBranch) return false;
      if (searchTerm && !repo.name.toLowerCase().includes(searchTerm.toLowerCase()) && !repo.path.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [repositories, filterDirty, filterUnpushed, filterBranch, searchTerm]);

  const branches = useMemo(() => {
    const allBranches = new Set<string>();
    repositories.forEach(repo => allBranches.add(repo.current_branch));
    return Array.from(allBranches);
  }, [repositories]);

  return {
    filteredData,
    branches,
    filterDirty,
    setFilterDirty,
    filterUnpushed,
    setFilterUnpushed,
    filterBranch,
    setFilterBranch,
    searchTerm,
    setSearchTerm,
  };
};
